import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Clock, CheckCircle, XCircle, Clock3 } from 'lucide-react';
import api from '../lib/api';

const statusColor: Record<string, string> = {
  pending: 'badge-gray',
  reviewed: 'badge-blue',
  shortlisted: 'badge-orange',
  accepted: 'badge-green',
  rejected: 'bg-red-100 text-red-700',
};

export default function MyApplicationsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs/my/applications').then(res => setApps(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-display font-bold text-gray-900">My Applications</h1>
      {apps.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="mb-4">No applications yet</p>
          <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map(app => (
            <div key={app.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{app.title}</h3>
                  <p className="text-blue-600 text-sm">{app.company}</p>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={10} />{app.location}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-500"><Briefcase size={10} />{app.job_type}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={10} />{new Date(app.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={`badge text-xs flex-shrink-0 ${statusColor[app.status] || 'badge-gray'}`}>{app.status}</span>
              </div>
              {app.cover_letter && <p className="text-xs text-gray-500 mt-2 italic line-clamp-2">"{app.cover_letter}"</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
