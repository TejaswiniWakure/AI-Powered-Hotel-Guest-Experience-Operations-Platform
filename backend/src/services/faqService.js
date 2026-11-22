const KnowledgeDocument = require('../models/KnowledgeDocument');
const Hotel = require('../models/Hotel');
const RAGService = require('./ragService');

function getDefaultHotelFAQ(hotelName) {
  const h = hotelName || 'our hotel';
  return [
    // 1. Dining & Food
    {
      id: 1,
      category: 'Dining & Food',
      question: 'What time is breakfast served?',
      answer: `Breakfast is served daily from 7:00 AM to 10:30 AM at the main dining restaurant of ${h}. Both hot buffet spreads and à la carte options are available.`
    },
    {
      id: 2,
      category: 'Dining & Food',
      question: 'What time is lunch served?',
      answer: `Lunch is available daily from 12:30 PM to 3:30 PM at the hotel restaurant.`
    },
    {
      id: 3,
      category: 'Dining & Food',
      question: 'What time is dinner served?',
      answer: `Dinner is hosted every evening from 7:00 PM to 11:00 PM featuring multi-cuisine specialties.`
    },
    {
      id: 4,
      category: 'Dining & Food',
      question: 'Is 24-hour room service available?',
      answer: `Yes, 24-hour in-room dining is available. You can order food directly from the StayFlow guest app under "Services" or "Room Service".`
    },
    {
      id: 5,
      category: 'Dining & Food',
      question: 'Can I request vegetarian, vegan, or special dietary food?',
      answer: `Yes, ${h} provides vegetarian, vegan, gluten-free, and Jain food options upon request. Please mention any dietary needs when placing your order.`
    },
    {
      id: 6,
      category: 'Dining & Food',
      question: 'Where is the hotel restaurant located?',
      answer: `The primary restaurant and lounge is situated on the Lobby Level of ${h}.`
    },

    // 2. Check-In, Check-Out & Stays
    {
      id: 7,
      category: 'Check-In & Stays',
      question: 'What is the check-in time?',
      answer: `Standard check-in time at ${h} is 2:00 PM. Early check-in can be requested in advance, subject to room availability.`
    },
    {
      id: 8,
      category: 'Check-In & Stays',
      question: 'What is the check-out time?',
      answer: `Standard check-out time is 11:00 AM. Please ensure keys are returned or express check-out is completed by 11:00 AM.`
    },
    {
      id: 9,
      category: 'Check-In & Stays',
      question: 'Can I request early check-in or late check-out?',
      answer: `Late check-out up to 2:00 PM or 3:00 PM can be requested via the StayFlow app under "Services" or through the Front Desk, subject to availability.`
    },
    {
      id: 10,
      category: 'Check-In & Stays',
      question: 'Can I store my luggage before check-in or after check-out?',
      answer: `Yes, ${h} offers complimentary secure luggage storage at the Bell Desk / Reception.`
    },
    {
      id: 11,
      category: 'Check-In & Stays',
      question: 'How do I extend my stay?',
      answer: `To extend your stay, contact the Front Desk or request extended nights through the StayFlow app before 10:00 AM.`
    },
    {
      id: 12,
      category: 'Check-In & Stays',
      question: 'What is the cancellation or modification policy?',
      answer: `Standard bookings can be canceled or altered free of charge up to 24 hours prior to scheduled check-in. For non-refundable rates, please refer to your booking receipt.`
    },

    // 3. Wi-Fi & Internet
    {
      id: 13,
      category: 'Wi-Fi & Internet',
      question: 'How do I connect to the guest Wi-Fi?',
      answer: `Connect your device to the "${h.replace(/\s+/g, '_')}_Guest" Wi-Fi network and enter your room number and registered last name.`
    },
    {
      id: 14,
      category: 'Wi-Fi & Internet',
      question: 'Is the Wi-Fi complimentary and what is the speed?',
      answer: `High-speed Wi-Fi is completely complimentary for all staying guests across guestrooms, lobby, and public areas.`
    },

    // 4. Facilities & Wellness
    {
      id: 15,
      category: 'Facilities & Wellness',
      question: 'Where is the swimming pool located and what are the timings?',
      answer: `The swimming pool is open daily from 6:00 AM to 10:00 PM. Clean towels and lounger chairs are provided poolside.`
    },
    {
      id: 16,
      category: 'Facilities & Wellness',
      question: 'Is there a fitness center / gym and when is it open?',
      answer: `The fitness center is equipped with cardio and strength equipment, open daily from 6:00 AM to 10:00 PM.`
    },
    {
      id: 17,
      category: 'Facilities & Wellness',
      question: 'Does the hotel have a spa or massage center?',
      answer: `Yes, wellness and massage therapies are offered at the spa. Appointments can be scheduled through the Front Desk.`
    },
    {
      id: 18,
      category: 'Facilities & Wellness',
      question: 'Are there meeting rooms or a business center?',
      answer: `Yes, banquet halls and conference meeting rooms with audiovisual equipment can be reserved through Front Desk or Management.`
    },
    {
      id: 19,
      category: 'Facilities & Wellness',
      question: 'Is there a kids’ play area or family amenities?',
      answer: `Family-friendly amenities, baby cots, and children's activities are available on request at ${h}.`
    },

    // 5. Transport, Parking & Location
    {
      id: 20,
      category: 'Transport & Parking',
      question: 'Is parking available and is valet parking provided?',
      answer: `Complimentary secure on-site parking with valet service is available for all hotel guests.`
    },
    {
      id: 21,
      category: 'Transport & Parking',
      question: 'Does the hotel offer airport or station transfers?',
      answer: `Yes, chauffeur-driven airport or railway station transfers can be arranged with the Concierge 3 hours in advance.`
    },
    {
      id: 22,
      category: 'Transport & Parking',
      question: 'Can the front desk call a taxi or local cab?',
      answer: `Yes, the Front Desk team can book verified city taxis or rideshare pickups at any time upon request.`
    },

    // 6. Housekeeping & Amenities
    {
      id: 23,
      category: 'Housekeeping & Amenities',
      question: 'How do I request extra towels, pillows, or water bottles?',
      answer: `You can instantly request extra towels, pillows, bottled water, or toiletries from the "Services" tab in your StayFlow guest app.`
    },
    {
      id: 24,
      category: 'Housekeeping & Amenities',
      question: 'What time does housekeeping / room cleaning operate?',
      answer: `Daily housekeeping services operate from 8:00 AM to 6:00 PM. Evening turndown service is available upon request.`
    },
    {
      id: 25,
      category: 'Housekeeping & Amenities',
      question: 'Is laundry and dry cleaning available?',
      answer: `Yes, express washing, dry-cleaning, and pressing services are available. Laundry picked up before 10:00 AM is returned the same evening.`
    },
    {
      id: 26,
      category: 'Housekeeping & Amenities',
      question: 'Is there an electronic safe in the room?',
      answer: `Yes, every guestroom is equipped with a digital code electronic safe located inside the wardrobe.`
    },
    {
      id: 27,
      category: 'Housekeeping & Amenities',
      question: 'Can I get an iron and ironing board delivered?',
      answer: `Yes, iron and ironing board can be requested on demand via the "Services" section of the guest app and will be delivered to your room.`
    },

    // 7. Policies, Safety & Emergencies
    {
      id: 28,
      category: 'Policies & Safety',
      question: 'Is smoking allowed in the rooms?',
      answer: `${h} is a 100% smoke-free property. Smoking is only permitted in designated open-air outdoor zones.`
    },
    {
      id: 29,
      category: 'Policies & Safety',
      question: 'Are pets allowed at the hotel?',
      answer: `Please consult the Front Desk for pet policies and service animal accommodations before arrival.`
    },
    {
      id: 30,
      category: 'Policies & Safety',
      question: 'What should I do in case of a medical emergency or doctor request?',
      answer: `In case of emergency, immediately contact the Front Desk or touch the Emergency button in your app. An on-call medical doctor and first-aid supplies are accessible 24/7.`
    }
  ];
}

function buildFAQMarkdown(hotelName, faqItems) {
  const h = hotelName || 'Hotel';
  let md = `# ${h} — Guest FAQ & Hotel Information Directory\n\n`;
  md += `This document contains the 30 standard hotel FAQ answers used by the AI Concierge. Hotel managers can customize each answer to reflect specific property amenities, timings, and policies.\n\n`;

  faqItems.forEach((item, index) => {
    const num = item.id || (index + 1);
    md += `## Q${num}: ${item.question}\n`;
    md += `**Category:** ${item.category || 'General'}\n\n`;
    md += `${item.answer.trim()}\n\n`;
  });

  return md;
}

function parseFAQMarkdown(markdownContent, hotelName) {
  if (!markdownContent) return getDefaultHotelFAQ(hotelName);

  const sections = markdownContent.split(/\n(?=## Q\d+:)/i);
  const items = [];

  sections.forEach((sec, idx) => {
    const headerMatch = sec.match(/## Q(\d+):\s*(.+)/i);
    if (!headerMatch) return;

    const id = parseInt(headerMatch[1], 10) || (idx + 1);
    const question = headerMatch[2].trim();

    let category = 'General';
    const catMatch = sec.match(/\*\*Category:\*\*\s*(.+)/i);
    if (catMatch) {
      category = catMatch[1].trim();
    }

    // Body answer is everything after the category or question header
    let body = sec.replace(/## Q\d+:.+/i, '').replace(/\*\*Category:\*\*.+/i, '').trim();

    items.push({
      id,
      category,
      question,
      answer: body
    });
  });

  if (items.length === 0) {
    return getDefaultHotelFAQ(hotelName);
  }

  return items;
}

/**
 * Get or automatically initialize the 30 FAQ questions for a hotel
 */
async function getOrCreateHotelFAQ(hotelId, hotelName) {
  let name = hotelName;
  if (!name) {
    const hotel = await Hotel.findById(hotelId);
    name = hotel ? hotel.name : 'StayFlow Hotel';
  }

  let doc = await KnowledgeDocument.findOne({ hotelId, category: 'faq' });
  let items = doc ? parseFAQMarkdown(doc.content, name) : [];

  // If doc doesn't exist or has fewer than 25 questions, create or upgrade to the full 30 questions
  if (!doc || items.length < 25) {
    const defaultItems = getDefaultHotelFAQ(name);
    const markdown = buildFAQMarkdown(name, defaultItems);
    const chunks = RAGService.chunkContent(markdown);

    if (!doc) {
      doc = await KnowledgeDocument.create({
        hotelId,
        title: `${name} — Guest FAQ & Hotel Information`,
        category: 'faq',
        description: `Default 30-question FAQ covering dining, amenities, services, and policies for ${name}.`,
        content: markdown,
        chunks,
        status: 'indexed'
      });
    } else {
      doc.title = `${name} — Guest FAQ & Hotel Information`;
      doc.content = markdown;
      doc.chunks = chunks;
      doc.status = 'indexed';
      await doc.save();
    }
    items = defaultItems;
  }

  return { doc, items };
}

/**
 * Save updated 30 FAQ items
 */
async function updateHotelFAQ(hotelId, updatedItems, hotelName, userId) {
  let doc = await KnowledgeDocument.findOne({ hotelId, category: 'faq' });
  const name = hotelName || 'StayFlow Hotel';
  const markdown = buildFAQMarkdown(name, updatedItems);
  const chunks = RAGService.chunkContent(markdown);

  if (!doc) {
    doc = await KnowledgeDocument.create({
      hotelId,
      title: `${name} — Guest FAQ & Hotel Information`,
      category: 'faq',
      description: `Customized 30-question FAQ directory for ${name}.`,
      content: markdown,
      chunks,
      status: 'indexed',
      uploadedBy: userId
    });
  } else {
    doc.content = markdown;
    doc.chunks = chunks;
    doc.status = 'indexed';
    if (userId) doc.uploadedBy = userId;
    await doc.save();
  }

  return { doc, items: updatedItems };
}

module.exports = {
  getDefaultHotelFAQ,
  buildFAQMarkdown,
  parseFAQMarkdown,
  getOrCreateHotelFAQ,
  updateHotelFAQ
};
