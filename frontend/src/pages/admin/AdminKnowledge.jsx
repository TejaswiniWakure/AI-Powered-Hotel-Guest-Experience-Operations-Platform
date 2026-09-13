import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, CheckCircle2, Sparkles, FileText, Upload } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/shared/Modal';
import { api } from '../../services/api';

export default function AdminKnowledge() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload Modal
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('faq');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchDocs = () => {
    setLoading(true);
    api.get('/admin/knowledge')
      .then(data => {
        if (Array.isArray(data)) setDocs(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    setUploading(true);
    try {
      await api.post('/admin/knowledge/upload', {
        title,
        category,
        description,
        content
      });
      setShowModal(false);
      setTitle('');
      setDescription('');
      setContent('');
      fetchDocs();
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this document from knowledge base?')) return;
    try {
      await api.delete(`/admin/knowledge/${id}`);
      fetchDocs();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles size={14} /> RAG Vector Indexing
          </div>
          <h1 className="text-3xl font-bold text-primary font-serif">Knowledge Center & Vector Index</h1>
          <p className="text-text-muted text-sm mt-0.5">
            Upload hotel manuals, emergency guidelines, and SOPs. Content is chunked and indexed into the tenant vector knowledge base.
          </p>
        </div>

        <Button
          onClick={() => setShowModal(true)}
          className="bg-primary text-accent hover:bg-primary-hover font-bold text-xs gap-1.5"
        >
          <Upload size={16} /> Upload Document
        </Button>
      </div>

      <Card className="overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary-bg/30 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="p-4">Document Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Vector Chunks</th>
                <th className="p-4">Status</th>
                <th className="p-4">Uploaded By</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-text-muted">Retrieving indexed documents...</td></tr>
              ) : docs.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-text-muted">No documents uploaded.</td></tr>
              ) : (
                docs.map(doc => (
                  <tr key={doc._id} className="hover:bg-secondary-bg/20 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-primary text-sm block">{doc.title}</span>
                      <span className="text-[11px] text-text-muted line-clamp-1">{doc.description}</span>
                    </td>
                    <td className="p-4 uppercase font-bold text-[10px] text-accent">
                      <span className="px-2 py-0.5 rounded bg-primary text-white">{doc.category}</span>
                    </td>
                    <td className="p-4 font-semibold text-primary">{doc.chunkCount} chunks</td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold text-success bg-success/15 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                        <CheckCircle2 size={12} /> INDEXED
                      </span>
                    </td>
                    <td className="p-4 text-text-muted">{doc.uploadedBy}</td>
                    <td className="p-4 text-text-muted">{new Date(doc.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(doc._id)}
                        className="p-1.5 text-text-muted hover:text-critical transition-colors rounded"
                        title="Delete Document"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Upload Hotel Document"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
              Document Title *
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. In-Room Dining Menu & Bar Hours"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-border bg-white text-primary focus:outline-none focus:border-primary"
              >
                <option value="faq">FAQ / Guest Amenities</option>
                <option value="sop">SOP / Engineering & Maintenance</option>
                <option value="policy">Policy / Check-in & Rules</option>
                <option value="menu">Dining Menu</option>
                <option value="emergency">Emergency Procedures</option>
                <option value="facility">Facilities Directory</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                Brief Scope / Description
              </label>
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Overview of document content"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
              Document Text Content *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste markdown or plain text here. StayFlow will automatically chunk and generate vector embeddings..."
              rows={8}
              required
              className="w-full text-xs p-3 rounded-xl border border-border bg-white font-mono focus:outline-none focus:border-primary"
            />
          </div>

          <Button
            type="submit"
            disabled={uploading}
            className="w-full bg-primary text-accent hover:bg-primary-hover font-bold text-xs uppercase tracking-wider py-2.5"
          >
            {uploading ? 'Chunking & Generating Embeddings...' : 'Process & Index into Knowledge Base'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
