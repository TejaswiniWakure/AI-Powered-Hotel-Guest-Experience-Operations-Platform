import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LogOut, Settings, User, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GuestProfile() {
  return (
    <div className="p-6 max-w-md mx-auto mb-16">
      <h1 className="text-2xl font-bold text-primary mb-6">Profile</h1>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 bg-secondary-bg rounded-full flex items-center justify-center">
          <User size={40} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary">Guest Name</h2>
          <p className="text-text-muted">Room 312</p>
          <p className="text-text-muted text-sm">Oct 12 - Oct 15</p>
        </div>
      </div>
      
      <Card className="p-4 mb-6">
        <h3 className="font-semibold text-primary mb-4 flex items-center gap-2"><Heart size={18} className="text-critical" /> Hotel Preferences</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Extra Towels</span>
            <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">Always</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Vegetarian Food</span>
            <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">Preferred</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Quiet Room</span>
            <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">Requested</span>
          </div>
        </div>
      </Card>
      
      <div className="space-y-2 mb-8">
        <button className="w-full flex items-center justify-between p-4 bg-white border border-border rounded-lg hover:border-primary transition-colors">
          <div className="flex items-center gap-3 text-primary"><Settings size={20} /> Settings</div>
        </button>
      </div>

      <Link to="/login" className="block w-full">
        <Button variant="outline" className="w-full text-critical hover:bg-critical/10 flex items-center gap-2 justify-center">
          <LogOut size={18} /> Checkout / Sign Out
        </Button>
      </Link>
    </div>
  );
}
