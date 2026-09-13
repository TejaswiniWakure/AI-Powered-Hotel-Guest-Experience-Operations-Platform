import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckSquare, Clock, AlertTriangle, 
  Sparkles, Camera, Play, CheckCircle2, AlertCircle, 
  Send, User, FileText, ArrowRight 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/shared/Modal';
import { api } from '../../services/api';
import SLAIndicator from '../../components/shared/SLAIndicator';
import PriorityBadge from '../../components/shared/PriorityBadge';
import StatusBadge from '../../components/shared/StatusBadge';

export default function StaffTaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals & Action states
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [completionPhoto, setCompletionPhoto] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalateReason, setEscalateReason] = useState('');

  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  const fetchTask = () => {
    api.get(`/staff/tasks/${id}`)
      .then(data => setTask(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleAction = async (actionEndpoint, payload = {}) => {
    setSubmittingAction(true);
    try {
      await api.patch(`/staff/tasks/${id}/${actionEndpoint}`, payload);
      setShowCompleteModal(false);
      setShowEscalateModal(false);
      fetchTask();
    } catch (err) {
      alert(`Action failed: ` + err.message);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setAddingNote(true);
    try {
      await api.post(`/staff/tasks/${id}/notes`, { text: newNote });
      setNewNote('');
      fetchTask();
    } catch (err) {
      alert('Failed to add note: ' + err.message);
    } finally {
      setAddingNote(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCompletionPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-text-muted">Loading work order details...</div>;
  }

  if (!task) {
    return (
      <div className="p-8 text-center text-xs text-text-muted">
        Task not found. <Link to="/staff/tasks" className="text-accent underline ml-1">Back to tasks</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Link */}
      <Link to="/staff/tasks" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-primary mb-4 transition-colors font-medium">
        <ArrowLeft size={14} /> Back to Task Board
      </Link>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Work Order #{task._id?.slice(-6).toUpperCase()}
            </span>
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>
          <h1 className="text-2xl font-bold text-primary font-serif">
            Room {task.roomNumber} · {task.category}
          </h1>
        </div>

        {/* Workflow Execution Control Group */}
        <div className="flex items-center gap-2 flex-wrap">
          {task.status === 'assigned' && (
            <Button
              onClick={() => handleAction('accept')}
              disabled={submittingAction}
              className="bg-accent text-primary hover:bg-accent-light font-bold text-xs"
            >
              Accept Work Order
            </Button>
          )}

          {task.status === 'accepted' && (
            <Button
              onClick={() => handleAction('start')}
              disabled={submittingAction}
              className="bg-primary text-accent hover:bg-primary-hover font-bold text-xs gap-1"
            >
              <Play size={14} /> Start Execution
            </Button>
          )}

          {['accepted', 'in_progress'].includes(task.status) && (
            <>
              <Button
                onClick={() => setShowCompleteModal(true)}
                disabled={submittingAction}
                className="bg-success text-white hover:bg-success/90 font-bold text-xs gap-1"
              >
                <CheckCircle2 size={14} /> Mark as Completed
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEscalateModal(true)}
                disabled={submittingAction}
                className="border-critical text-critical hover:bg-critical/5 text-xs font-bold"
              >
                Escalate
              </Button>
            </>
          )}

          {task.status === 'completed' && (
            <span className="text-xs font-bold text-success bg-success/15 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <CheckCircle2 size={16} /> Work Order Closed
            </span>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {/* Left Column: Details & Guest Request */}
        <div className="md:col-span-7 space-y-6">
          {/* SLA Status Card */}
          <Card className="p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Service Level Agreement</span>
                <p className="text-sm font-bold text-primary mt-0.5">{task.slaMinutes} Minutes Target</p>
              </div>
              <SLAIndicator slaDeadline={task.slaDeadline} slaMinutes={task.slaMinutes} status={task.status} />
            </div>
            {task.assignmentReason && (
              <div className="mt-3 pt-3 border-t border-border text-xs text-text-muted flex items-start gap-1.5">
                <Sparkles size={14} className="text-accent shrink-0 mt-0.5" />
                <span><strong>Dispatch Note:</strong> {task.assignmentReason}</span>
              </div>
            )}
          </Card>

          {/* Description & Guest Photo */}
          <Card className="p-5 bg-white space-y-4">
            <div>
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Guest Request Description</h3>
              <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line bg-secondary-bg/30 p-3 rounded-xl border border-border">
                {task.description}
              </p>
            </div>

            {task.aiSummary && (
              <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 text-xs text-primary">
                <span className="font-bold text-accent block mb-0.5">AI Diagnostic Summary</span>
                {task.aiSummary}
              </div>
            )}

            {task.requestId?.images && task.requestId.images.length > 0 && (
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Guest Photo Attached</p>
                <div className="rounded-xl overflow-hidden border border-border aspect-video">
                  <img src={task.requestId.images[0]} alt="Guest photo" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {task.completionPhoto && (
              <div>
                <p className="text-xs font-bold text-success uppercase tracking-wider mb-2">Completion Proof Verified</p>
                <div className="rounded-xl overflow-hidden border border-success/30 aspect-video">
                  <img src={task.completionPhoto} alt="Completion proof" className="w-full h-full object-cover" />
                </div>
                {task.resolutionNotes && (
                  <p className="text-xs text-text-muted mt-2"><strong>Notes:</strong> {task.resolutionNotes}</p>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Operational Notes & Quick SOP link */}
        <div className="md:col-span-5 space-y-6">
          <Card className="p-5 bg-primary text-white border-primary shadow-sm">
            <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles size={14} /> Need Troubleshooting Guidance?
            </div>
            <h4 className="font-bold text-base mb-1">StayFlow SOP Assistant</h4>
            <p className="text-xs text-white/70 mb-4 leading-relaxed">
              Query step-by-step repair manuals, emergency safety standards, and engineering checklists.
            </p>
            <Link to="/staff/assistant">
              <Button size="sm" className="w-full bg-accent text-primary hover:bg-accent-light font-bold text-xs">
                Open SOP Assistant →
              </Button>
            </Link>
          </Card>

          {/* Operational Notes Log */}
          <Card className="p-5 bg-white">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Shift Running Notes</h3>
            
            <div className="space-y-3 max-h-52 overflow-y-auto pr-1 mb-4">
              {(!task.notes || task.notes.length === 0) ? (
                <p className="text-xs text-text-muted italic">No internal notes logged yet.</p>
              ) : (
                task.notes.map((n, i) => (
                  <div key={i} className="p-2.5 bg-secondary-bg/40 rounded-xl border border-border text-xs">
                    <p className="text-text-main leading-relaxed">{n.text}</p>
                    <div className="flex items-center justify-between text-[10px] text-text-muted mt-1.5 pt-1 border-t border-border/50">
                      <span className="font-semibold text-primary">{n.by}</span>
                      <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add note input */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log note (e.g. Replaced 16A breaker)..."
                className="flex-1 text-xs p-2.5 rounded-xl border border-border focus:outline-none focus:border-primary"
              />
              <Button type="submit" disabled={addingNote || !newNote.trim()} size="sm" className="shrink-0 bg-primary text-accent">
                <Send size={14} />
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* Completion Proof Modal */}
      <Modal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        title="Complete Work Order"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
              Resolution Summary *
            </label>
            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Describe work performed (e.g. Cleared clogged AC drain line, verified cooling at 22°C)..."
              rows={3}
              required
              className="w-full text-xs p-3 rounded-xl border border-border bg-white focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
              Completion Photo Proof (Optional)
            </label>
            {completionPhoto ? (
              <div className="relative rounded-xl overflow-hidden border border-border aspect-video">
                <img src={completionPhoto} alt="Completion preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setCompletionPhoto('')}
                  className="absolute top-2 right-2 bg-primary/80 text-white text-[10px] px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary bg-secondary-bg/20">
                <Camera size={22} className="text-text-muted mb-1" />
                <span className="text-xs font-semibold text-primary">Upload repair proof photo</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            )}
          </div>

          <Button
            onClick={() => handleAction('complete', { resolutionNotes, completionPhoto })}
            disabled={submittingAction || !resolutionNotes.trim()}
            className="w-full bg-success text-white hover:bg-success/90 py-2.5 font-bold text-xs uppercase tracking-wider"
          >
            {submittingAction ? 'Closing Task...' : 'Confirm Resolution & Notify Guest'}
          </Button>
        </div>
      </Modal>

      {/* Escalation Modal */}
      <Modal
        isOpen={showEscalateModal}
        onClose={() => setShowEscalateModal(false)}
        title="Escalate Work Order to Manager"
      >
        <div className="space-y-4">
          <p className="text-xs text-text-muted">
            Escalating will notify the Duty Operations Manager and flag this room request for emergency intervention.
          </p>
          <div>
            <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
              Reason for Escalation *
            </label>
            <textarea
              value={escalateReason}
              onChange={(e) => setEscalateReason(e.target.value)}
              placeholder="e.g. Major compressor fault requiring external replacement part, safety hazard detected..."
              rows={3}
              className="w-full text-xs p-3 rounded-xl border border-border bg-white focus:outline-none focus:border-primary"
            />
          </div>

          <Button
            onClick={() => handleAction('escalate', { reason: escalateReason })}
            disabled={submittingAction || !escalateReason.trim()}
            className="w-full bg-critical text-white hover:bg-critical/90 py-2.5 font-bold text-xs uppercase tracking-wider"
          >
            {submittingAction ? 'Escalating...' : 'Confirm Escalation'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
