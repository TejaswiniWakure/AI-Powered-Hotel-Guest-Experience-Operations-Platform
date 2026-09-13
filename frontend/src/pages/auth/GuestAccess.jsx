import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, BedDouble, ArrowRight, QrCode, Shield, AlertCircle, User as UserIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function GuestAccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setGuestRoom, setGuestSession } = useAuth();

  const hotelParam = searchParams.get('hotel') || '';
  const [hotelCode, setHotelCode] = useState('');
  const [hotelInfo, setHotelInfo] = useState(null);
  const [roomNumber, setRoomNumber] = useState('');
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  // Initialize from URL query param
  useEffect(() => {
    if (hotelParam) {
      setHotelCode(hotelParam);
      verifyHotel(hotelParam);
    }
  }, [hotelParam]);

  const verifyHotel = async (code) => {
    if (!code.trim()) {
      setError('Please enter a hotel code.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.get('/guest/access', { hotel: code.trim().toUpperCase() });
      if (res && res.name) {
        setHotelInfo(res);
        setStep(2);
      } else {
        throw new Error('Hotel not found');
      }
    } catch (err) {
      console.error('verifyHotel error:', err);
      setError(err.message || 'Invalid hotel code. Please try again.');
      setHotelInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyHotelSubmit = (e) => {
    e.preventDefault();
    verifyHotel(hotelCode);
  };

  const handleVerifyRoomSubmit = async (e) => {
    e.preventDefault();
    if (!roomNumber.trim()) {
      setError('Please enter your room number.');
      return;
    }

    const codeToUse = (hotelInfo?.hotelCode || hotelCode).trim();
    if (!codeToUse) {
      setError('Please provide a valid hotel code.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await api.post('/guest/verify-room', {
        hotelCode: codeToUse.toUpperCase(),
        roomNumber: roomNumber.trim()
      });

      if (res.hasSession && res.token) {
        // Active session already found for this room -> log in immediately!
        const { token, hotel, room, guest } = res;
        setGuestSession(
          token,
          'guest',
          hotel._id,
          hotel.name,
          hotel.hotelCode,
          guest?._id,
          room.roomNumber,
          guest?.name
        );
        navigate('/guest');
      } else if (res.verified) {
        // First-time entry for this room -> ask for name once
        setStep(3);
      } else {
        throw new Error('Verification failed');
      }
    } catch (err) {
      setError(err.message || 'Room number not found. Please check your room number or contact the front desk.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestNameSubmit = async (e) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const codeToUse = (hotelInfo?.hotelCode || hotelCode).trim();

    setError('');
    setLoading(true);

    try {
      const res = await api.post('/guest/verify-room', {
        hotelCode: codeToUse.toUpperCase(),
        roomNumber: roomNumber.trim(),
        guestName: guestName.trim()
      });

      const { token, hotel, room, guest } = res;
      
      setGuestSession(
        token, 
        'guest', 
        hotel._id, 
        hotel.name, 
        hotel.hotelCode, 
        guest?._id, 
        room.roomNumber, 
        guest?.name
      );

      navigate('/guest');
    } catch (err) {
      setError(err.message || 'Unable to create session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-6">
      <div className="max-w-md mx-auto w-full">
        {/* Hotel Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-accent shadow-md mb-4">
            <Building2 size={30} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight font-serif">
            {step === 1 ? 'Welcome to StayFlow' : hotelInfo?.name}
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {step === 1
              ? "Access your hotel's guest services."
              : step === 2
                ? `Welcome to ${hotelInfo?.name}. Enter your room number to continue.`
                : `Room ${roomNumber} verified. Please tell us your name.`}
          </p>
        </div>

        {/* Guest Access Card */}
        <Card className="p-8 shadow-sm border-border bg-white">
          {error && (
            <div className="mb-5 p-3.5 bg-critical/10 border border-critical/20 rounded-xl text-critical text-xs font-medium flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleVerifyHotelSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wider">
                  Hotel Code
                </label>
                <Input
                  type="text"
                  value={hotelCode}
                  onChange={(e) => setHotelCode(e.target.value.toUpperCase())}
                  placeholder="e.g. STAY001"
                  className="uppercase font-semibold tracking-wider text-center text-lg py-3"
                  autoFocus
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !hotelCode}
                className="w-full bg-primary text-accent hover:bg-primary-hover font-semibold py-3 flex items-center justify-center gap-2"
              >
                {loading ? 'Identifying...' : 'Continue'}
                {!loading && <ArrowRight size={18} />}
              </Button>

              <div className="pt-3">
                <p className="text-[11px] text-text-muted text-center leading-relaxed">
                  Your hotel code can be found on your hotel welcome card, room information, or provided by the front desk.
                </p>
              </div>

              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                <div className="relative bg-white px-4 text-xs font-semibold text-text-muted/60 uppercase tracking-widest">OR</div>
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold text-primary mb-2 flex items-center justify-center gap-2">
                  <QrCode size={16} /> Scan Hotel QR
                </p>
                <p className="text-xs text-text-muted">
                  Point your camera at the StayFlow QR code in your room or at the front desk to automatically enter your hotel code.
                </p>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyRoomSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wider">
                  Room Number
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="e.g. 312"
                    className="text-lg font-bold tracking-wide text-center py-3"
                    autoFocus
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted/60 pointer-events-none">
                    <BedDouble size={20} />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !roomNumber}
                className="w-full bg-primary text-accent hover:bg-primary-hover font-semibold py-3 flex items-center justify-center gap-2"
              >
                {loading ? 'Verifying...' : 'Continue'}
                {!loading && <ArrowRight size={18} />}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-text-muted hover:text-primary transition-colors underline decoration-border underline-offset-4"
                >
                  Change Hotel
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleGuestNameSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter your name"
                    className="text-lg font-bold tracking-wide text-center py-3"
                    autoFocus
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted/60 pointer-events-none">
                    <UserIcon size={20} />
                  </div>
                </div>
                <p className="text-[11px] text-text-muted text-center mt-2">
                  Your name will be used to personalize your StayFlow experience.
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading || !guestName}
                className="w-full bg-primary text-accent hover:bg-primary-hover font-semibold py-3 flex items-center justify-center gap-2"
              >
                {loading ? 'Entering...' : 'Continue to Guest Portal'}
                {!loading && <ArrowRight size={18} />}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-text-muted hover:text-primary transition-colors underline decoration-border underline-offset-4"
                >
                  Change Room Number
                </button>
              </div>
            </form>
          )}
        </Card>

        {/* Security / QR Notice */}
        <div className="text-center mt-6">
          <p className="text-[11px] text-text-muted/80 flex items-center justify-center gap-1.5">
            <Shield size={12} className="text-accent" />
            <span>StayFlow Verified In-Room Guest Session</span>
          </p>
        </div>
      </div>
    </div>
  );
}
