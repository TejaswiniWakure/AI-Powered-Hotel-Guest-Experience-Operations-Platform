import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, Clock, AlertTriangle, ArrowLeft, 
  ChevronRight, Star, User, MessageSquare, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/shared/Modal';
import { api } from '../../services/api';
import SLAIndicator from '../../components/shared/SLAIndicator';
import PriorityBadge from '../../components/shared/PriorityBadge';
import StatusBadge from '../../components/shared/StatusBadge';
import EmptyState from '../../components/shared/EmptyState';

// 1. LIST OF GUEST REQUESTS
export function GuestRequestsList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/guest/requests')
      .then(data => {
        if (Array.isArray(data)) setRequests(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-5 max-w-lg mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-primary font-serif">My Room Requests</h1>
        <p className="text-xs text-text-muted mt-0.5">Track live progress, technician assignments, and SLA resolution times.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-text-muted">Loading request history...</div>
      ) : requests.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No requests yet"
          description="You have not submitted any room service or maintenance requests during this stay."
          actionLabel="Request a Service"
          onAction={() => window.location.href = '/guest/services'}
        />
      ) : (
        <div className="space-y-3.5">
          {requests.map(req => (
            <Link to={`/guest/requests/${req._id}`} key={req._id} className="block">
              <Card className="p-4 hover:border-primary hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Room {req.roomNumber}
                    </span>
                    <h3 className="font-bold text-sm text-primary mt-0.5">{req.category}</h3>
                  </div>
                  <StatusBadge status={req.status} />
                </div>

                <p className="text-xs text-text-muted line-clamp-2 leading-relaxed mb-3">
                  {req.description}
                </p>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <SLAIndicator slaDeadline={req.slaDeadline} slaMinutes={req.slaMinutes} status={req.status} />
                  <span className="text-accent font-semibold flex items-center gap-0.5">
                    View Progress <ChevronRight size={14} />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// 2. DETAILED VIEW OF SINGLE REQUEST WITH LIVE TIMELINE & FEEDBACK MODAL
export function GuestRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  // Feedback State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [resolutionSatisfied, setResolutionSatisfied] = useState(true);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const fetchDetail = () => {
    api.get(`/guest/requests/${id}`)
      .then(data => setRequest(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetail();
    const interval = setInterval(fetchDetail, 8000);
    return () => clearInterval(interval);
  }, [id]);

  const handleFeedbackSubmit = async () => {
    setSubmittingFeedback(true);
    try {
      await api.post(`/guest/requests/${id}/feedback`, {
        rating,
        comment,
        resolutionSatisfied
      });
      setShowFeedbackModal(false);
      fetchDetail();
    } catch (err) {
      alert('Failed to submit feedback: ' + err.message);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-text-muted">Loading request progress...</div>;
  }

  if (!request) {
    return (
      <div className="p-5 max-w-lg mx-auto">
        <p className="text-xs text-text-muted">Request not found.</p>
        <Link to="/guest/requests" className="text-xs text-accent mt-2 inline-block">← Back to requests</Link>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-lg mx-auto">
      {/* Back button */}
      <Link to="/guest/requests" className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-primary mb-4 transition-colors">
        <ArrowLeft size={14} /> Back to Requests
      </Link>

      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            Request #{request._id?.slice(-6).toUpperCase()} · Room {request.roomNumber}
          </span>
          <h1 className="text-xl font-bold text-primary font-serif mt-0.5">{request.category}</h1>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {/* SLA & Details Card */}
      <Card className="p-4 mb-5 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-border text-xs">
          <span className="text-text-muted">SLA Status</span>
          <SLAIndicator slaDeadline={request.slaDeadline} slaMinutes={request.slaMinutes} status={request.status} />
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-border text-xs">
          <span className="text-text-muted">Priority</span>
          <PriorityBadge priority={request.priority} />
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-border text-xs">
          <span className="text-text-muted">Department</span>
          <span className="font-semibold text-primary">{request.department || 'Operations'}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-text-muted">Assigned Specialist</span>
          <span className="font-semibold text-primary">{request.assignedTo?.name || 'Smart Dispatch Assigned'}</span>
        </div>
      </Card>

      {/* Description & Photo */}
      <Card className="p-4 mb-5">
        <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Guest Request Details</h3>
        <p className="text-xs text-text-muted leading-relaxed whitespace-pre-line mb-3">
          {request.description}
        </p>

        {request.images && request.images.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Attached Photograph</p>
            <div className="rounded-xl overflow-hidden border border-border aspect-video">
              <img src={request.images[0]} alt="Guest attachment" className="w-full h-full object-cover" />
            </div>
          </div>
        )}
      </Card>

      {/* Interactive Timeline */}
      <Card className="p-4 mb-6">
        <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-4">Operational Timeline</h3>
        <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
          {(request.timeline && request.timeline.length > 0 ? request.timeline : [
            { action: 'CREATED', by: 'Guest', note: 'Request logged into StayFlow operations.', timestamp: request.createdAt }
          ]).map((t, idx) => (
            <div key={idx} className="relative flex items-start gap-3.5 pl-1 text-xs">
              <div className="w-5 h-5 rounded-full bg-primary text-accent flex items-center justify-center text-[10px] font-bold shrink-0 z-10">
                ✓
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">{t.action}</span>
                  <span className="text-[10px] text-text-muted">
                    {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-text-muted mt-0.5">{t.note}</p>
                {t.by && <p className="text-[10px] text-accent mt-0.5 font-medium">By: {t.by}</p>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Feedback Section (Available if completed) */}
      {request.status === 'completed' && (
        <Card className="p-5 border-accent/40 bg-secondary-bg/30 text-center">
          {request.feedback?.rating ? (
            <div>
              <div className="flex justify-center gap-1 text-accent mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={20} fill={star <= request.feedback.rating ? 'currentColor' : 'none'} />
                ))}
              </div>
              <h3 className="font-bold text-sm text-primary mb-1">Feedback Submitted</h3>
              <p className="text-xs text-text-muted">"{request.feedback.comment || 'Resolved satisfactorily'}"</p>
            </div>
          ) : (
            <div>
              <h3 className="font-bold text-sm text-primary mb-1">Service Completed</h3>
              <p className="text-xs text-text-muted mb-4">How was your experience with this resolution?</p>
              <Button
                onClick={() => setShowFeedbackModal(true)}
                className="bg-primary text-accent hover:bg-primary-hover font-bold text-xs px-6"
              >
                Rate Experience (1-5 Stars)
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Feedback Dialog Modal */}
      <Modal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        title="Rate Your StayFlow Resolution"
      >
        <div className="space-y-4">
          <div className="text-center py-2">
            <p className="text-xs text-text-muted mb-2">How satisfied are you with the service provided?</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-accent hover:scale-110 transition-transform"
                >
                  <Star size={32} fill={star <= rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wider">
              Was the problem completely resolved?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setResolutionSatisfied(true)}
                className={`py-2 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 ${
                  resolutionSatisfied ? 'bg-primary text-white border-primary' : 'bg-white text-text-muted border-border'
                }`}
              >
                <ThumbsUp size={14} /> Yes, Solved
              </button>
              <button
                type="button"
                onClick={() => setResolutionSatisfied(false)}
                className={`py-2 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 ${
                  !resolutionSatisfied ? 'bg-critical text-white border-critical' : 'bg-white text-text-muted border-border'
                }`}
              >
                <ThumbsDown size={14} /> Needs Work
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wider">
              Comments (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Prompt and polite staff, perfect resolution!"
              rows={3}
              className="w-full text-xs p-3 rounded-xl border border-border bg-white focus:outline-none focus:border-primary"
            />
          </div>

          <Button
            onClick={handleFeedbackSubmit}
            disabled={submittingFeedback}
            className="w-full bg-primary text-accent hover:bg-primary-hover font-bold text-xs uppercase tracking-wider py-2.5"
          >
            {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
