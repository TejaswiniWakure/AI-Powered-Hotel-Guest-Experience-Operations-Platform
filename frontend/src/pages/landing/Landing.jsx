import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, X, Building2, BedDouble, CheckCircle2, 
  Settings, Users, ArrowRight, QrCode, 
  MapPin, Shield, Clock, MessageSquare, 
  LineChart, Check, BoxSelect, ConciergeBell, BarChart3,
  Hotel, Tent, Home, Building, Key, Map,
  MessageCircle, FileText, Zap, UserPlus, Image as ImageIcon,
  TrendingUp, Activity, 
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-sans text-[#0B1426] overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#B89020] rounded-xl flex items-center justify-center text-white shadow-sm">
              <Building2 size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight leading-none text-[#0B1426]">StayFlow</span>
              <span className="text-[10px] font-medium text-[#0B1426]/60 mt-0.5">Smarter Hospitality Operations</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 font-semibold text-xs tracking-wide text-[#0B1426]/80">
            <button onClick={() => scrollTo('workflow')} className="hover:text-[#B89020] transition-colors">How It Works</button>
            <button onClick={() => scrollTo('solutions')} className="hover:text-[#B89020] transition-colors">Solutions</button>
            <button onClick={() => scrollTo('features')} className="hover:text-[#B89020] transition-colors">Features</button>
            <button onClick={() => scrollTo('pricing')} className="hover:text-[#B89020] transition-colors">Pricing</button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/guest-access">
              <div className="flex items-center gap-2 bg-[#F3F4F6] text-[#0B1426] hover:bg-[#E5E7EB] transition-colors px-4 py-2.5 rounded-full text-xs font-bold">
                <QrCode size={16} className="text-[#0B1426]" />
                Guest Access
              </div>
            </Link>
            <Link to="/login" className="text-xs font-bold text-[#0B1426] hover:text-[#B89020] transition-colors px-2">
              Sign In
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-[#0B1426] text-white hover:bg-[#0B1426]/90 font-bold rounded-full px-6 h-10 text-xs">
                Get Started <ArrowRight size={16} className="ml-1" />
              </Button>
            </Link>
          </div>

          <button className="md:hidden p-2 text-[#0B1426]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-black/5 px-6 py-4 space-y-4 shadow-lg absolute w-full left-0 top-full">
            <button onClick={() => scrollTo('workflow')} className="block text-sm font-bold text-[#0B1426]/70 hover:text-[#0B1426]">How It Works</button>
            <button onClick={() => scrollTo('solutions')} className="block text-sm font-bold text-[#0B1426]/70 hover:text-[#0B1426]">Solutions</button>
            <button onClick={() => scrollTo('features')} className="block text-sm font-bold text-[#0B1426]/70 hover:text-[#0B1426]">Features</button>
            <button onClick={() => scrollTo('pricing')} className="block text-sm font-bold text-[#0B1426]/70 hover:text-[#0B1426]">Pricing</button>
            <div className="pt-4 flex flex-col gap-3 border-t border-black/5">
              <Link to="/guest-access" className="w-full">
                <Button variant="outline" className="w-full border-black/10 flex items-center justify-center gap-2 h-12 font-bold">
                  <QrCode size={18} /> Guest Access
                </Button>
              </Link>
              <div className="flex gap-3">
                <Link to="/login" className="flex-1">
                  <Button variant="outline" className="w-full border-black/10 h-12 font-bold">Sign In</Button>
                </Link>
                <Link to="/signup" className="flex-1">
                  <Button className="w-full bg-[#0B1426] text-white font-bold h-12">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-[#FDFCF9]">
        {/* Background Decorative Waves */}
        <div className="absolute top-0 right-0 w-[50vw] h-full pointer-events-none z-0 hidden lg:block" style={{
          backgroundImage: 'radial-gradient(circle at 100% 50%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)'
        }}></div>

        <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
          
          {/* Left Content */}
          <div className="flex-1 z-20 lg:pl-10 lg:pr-8 pt-16 lg:pt-0">
            <div className="inline-flex items-center text-[#B89020] font-bold tracking-[0.2em] uppercase text-[10px] mb-6">
              AI-Powered Hotel Operations
            </div>
            
            <h1 className="text-4xl md:text-[3.5rem] font-bold tracking-tight mb-6 leading-[1.1] text-[#0B1426] font-serif">
              Smarter Operations.<br/>
              <span className="text-[#B89020] italic">Happier Guest<br/>Experiences.</span>
            </h1>

            <p className="text-lg text-[#0B1426]/70 mb-10 max-w-lg leading-relaxed font-medium">
              StayFlow connects guests, hotel staff, and management in one intelligent platform — turning guest requests into organized tasks, faster resolutions, and actionable insights.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-14">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-[#0B1426] text-white hover:bg-[#0B1426]/90 font-bold px-8 h-14 rounded-xl shadow-xl shadow-[#0B1426]/20 text-base">
                  Get Started <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <a href="#workflow" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#0B1426]/20 text-[#0B1426] hover:bg-black/5 px-8 h-14 rounded-xl font-bold text-base">
                  Learn More
                </Button>
              </a>
            </div>

            {/* Quick Features */}
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full border border-[#B89020]/30 flex items-center justify-center shrink-0">
                  <BoxSelect size={18} className="text-[#B89020]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0B1426] mb-0.5">Unified Operations</p>
                  <p className="text-[11px] text-[#0B1426]/60 font-medium">All roles, one platform</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full border border-[#B89020]/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={18} className="text-[#B89020]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0B1426] mb-0.5">Better Guest Stays</p>
                  <p className="text-[11px] text-[#0B1426]/60 font-medium">Faster resolutions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full border border-[#B89020]/30 flex items-center justify-center shrink-0">
                  <BarChart3 size={18} className="text-[#B89020]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0B1426] mb-0.5">Data-Driven Decisions</p>
                  <p className="text-[11px] text-[#0B1426]/60 font-medium">Improve every stay</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 relative w-full hidden lg:block z-10">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square bg-black">
              <img 
                src="/hero-bg.jpg" 
                alt="Luxury Hotel Room" 
                className="w-full h-full object-cover opacity-90"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1618773928120-2c7003ff5eb9?auto=format&fit=crop&q=80" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426]/80 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-8 right-8 text-right">
                <p className="text-xl font-serif text-white leading-tight font-bold drop-shadow-md">
                  Great stays happen here.
                </p>
                <p className="text-xs text-white/90 flex items-center justify-end gap-1 mt-1 drop-shadow-md">
                  <MapPin size={12} /> The Parkview
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-20 relative bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold text-[#B89020] uppercase tracking-[0.2em] mb-4">Built for Modern Hospitality</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0B1426] mb-4">Designed for Every Type of Property</h2>
            <p className="text-sm text-[#0B1426]/60">From city hotels to beach resorts, StayFlow adapts to your operational needs.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-10">
            {[
              { icon: Building2, label: 'Hotels' },
              { icon: Tent, label: 'Resorts' },
              { icon: Home, label: 'Boutique Hotels' },
              { icon: Building, label: 'Business Hotels' },
              { icon: Key, label: 'Serviced Apartments' },
              { icon: Map, label: 'Hotel Chains' },
            ].map((prop, idx) => (
              <div key={idx} className="flex flex-col items-center gap-4 w-32 group cursor-pointer">
                <prop.icon size={36} className="text-[#0B1426]/40 group-hover:text-[#B89020] transition-colors" strokeWidth={1.5} />
                <span className="text-xs font-bold text-[#0B1426] text-center">{prop.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="py-24 bg-[#F9F8F6] relative border-t border-black/5">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-[10px] font-bold text-[#B89020] uppercase tracking-[0.2em] mb-4">How it works</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0B1426] mb-4">From Request to Resolution</h2>
            <p className="text-sm text-[#0B1426]/60">One connected flow keeps guests supported and hotel teams aligned.</p>
          </div>

          <div className="relative">
            <div className="absolute top-12 left-[10%] right-[10%] h-[1px] bg-[#0B1426]/10 hidden md:block" />
            <div className="grid md:grid-cols-4 gap-12 relative z-10">
              {[
                { step: '01', title: 'Guest Request', desc: 'Guests submit a service request or report an issue.', icon: MessageCircle },
                { step: '02', title: 'AI Understands', desc: 'StayFlow identifies the category and priority using AI.', icon: Zap },
                { step: '03', title: 'Staff Takes Action', desc: 'The right team receives and manages the task.', icon: Users },
                { step: '04', title: 'Issue Resolved', desc: 'Guests get an update and you gain valuable operational insights.', icon: CheckCircle2 }
              ].map((item, i) => (
                <div key={i} className="flex flex-col relative text-center">
                  <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-md mb-6 relative">
                    <item.icon size={28} className="text-[#0B1426]" strokeWidth={1.5} />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FDFCF9] rounded-full flex items-center justify-center font-bold text-[#B89020] text-xs">
                      {item.step}
                    </div>
                  </div>
                  {i < 3 && <div className="hidden md:block absolute top-12 -right-6 text-[#0B1426]/20"><ArrowRight size={20} /></div>}
                  <h3 className="font-bold text-base text-[#0B1426] mb-2">{item.title}</h3>
                  <p className="text-xs text-[#0B1426]/60 leading-relaxed px-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solutions / Experiences */}
      <section id="solutions" className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-[10px] font-bold text-[#B89020] uppercase tracking-[0.2em] mb-4">Our Solution</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0B1426] mb-4">One Platform for the Entire Hotel Operation</h2>
            <p className="text-sm text-[#0B1426]/60 max-w-2xl mx-auto">StayFlow brings together guests, staff, managers, and administrators — everything you need to handle guest requests, team workflows, and property insights, all in one place.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             {[
               { role: 'Guests', icon: ConciergeBell, desc: 'Request services and track status' },
               { role: 'Staff', icon: Users, desc: 'Manage and complete tasks' },
               { role: 'Managers', icon: BarChart3, desc: 'Monitor operations and insights' },
               { role: 'Admins', icon: Settings, desc: 'Manage properties and settings' }
             ].map((r, i) => (
               <div key={i} className="flex flex-col items-center text-center p-6 border-r border-[#0B1426]/5 last:border-0">
                 <div className="w-16 h-16 bg-[#F9F8F6] rounded-full flex items-center justify-center mb-6">
                   <r.icon size={24} className="text-[#0B1426]" strokeWidth={1.5} />
                 </div>
                 <h3 className="font-bold text-[#0B1426] mb-2">{r.role}</h3>
                 <p className="text-xs text-[#0B1426]/60">{r.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-[#FDFCF9] border-t border-black/5">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-[10px] font-bold text-[#B89020] uppercase tracking-[0.2em] mb-4">Key Features</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0B1426] mb-4">Powerful Features for Real Hotel Operations</h2>
            <p className="text-sm text-[#0B1426]/60">Built to simplify operations, resolve issues faster, and create better guest experiences.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: MessageSquare, title: 'AI Concierge', desc: 'Hotel-specific conversational assistance powered by RAG.' },
              { icon: FileText, title: 'Request Understanding', desc: 'Converts guest requests into structured operational formats.' },
              { icon: Zap, title: 'Smart Priority', desc: 'Determines request priority based on issue context and hotel rules.' },
              { icon: UserPlus, title: 'Smart Assignment', desc: 'Routes tasks to the right staff based on department, skills, and workload.' },
              { icon: Clock, title: 'SLA Tracking', desc: 'Tracks deadlines, risk, escalation, and resolution performance.' },
              { icon: ImageIcon, title: 'Multimodal Issue Analysis', desc: 'Uses text and optional images to identify reported room or service issues.' },
              { icon: TrendingUp, title: 'Issue Trends', desc: 'Detects recurring issues across rooms, floors, categories, and time periods.' },
              { icon: Activity, title: 'Operations Insights', desc: 'Provides managers with actionable operational analytics.' }
            ].map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-[#0B1426]/5 hover:shadow-lg transition-shadow flex flex-col items-start">
                <div className="w-10 h-10 bg-[#F4F7FF] rounded-lg flex items-center justify-center text-[#2563EB] mb-5">
                  <f.icon size={20} />
                </div>
                <h3 className="font-bold text-sm text-[#0B1426] mb-2">{f.title}</h3>
                <p className="text-[11px] text-[#0B1426]/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-[#F9F8F6] border-y border-black/5">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold text-[#B89020] uppercase tracking-[0.2em] mb-4">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0B1426] mb-4">Simple Plans for Growing Properties</h2>
            <p className="text-sm text-[#0B1426]/60">Choose a plan that fits your hotel's needs.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Essential */}
            <div className="bg-white rounded-2xl p-8 border border-black/5 flex flex-col hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-lg text-[#0B1426] mb-2">Essential</h3>
              <div className="flex items-end gap-1 mb-8">
                <span className="text-4xl font-bold text-[#0B1426]">₹999</span>
                <span className="text-xs text-[#0B1426]/50 mb-1">/ month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-[#0B1426]/80"><Check size={16} className="text-success" /> Up to 30 rooms</li>
                <li className="flex items-center gap-3 text-sm text-[#0B1426]/80"><Check size={16} className="text-success" /> Core guest & staff workflows</li>
                <li className="flex items-center gap-3 text-sm text-[#0B1426]/80"><Check size={16} className="text-success" /> Basic analytics</li>
              </ul>
              <Link to="/signup"><Button variant="outline" className="w-full border-black/10 font-bold h-12">Get Started</Button></Link>
            </div>

            {/* Professional */}
            <div className="bg-white rounded-2xl p-8 border-2 border-[#0B1426] flex flex-col relative shadow-xl scale-105 z-10">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#B89020] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Popular
              </div>
              <h3 className="font-bold text-lg text-[#0B1426] mb-2">Professional</h3>
              <div className="flex items-end gap-1 mb-8">
                <span className="text-4xl font-bold text-[#0B1426]">₹1,999</span>
                <span className="text-xs text-[#0B1426]/50 mb-1">/ month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-[#0B1426]/80"><Check size={16} className="text-success" /> Up to 100 rooms</li>
                <li className="flex items-center gap-3 text-sm text-[#0B1426]/80"><Check size={16} className="text-success" /> AI-powered features</li>
                <li className="flex items-center gap-3 text-sm text-[#0B1426]/80"><Check size={16} className="text-success" /> Advanced analytics</li>
                <li className="flex items-center gap-3 text-sm text-[#0B1426]/80"><Check size={16} className="text-success" /> SLA monitoring</li>
              </ul>
              <Link to="/signup"><Button className="w-full bg-[#0B1426] text-white font-bold h-12">Get Started</Button></Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-2xl p-8 border border-black/5 flex flex-col hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-lg text-[#0B1426] mb-2">Enterprise</h3>
              <div className="flex items-end gap-1 mb-8">
                <span className="text-4xl font-bold text-[#0B1426]">₹3,999</span>
                <span className="text-xs text-[#0B1426]/50 mb-1">/ month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-[#0B1426]/80"><Check size={16} className="text-success" /> Multiple properties</li>
                <li className="flex items-center gap-3 text-sm text-[#0B1426]/80"><Check size={16} className="text-success" /> Advanced controls</li>
                <li className="flex items-center gap-3 text-sm text-[#0B1426]/80"><Check size={16} className="text-success" /> Custom integrations</li>
                <li className="flex items-center gap-3 text-sm text-[#0B1426]/80"><Check size={16} className="text-success" /> Dedicated support</li>
              </ul>
              <Link to="/signup"><Button variant="outline" className="w-full border-black/10 font-bold h-12">Get Started</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0B1426] text-white py-20 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between z-10 relative">
          <div className="max-w-xl text-center md:text-left mb-10 md:mb-0">
            <h2 className="text-3xl font-serif font-bold mb-4">Ready to Simplify Your Hotel Operations?</h2>
            <p className="text-sm text-white/70 mb-8 max-w-md mx-auto md:mx-0">Bring guest requests, staff workflows, and operational insights together with StayFlow.</p>
            <Link to="/signup">
              <Button size="lg" className="bg-[#B89020] text-white hover:bg-[#A37E1C] font-bold px-8 h-12 rounded-lg">
                Get Started <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center">
            {/* Simple leaf graphic SVG mimicking the screenshot */}
            <svg width="200" height="200" viewBox="0 0 100 100" className="opacity-20 absolute top-1/2 left-1/2 md:left-auto md:right-[20%] -translate-y-1/2 -translate-x-1/2 md:-translate-x-0">
              <path d="M10,90 C10,40 40,10 90,10 C90,60 60,90 10,90 Z" stroke="#B89020" strokeWidth="2" fill="none"/>
              <line x1="10" y1="90" x2="90" y2="10" stroke="#B89020" strokeWidth="1" />
            </svg>
            
            <div className="border-l border-white/20 pl-8 hidden md:block z-10 relative">
              <p className="text-sm font-bold leading-snug">Better<br/>Operations.<br/>Happier Stays.</p>
              <div className="w-8 h-0.5 bg-[#B89020] mt-3"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-black/5 pb-8 mb-8">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-[#B89020] rounded-lg flex items-center justify-center text-white">
                <Building2 size={16} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-[#0B1426] leading-none">StayFlow</span>
                <span className="text-[8px] font-medium text-[#0B1426]/60">Smarter Hospitality Operations</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-bold text-[#0B1426]/60">
              <button onClick={() => scrollTo('workflow')} className="hover:text-[#B89020] transition-colors">How It Works</button>
              <button onClick={() => scrollTo('solutions')} className="hover:text-[#B89020] transition-colors">Solutions</button>
              <button onClick={() => scrollTo('features')} className="hover:text-[#B89020] transition-colors">Features</button>
              <button onClick={() => scrollTo('pricing')} className="hover:text-[#B89020] transition-colors">Pricing</button>
              <Link to="/guest-access" className="hover:text-[#B89020] transition-colors">Guest Access</Link>
              <Link to="/login" className="hover:text-[#B89020] transition-colors">Sign In</Link>
            </div>
            
            
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between text-[10px] text-[#0B1426]/40">
            <p>© 2026 StayFlow. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-[#0B1426]">Privacy</a>
              <a href="#" className="hover:text-[#0B1426]">Terms</a>
              <a href="#" className="hover:text-[#0B1426]">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
