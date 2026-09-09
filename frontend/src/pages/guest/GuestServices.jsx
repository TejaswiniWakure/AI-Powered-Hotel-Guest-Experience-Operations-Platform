import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Bath, Wind, Droplet, Brush, Home, Coffee, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GuestServices() {
  const [selectedService, setSelectedService] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const services = [
    { id: 1, name: 'Extra Towels', icon: <Bath size={24} /> },
    { id: 2, name: 'Extra Pillow', icon: <Wind size={24} /> },
    { id: 3, name: 'Drinking Water', icon: <Droplet size={24} /> },
    { id: 4, name: 'Room Cleaning', icon: <Brush size={24} /> },
    { id: 5, name: 'Iron', icon: <Home size={24} /> },
    { id: 6, name: 'Room Service', icon: <Coffee size={24} /> },
  ];

  if (selectedService) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <button onClick={() => setSelectedService(null)} className="flex items-center text-primary mb-6">
          <ArrowLeft size={20} className="mr-2" /> Back to Services
        </button>
        <h1 className="text-2xl font-bold text-primary mb-6">Request {selectedService.name}</h1>
        
        <Card className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-main mb-2">Quantity</label>
            <div className="flex items-center gap-4">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary-bg">
                <Minus size={16} />
              </button>
              <span className="text-xl font-medium w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary-bg">
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-main mb-2">Additional Notes</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
              placeholder="E.g., Please leave at the door..."
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-main mb-2">Preferred Time</label>
            <select className="w-full border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary bg-white">
              <option>As soon as possible</option>
              <option>In 30 minutes</option>
              <option>In 1 hour</option>
            </select>
          </div>
          
          <Button className="w-full" onClick={() => alert("Request Submitted!")}>Submit Request</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6">Request a Service</h1>
      <div className="grid grid-cols-2 gap-4">
        {services.map(service => (
          <Card 
            key={service.id} 
            className="p-4 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:border-primary transition-colors h-32"
            onClick={() => setSelectedService(service)}
          >
            <div className="text-primary bg-secondary-bg p-3 rounded-full">
              {service.icon}
            </div>
            <span className="font-medium text-primary text-sm">{service.name}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
