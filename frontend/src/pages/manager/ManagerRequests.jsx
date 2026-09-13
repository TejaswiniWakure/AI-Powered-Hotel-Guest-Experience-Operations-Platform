import React, { useState, useEffect } from 'react';
import { 
  Filter, Search, UserCheck, AlertTriangle, 
  ArrowUpDown, CheckCircle, RefreshCw, MoreVertical 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/shared/Modal';
import { api } from '../../services/api';
import SLAIndicator from '../../components/shared/SLAIndicator';
import PriorityBadge from '../../components/shared/PriorityBadge';
import StatusBadge from '../../components/shared/StatusBadge';

export default function ManagerRequests() {
  const [requests, setRequests] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [floor, setFloor] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');

  // Reassignment Modal State
  const [reassignRequest, setReassignRequest] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [reassignReason, setReassignReason] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  // Priority Change Modal State
  const [priorityRequest, setPriorityRequest] = useState(null);
  const [newPriority, setNewPriority] = useState('High');

  const fetchRequests = () => {
    setLoading(true);
    api.get('/manager/requests', {
      department,
      floor,
      priority,
      status
    })
      .then(data => {
        if (Array.isArray(data)) setRequests(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
    // Also load available staff for reassignment
    api.get('/admin/staff')
      .then(data => {
        if (Array.isArray(data)) setStaffList(data);
      })
      .catch(() => {});
  }, [department, floor, priority, status]);

  const handleReassign = async () => {
    if (!reassignRequest || !selectedStaffId) return;
    setSubmittingAction(true);
    try {
      await api.patch(`/manager/requests/${reassignRequest._id}/reassign`, {
        staffId: selectedStaffId,
        reason: reassignReason || 'Manager workload rebalancing'
      });
      setReassignRequest(null);
      setSelectedStaffId('');
      setReassignReason('');
      fetchRequests();
    } catch (err) {
      alert('Reassignment failed: ' + err.message);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleChangePriority = async () => {
    if (!priorityRequest) return;
    setSubmittingAction(true);
    try {
      await api.patch(`/manager/requests/${priorityRequest._id}/priority`, {
        priority: newPriority
      });
      setPriorityRequest(null);
      fetchRequests();
    } catch (err) {
      alert('Priority update failed: ' + err.message);
    } finally {
      setSubmittingAction(false);
    }
  };

  const filteredRequests = requests.filter(r => {
    if (!search) return true;
    const term = search.toLowerCase();
    return r.roomNumber?.toLowerCase().includes(term) ||
           r.category?.toLowerCase().includes(term) ||
           r.description?.toLowerCase().includes(term) ||
           r.guestId?.name?.toLowerCase().includes(term);
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif">Guest Requests & Operational Tickets</h1>
          <p className="text-text-muted text-sm mt-1">Multi-criteria filtering, live technician assignments, and SLA status.</p>
        </div>
        <Button onClick={fetchRequests} variant="outline" size="sm" className="bg-white gap-1.5 text-xs font-bold">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Table
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 mb-6 bg-white shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search room, guest..."
            className="text-xs col-span-2 md:col-span-1"
          />

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="text-xs p-2.5 rounded-xl border border-border bg-white text-primary focus:outline-none focus:border-primary"
          >
            <option value="">All Departments</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Front Desk">Front Desk</option>
            <option value="Room Service">Room Service</option>
          </select>

          <select
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            className="text-xs p-2.5 rounded-xl border border-border bg-white text-primary focus:outline-none focus:border-primary"
          >
            <option value="">All Floors</option>
            <option value="1">Floor 1</option>
            <option value="2">Floor 2</option>
            <option value="3">Floor 3</option>
            <option value="4">Floor 4</option>
            <option value="5">Floor 5</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="text-xs p-2.5 rounded-xl border border-border bg-white text-primary focus:outline-none focus:border-primary"
          >
            <option value="">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="text-xs p-2.5 rounded-xl border border-border bg-white text-primary focus:outline-none focus:border-primary"
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="assigned">Assigned</option>
            <option value="accepted">Accepted</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="escalated">Escalated</option>
          </select>
        </div>
      </Card>

      {/* Requests Table */}
      <Card className="overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary-bg/30 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="p-4">Room / Guest</th>
                <th className="p-4">Category & Request</th>
                <th className="p-4">Dept</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Assigned To</th>
                <th className="p-4">Status</th>
                <th className="p-4">SLA Deadline</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-text-muted">Loading requests...</td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-text-muted">No requests found matching filters.</td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-secondary-bg/20 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-primary text-sm block">Room {req.roomNumber}</span>
                      <span className="text-[11px] text-text-muted">{req.guestId?.name || 'Guest'}</span>
                    </td>
                    <td className="p-4 max-w-xs">
                      <span className="font-semibold text-primary block">{req.category}</span>
                      <span className="text-[11px] text-text-muted line-clamp-1">{req.description}</span>
                    </td>
                    <td className="p-4 font-medium text-text-muted">{req.department || 'Operations'}</td>
                    <td className="p-4"><PriorityBadge priority={req.priority} /></td>
                    <td className="p-4">
                      <span className="font-medium text-primary block">{req.assignedTo?.name || 'Unassigned'}</span>
                    </td>
                    <td className="p-4"><StatusBadge status={req.status} /></td>
                    <td className="p-4">
                      <SLAIndicator slaDeadline={req.slaDeadline} slaMinutes={req.slaMinutes} status={req.status} />
                    </td>
                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => { setReassignRequest(req); setSelectedStaffId(req.assignedTo?._id || ''); }}
                        className="text-[11px] font-semibold"
                      >
                        Reassign
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => { setPriorityRequest(req); setNewPriority(req.priority); }}
                        className="text-[11px] font-semibold"
                      >
                        Priority
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Reassignment Modal */}
      <Modal
        isOpen={!!reassignRequest}
        onClose={() => setReassignRequest(null)}
        title={`Reassign Room ${reassignRequest?.roomNumber} (${reassignRequest?.category})`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
              Select Technician / Staff Member
            </label>
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-border bg-white text-primary focus:outline-none focus:border-primary"
            >
              <option value="">Select active staff...</option>
              {staffList.map(s => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.department || s.role}) {s.skills?.length ? `— Skills: ${s.skills.join(', ')}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
              Manager Reassignment Reason
            </label>
            <textarea
              value={reassignReason}
              onChange={(e) => setReassignReason(e.target.value)}
              placeholder="e.g. Workload rebalancing, specialist skills required..."
              rows={2}
              className="w-full text-xs p-2.5 rounded-xl border border-border bg-white focus:outline-none focus:border-primary"
            />
          </div>

          <Button
            onClick={handleReassign}
            disabled={submittingAction || !selectedStaffId}
            className="w-full bg-primary text-accent hover:bg-primary-hover font-bold text-xs uppercase tracking-wider py-2.5"
          >
            {submittingAction ? 'Reassigning...' : 'Confirm Reassignment'}
          </Button>
        </div>
      </Modal>

      {/* Change Priority Modal */}
      <Modal
        isOpen={!!priorityRequest}
        onClose={() => setPriorityRequest(null)}
        title={`Adjust Priority: Room ${priorityRequest?.roomNumber}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-text-muted">
            Changing priority will automatically recalculate the SLA deadline and notify the assigned technician.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {['Critical', 'High', 'Medium', 'Low'].map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setNewPriority(p)}
                className={`py-2 text-xs font-bold rounded-xl border transition-colors ${
                  newPriority === p
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-text-muted border-border hover:border-primary'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <Button
            onClick={handleChangePriority}
            disabled={submittingAction}
            className="w-full bg-primary text-accent hover:bg-primary-hover font-bold text-xs uppercase tracking-wider py-2.5"
          >
            {submittingAction ? 'Updating...' : 'Update Priority & Recalculate SLA'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
