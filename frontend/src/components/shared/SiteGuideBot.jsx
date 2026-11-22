import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, Sparkles, X, Send, ArrowRight, 
  RotateCcw, Building2, QrCode, Key, HelpCircle 
} from 'lucide-react';

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text: "Hello! 👋 Welcome to StayFlow. I'm your AI guide. How can I help you explore today?",
    quickOptions: [
      { id: 'guest', label: '🛎️ I am a Guest (How to use?)' },
      { id: 'manager', label: '🏨 I am a Manager (How to test?)' },
      { id: 'staff', label: '👷 I am Staff (How do tasks work?)' },
      { id: 'demo', label: '🔑 Demo Login Credentials' },
      { id: 'about', label: '💡 What is StayFlow?' }
    ]
  }
];

export default function SiteGuideBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [isOpen, messages]);

  const handleQuickOption = (optionId) => {
    let userText = '';
    let botReply = '';
    let link = null;

    switch (optionId) {
      case 'guest':
        userText = 'How do I use StayFlow as a guest?';
        botReply = `Here is how to use the Guest Portal in 3 easy steps:

1️⃣ Click "Guest Access" at the top of the website (or scan your room QR code).
2️⃣ Enter your Hotel Code (e.g. SFGP or SIL814) and your Room Number (e.g. 301).
3️⃣ You're in! From there you can:
   • Chat with the AI Concierge for breakfast times, Wi-Fi info, and pool hours.
   • Order In-Room Dining from the food menu.
   • Request Extra Towels, Room Cleaning, or report AC/plumbing issues.`;
        link = { text: 'Go to Guest Access', url: '/guest-access' };
        break;

      case 'manager':
        userText = 'How can I try StayFlow as a Hotel Manager?';
        botReply = `Here is how to explore the Manager Portal:

1️⃣ Go to "Sign In" and enter your credentials.
   (Or use our demo: manager@stayflow.demo / StayFlow@2026 / Code: SFGP)
2️⃣ In the Manager Dashboard, you can:
   • Monitor live guest requests & track staff resolution times.
   • Manage In-Room Dining food items, prices, and kitchen hours.
   • View Staff Workload and assign or reassign tasks.
   • Edit the 30 Hotel FAQ answers used by the guest AI Concierge!`;
        link = { text: 'Go to Manager Sign In', url: '/login' };
        break;

      case 'staff':
        userText = 'How do staff members manage their tasks?';
        botReply = `Here is how the Staff workflow works:

1️⃣ Staff members sign in using their staff ID/email and their hotel code.
   (Demo: staff@stayflow.demo / StayFlow@2026 / Code: SFGP)
2️⃣ When a guest reports an issue or requests service, StayFlow automatically assigns it to staff in that specific department (Housekeeping, Maintenance, Room Service).
3️⃣ Staff see only their assigned tasks. They can click "Accept", start the task, and mark it "Completed" once finished!`;
        link = { text: 'Go to Staff Login', url: '/login' };
        break;

      case 'demo':
        userText = 'What are the demo login credentials?';
        botReply = `Here are the active demo credentials you can test right now:

🏨 Hotel Code: SFGP (StayFlow Grand Pune)

👤 Manager Portal:
• Email: manager@stayflow.demo
• Password: StayFlow@2026

👷 Staff Portal:
• Email: staff@stayflow.demo
• Password: StayFlow@2026

🛎️ Guest Portal:
• Hotel Code: SFGP
• Room: 312 or 301
(Enter room details directly on Guest Access page!)`;
        link = { text: 'Sign In Now', url: '/login' };
        break;

      case 'about':
        userText = 'What is StayFlow?';
        botReply = `StayFlow is an AI-powered hotel guest experience and operations platform.

It replaces slow phone calls and paper logs with a smooth digital flow:
• Guests scan a QR code to order food, ask questions, or report issues.
• The system automatically routes each request to the correct department (Housekeeping, Maintenance, Front Desk, Room Service).
• Managers get real-time operational visibility and SLA tracking.
• Multiple hotels can use the same platform safely with complete data isolation!`;
        link = { text: 'Explore Features', url: '/#features' };
        break;

      default:
        break;
    }

    if (userText && botReply) {
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: 'user', text: userText },
        { id: Date.now() + 1, sender: 'bot', text: botReply, link }
      ]);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    const query = input.trim();
    if (!query) return;

    setInput('');
    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);

    // Intelligent answer matching based on query keywords
    setTimeout(() => {
      const q = query.toLowerCase();
      let botReply = '';
      let link = null;

      if (/guest|room|hotel code|towel|service|food|order|menu|eat/.test(q)) {
        botReply = `To use the guest services:
1. Tap "Guest Access" on the top right.
2. Enter your Hotel Code (e.g. SFGP or SIL814) and your Room Number.
3. Once inside, you can request extra towels, water bottles, room cleaning, or order from the In-Room Dining menu!`;
        link = { text: 'Open Guest Access', url: '/guest-access' };
      } else if (/manager|admin|dashboard|track|reassign|analytics/.test(q)) {
        botReply = `The Manager Portal gives you full command over your hotel property:
• View all real-time guest requests by department.
• Manage staff accounts and check staff workload.
• Update In-Room Dining items and kitchen opening hours.
• Edit the 30 default hotel questions answered by the AI concierge.`;
        link = { text: 'Manager Login', url: '/login' };
      } else if (/staff|technician|housekeeping|workload|accept|task/.test(q)) {
        botReply = `Staff members have their own focused workspace. They receive tasks matching their department, accept them, and update status from start to completion in real-time.`;
        link = { text: 'Staff Sign In', url: '/login' };
      } else if (/login|credential|password|demo|account/.test(q)) {
        botReply = `You can test with these demo accounts:
• Manager: manager@stayflow.demo (Password: StayFlow@2026, Hotel: SFGP)
• Staff: staff@stayflow.demo (Password: StayFlow@2026, Hotel: SFGP)
• Guest: Hotel Code SFGP, Room 301`;
        link = { text: 'Go to Sign In', url: '/login' };
      } else if (/signup|register|create hotel|new hotel/.test(q)) {
        botReply = `You can create a brand new hotel workspace in 60 seconds! Click "Create Hotel Workspace" from the Sign In page. Your new hotel will automatically receive 30 pre-loaded FAQ questions and starter services.`;
        link = { text: 'Create Workspace', url: '/signup' };
      } else {
        botReply = `I can help you explore StayFlow! You can ask me:
• How to use the Guest Portal
• How to test the Manager or Staff portals
• What the demo login credentials are
• How to create a new hotel workspace`;
      }

      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: botReply, link }
      ]);
    }, 400);
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <div className="relative">
            {/* Pulsing indicator if unread */}
            {hasUnread && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B89020] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#B89020]"></span>
              </span>
            )}

            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2.5 bg-[#0B1426] text-white px-4 py-3 rounded-full shadow-2xl hover:bg-[#1a2b4c] transition-all hover:scale-105 border border-[#B89020]/40 group"
              aria-label="Open AI Site Guide"
            >
              <div className="w-8 h-8 rounded-full bg-[#B89020] flex items-center justify-center text-white shrink-0 group-hover:rotate-12 transition-transform">
                <Bot size={18} />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold leading-tight flex items-center gap-1">
                  AI Site Guide <Sparkles size={12} className="text-[#B89020]" />
                </p>
                <p className="text-[10px] text-white/70">New here? Learn how to use</p>
              </div>
            </button>
          </div>
        )}

        {/* Floating Chat Window */}
        {isOpen && (
          <div className="w-[92vw] sm:w-[380px] h-[520px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-black/10 flex flex-col overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="bg-[#0B1426] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#B89020] flex items-center justify-center text-white shrink-0">
                  <Bot size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm leading-none">StayFlow AI Guide</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  </div>
                  <p className="text-[11px] text-white/60 mt-0.5">Quick steps & website walkthrough</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  title="Restart conversation"
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close guide"
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FDFCF9] text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`p-3.5 rounded-2xl max-w-[88%] whitespace-pre-line leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#0B1426] text-white rounded-tr-xs'
                        : 'bg-white text-[#0B1426] border border-black/5 shadow-2xs rounded-tl-xs'
                    }`}
                  >
                    {msg.text}

                    {msg.link && (
                      <div className="mt-2.5 pt-2 border-t border-black/5">
                        <Link
                          to={msg.link.url}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#B89020] hover:underline"
                        >
                          {msg.link.text} <ArrowRight size={12} />
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Render Quick Action Options */}
                  {msg.quickOptions && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 w-full">
                      {msg.quickOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleQuickOption(opt.id)}
                          className="text-[11px] font-medium bg-white hover:bg-[#B89020]/10 hover:text-[#0B1426] hover:border-[#B89020]/40 text-[#0B1426]/80 px-3 py-1.5 rounded-full border border-black/10 transition-colors shadow-2xs text-left"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-black/5 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask how to use the website..."
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-black/10 bg-[#FDFCF9] focus:outline-none focus:border-[#B89020]"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-[#0B1426] text-[#B89020] hover:bg-[#1a2b4c] disabled:opacity-40 p-2.5 rounded-xl transition-colors shrink-0"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
