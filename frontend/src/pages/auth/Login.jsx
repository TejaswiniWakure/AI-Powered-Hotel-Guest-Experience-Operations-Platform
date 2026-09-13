import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hotelCode, setHotelCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password || !hotelCode.trim()) {
      setError('Please enter your work email, password, and Hotel Code.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { userRole } = await login(email, password, hotelCode.trim());
      
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'manager') {
        navigate('/manager');
      } else if (userRole === 'staff') {
        navigate('/staff');
      } else {
        navigate('/'); // fallback
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-6">
      <div className="max-w-md mx-auto w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 text-2xl font-bold text-primary mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-accent shadow-md">
              <Building2 size={22} />
            </div>
            <span>StayFlow</span>
          </Link>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Sign In to Your Property</h1>
          <p className="text-text-muted text-sm mt-1">Enter your account credentials to access your hotel workspace.</p>
        </div>

        {/* Login Card */}
        <Card className="p-8 shadow-sm border-border bg-white">
          {error && (
            <div className="mb-5 p-3.5 bg-critical/10 border border-critical/20 rounded-xl text-critical text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wider">
                Hotel Code *
              </label>
              <Input
                type="text"
                value={hotelCode}
                onChange={(e) => setHotelCode(e.target.value.toUpperCase())}
                placeholder="e.g. SFGP / SIL814"
                className="uppercase font-semibold tracking-wider"
                required
              />
              <p className="text-[11px] text-text-muted mt-1">Mandatory hotel property code to identify your workspace.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wider">
                Work Email or Login ID *
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name.staff.com or name@hotel.com"
                  required
                />
              </div>
              <p className="text-[11px] text-text-muted mt-1">Accepts any staff/manager email or dot login ID (e.g. anyname.staff.com).</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                  Password *
                </label>
                <Link to="/forgot-password" className="text-xs text-accent hover:underline">
                  Forgot?
                </Link>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-primary text-accent hover:bg-primary-hover font-semibold py-2.5 flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Workspace'}
              {!loading && <ArrowRight size={16} />}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center space-y-4">
            <Link 
              to="/guest-access" 
              className="block p-3 bg-secondary-bg/50 rounded-xl border border-border hover:border-primary/30 transition-colors"
            >
              <p className="text-sm font-bold text-primary flex items-center justify-center gap-2">
                Staying with us? Use Guest Access <ArrowRight size={14} />
              </p>
            </Link>
            
            <p className="text-xs text-text-muted">
              Don't have a hotel workspace yet?{' '}
              <Link to="/signup" className="text-primary font-bold hover:underline">
                Create Hotel Workspace
              </Link>
            </p>
          </div>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-text-muted hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
