import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Snowflake, Monitor, Wifi, Droplets, Lightbulb, Bath, 
  Sparkles, Volume2, LockKeyhole, CircleEllipsis, Camera, Upload, 
  Trash2, ShieldAlert, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const CATEGORIES = [
  { id: 'HVAC', label: 'AC / Cooling', icon: <Snowflake size={22} />, sub: ['Not cooling', 'Making noise', 'Water leaking', 'Not turning on', 'Bad smell', 'Other'] },
  { id: 'TV', label: 'TV / Remote', icon: <Monitor size={22} />, sub: ['No signal', 'Remote not working', 'Screen broken', 'No power', 'Other'] },
  { id: 'Wi-Fi', label: 'Wi-Fi / Internet', icon: <Wifi size={22} />, sub: ['Cannot connect', 'Slow internet', 'Keeps disconnecting', 'No signal', 'Other'] },
  { id: 'Plumbing', label: 'Plumbing / Water', icon: <Droplets size={22} />, sub: ['Water leak', 'No hot water', 'Low pressure', 'Toilet issue', 'Drain blocked', 'Other'] },
  { id: 'Lighting', label: 'Lighting / Power', icon: <Lightbulb size={22} />, sub: ['Bulb fused', 'Switch broken', 'No power', 'Sparking', 'Other'] },
  { id: 'Bathroom', label: 'Bathroom', icon: <Bath size={22} />, sub: ['Shower issue', 'Toilet issue', 'Hot water issue', 'Drain issue', 'Cleanliness', 'Other'] },
  { id: 'Cleanliness', label: 'Cleanliness', icon: <Sparkles size={22} />, sub: ['Floor dirty', 'Trash not empty', 'Bad odor', 'Linen soiled', 'Other'] },
  { id: 'Noise', label: 'Noise', icon: <Volume2 size={22} />, sub: ['Nearby room', 'Corridor', 'Outside traffic', 'AC/equipment noise', 'Other'] },
  { id: 'Door', label: 'Door / Lock', icon: <LockKeyhole size={22} />, sub: ['Cannot lock', 'Cannot unlock', 'Keycard not working', 'Door damaged', 'Other'] },
  { id: 'Other', label: 'Other Problem', icon: <CircleEllipsis size={22} />, sub: [] },
];

const COMMON_AREAS = ['Lobby', 'Restaurant', 'Swimming Pool', 'Gym', 'Corridor', 'Lift / Elevator', 'Parking', 'Other'];

export default function GuestReport() {
  const navigate = useNavigate();
  const { roomNumber, hotelName } = useAuth();
  
  const [cat, setCat] = useState(null);
  const [subs, setSubs] = useState([]);
  const [desc, setDesc] = useState('');
  const [locType, setLocType] = useState('room');
  const [commonArea, setCommonArea] = useState('');
  const [urgency, setUrgency] = useState('asap');
  const [access, setAccess] = useState('knock');
  const [images, setImages] = useState([]);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const activeCat = CATEGORIES.find(c => c.id === cat);

  const toggleSub = (s) => {
    setSubs(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && images.length < 3) {
      const reader = new FileReader();
      reader.onloadend = () => setImages([...images, reader.result]);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!desc.trim()) return;
    setLoading(true);
    
    const finalLocation = locType === 'room' ? `Room ${roomNumber}` : `Common Area: ${commonArea}`;
    const fullDesc = `Subcategories: ${subs.join(', ')}\n${desc}\nAccess: ${locType==='room'?access:'N/A'}`;
    
    try {
      const res = await api.post('/guest/requests/issue', {
        category: cat,
        location: finalLocation,
        description: fullDesc,
        image: images[0],
        requestedTime: urgency
      });
      setSuccess(res);
    } catch (err) {
      console.error(err);
      alert('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto p-6 flex flex-col items-center justify-center text-center pt-10 pb-28">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
          <CheckCircle2 size={36} />
        </div>
        <h2 className="text-2xl font-serif font-bold text-primary mb-1">Problem Reported</h2>
        <p className="text-xs text-text-muted mb-6">
          Location: <strong className="text-primary">{locType === 'room' ? `Room ${roomNumber}` : commonArea}</strong> · {hotelName}
        </p>
        
        <div className="bg-white rounded-2xl border border-border p-4 w-full text-left space-y-3 mb-6 shadow-xs">
          <div>
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">AI Analysis</span>
            <span className="text-xs font-semibold text-primary">{success.aiAnalysis?.summary || activeCat?.label}</span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Priority</span>
            <span className="text-xs font-semibold text-primary capitalize">{success.request?.priority || 'High'}</span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Assigned Team</span>
            <span className="text-xs font-semibold text-primary">{success.task?.departmentName || 'Maintenance'}</span>
          </div>
        </div>

        <div className="w-full space-y-2.5">
          <button 
            onClick={() => navigate('/guest/requests')} 
            className="w-full bg-primary text-accent py-3.5 rounded-2xl shadow-md font-bold text-xs hover:bg-primary-hover transition-all"
          >
            Track Resolution Status
          </button>
          <button 
            onClick={() => navigate('/guest')} 
            className="w-full bg-secondary-bg text-primary py-3 rounded-2xl font-semibold text-xs border border-border hover:bg-secondary-bg/80 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6 pb-32">
      {/* Header */}
      <div className="pt-2 pb-2 border-b border-border flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)} 
          className="p-1.5 -ml-1 text-text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft size={20}/>
        </button>
        <div>
          <h1 className="text-lg font-serif font-bold text-primary">Report an Issue</h1>
          <p className="text-[11px] text-text-muted">Assisting Room <strong className="text-primary">{roomNumber}</strong> · {hotelName}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Common Categories */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2.5">1. Select Issue Category</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {CATEGORIES.map(c => (
              <button 
                type="button"
                key={c.id} 
                onClick={() => { setCat(c.id); setSubs([]); }} 
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  cat === c.id 
                    ? 'bg-primary/5 border-primary text-primary font-bold shadow-xs' 
                    : 'bg-white border-border text-text hover:border-primary/40'
                }`}
              >
                <div className={cat === c.id ? 'text-primary' : 'text-text-muted'}>{c.icon}</div>
                <span className="text-xs leading-tight">{c.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 2. Sub-issues */}
        {activeCat && activeCat.sub.length > 0 && (
          <section className="animate-in fade-in slide-in-from-top-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">2. What best describes the issue?</h3>
            <div className="flex flex-wrap gap-2">
              {activeCat.sub.map(s => (
                <button 
                  type="button"
                  key={s} 
                  onClick={() => toggleSub(s)} 
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    subs.includes(s) 
                      ? 'bg-primary text-accent border-primary shadow-xs' 
                      : 'bg-white border-border text-text hover:bg-secondary-bg'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 3. Description */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">3. Describe the problem *</h3>
          <textarea 
            value={desc} 
            onChange={e => setDesc(e.target.value)}
            placeholder={activeCat ? `e.g. The ${activeCat.label.toLowerCase()} is not working properly...` : "Describe the issue affecting your stay."}
            rows={3}
            className="w-full bg-white border border-border rounded-xl p-3 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
          <div className="text-right text-[10px] text-text-muted mt-1">{desc.length} / 500</div>
        </section>

        {/* 4. Photo upload */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">4. Add photo (optional)</h3>
          <div className="flex gap-2.5">
            <label className="flex-1 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center py-3.5 bg-white cursor-pointer hover:bg-secondary-bg transition-colors">
               <Camera size={18} className="text-text-muted mb-1" />
               <span className="text-[11px] font-medium text-text-muted">Take Photo</span>
               <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
            </label>
            <label className="flex-1 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center py-3.5 bg-white cursor-pointer hover:bg-secondary-bg transition-colors">
               <Upload size={18} className="text-text-muted mb-1" />
               <span className="text-[11px] font-medium text-text-muted">Upload Image</span>
               <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          {images.length > 0 && (
            <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border shadow-xs">
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))} 
                    className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-bl-lg"
                  >
                    <Trash2 size={11}/>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5. Location */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">5. Location *</h3>
          <div className="grid grid-cols-2 gap-2 mb-2">
             <button 
               type="button" 
               onClick={() => setLocType('room')} 
               className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                 locType === 'room' ? 'bg-primary/5 border-primary text-primary shadow-xs' : 'bg-white border-border text-text'
               }`}
             >
               ● My Room ({roomNumber})
             </button>
             <button 
               type="button" 
               onClick={() => setLocType('common')} 
               className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                 locType === 'common' ? 'bg-primary/5 border-primary text-primary shadow-xs' : 'bg-white border-border text-text'
               }`}
             >
               ○ Common Area
             </button>
          </div>
          {locType === 'common' && (
            <select 
              value={commonArea} 
              onChange={e => setCommonArea(e.target.value)} 
              className="w-full bg-white border border-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-primary"
            >
              <option value="">Select location area...</option>
              {COMMON_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          )}
        </section>

        {/* 6. Urgency */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">6. When do you need help?</h3>
          <div className="grid grid-cols-2 gap-2">
             <label className={`p-2.5 border rounded-xl flex items-center gap-2 text-xs cursor-pointer ${
               urgency === 'asap' ? 'bg-primary/5 border-primary text-primary font-bold' : 'bg-white border-border text-text'
             }`}>
               <input type="radio" checked={urgency === 'asap'} onChange={() => setUrgency('asap')} className="text-primary"/> 
               <span>As soon as possible</span>
             </label>
             <label className={`p-2.5 border rounded-xl flex items-center gap-2 text-xs cursor-pointer ${
               urgency === 'later' ? 'bg-primary/5 border-primary text-primary font-bold' : 'bg-white border-border text-text'
             }`}>
               <input type="radio" checked={urgency === 'later'} onChange={() => setUrgency('later')} className="text-primary"/> 
               <span>Later today</span>
             </label>
          </div>
        </section>

        {/* 7. Room Access */}
        {locType === 'room' && (
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">7. Room Access Preference</h3>
            <div className="space-y-1.5">
               {[
                 { id: 'knock', label: 'Please knock before entering' },
                 { id: 'away', label: 'You may enter if I am away' },
                 { id: 'contact', label: 'Contact me on phone before visiting' }
               ].map(item => (
                 <label key={item.id} className={`flex items-center gap-2.5 p-2.5 border rounded-xl text-xs cursor-pointer bg-white ${
                   access === item.id ? 'border-primary bg-primary/5 text-primary font-semibold' : 'border-border text-text'
                 }`}>
                   <input type="radio" checked={access === item.id} onChange={() => setAccess(item.id)} className="text-primary"/> 
                   <span>{item.label}</span>
                 </label>
               ))}
            </div>
          </section>
        )}

        {/* Emergency Assistance */}
        <div className="p-4 bg-red-50/50 rounded-2xl border border-red-200/80 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-900">
            <ShieldAlert size={15} className="text-red-600" />
            <span>Immediate Emergency?</span>
          </div>
          <p className="text-[11px] text-red-700/90 leading-relaxed">
            For critical safety, medical, fire, or severe flooding issues requiring emergency response.
          </p>
          <button 
            type="button"
            onClick={() => setEmergencyOpen(true)} 
            className="w-full py-2.5 border border-red-500 text-red-600 font-bold text-xs rounded-xl bg-white hover:bg-red-50 transition-colors"
          >
            Request Emergency Assistance
          </button>
        </div>

        {/* Primary Submit Button — Clearly Visible and Positioned within Flow */}
        <div className="pt-2">
          <button 
            type="submit"
            onClick={handleSubmit} 
            disabled={!desc.trim() || (locType === 'common' && !commonArea) || loading} 
            className="w-full bg-primary text-accent font-bold py-3.5 rounded-2xl shadow-md hover:bg-primary-hover active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 text-xs transition-all"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin"></div>
            ) : (
              'Submit Report'
            )}
          </button>
        </div>
      </form>

      {/* Emergency Modal */}
      {emergencyOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl space-y-4">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert size={28} />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-gray-900">Emergency Assistance</h2>
              <p className="text-xs text-gray-600 mt-1">This will immediately notify hotel duty managers and security team.</p>
            </div>
            
            <div className="space-y-2 text-left">
              {['Medical Emergency', 'Security Concern', 'Fire / Smoke Hazard', 'Major Water Flood'].map(e => (
                <button 
                  key={e} 
                  type="button"
                  onClick={() => { setEmergencyOpen(false); setDesc(`EMERGENCY ALERT: ${e}`); setUrgency('asap'); }} 
                  className="w-full py-2.5 px-3.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors text-left"
                >
                  {e}
                </button>
              ))}
            </div>

            <button 
              type="button"
              onClick={() => setEmergencyOpen(false)} 
              className="text-xs font-semibold text-gray-500 hover:text-gray-800 pt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
