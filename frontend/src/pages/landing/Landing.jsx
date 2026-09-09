import React from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import {
  Building2, MessageSquare, CheckSquare, BarChart3, ShieldCheck,
  Zap, Clock, Users, TrendingUp, Star, ArrowRight, Check,
  ConciergeBell, AlertTriangle, Gift, BookOpen, Menu, X
} from 'lucide-react';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold text-primary">
            <Building2 className="text-accent" size={24} />
            StayFlow
          </div>
          <div className="hidden md:flex items-center gap-8 text-text-muted font-medium text-sm">
            <a href="#product" className="hover:text-primary transition-colors">Product</a>
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#solutions" className="hover:text-primary transition-colors">Solutions</a>
            <Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
            <a href="#resources" className="hover:text-primary transition-colors">Resources</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/pricing">
              <Button size="sm" className="bg-primary text-accent hover:bg-primary-hover">Get Started</Button>
            </Link>
          </div>
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} className="text-primary" /> : <Menu size={24} className="text-primary" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-border px-6 py-4 space-y-4">
            <a href="#product" className="block text-text-muted hover:text-primary font-medium">Product</a>
            <a href="#features" className="block text-text-muted hover:text-primary font-medium">Features</a>
            <Link to="/pricing" className="block text-text-muted hover:text-primary font-medium">Pricing</Link>
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="flex-1"><Button variant="outline" className="w-full">Login</Button></Link>
              <Link to="/pricing" className="flex-1"><Button className="w-full bg-primary text-accent">Get Started</Button></Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="bg-primary text-white pt-24 pb-32 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-accent font-medium mb-8">
            <Zap size={14} /> Hotel operations, reimagined
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            Turn Every Guest Request<br />Into a <span className="text-accent">Better Stay.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            StayFlow connects guests, hotel staff, and management in one intelligent operations platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/pricing">
              <Button size="lg" className="w-full sm:w-auto bg-accent text-primary hover:bg-accent-light font-semibold px-8">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white/30 hover:bg-white/10 px-8">
                View Demo <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
        {/* Background glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-secondary/60 blur-3xl pointer-events-none" />
      </section>

      {/* Trusted By */}
      <section className="py-14 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-bold text-text-muted uppercase tracking-widest mb-8">Designed for every type of hotel</p>
          <div className="flex flex-wrap justify-center gap-12 text-text-muted/40 font-extrabold text-xl items-center">
            {['Boutique Hotels', 'Business Hotels', 'Luxury Resorts', 'Hotel Groups', 'Extended Stay'].map(t => (
              <span key={t} className="hover:text-text-muted/60 transition-colors">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="product" className="py-28 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-5">How It Works</h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">One connected workflow from the moment a guest has a need to the moment it is resolved — and learned from.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-border via-accent/40 to-border -z-0" />
          {[
            { title: 'Request', desc: 'Guest submits a request via Concierge chat or service menu.', icon: <MessageSquare size={22} className="text-accent" />, num: '01' },
            { title: 'Understand', desc: 'StayFlow categorises, prioritises, and routes the request instantly.', icon: <Zap size={22} className="text-accent" />, num: '02' },
            { title: 'Resolve', desc: 'Staff receives the task, acts within SLA, and marks it complete.', icon: <CheckSquare size={22} className="text-accent" />, num: '03' },
            { title: 'Improve', desc: 'Analytics and trend detection surface opportunities for the manager.', icon: <TrendingUp size={22} className="text-accent" />, num: '04' },
          ].map((step, i) => (
            <div key={i} className="relative z-10 bg-card rounded-2xl border border-border p-7 shadow-sm text-center">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-5 shadow-md">{step.icon}</div>
              <p className="text-xs font-bold text-accent mb-2 tracking-widest">{step.num}</p>
              <h3 className="text-xl font-bold text-primary mb-3">{step.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Three Experiences */}
      <section id="solutions" className="py-24 bg-secondary-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-5">One Platform. Three Experiences.</h2>
            <p className="text-lg text-text-muted">Built specifically for how each role works.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                role: 'Guest', tagline: 'Request anything from your room.',
                desc: 'A polished mobile-first portal that makes requesting services, reporting issues, and chatting with the concierge effortless.',
                icon: <ConciergeBell size={28} className="text-accent" />,
                features: ['Smart Concierge chat', 'One-tap service requests', 'Photo issue reporting', 'Live request tracking'],
                path: '/guest', cta: 'Guest Demo'
              },
              {
                role: 'Staff', tagline: 'Handle work faster and stay organised.',
                desc: 'A focused task management workspace with SLA timers, smart task summaries, and an AI-powered assistant for hotel procedures.',
                icon: <Users size={28} className="text-accent" />,
                features: ['Kanban & List task views', 'SLA countdown timers', 'Staff Assistant chat', 'Performance dashboard'],
                path: '/staff', cta: 'Staff Demo'
              },
              {
                role: 'Manager', tagline: 'See what is happening and drive improvement.',
                desc: 'A data-rich operations dashboard with real-time visibility, analytics, and AI-detected issue trends with recommended actions.',
                icon: <BarChart3 size={28} className="text-accent" />,
                features: ['Live operations feed', 'Analytics & charts', 'Issue Trend detection', 'Offers & recommendations'],
                path: '/manager', cta: 'Manager Demo'
              },
            ].map((exp, i) => (
              <Card key={i} className="p-8 flex flex-col hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6">{exp.icon}</div>
                <h3 className="text-2xl font-bold text-primary mb-1">{exp.role}</h3>
                <p className="text-accent font-semibold text-sm mb-4">{exp.tagline}</p>
                <p className="text-text-muted text-sm mb-6 leading-relaxed">{exp.desc}</p>
                <ul className="space-y-2 mb-8 flex-1">
                  {exp.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-text-muted">
                      <Check size={14} className="text-success shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to={exp.path}>
                  <Button variant="outline" className="w-full">{exp.cta} <ArrowRight size={14} className="ml-2" /></Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-28 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-5">Everything Your Hotel Needs</h2>
          <p className="text-lg text-text-muted">Every feature is built around the guest-to-resolution workflow.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: <MessageSquare size={22} className="text-accent" />, name: 'Concierge', desc: 'Natural language guest assistance powered by hotel knowledge.' },
            { icon: <ConciergeBell size={22} className="text-accent" />, name: 'Smart Requests', desc: 'Structured service requests that route themselves to the right team.' },
            { icon: <AlertTriangle size={22} className="text-accent" />, name: 'Issue Reporting', desc: 'Photo-based problem reporting with automatic detection and priority.' },
            { icon: <CheckSquare size={22} className="text-accent" />, name: 'Task Management', desc: 'Kanban and list views with SLA timers and smart task summaries.' },
            { icon: <Clock size={22} className="text-accent" />, name: 'SLA Monitoring', desc: 'Configurable SLA tiers with automatic escalation and alerts.' },
            { icon: <BarChart3 size={22} className="text-accent" />, name: 'Analytics', desc: 'Rich visual charts for requests, resolution times, and satisfaction.' },
            { icon: <TrendingUp size={22} className="text-accent" />, name: 'Issue Trends', desc: 'Automatic detection of recurring operational patterns with recommendations.' },
            { icon: <Gift size={22} className="text-accent" />, name: 'Guest Preferences', desc: 'Personalised service offers based on guest behaviour and history.' },
          ].map((f, i) => (
            <Card key={i} className="p-6 hover:border-primary transition-colors hover:shadow-sm group">
              <div className="w-10 h-10 bg-primary/5 group-hover:bg-primary/10 rounded-xl flex items-center justify-center mb-4 transition-colors">{f.icon}</div>
              <h3 className="font-bold text-primary mb-2">{f.name}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-5">Simple, Transparent Pricing</h2>
          <p className="text-white/70 text-lg mb-14">Start with a 14-day free trial. No credit card required.</p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              { plan: 'Essential', price: '₹4,999', desc: 'For small hotels up to 30 rooms.', cta: 'Start Free Trial', highlight: false },
              { plan: 'Professional', price: '₹9,999', desc: 'For growing hotels up to 100 rooms.', cta: 'Start Free Trial', highlight: true },
              { plan: 'Enterprise', price: 'Custom', desc: 'Multiple properties, unlimited scale.', cta: 'Contact Sales', highlight: false },
            ].map((plan, i) => (
              <div key={i} className={`rounded-2xl p-7 border ${plan.highlight ? 'border-accent bg-secondary shadow-xl' : 'border-white/10 bg-white/5'}`}>
                {plan.highlight && <p className="text-accent text-xs font-bold uppercase tracking-wider mb-3">Most Popular</p>}
                <h3 className="text-xl font-bold mb-1">{plan.plan}</h3>
                <div className="mb-3"><span className="text-3xl font-bold">{plan.price}</span>{plan.price !== 'Custom' && <span className="text-white/60 text-sm"> / month</span>}</div>
                <p className="text-white/60 text-sm mb-6">{plan.desc}</p>
                <Link to="/pricing">
                  <Button size="sm" className={`w-full ${plan.highlight ? 'bg-accent text-primary hover:bg-accent-light' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">Ready to simplify hotel operations?</h2>
        <p className="text-lg text-text-muted mb-10 max-w-xl mx-auto">Join hotels using StayFlow to deliver better guest experiences, faster resolutions, and smarter operations.</p>
        <Link to="/pricing">
          <Button size="lg" className="bg-primary text-accent hover:bg-primary-hover px-12 font-semibold">
            Get Started Today
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-10 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <Building2 className="text-accent" size={20} /> StayFlow
              </div>
              <p className="text-white/50 text-sm leading-relaxed">Guest Experience. Hotel Operations. One Flow.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'How It Works', 'Changelog', 'Roadmap'] },
              { title: 'Solutions', links: ['Boutique Hotels', 'Business Hotels', 'Resorts', 'Hotel Groups'] },
              { title: 'Pricing', links: ['Essential', 'Professional', 'Enterprise', 'Compare Plans'] },
              { title: 'Company', links: ['About', 'Privacy', 'Terms', 'Support'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-semibold text-sm mb-4 text-white">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link}><a href="#" className="text-white/50 hover:text-accent text-sm transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-xs">© 2026 StayFlow. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-white/40">
              <a href="#" className="hover:text-white/70">Privacy Policy</a>
              <a href="#" className="hover:text-white/70">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
