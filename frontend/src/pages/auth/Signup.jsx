import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Hotel Info
  const [hotelInfo, setHotelInfo] = useState({
    hotelName: '',
    hotelType: '',
    rooms: '',
    address: '',
    city: '',
    state: '',
    contactNumber: '',
    hotelEmail: ''
  });

  // Step 2: Manager Info
  const [managerInfo, setManagerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!hotelInfo.hotelName || !hotelInfo.hotelType || !hotelInfo.rooms || !hotelInfo.address || !hotelInfo.city || !hotelInfo.state || !hotelInfo.contactNumber) {
        setError('Please fill in all required hotel fields.');
        return;
      }
      setError('');
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!managerInfo.name || !managerInfo.email || !managerInfo.password) {
      setError('Please fill in all required manager fields.');
      return;
    }
    setError('');
    setLoading(true);
    setStep(3); // Loading screen

    try {
      await signup({ 
        ...hotelInfo, 
        ...managerInfo, 
        plan: 'professional' // default plan
      });
      // Signup success, redirect based on role (manager)
      navigate('/manager');
    } catch (err) {
      setError(err.message || 'Onboarding registration failed');
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-6">
      <div className="max-w-xl mx-auto w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary mb-2">
            <Building2 className="text-accent" size={28} />
            StayFlow
          </Link>
          <h1 className="text-2xl font-bold text-primary">Create Your Hotel Workspace</h1>
          <p className="text-text-muted text-sm mt-1">Set up your hotel and start managing guest experiences with StayFlow.</p>
        </div>

        <Card className="p-8 shadow-sm border-border bg-white">
          {error && (
            <div className="mb-5 p-3.5 bg-critical/10 border border-critical/20 rounded-xl text-critical text-xs font-medium">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-4">
              <div className="mb-6 flex items-center justify-between text-xs font-bold text-primary">
                <span>Step 1 of 2: Hotel Information</span>
                <span className="text-text-muted">Next: Manager Account</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">Hotel Name *</label>
                <Input type="text" value={hotelInfo.hotelName} onChange={(e) => setHotelInfo({...hotelInfo, hotelName: e.target.value})} placeholder="e.g. Royal Heritage Resort" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">Hotel Type *</label>
                  <select 
                    className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={hotelInfo.hotelType} 
                    onChange={(e) => setHotelInfo({...hotelInfo, hotelType: e.target.value})}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Boutique Hotel">Boutique Hotel</option>
                    <option value="Resort">Resort</option>
                    <option value="Business Hotel">Business Hotel</option>
                    <option value="Serviced Apartment">Serviced Apartment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">Number of Rooms *</label>
                  <Input type="number" value={hotelInfo.rooms} onChange={(e) => setHotelInfo({...hotelInfo, rooms: e.target.value})} placeholder="e.g. 50" required min="1" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">Address *</label>
                <Input type="text" value={hotelInfo.address} onChange={(e) => setHotelInfo({...hotelInfo, address: e.target.value})} placeholder="Street address" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">City *</label>
                  <Input type="text" value={hotelInfo.city} onChange={(e) => setHotelInfo({...hotelInfo, city: e.target.value})} placeholder="City" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">State *</label>
                  <Input type="text" value={hotelInfo.state} onChange={(e) => setHotelInfo({...hotelInfo, state: e.target.value})} placeholder="State" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">Contact Number *</label>
                  <Input type="tel" value={hotelInfo.contactNumber} onChange={(e) => setHotelInfo({...hotelInfo, contactNumber: e.target.value})} placeholder="Hotel phone" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">Hotel Email</label>
                  <Input type="email" value={hotelInfo.hotelEmail} onChange={(e) => setHotelInfo({...hotelInfo, hotelEmail: e.target.value})} placeholder="info@hotel.com" />
                </div>
              </div>

              <Button type="submit" className="w-full mt-6 bg-primary text-accent hover:bg-primary-hover font-semibold py-2.5">
                Continue to Manager Account <ArrowRight size={16} className="ml-2" />
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="mb-6 flex items-center justify-between text-xs font-bold text-primary">
                <button type="button" onClick={() => setStep(1)} className="flex items-center text-text-muted hover:text-primary">
                  <ArrowLeft size={14} className="mr-1" /> Back
                </button>
                <span>Step 2 of 2: Manager Account</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">Full Name *</label>
                <Input type="text" value={managerInfo.name} onChange={(e) => setManagerInfo({...managerInfo, name: e.target.value})} placeholder="e.g. Aditi Rao" required />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">Work Email *</label>
                <Input type="email" value={managerInfo.email} onChange={(e) => setManagerInfo({...managerInfo, email: e.target.value})} placeholder="manager@hotel.com" required />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">Phone</label>
                <Input type="tel" value={managerInfo.phone} onChange={(e) => setManagerInfo({...managerInfo, phone: e.target.value})} placeholder="+91 98200 00000" />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">Password *</label>
                <Input type="password" value={managerInfo.password} onChange={(e) => setManagerInfo({...managerInfo, password: e.target.value})} placeholder="Minimum 8 characters" required />
              </div>

              <Button type="submit" disabled={loading} className="w-full mt-6 bg-primary text-accent hover:bg-primary-hover font-semibold py-2.5">
                Create Workspace
              </Button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-12 flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <h3 className="text-lg font-bold text-primary mb-2">Creating your workspace...</h3>
              <p className="text-sm text-text-muted">Setting up hotel profile, departments, and manager account.</p>
            </div>
          )}

          {step !== 3 && (
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-xs text-text-muted">
                Already registered?{' '}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
