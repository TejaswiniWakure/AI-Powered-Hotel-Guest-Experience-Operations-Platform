import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  MessageSquare, ConciergeBell, AlertTriangle, Coffee, 
  ChevronRight, Clock, CheckCircle, Info, Sparkles, Star, UtensilsCrossed 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import SLAIndicator from '../../components/shared/SLAIndicator';
import StatusBadge from '../../components/shared/StatusBadge';

export default function GuestHome() {
  const [searchParams] = useSearchParams();
  const { roomNumber, setGuestRoom, hotelName } = useAuth();
  const [activeRequests, setActiveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Rating State
  const [rating, setRating] = useState(5);
  const [feedbackDone, setFeedbackDone] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);

  // Auto-detect room from QR code URL param: /guest?room=312
  useEffect(() => {
    const roomParam = searchParams.get('room');
    if (roomParam && roomParam !== roomNumber) {
      setGuestRoom(roomParam);
    }
  }, [searchParams]);

  useEffect(() => {
    api.get('/guest/dashboard')
      .then(data => {
        if (data && data.activeRequests) {
          setActiveRequests(data.activeRequests);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [roomNumber]);

  const handleQuickRate = async (stars) => {
    setRating(stars);
    setSubmittingRating(true);
    try {
      await api.post('/guest/feedback', {
        rating: stars,
        category: 'Overall Stay Experience',
        comment: `Rated ${stars} stars from Room ${roomNumber}`,
        resolutionSatisfied: stars >= 4
      });
      setFeedbackDone(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingRating(false);
    }
  };

  const guestName = localStorage.getItem('stayflow_guestName') || 'Guest';
  const firstName = guestName.split(' ')[0];

  return (
    <div className="p-5 max-w-lg mx-auto pb-32">
      {/* Welcome Banner */}
      <div className="mb-6 mt-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/15 text-primary text-xs font-bold mb-2">
              <Sparkles size={12} className="text-accent" /> Premium Guest Experience
            </div>
            <h1 className="text-2xl font-bold text-primary font-serif">Welcome, {firstName}</h1>
            <p className="text-text-muted text-xs mt-0.5">
              Room <strong className="text-primary font-bold">{roomNumber}</strong> · {hotelName}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-secondary-bg flex items-center justify-center font-bold text-primary text-base shadow-xs font-serif">
            {roomNumber}
          </div>
        </div>
      </div>

      {/* Main 4 Action Buttons */}
      <div className="grid grid-cols-2 gap-3.5 mb-6">
        <Link to="/guest/concierge" className="block">
          <Card className="p-4 flex flex-col justify-between h-32 bg-primary text-white border-primary hover:bg-primary-hover hover:shadow-md transition-all cursor-pointer group rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
              <MessageSquare size={22} />
            </div>
            <div>
              <p className="font-bold text-sm text-white font-serif">Ask Concierge</p>
              <p className="text-[11px] text-white/60">Instant AI hotel answers</p>
            </div>
          </Card>
        </Link>

        <Link to="/guest/services" className="block">
          <Card className="p-4 flex flex-col justify-between h-32 bg-white hover:border-primary hover:shadow-md transition-all cursor-pointer group rounded-2xl border-border">
            <div className="w-10 h-10 rounded-xl bg-secondary-bg flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <ConciergeBell size={22} className="text-accent" />
            </div>
            <div>
              <p className="font-bold text-sm text-primary font-serif">Request Service</p>
              <p className="text-[11px] text-text-muted">Towels, water, cleaning</p>
            </div>
          </Card>
        </Link>

        <Link to="/guest/report" className="block">
          <Card className="p-4 flex flex-col justify-between h-32 bg-white hover:border-critical hover:shadow-md transition-all cursor-pointer group rounded-2xl border-border">
            <div className="w-10 h-10 rounded-xl bg-critical/10 flex items-center justify-center text-critical group-hover:scale-105 transition-transform">
              <AlertTriangle size={22} />
            </div>
            <div>
              <p className="font-bold text-sm text-primary font-serif">Report Problem</p>
              <p className="text-[11px] text-text-muted">Photo & fast dispatch</p>
            </div>
          </Card>
        </Link>

        <Link to="/guest/services/room-service" className="block">
          <Card className="p-4 flex flex-col justify-between h-32 bg-white hover:border-primary hover:shadow-md transition-all cursor-pointer group rounded-2xl border-border">
            <div className="w-10 h-10 rounded-xl bg-secondary-bg flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <UtensilsCrossed size={22} className="text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm text-primary font-serif">In-Room Dining</p>
              <p className="text-[11px] text-text-muted">Browse menu & cart</p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Quick Stay Feedback Rating Banner */}
      <Card className="p-4 mb-6 border-border bg-white rounded-2xl shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-primary font-serif block">How is your stay at {hotelName}?</span>
            <span className="text-[10px] text-text-muted">Tap to rate your experience</span>
          </div>

          {feedbackDone ? (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              ✓ Rated {rating}★
            </span>
          ) : (
            <div className="flex items-center gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleQuickRate(s)}
                  disabled={submittingRating}
                  className="p-1 hover:scale-125 transition-transform"
                >
                  <Star size={20} fill={s <= rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Active Requests Stream */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-primary uppercase tracking-wider">Active Requests</h2>
          <Link to="/guest/requests" className="text-xs font-semibold text-accent hover:underline">
            View All History →
          </Link>
        </div>

        {loading ? (
          <div className="p-6 bg-white rounded-xl border border-border text-center text-xs text-text-muted">
            Checking active room requests...
          </div>
        ) : activeRequests.length === 0 ? (
          <Card className="p-5 text-center border-dashed border-border bg-secondary-bg/30 rounded-2xl">
            <p className="text-xs font-medium text-text-muted">
              No active requests for Room {roomNumber}. Everything is running smoothly.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {activeRequests.map((req) => (
              <Link to={`/guest/requests/${req._id}`} key={req._id} className="block">
                <Card className="p-4 hover:border-primary hover:shadow-sm transition-all border-l-4 border-l-accent rounded-2xl">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-sm text-primary">{req.category}</h3>
                      <p className="text-xs text-text-muted line-clamp-1 mt-0.5">{req.description}</p>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                    <SLAIndicator slaDeadline={req.slaDeadline} slaMinutes={req.slaMinutes} status={req.status} />
                    <span className="text-accent font-semibold flex items-center gap-0.5">
                      Track <ChevronRight size={14} />
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Hotel Highlights */}
      <Card className="p-4 bg-secondary-bg/70 border-border rounded-2xl">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
            <Info size={18} className="text-accent" />
          </div>
          <div className="text-xs">
            <h3 className="font-bold text-primary text-sm mb-1 font-serif">Hotel Facilities & Timings</h3>
            <p className="text-text-muted leading-relaxed">
              • Breakfast: 6:30 AM – 11:00 AM (Main Pavilion)<br/>
              • In-Room Dining: Available 24/7 (Delivery in 25–35 min)<br/>
              • Housekeeping & Maintenance: On-demand dispatch
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
