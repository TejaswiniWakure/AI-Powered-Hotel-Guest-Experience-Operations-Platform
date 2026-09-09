import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Clock, ChevronRight, InboxIcon } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export function GuestRequestsList() {
  const requests = [];

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6">My Requests</h1>

      {requests.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed bg-secondary-bg/50">
          <InboxIcon size={48} className="text-text-muted opacity-40 mb-4" />
          <h3 className="text-lg font-bold text-primary mb-2">No requests yet</h3>
          <p className="text-text-muted text-sm max-w-xs">
            You haven't submitted any requests during this stay. Use the concierge or service options from the home screen.
          </p>
          <Link to="/guest" className="mt-6 text-sm font-semibold text-accent hover:underline">
            Go to Home
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <Link to={`/guest/requests/${req.id}`} key={req.id}>
              <Card className="p-4 hover:border-primary transition-colors cursor-pointer mb-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-primary">{req.title}</h3>
                  <Badge variant={req.status === 'Completed' ? 'success' : 'accent'}>{req.status}</Badge>
                </div>
                <div className="flex justify-between items-center text-sm text-text-muted mt-4">
                  <div className="flex items-center gap-1">
                    <Clock size={14} /> {req.time}
                  </div>
                  <span className="flex items-center text-primary">Details <ChevronRight size={14} /></span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function GuestRequestDetail() {
  const { id } = useParams();

  return (
    <div className="p-6 max-w-md mx-auto mb-16">
      <Link to="/guest/requests" className="text-primary font-medium flex items-center mb-6">
        ← Back to Requests
      </Link>
      <h1 className="text-2xl font-bold text-primary mb-2">Request {id}</h1>
      <p className="text-text-muted">Request details will appear here once connected to the backend.</p>
    </div>
  );
}
