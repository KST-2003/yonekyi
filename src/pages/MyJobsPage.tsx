import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Users, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    const res = await api.get('/jobs/my/posted');
    setJobs(res.data);
    setLoading(false);
  };

  useEffect(() => { loadJobs(); }, []);

  const toggleActive = async (id: string, current: number) => {
    await api.put(`/jobs/${id}`, { is_active: current ? 0 : 1 });
    toast.success(current ? 'Job deactivated' : 'Job activated');
    loadJobs();
  };

  const deleteJob = async (id: string) => {
    if (!confirm('Delete this job?')) return;
    await api.delete(`/jobs/${id}`);
    toast.success('Job deleted');
    loadJobs();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-gray-900">My Posted Jobs</h1>
        <Link to="/jobs/post" className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5"><Plus size={15} />Post Job</Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="mb-4">No jobs posted yet</p>
          <Link to="/jobs/post" className="btn-primary">Post Your First Job</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => (
            <div key={job.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge text-xs ${job.is_active ? 'badge-green' : 'badge-gray'}`}>{job.is_active ? 'Active' : 'Inactive'}</span>
                    <span className="badge-gray text-xs">{job.category}</span>
                  </div>
                  <h3 className="font-display font-bold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{job.location} • {job.job_type}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Eye size={12} />{job.views} views</span>
                    <span className="flex items-center gap-1"><Users size={12} />{job.application_count} applicants</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleActive(job.id, job.is_active)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
                    {job.is_active ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} className="text-gray-400" />}
                  </button>
                  <button onClick={() => deleteJob(job.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50">
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
              <Link to={`/jobs/${job.id}`} className="mt-3 inline-flex items-center gap-1 text-sm text-[#1d3a8a] font-medium hover:underline">
                <Users size={14} />View Applications ({job.application_count})
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
