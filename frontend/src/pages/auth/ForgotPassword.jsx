import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { api } from '../../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-6">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary mb-2">
            <Building2 className="text-accent" size={28} />
            StayFlow
          </Link>
          <h1 className="text-2xl font-bold text-primary">Reset Password</h1>
          <p className="text-text-muted text-sm mt-1">Enter your registered email to receive reset instructions.</p>
        </div>

        <Card className="p-8 shadow-sm border-border bg-white">
          {submitted ? (
            <div className="text-center py-4">
              <CheckCircle className="mx-auto text-success mb-3" size={40} />
              <h3 className="font-bold text-base text-primary mb-1">Check Your Inbox</h3>
              <p className="text-xs text-text-muted mb-6 leading-relaxed">
                If an account exists for {email}, a recovery link has been dispatched.
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wider">
                  Account Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@hotel.com"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-accent hover:bg-primary-hover font-semibold py-2.5"
              >
                {loading ? 'Sending link...' : 'Send Recovery Link'}
              </Button>

              <div className="text-center pt-2">
                <Link to="/login" className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-primary transition-colors">
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
