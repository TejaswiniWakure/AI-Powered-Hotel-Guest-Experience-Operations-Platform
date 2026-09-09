import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Building, Save } from 'lucide-react';

export default function AdminHotel() {
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg"><Building className="text-primary" size={24} /></div>
        <div>
          <h1 className="text-3xl font-bold text-primary">Hotel Setup</h1>
          <p className="text-text-muted mt-1">Configure your hotel's profile and information.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-primary mb-6">Hotel Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Hotel Name</label>
                <Input placeholder="e.g. The Grand Hotel" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Address</label>
                <Input placeholder="Full hotel address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">Phone</label>
                  <Input placeholder="+91 XXXXX XXXXX" type="tel" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">Email</label>
                  <Input placeholder="contact@hotel.com" type="email" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Description</label>
                <textarea className="flex w-full rounded-md border border-border bg-white px-3 py-2 text-sm placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent min-h-[100px]" placeholder="A brief description of your hotel..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Facilities (comma-separated)</label>
                <Input placeholder="e.g. Pool, Gym, Spa, Restaurant, Conference Hall" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setSaved(true)} className="flex items-center gap-2">
                <Save size={16} /> {saved ? 'Saved!' : 'Save Changes'}
              </Button>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h2 className="text-lg font-bold text-primary mb-4">Hotel Logo</h2>
            <div className="aspect-square bg-secondary-bg rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 text-text-muted cursor-pointer hover:border-primary transition-colors">
              <Building size={40} className="opacity-30" />
              <span className="text-sm font-medium">Upload Logo</span>
              <span className="text-xs">PNG, JPG up to 2MB</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
