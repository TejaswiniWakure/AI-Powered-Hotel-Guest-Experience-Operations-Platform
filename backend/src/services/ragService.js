const KnowledgeDocument = require('../models/KnowledgeDocument');

class RAGService {
  /**
   * Split document content into chunks
   */
  static chunkContent(content, chunkSize = 300) {
    if (!content) return [];
    
    // Split by double newline or headers
    const rawSections = content.split(/\n\s*\n+/);
    const chunks = [];

    rawSections.forEach((section, idx) => {
      const trimmed = section.trim();
      if (!trimmed) return;

      if (trimmed.length > chunkSize * 2) {
        // Subdivide large section by sentences
        const sentences = trimmed.match(/[^.!?]+[.!?]+/g) || [trimmed];
        let currentChunk = '';

        for (const sentence of sentences) {
          if ((currentChunk + ' ' + sentence).length > chunkSize && currentChunk.length > 50) {
            chunks.push({
              text: currentChunk.trim(),
              metadata: { section: `Part ${chunks.length + 1}`, page: Math.floor(chunks.length / 3) + 1 }
            });
            currentChunk = sentence;
          } else {
            currentChunk += ' ' + sentence;
          }
        }
        if (currentChunk.trim()) {
          chunks.push({
            text: currentChunk.trim(),
            metadata: { section: `Part ${chunks.length + 1}`, page: Math.floor(chunks.length / 3) + 1 }
          });
        }
      } else {
        chunks.push({
          text: trimmed,
          metadata: { section: `Section ${idx + 1}`, page: Math.floor(idx / 3) + 1 }
        });
      }
    });

    return chunks;
  }

  /**
   * Generate simple term vector representation for cosine similarity
   */
  static generateVector(text, vocabulary) {
    const tokens = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const vector = new Array(vocabulary.length).fill(0);
    const counts = {};
    tokens.forEach(t => { counts[t] = (counts[t] || 0) + 1; });
    vocabulary.forEach((word, i) => {
      if (counts[word]) vector[i] = counts[word];
    });
    return vector;
  }

  /**
   * Compute cosine similarity between two vectors
   */
  static cosineSimilarity(vecA, vecB) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Query hotel's knowledge documents strictly scoped by hotelId
   */
  static async searchHotelKnowledge({ hotelId, query, categories = [], limit = 3 }) {
    const filter = { hotelId, status: 'indexed' };
    if (categories && categories.length > 0) {
      filter.category = { $in: categories };
    }

    const docs = await KnowledgeDocument.find(filter);
    if (!docs || docs.length === 0) return [];

    const queryTokens = (query.toLowerCase().match(/\b[a-z]{3,}\b/g) || []);
    if (queryTokens.length === 0) return [];

    const matches = [];

    for (const doc of docs) {
      for (const chunk of doc.chunks || []) {
        const chunkTextLower = chunk.text.toLowerCase();
        let matchScore = 0;

        queryTokens.forEach(token => {
          if (chunkTextLower.includes(token)) {
            matchScore += 1;
            // Higher weight if matching words in title or first line
            if (doc.title.toLowerCase().includes(token)) matchScore += 1.5;
          }
        });

        if (matchScore > 0) {
          matches.push({
            score: matchScore,
            docTitle: doc.title,
            category: doc.category,
            snippet: chunk.text,
            metadata: chunk.metadata
          });
        }
      }
    }

    // Sort descending by relevance score
    matches.sort((a, b) => b.score - a.score);
    return matches.slice(0, limit);
  }

  /**
   * Concierge Assistant: Answers guest questions using hotel knowledge
   */
  static async answerConcierge({ hotelId, question, guestName, roomNumber, hotelName }) {
    const hName = hotelName || 'the hotel';

    // Ensure the hotel has all 30 default FAQ questions indexed
    try {
      const { getOrCreateHotelFAQ } = require('./faqService');
      await getOrCreateHotelFAQ(hotelId, hName);
    } catch (e) {
      // Continue even if FAQ check throws
    }

    const relevantChunks = await this.searchHotelKnowledge({
      hotelId,
      query: question,
      categories: ['faq', 'menu', 'facility', 'policy', 'emergency'],
      limit: 2
    });

    if (relevantChunks.length === 0) {
      // Mock LLM Fallbacks for common hotel queries
      const q = question.toLowerCase();
      let fallbackText = `I don't have that specific information in my knowledge base. Please contact the front desk at extension 0 or visit the reception for assistance.`;
      
      if (/breakfast|food|dining|lunch|dinner/.test(q)) {
        fallbackText = `Breakfast at ${hName} is served daily from 7:00 AM to 10:30 AM at the main dining area. You can also order In-Room Dining directly from the "Services" tab in this app!`;
      } else if (/pool|swim/.test(q)) {
        fallbackText = `The swimming pool at ${hName} is open daily from 6:00 AM to 10:00 PM. Clean towels and lounger chairs are provided poolside.`;
      } else if (/gym|fitness|workout/.test(q)) {
        fallbackText = `The fitness center at ${hName} is open daily from 6:00 AM to 10:00 PM with cardio and strength equipment.`;
      } else if (/spa|massage/.test(q)) {
        fallbackText = `Wellness and massage therapies are offered at the spa. Appointments can be scheduled through the Front Desk.`;
      } else if (/wifi|wi-fi|internet|network|password/.test(q)) {
        fallbackText = `To connect to guest Wi-Fi at ${hName}, select the "${hName.replace(/\s+/g, '_')}_Guest" network and enter your room number and last name. Wi-Fi is completely complimentary!`;
      } else if (/checkout|check-out|checkin|check-in|time/.test(q)) {
        fallbackText = `Standard check-in time at ${hName} is 2:00 PM and check-out is 11:00 AM. Late check-out can be requested through the "Services" tab under Front Desk.`;
      } else if (/park|valet|car/.test(q)) {
        fallbackText = `Complimentary secure on-site parking with valet service is available for all guests at ${hName}.`;
      } else if (/towel|pillow|water|clean|housekeeping/.test(q)) {
        fallbackText = `You can request extra towels, pillows, drinking water, or room cleaning directly from the "Services" tab in this app!`;
      }

      return {
        answer: fallbackText,
        sources: [],
        sourceLabel: null
      };
    }

    // Compose grounded response
    const topChunk = relevantChunks[0];
    const sourceInfo = `${topChunk.docTitle} (${topChunk.category.toUpperCase()})`;

    // Strip markdown question header if the chunk starts with ## Q...
    let cleanSnippet = topChunk.snippet
      .replace(/^##\s+Q\d+:\s*[^\n]+\n+/i, '')
      .replace(/^\[Category:[^\]]+\]\n+/i, '')
      .replace(/^\*\*Category:\*\*[^\n]+\n+/i, '')
      .replace(/\*\*Category:\*\*[^\n]+/i, '')
      .trim();

    // If cleanSnippet is accidentally empty or just a category label (e.g. "**Category:** Check-In & Stays"):
    if (!cleanSnippet || /^\*?\*?category/i.test(cleanSnippet) || cleanSnippet.length < 25) {
      try {
        const { getOrCreateHotelFAQ } = require('./faqService');
        const { items } = await getOrCreateHotelFAQ(hotelId, hName);

        const qTokens = (question.toLowerCase().match(/\b[a-z]{3,}\b/g) || []);
        let bestItem = null;
        let maxMatches = 0;

        items.forEach(item => {
          const itemTokens = (item.question.toLowerCase().match(/\b[a-z]{3,}\b/g) || []);
          const matches = qTokens.filter(t => itemTokens.includes(t)).length;
          if (matches > maxMatches) {
            maxMatches = matches;
            bestItem = item;
          }
        });

        if (bestItem && maxMatches >= 1) {
          cleanSnippet = bestItem.answer;
        }
      } catch (e) {
        // fallback to topChunk.snippet
      }
    }

    if (!cleanSnippet) cleanSnippet = topChunk.snippet;

    return {
      answer: cleanSnippet,
      sources: relevantChunks.map(c => ({
        title: c.docTitle,
        category: c.category,
        snippet: c.snippet.slice(0, 120) + '...'
      })),
      sourceLabel: `Source: ${sourceInfo}`
    };
  }

  /**
   * Staff Assistant: Answers staff operational questions using hotel SOPs
   */
  static async answerStaffAssistant({ hotelId, query }) {
    const relevantChunks = await this.searchHotelKnowledge({
      hotelId,
      query,
      categories: ['sop', 'emergency', 'policy', 'facility'],
      limit: 2
    });

    if (relevantChunks.length === 0) {
      return {
        answer: "No specific SOP procedure found for this operational query. Please check with your Duty Manager or consult the Hotel Operations Manual.",
        sources: []
      };
    }

    const topChunk = relevantChunks[0];
    return {
      answer: topChunk.snippet,
      sources: relevantChunks.map(c => ({
        title: c.docTitle,
        category: c.category,
        snippet: c.snippet.slice(0, 120) + '...'
      })),
      sourceLabel: `Source: ${topChunk.docTitle} — Standard Operating Procedure`
    };
  }
}

module.exports = RAGService;
