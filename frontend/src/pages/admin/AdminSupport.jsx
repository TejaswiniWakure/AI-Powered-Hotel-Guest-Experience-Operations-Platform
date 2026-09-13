import React, { useState, useEffect } from 'react';
import { LifeBuoy, Send, CheckCircle2, Clock, MessageSquare, AlertCircle, RefreshCw, X, User } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [ticketStatus, setTicketStatus] = useState('In Progress');
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/platform/support-tickets');
      if (res) {
        setTickets(res);
        if (res.length > 0 && !selectedTicket) {
          setSelectedTicket(res[0]);
          setTicketStatus(res[0].status);
        }
      }
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() && !ticketStatus) return;

    setSubmittingReply(true);
    try {
      const res = await api.post(`/admin/platform/support-tickets/${selectedTicket._id}/reply`, {
        message: replyText.trim(),
        status: ticketStatus
      });
      setReplyText('');
      setSelectedTicket(res);
      fetchTickets();
    } catch (err) {
      alert(err.message || 'Failed to dispatch reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-primary">Support & Change Requests</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Assist customer hotel managers with menu setups, onboarding questions, and platform assistance.
          </p>
        </div>

        <button
          onClick={fetchTickets}
          className="p-2.5 rounded-xl border border-border bg-white text-text-muted hover:text-primary hover:bg-secondary-bg transition-colors flex items-center gap-1.5 text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw size={14} /> Refresh Tickets
        </button>
      </div>

      {/* Tickets Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <Card className="p-4 border-border shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-primary uppercase tracking-wider">Tickets Queue ({tickets.length})</h2>

          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {loading ? (
              <div className="text-center py-12 text-text-muted text-xs">Loading tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-12 text-text-muted text-xs">No active tickets.</div>
            ) : (
              tickets.map(t => (
                <div
                  key={t._id}
                  onClick={() => { setSelectedTicket(t); setTicketStatus(t.status); }}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedTicket?._id === t._id
                      ? 'bg-primary/5 border-primary shadow-xs'
                      : 'bg-white border-border hover:bg-secondary-bg/40'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-mono text-[10px] font-bold text-text-muted">{t.ticketNo}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      t.status === 'Open'
                        ? 'bg-amber-100 text-amber-800'
                        : t.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-primary truncate">{t.subject}</h4>
                  <p className="text-[11px] text-text-muted mt-0.5">{t.hotelName} • {t.managerName}</p>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Ticket Conversation Detail */}
        <Card className="lg:col-span-2 p-6 border-border shadow-xs flex flex-col justify-between min-h-[600px]">
          {selectedTicket ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex justify-between items-start pb-4 border-b border-border">
                  <div>
                    <span className="font-mono text-xs font-bold text-accent">{selectedTicket.ticketNo}</span>
                    <h2 className="text-lg font-bold font-serif text-primary mt-0.5">{selectedTicket.subject}</h2>
                    <p className="text-xs text-text-muted mt-0.5">
                      {selectedTicket.hotelName} ({selectedTicket.hotelCode}) • Manager: {selectedTicket.managerName} ({selectedTicket.managerEmail})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={ticketStatus}
                      onChange={(e) => setTicketStatus(e.target.value)}
                      className="text-xs p-2 rounded-xl border border-border bg-white font-semibold text-primary"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                {/* Original Message */}
                <div className="my-5 p-4 rounded-2xl bg-secondary-bg/50 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-primary text-accent text-xs font-bold flex items-center justify-center">
                      M
                    </div>
                    <span className="text-xs font-bold text-primary">{selectedTicket.managerName}</span>
                    <span className="text-[10px] text-text-muted">
                      {new Date(selectedTicket.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-text leading-relaxed pl-8">
                    {selectedTicket.message}
                  </p>
                </div>

                {/* Replies Thread */}
                {selectedTicket.replies && selectedTicket.replies.length > 0 && (
                  <div className="space-y-3 pl-4 border-l-2 border-primary/20 my-4">
                    {selectedTicket.replies.map((r, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-border text-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-accent">{r.senderName}</span>
                          <span className="text-[10px] text-text-muted">{new Date(r.sentAt).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-text">{r.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="pt-4 border-t border-border space-y-3">
                <textarea
                  placeholder="Type your reply or advisory note to the manager..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl border border-border bg-white focus:outline-none focus:border-primary"
                />

                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-text-muted">Manager will be notified instantly</span>
                  <Button
                    type="submit"
                    disabled={submittingReply || (!replyText.trim() && ticketStatus === selectedTicket.status)}
                    className="bg-primary text-accent hover:bg-primary-hover font-bold text-xs flex items-center gap-2 py-2.5 px-5"
                  >
                    <Send size={13} /> {submittingReply ? 'Sending...' : 'Send Reply & Update'}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-32 text-text-muted text-xs">
              Select a support ticket from the list to view the conversation.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
