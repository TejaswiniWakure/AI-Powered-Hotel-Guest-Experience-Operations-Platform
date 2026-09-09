import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ConciergeBell, AlertTriangle, Coffee, Info, ChevronRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';

export default function GuestHome() {
  const activeRequests = [];

  return (
    <div className="p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-8 mt-4">
        <h1 className="text-2xl font-bold text-primary">Welcome 👋</h1>
        <p className="text-text-muted">Room 312 · The Grand StayFlow</p>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link to="/guest/concierge">
          <Card className="p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-primary transition-colors h-32 bg-primary text-white border-primary cursor-pointer">
            <MessageSquare size={32} className="text-accent" />
            <span className="font-medium">Ask Concierge</span>
          </Card>
        </Link>
        <Link to="/guest/services">
          <Card className="p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-primary transition-colors h-32 cursor-pointer">
            <ConciergeBell size={32} className="text-primary" />
            <span className="font-medium text-primary">Request Service</span>
          </Card>
        </Link>
        <Link to="/guest/report">
          <Card className="p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-primary transition-colors h-32 cursor-pointer">
            <AlertTriangle size={32} className="text-critical" />
            <span className="font-medium text-primary">Report Problem</span>
          </Card>
        </Link>
        <Link to="/guest/services">
          <Card className="p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-primary transition-colors h-32 cursor-pointer">
            <Coffee size={32} className="text-primary" />
            <span className="font-medium text-primary">Room Service</span>
          </Card>
        </Link>
      </div>

      {/* Active Requests */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-primary mb-4 flex justify-between items-center">
          Active Requests
          <Link to="/guest/requests" className="text-sm text-accent font-medium hover:underline">View All</Link>
        </h2>

        {activeRequests.length === 0 ? (
          <Card className="p-6 text-center border-dashed bg-secondary-bg/50">
            <p className="text-text-muted text-sm">No active requests. Ask the concierge or request a service to get started.</p>
          </Card>
        ) : (
          activeRequests.map((req) => (
            <Link to={`/guest/requests/${req.id}`} key={req.id}>
              <Card className="p-4 border-l-4 border-l-high mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-primary">{req.title}</h3>
                    <p className="text-sm text-text-muted">{req.time}</p>
                  </div>
                  <span className="bg-secondary-bg text-primary text-xs px-2 py-1 rounded-full font-medium">{req.status}</span>
                </div>
                <div className="mt-3 flex items-center text-sm text-accent font-medium">
                  View details <ChevronRight size={16} className="ml-1" />
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* Hotel Info */}
      <Card className="p-4 bg-secondary-bg border-none">
        <div className="flex items-start gap-3">
          <div className="bg-white p-2 rounded-lg">
            <Info className="text-primary" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-primary">Hotel Information</h3>
            <p className="text-sm text-text-muted mt-1">Breakfast: 7:00 AM – 10:30 AM<br/>Pool: 6:00 AM – 10:00 PM</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
