import React, { useState, useEffect } from 'react';
import { Gift, TrendingUp, Send, CheckCircle2, DollarSign, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

export default function ManagerOffers() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOffers = () => {
    api.get('/manager/offers')
      .then(res => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleSend = async (offerId) => {
    try {
      await api.post(`/manager/offers/${offerId}/send`);
      fetchOffers();
    } catch (err) {
      alert('Failed to send offer: ' + err.message);
    }
  };

  const metrics = data?.metrics || {
    totalOffers: 3,
    accepted: 2,
    conversionRate: '74%',
    revenueGenerated: '₹18,500'
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1 text-accent font-bold text-xs uppercase tracking-wider">
          <Sparkles size={14} /> Revenue Intelligence
        </div>
        <h1 className="text-3xl font-bold text-primary font-serif">Guest Offers & Ancillary Recommendations</h1>
        <p className="text-text-muted text-sm mt-0.5">Behavior-driven recommendation engine for personalized upsells and late departure extensions.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Total Recommended</span>
            <Gift size={16} className="text-primary" />
          </div>
          <p className="text-3xl font-bold text-primary">{metrics.totalOffers}</p>
          <p className="text-xs text-text-muted mt-1">Generated offers</p>
        </Card>

        <Card className="p-5 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Accepted Upsells</span>
            <CheckCircle2 size={16} className="text-success" />
          </div>
          <p className="text-3xl font-bold text-success">{metrics.accepted}</p>
          <p className="text-xs text-text-muted mt-1">Confirmed guest upgrades</p>
        </Card>

        <Card className="p-5 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Acceptance Rate</span>
            <TrendingUp size={16} className="text-accent" />
          </div>
          <p className="text-3xl font-bold text-accent">{metrics.conversionRate}</p>
          <p className="text-xs text-text-muted mt-1">High conversion threshold</p>
        </Card>

        <Card className="p-5 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Revenue Realized</span>
            <DollarSign size={16} className="text-success" />
          </div>
          <p className="text-3xl font-bold text-primary">{metrics.revenueGenerated}</p>
          <p className="text-xs text-text-muted mt-1">Direct hotel ancillary income</p>
        </Card>
      </div>

      {/* Offers Cards */}
      {loading ? (
        <div className="p-12 text-center text-xs text-text-muted bg-white rounded-xl border border-border">
          Loading revenue recommendations...
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(data?.offers || []).map(offer => (
            <Card key={offer._id} className="p-5 bg-white hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary text-white">
                    {offer.type}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    offer.status === 'accepted' ? 'bg-success/15 text-success' :
                    offer.status === 'sent' ? 'bg-info/15 text-info' :
                    'bg-accent/20 text-primary'
                  }`}>
                    {offer.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-primary mb-1">{offer.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed mb-4">{offer.description}</p>
              </div>

              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <div>
                    <span className="text-text-muted block text-[10px] uppercase">Price</span>
                    <span className="text-base font-bold text-primary">₹{offer.price?.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-text-muted block text-[10px] uppercase">Acceptance Probability</span>
                    <span className="text-xs font-bold text-success">{offer.estimatedAcceptance}%</span>
                  </div>
                </div>

                {offer.status === 'recommended' && (
                  <Button
                    onClick={() => handleSend(offer._id)}
                    size="sm"
                    className="w-full bg-primary text-accent hover:bg-primary-hover font-bold text-xs gap-1.5 py-2"
                  >
                    <Send size={14} /> Send Recommendation to Guest
                  </Button>
                )}

                {offer.status === 'sent' && (
                  <span className="block text-center text-xs font-medium text-text-muted py-1.5 bg-secondary-bg rounded-lg">
                    Sent to guest · Awaiting response
                  </span>
                )}

                {offer.status === 'accepted' && (
                  <span className="block text-center text-xs font-bold text-success py-1.5 bg-success/10 rounded-lg">
                    ✓ Accepted by Guest
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
