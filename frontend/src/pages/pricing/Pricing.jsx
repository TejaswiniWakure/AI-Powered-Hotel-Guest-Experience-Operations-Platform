import React from 'react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Link to="/" className="text-accent font-semibold mb-4 inline-block hover:underline">&larr; Back to Home</Link>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Choose the plan that fits your hotel's needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Essential Plan */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">Essential</CardTitle>
              <CardDescription>For small hotels starting out.</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-primary">₹4,999</span>
                <span className="text-text-muted"> / month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3 text-sm text-text-muted">
                {['Up to 30 rooms', 'Guest web portal', 'Service requests', 'Staff workspace', 'Basic analytics', 'Knowledge Center', 'Basic reports', 'Email notifications'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" /> {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">Start Free Trial</Button>
            </CardFooter>
          </Card>

          {/* Professional Plan */}
          <Card className="flex flex-col border-accent shadow-md relative scale-105 z-10 bg-primary text-white">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Badge variant="accent" className="px-4 py-1 text-sm bg-accent text-primary">MOST POPULAR</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl text-white">Professional</CardTitle>
              <CardDescription className="text-white/70">For growing and mid-size hotels.</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">₹9,999</span>
                <span className="text-white/70"> / month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="font-medium text-sm mb-4 text-accent">Everything in Essential +</p>
              <ul className="space-y-3 text-sm text-white/80">
                {['Up to 100 rooms', 'Concierge', 'Photo-based issue reporting', 'Smart task routing', 'SLA monitoring', 'Advanced analytics', 'Guest preferences', 'Automated reports', 'Real-time notifications'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-accent" /> {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-accent text-primary hover:bg-accent-light">Start Free Trial</Button>
            </CardFooter>
          </Card>

          {/* Enterprise Plan */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">Enterprise</CardTitle>
              <CardDescription>For large hotels and groups.</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-primary">Custom</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="font-medium text-sm mb-4">Everything in Professional +</p>
              <ul className="space-y-3 text-sm text-text-muted">
                {['Unlimited rooms', 'Multiple properties', 'Advanced reporting', 'Custom workflows', 'Safety & Compliance', 'Custom integrations', 'Dedicated support', 'Enterprise security'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">Contact Sales</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
