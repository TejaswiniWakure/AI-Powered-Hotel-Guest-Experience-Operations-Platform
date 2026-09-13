import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { api } from '../../services/api';

export default function AdminPermissions() {
  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/permissions')
      .then(data => {
        if (Array.isArray(data)) setMatrix(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary font-serif">Role-Based Access Control (RBAC)</h1>
        <p className="text-text-muted text-sm mt-1">
          Cryptographic enforcement matrix separating Guest, Staff, Manager, and Administrator privileges.
        </p>
      </div>

      <Card className="overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary-bg/30 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="p-4">Operational Feature</th>
                <th className="p-4 text-center">Guest</th>
                <th className="p-4 text-center">Staff</th>
                <th className="p-4 text-center">Manager</th>
                <th className="p-4 text-center">Administrator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-text-muted">Loading permissions matrix...</td></tr>
              ) : (
                matrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-secondary-bg/20">
                    <td className="p-4 font-bold text-primary text-sm">{row.feature}</td>
                    <td className="p-4 text-center">
                      {row.guest ? (
                        <Check size={18} className="text-success mx-auto" />
                      ) : (
                        <span className="text-text-muted/40 font-bold">—</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {row.staff ? (
                        <Check size={18} className="text-success mx-auto" />
                      ) : (
                        <span className="text-text-muted/40 font-bold">—</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {row.manager ? (
                        <Check size={18} className="text-success mx-auto" />
                      ) : (
                        <span className="text-text-muted/40 font-bold">—</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {row.admin ? (
                        <Check size={18} className="text-success mx-auto" />
                      ) : (
                        <span className="text-text-muted/40 font-bold">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
