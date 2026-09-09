import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { BookOpen, Upload, Eye, Trash2, FileText } from 'lucide-react';

export default function AdminKnowledge() {
  const documents = [];

  const docTypes = [
    'Hotel FAQ', 'Hotel Policies', 'Restaurant Menu',
    'Emergency SOP', 'Maintenance SOP', 'Facilities Guide',
  ];

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg"><BookOpen className="text-primary" size={24} /></div>
          <div>
            <h1 className="text-3xl font-bold text-primary">Knowledge Center</h1>
            <p className="text-text-muted mt-1">Upload documents that power the StayFlow Concierge and Staff Assistant.</p>
          </div>
        </div>
        <Button className="flex items-center gap-2">
          <Upload size={16} /> Upload Document
        </Button>
      </div>

      {/* Upload Area */}
      <Card className="p-8 mb-8 border-2 border-dashed text-center cursor-pointer hover:border-primary transition-colors bg-secondary-bg/30">
        <Upload size={32} className="mx-auto text-text-muted opacity-40 mb-3" />
        <h3 className="font-bold text-primary mb-1">Drag & drop files here</h3>
        <p className="text-sm text-text-muted">PDF, DOCX, TXT — up to 10MB</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {docTypes.map((type) => (
            <span key={type} className="px-3 py-1 bg-white border border-border rounded-full text-xs text-text-muted">{type}</span>
          ))}
        </div>
      </Card>

      {documents.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed bg-secondary-bg/30">
          <FileText size={48} className="text-text-muted opacity-30 mb-4" />
          <h3 className="text-xl font-bold text-primary mb-2">No Documents Uploaded</h3>
          <p className="text-text-muted max-w-md">
            Upload hotel documents like FAQs, SOPs, menus, and policies. These are used by the Concierge to answer guest questions and by the Staff Assistant to provide procedure guidance.
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc, i) => (
            <Card key={i} className="p-5 group hover:border-primary transition-colors">
              <div className="flex gap-3 items-start">
                <div className="p-2 bg-secondary-bg rounded-lg shrink-0">
                  <FileText size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-primary truncate">{doc.name}</h3>
                  <p className="text-xs text-text-muted mt-1">{doc.size} · {doc.date}</p>
                  <Badge variant={doc.status === 'Processed' ? 'success' : 'secondary'} className="mt-2">{doc.status}</Badge>
                </div>
              </div>
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs"><Eye size={12} /> View</Button>
                <Button variant="ghost" size="sm" className="text-critical hover:bg-critical/10 flex items-center gap-1 text-xs"><Trash2 size={12} /> Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
