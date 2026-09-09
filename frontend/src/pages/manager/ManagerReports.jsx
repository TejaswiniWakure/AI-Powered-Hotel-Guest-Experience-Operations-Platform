import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FileText, Download, Eye } from 'lucide-react';

export default function ManagerReports() {
  const reports = [
    { name: 'Daily Operations', desc: 'Overview of all requests, tasks, and resolutions for today.' },
    { name: 'Weekly Performance', desc: 'Staff performance, SLA compliance, and guest satisfaction for the week.' },
    { name: 'Monthly Performance', desc: 'Full hotel performance summary for the month.' },
    { name: 'SLA Report', desc: 'Detailed SLA compliance breakdown by department and priority.' },
    { name: 'Guest Experience', desc: 'Guest satisfaction scores, feedback, and trends.' },
    { name: 'Staff Performance', desc: 'Individual and team-level performance metrics.' },
    { name: 'Safety Report', desc: 'Safety and compliance check history and status.' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Reports</h1>
        <p className="text-text-muted mt-1">Generate and export operational reports.</p>
      </div>

      {/* Operations Summary */}
      <Card className="p-6 mb-8 bg-secondary-bg/40 border-dashed">
        <h2 className="text-lg font-bold text-primary mb-2">Operations Summary</h2>
        <p className="text-text-muted">
          No data available yet. The operations summary will appear here once guests start using the platform and staff complete tasks.
        </p>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report, i) => (
          <Card key={i} className="p-5 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-secondary-bg rounded-lg shrink-0">
                <FileText size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-primary">{report.name}</h3>
                <p className="text-xs text-text-muted mt-1">{report.desc}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-auto">
              <Button variant="outline" size="sm" className="flex-1 flex items-center gap-1 justify-center text-xs" disabled>
                <Eye size={12} /> View
              </Button>
              <Button variant="outline" size="sm" className="flex-1 flex items-center gap-1 justify-center text-xs" disabled>
                <Download size={12} /> Export
              </Button>
            </div>
            <p className="text-[10px] text-text-muted -mt-2">No data available yet.</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
