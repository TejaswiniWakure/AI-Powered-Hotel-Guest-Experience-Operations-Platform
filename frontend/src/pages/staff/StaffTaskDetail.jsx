import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Clock, Image as ImageIcon, MessageSquare, AlertTriangle, User } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function StaffTaskDetail() {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/staff/tasks" className="text-primary font-medium flex items-center mb-6">
        &larr; Back to Tasks
      </Link>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-primary">AC Malfunction</h1>
            <Badge variant="accent">In Progress</Badge>
          </div>
          <p className="text-text-muted text-lg">{id || 'TSK-102'} • Room 312</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-critical font-bold text-xl mb-1">
            <Clock size={20} /> 15:00
          </div>
          <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">SLA Remaining</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2"><MessageSquare size={16} /> Guest Message</h3>
            <p className="text-primary bg-secondary-bg p-4 rounded-lg italic border-l-4 border-l-border">
              "The AC is making a loud noise and not cooling the room at all. It's getting quite warm."
            </p>
            
            <div className="mt-6 border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Task Summary
              </h3>
              <ul className="space-y-2 text-sm text-primary font-medium">
                <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5" /> AC unit emitting loud noise</li>
                <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5" /> Room is not cooling</li>
                <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5" /> Possible compressor or fan motor issue</li>
              </ul>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2"><ImageIcon size={16} /> Guest Photo</h3>
            <div className="aspect-video bg-secondary-bg rounded-lg border border-border flex items-center justify-center text-text-muted">
              Image_AC_Unit.jpg
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Task Details</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-text-muted mb-1">Priority</p>
                <Badge variant="danger">High</Badge>
              </div>
              <div>
                <p className="text-text-muted mb-1">Department</p>
                <p className="font-medium">Maintenance</p>
              </div>
              <div>
                <p className="text-text-muted mb-1">Assigned To</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">R</div>
                  <span className="font-medium">Rahul (You)</span>
                </div>
              </div>
              <div>
                <p className="text-text-muted mb-1">Created</p>
                <p className="font-medium">Today, 6:35 PM</p>
              </div>
            </div>
          </Card>
          
          <div className="flex flex-col gap-3">
            <Button className="w-full bg-success hover:bg-success/90">Complete Task</Button>
            <Button variant="outline" className="w-full">Reassign</Button>
            <Button variant="ghost" className="w-full text-critical hover:text-critical hover:bg-critical/10 flex items-center justify-center gap-2"><AlertTriangle size={16} /> Escalate</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
