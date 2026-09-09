import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { BedDouble, Plus, QrCode, Pencil, Trash2 } from 'lucide-react';

export default function AdminRooms() {
  const [floors] = useState([]);

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg"><BedDouble className="text-primary" size={24} /></div>
          <div>
            <h1 className="text-3xl font-bold text-primary">Rooms & Floors</h1>
            <p className="text-text-muted mt-1">Manage room inventory, types, and statuses.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <QrCode size={16} /> Generate QR Codes
          </Button>
          <Button className="flex items-center gap-2">
            <Plus size={16} /> Add Room
          </Button>
        </div>
      </div>

      {floors.length === 0 ? (
        <Card className="p-16 flex flex-col items-center justify-center text-center border-dashed bg-secondary-bg/30">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-border">
            <BedDouble size={40} className="text-primary/40" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-3">No Rooms Configured</h2>
          <p className="text-text-muted max-w-md mx-auto mb-6">
            Start by adding your hotel's floors and rooms. Each room gets a unique QR code that guests can scan to access the StayFlow guest portal.
          </p>
          <Button className="flex items-center gap-2">
            <Plus size={16} /> Add First Room
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {floors.map((floor, i) => (
            <div key={i}>
              <h2 className="text-lg font-bold text-primary mb-3">Floor {floor.number}</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {floor.rooms.map((room, j) => (
                  <Card key={j} className="p-4 hover:border-primary transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-primary text-lg">Room {room.number}</h3>
                      <Badge variant={room.status === 'Active' ? 'success' : 'secondary'}>{room.status}</Badge>
                    </div>
                    <p className="text-sm text-text-muted">{room.type}</p>
                    <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:text-primary text-text-muted"><Pencil size={14} /></button>
                      <button className="p-1 hover:text-critical text-text-muted"><Trash2 size={14} /></button>
                      <button className="p-1 hover:text-primary text-text-muted"><QrCode size={14} /></button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
