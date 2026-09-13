import React, { useState, useEffect } from 'react';
import { 
  BedDouble, Plus, Trash2, Edit2, 
  Settings, CheckCircle2, RefreshCw, Zap
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminRooms() {
  const { hotelName } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [floorFilter, setFloorFilter] = useState('');

  // Create Room Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newFloor, setNewFloor] = useState('1');
  const [newType, setNewType] = useState('standard');
  const [creating, setCreating] = useState(false);

  // Generate Rooms Modal
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [genFloors, setGenFloors] = useState('5');
  const [genRoomsPerFloor, setGenRoomsPerFloor] = useState('10');
  const [generating, setGenerating] = useState(false);

  const fetchRooms = () => {
    setLoading(true);
    api.get('/admin/rooms', { floor: floorFilter })
      .then(data => {
        if (Array.isArray(data)) setRooms(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRooms();
  }, [floorFilter]);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomNumber) return;
    setCreating(true);
    try {
      await api.post('/admin/rooms', {
        roomNumber: newRoomNumber,
        floor: Number(newFloor),
        type: newType,
        status: 'available'
      });
      setShowCreateModal(false);
      setNewRoomNumber('');
      fetchRooms();
    } catch (err) {
      alert('Failed to create room: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleGenerateRooms = async (e) => {
    e.preventDefault();
    if (!genFloors || !genRoomsPerFloor) return;
    setGenerating(true);
    try {
      await api.post('/admin/rooms/generate', {
        floors: Number(genFloors),
        roomsPerFloor: Number(genRoomsPerFloor)
      });
      setShowGenerateModal(false);
      setFloorFilter('');
      fetchRooms();
    } catch (err) {
      alert('Failed to generate rooms: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!confirm('Are you sure you want to remove this room?')) return;
    try {
      await api.delete(`/admin/rooms/${id}`);
      fetchRooms();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const updateRoomStatus = async (id, status) => {
    try {
      await api.patch(`/admin/rooms/${id}`, { status });
      fetchRooms();
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif">Room Inventory</h1>
          <p className="text-text-muted text-sm mt-1">Configure property room numbers, floors, and types.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowGenerateModal(true)}
            variant="outline"
            className="border-primary text-primary hover:bg-primary/5 font-bold text-xs gap-1.5"
          >
            <Zap size={16} className="text-accent" /> Auto-Generate
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary text-accent hover:bg-primary-hover font-bold text-xs gap-1.5"
          >
            <Plus size={16} /> Add Room
          </Button>
        </div>
      </div>

      {/* Filter by floor */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
        <button
          onClick={() => setFloorFilter('')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            floorFilter === '' ? 'bg-primary text-white shadow-xs' : 'bg-white text-text-muted border border-border'
          }`}
        >
          All Floors
        </button>
        {[1, 2, 3, 4, 5, 6, 7].map(f => (
          <button
            key={f}
            onClick={() => setFloorFilter(f.toString())}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              floorFilter === f.toString() ? 'bg-primary text-white shadow-xs' : 'bg-white text-text-muted border border-border hover:bg-black/5'
            }`}
          >
            Floor {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-text-muted bg-white rounded-xl border border-border">
          Loading rooms...
        </div>
      ) : rooms.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-border bg-secondary-bg/30">
          <BedDouble size={36} className="mx-auto text-text-muted mb-3 opacity-60" />
          <h3 className="font-bold text-sm text-primary mb-1">No Rooms Configured</h3>
          <p className="text-xs text-text-muted mb-4">You haven't added any rooms to this property yet.</p>
          <div className="flex justify-center gap-3">
             <Button onClick={() => setShowGenerateModal(true)} className="bg-primary text-accent hover:bg-primary-hover text-sm gap-2">
               <Zap size={14} /> Auto-Generate Rooms
             </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {rooms.map(room => (
            <Card key={room._id} className="p-4 bg-white hover:border-primary transition-colors flex flex-col justify-between">
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-bold text-primary">{room.roomNumber}</span>
                <button onClick={() => handleDeleteRoom(room._id)} className="text-text-muted hover:text-critical transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Floor {room.floor} · {room.type}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`w-2 h-2 rounded-full ${
                    room.status === 'available' ? 'bg-success' :
                    room.status === 'occupied' ? 'bg-critical' :
                    'bg-high'
                  }`} />
                  <select 
                    value={room.status}
                    onChange={(e) => updateRoomStatus(room._id, e.target.value)}
                    className="text-[11px] font-medium bg-transparent outline-none cursor-pointer"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Auto-Generate Rooms Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 bg-white">
            <h2 className="text-lg font-bold text-primary mb-1">Generate Rooms</h2>
            <p className="text-xs text-text-muted mb-5">Automatically create bulk rooms for {hotelName}.</p>

            <form onSubmit={handleGenerateRooms} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">Number of Floors</label>
                  <Input type="number" min="1" max="100" value={genFloors} onChange={e => setGenFloors(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">Rooms per Floor</label>
                  <Input type="number" min="1" max="100" value={genRoomsPerFloor} onChange={e => setGenRoomsPerFloor(e.target.value)} required />
                </div>
              </div>
              
              <div className="p-3 bg-secondary-bg/50 rounded-lg">
                <p className="text-xs font-bold text-primary mb-2">Room Numbering Preview:</p>
                <div className="text-[11px] text-text-muted space-y-1">
                  <p>○ 101–1{String(genRoomsPerFloor).padStart(2, '0')}</p>
                  <p>○ 201–2{String(genRoomsPerFloor).padStart(2, '0')}</p>
                  {Number(genFloors) > 2 && <p>○ ...</p>}
                  {Number(genFloors) > 2 && <p>○ {genFloors}01–{genFloors}{String(genRoomsPerFloor).padStart(2, '0')}</p>}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowGenerateModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={generating} className="flex-1 bg-primary text-accent hover:bg-primary-hover font-semibold">
                  {generating ? 'Generating...' : 'Generate Rooms'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Single Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm p-6 bg-white">
            <h2 className="text-lg font-bold text-primary mb-4">Add Single Room</h2>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">Room Number *</label>
                <Input value={newRoomNumber} onChange={e => setNewRoomNumber(e.target.value)} placeholder="e.g. 301" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">Floor</label>
                  <Input type="number" value={newFloor} onChange={e => setNewFloor(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">Type</label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={newType}
                    onChange={e => setNewType(e.target.value)}
                  >
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={creating} className="flex-1 bg-primary text-accent hover:bg-primary-hover font-semibold">
                  {creating ? 'Saving...' : 'Add Room'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
