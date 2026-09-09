import React from 'react';
import { Button } from '../../components/ui/Button';
import { User, Briefcase, BarChart3, Settings, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Login() {
  const panels = [
    {
      title: 'Guest',
      desc: 'Your stay, simplified.',
      icon: <User className="h-7 w-7 text-accent" />,
      features: ['Concierge', 'Services', 'Issue reporting', 'Request tracking'],
      path: '/guest',
      variant: 'outline',
    },
    {
      title: 'Staff',
      desc: 'Your work, organized.',
      icon: <Briefcase className="h-7 w-7 text-primary" />,
      features: ['Tasks', 'Priorities', 'Assignments', 'Assistant', 'Performance'],
      path: '/staff',
      variant: 'outline',
    },
    {
      title: 'Manager',
      desc: 'Your hotel, at a glance.',
      icon: <BarChart3 className="h-7 w-7 text-primary" />,
      features: ['Operations', 'Analytics', 'Insights', 'Reports', 'Staff performance'],
      path: '/manager',
      variant: 'outline',
    },
    {
      title: 'Administrator',
      desc: 'Configure your StayFlow workspace.',
      icon: <Settings className="h-7 w-7 text-text-muted" />,
      features: ['Hotel setup', 'Rooms', 'Staff', 'Services', 'Knowledge Center', 'Permissions'],
      path: '/admin',
      variant: 'outline',
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-md">
              <Building2 className="h-8 w-8 text-accent" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Welcome to StayFlow</h1>
          <p className="text-text-muted text-lg">Choose how you want to continue.</p>
        </div>

        {/* Panel Cards — equal height grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {panels.map((panel, idx) => (
            <div
              key={idx}
              className="bg-card rounded-xl border border-border shadow-sm hover:border-primary hover:shadow-md transition-all flex flex-col"
            >
              {/* Icon + Title + Description — fixed top section */}
              <div className="p-6 pb-4">
                <div className="mb-5 bg-secondary-bg w-14 h-14 rounded-xl flex items-center justify-center">
                  {panel.icon}
                </div>
                <h2 className="text-xl font-bold text-primary mb-1">{panel.title}</h2>
                <p className="text-sm text-text-muted">{panel.desc}</p>
              </div>

              {/* Features list — grows to fill space */}
              <div className="px-6 flex-1">
                <ul className="space-y-2.5">
                  {panel.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-text-muted">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button — pinned to bottom */}
              <div className="p-6 pt-6">
                <Link to={panel.path} className="block">
                  <Button className="w-full" >
                    Continue as {panel.title}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer link */}
        <div className="text-center mt-10">
          <Link to="/" className="text-sm text-text-muted hover:text-accent transition-colors">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
