import React, { useState, useEffect } from 'react';
import { 
  User, BedDouble, Calendar, LogOut, CheckCircle, Clock, Star, 
  Sparkles, ThumbsUp, Send, MessageSquare 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

export default function GuestProfile() {
  const { user, roomNumber, hotelName, logout } = useAuth();
  const navigate = useNavigate();
  const [checkoutRequested, setCheckoutRequested] = useState(false);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Feedback State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState('Overall Stay Experience');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const guestName = localStorage.getItem('stayflow_guestName') || user?.name || 'Guest';

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/guest/requests');
        if (Array.isArray(res)) {
          setRecentRequests(res.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to load history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      await api.post('/guest/feedback', {
        rating,
        comment: comment.trim(),
        category: feedbackCategory,
        resolutionSatisfied: rating >= 4
      });
      setFeedbackSubmitted(true);
    } catch (err) {
      alert(err.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div className="p-5 max-w-lg mx-auto pb-32 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-primary font-serif">Guest Profile</h1>
        <p className="text-xs text-text-muted mt-0.5">Stay details, stay feedback rating, and account status.</p>
      </div>

      {/* Guest Identification Card */}
      <Card className="p-5 bg-primary text-white border-primary shadow-md rounded-2xl">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-accent text-primary font-bold flex items-center justify-center text-lg shadow-sm font-serif">
            {guestName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-serif">{guestName}</h2>
            <p className="text-xs text-accent opacity-90">Authenticated Guest Session</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
          <div>
            <span className="text-white/60 block text-[10px] uppercase font-bold tracking-wider">Property</span>
            <span className="font-semibold text-white">{hotelName}</span>
          </div>
          <div>
            <span className="text-white/60 block text-[10px] uppercase font-bold tracking-wider">Allocated Room</span>
            <span className="font-bold text-accent">Room {roomNumber}</span>
          </div>
        </div>
      </Card>

      {/* Live Stay Feedback & Rating Card (Reflects in Manager Portal) */}
      <Card className="p-5 border-border shadow-xs rounded-2xl">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-accent" />
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Rate Your Stay Experience</h3>
        </div>
        <p className="text-xs text-text-muted mb-4">
          Your direct rating and comments instantly reflect in the hotel manager command dashboard.
        </p>

        {feedbackSubmitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1.5 animate-in fade-in">
            <div className="flex justify-center gap-1 text-amber-500 mb-1">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} size={16} fill={s <= rating ? 'currentColor' : 'none'} />
              ))}
            </div>
            <h4 className="text-xs font-bold text-emerald-900">Thank You! Review Recorded</h4>
            <p className="text-[11px] text-emerald-700">Your feedback has been routed to {hotelName} management.</p>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            {/* Star Picker */}
            <div className="flex items-center justify-center gap-2.5 py-2 bg-secondary-bg/40 rounded-xl border border-border/60">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-500 hover:scale-125 transition-transform"
                >
                  <Star size={28} fill={star <= rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>

            <div className="text-center text-xs font-bold text-primary">
              {rating === 5 ? '⭐⭐⭐⭐⭐ Exceptional (5.0)' :
               rating === 4 ? '⭐⭐⭐⭐ Great Stay (4.0)' :
               rating === 3 ? '⭐⭐⭐ Average Experience (3.0)' :
               rating === 2 ? '⭐⭐ Needs Improvement (2.0)' : '⭐ Unsatisfactory (1.0)'}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-primary uppercase tracking-wider mb-1">Service Area</label>
              <select
                value={feedbackCategory}
                onChange={(e) => setFeedbackCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-border bg-white focus:outline-none focus:border-primary"
              >
                <option value="Overall Stay Experience">Overall Stay Experience</option>
                <option value="Housekeeping & Cleanliness">Housekeeping & Cleanliness</option>
                <option value="In-Room Dining Food Quality">In-Room Dining Food Quality</option>
                <option value="Staff Promptness & Courtesy">Staff Promptness & Courtesy</option>
                <option value="Room Comfort & Facilities">Room Comfort & Facilities</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-primary uppercase tracking-wider mb-1">Comments or Suggestions</label>
              <textarea
                placeholder="Tell the hotel manager how your stay is going..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-border bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <Button
              type="submit"
              disabled={submittingFeedback}
              className="w-full bg-primary text-accent hover:bg-primary-hover font-bold text-xs py-3 rounded-xl shadow-xs"
            >
              {submittingFeedback ? 'Submitting...' : 'Submit Verified Feedback'}
            </Button>
          </form>
        )}
      </Card>

      {/* Recent Activity */}
      <Card className="p-5 border-border shadow-xs rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
            <Clock size={15} className="text-accent" /> Recent Activity
          </h3>
        </div>

        {loading ? (
          <div className="animate-pulse flex flex-col gap-3">
            <div className="h-4 bg-border rounded w-full"></div>
            <div className="h-4 bg-border rounded w-3/4"></div>
          </div>
        ) : recentRequests.length > 0 ? (
          <div className="space-y-3 text-xs">
            {recentRequests.map(req => (
              <div key={req._id} className="flex items-center justify-between pb-2.5 border-b border-border last:border-0 last:pb-0">
                <div>
                  <span className="font-semibold text-primary block">{req.category || 'Service Request'}</span>
                  <span className="text-text-muted text-[10px]">{new Date(req.createdAt).toLocaleDateString()}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  req.status === 'completed' || req.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-accent/20 text-primary'
                }`}>
                  {req.status}
                </span>
              </div>
            ))}
            <div className="pt-2 text-center">
              <button onClick={() => navigate('/guest/requests')} className="text-xs text-primary font-bold hover:underline">
                View all requests →
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-text-muted text-center py-4">No recent activity on file.</p>
        )}
      </Card>

      {/* Session Controls */}
      <div className="pt-2">
        <button
          onClick={() => { logout(); navigate('/guest-access'); }}
          className="w-full py-3 bg-white text-critical border border-red-200 rounded-2xl font-bold text-xs hover:bg-red-50 transition-colors flex items-center justify-center gap-2 shadow-xs"
        >
          <LogOut size={15} /> End Guest Session & Change Hotel
        </button>
      </div>
    </div>
  );
}
