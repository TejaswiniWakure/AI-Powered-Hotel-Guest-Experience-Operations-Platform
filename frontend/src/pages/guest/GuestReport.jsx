import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function GuestReport() {
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="p-6 max-w-md mx-auto text-center mt-12">
        <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">Request Received</h2>
        <p className="text-text-muted mb-8">We've dispatched maintenance to your room.</p>
        
        <Card className="text-left p-4 mb-8 bg-secondary-bg border-none">
          <div className="grid grid-cols-2 gap-y-4">
            <div><p className="text-sm text-text-muted">Request ID</p><p className="font-medium">REQ-042</p></div>
            <div><p className="text-sm text-text-muted">Room</p><p className="font-medium">312</p></div>
            <div><p className="text-sm text-text-muted">Detected Issue</p><p className="font-medium text-critical">AC Malfunction</p></div>
            <div><p className="text-sm text-text-muted">Priority</p><p className="font-medium text-critical">High</p></div>
            <div className="col-span-2"><p className="text-sm text-text-muted">Expected Response</p><p className="font-medium">Within 15 minutes</p></div>
          </div>
        </Card>
        
        <Link to="/guest">
          <Button className="w-full">Return Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto mb-16">
      <h1 className="text-2xl font-bold text-primary mb-2">Report a Problem</h1>
      <p className="text-text-muted mb-6">Let us know what's wrong, and we'll fix it right away.</p>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-main mb-2">Describe the problem</label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]"
          placeholder="E.g., The AC is making a loud noise and not cooling..."
        ></textarea>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-text-main mb-2">Add Photos</label>
        <div className="grid grid-cols-2 gap-4">
          <button className="flex flex-col items-center justify-center gap-2 h-32 border-2 border-dashed border-border rounded-lg text-text-muted hover:border-primary hover:text-primary transition-colors bg-secondary-bg/50">
            <Camera size={24} />
            <span className="text-sm font-medium">Take Photo</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 h-32 border-2 border-dashed border-border rounded-lg text-text-muted hover:border-primary hover:text-primary transition-colors bg-secondary-bg/50">
            <ImageIcon size={24} />
            <span className="text-sm font-medium">Upload Image</span>
          </button>
        </div>
      </div>
      
      {/* Mock AI Detection block */}
      {description.length > 10 && (
        <Card className="p-4 mb-6 bg-secondary-bg border-none">
          <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            StayFlow AI Analysis
          </h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-text-muted">Detected Category</p>
              <p className="font-medium">HVAC / Air Conditioning</p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Priority</p>
              <span className="inline-flex items-center rounded-full bg-critical/10 px-2 py-0.5 text-xs font-medium text-critical">High</span>
            </div>
          </div>
        </Card>
      )}

      <Button className="w-full" onClick={() => setSubmitted(true)}>Submit Report</Button>
    </div>
  );
}
