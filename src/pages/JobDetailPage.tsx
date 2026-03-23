import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Briefcase, Clock, Eye, ArrowLeft, Phone, Mail, Users } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applications, setApplications] = useState<any[]>([]);
  const [showApps, setShowApps] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`).then(res => setJob(res.data)).catch(() => navigate('/jobs')).finally(() => setLoading(false));
  }, [id]);

  const loadApplications = async () => {
    const res = await api.get(`/jobs/${id}/applications`);
    setApplications(res.data);
    setShowApps(true);
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.post(`/jobs/${id}/apply`, { cover_letter: coverLetter });
      toast.success('Application submitted!');
      setShowApplyModal(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const updateStatus = async (appId: string, status: string) => {
    await api.put(`/jobs/applications/${appId}/status`, { status });
    toast.success(`Status updated to ${status}`);
    loadApplications();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;
  if (!job) return null;

  return (
    <div className="space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={16} />Back
      </button>

      <div className="card">
        <div className="flex flex-wrap gap-2 mb-3">
          {job.is_promoted && <span className="badge-blue">Promoted</span>}
          <span className="badge-gray">{job.category}</span>
          <span className="badge-green">{job.job_type}</span>
        </div>

        <h1 className="text-2xl font-display font-bold text-gray-900">{job.title}</h1>
        <p className="text-blue-600 font-semibold text-lg mt-1">{job.company}</p>

        <div className="flex flex-wrap gap-3 mt-3">
          <span className="flex items-center gap-1.5 text-sm text-gray-600"><MapPin size={14} />{job.location}</span>
          {job.salary_min && <span className="flex items-center gap-1.5 text-sm text-gray-600"><DollarSign size={14} />{job.salary_min.toLocaleString()} – {job.salary_max?.toLocaleString()} {job.currency}</span>}
          <span className="flex items-center gap-1.5 text-sm text-gray-600"><Eye size={14} />{job.views} views</span>
          <span className="flex items-center gap-1.5 text-sm text-gray-600"><Clock size={14} />{new Date(job.created_at).toLocaleDateString()}</span>
        </div>

        <div className="border-t border-gray-100 mt-4 pt-4">
          <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
          <p className="text-gray-600 text-sm whitespace-pre-wrap">{job.description}</p>
        </div>

        {job.requirements && (
          <div className="border-t border-gray-100 mt-4 pt-4">
            <h2 className="font-semibold text-gray-900 mb-2">Requirements</h2>
            <p className="text-gray-600 text-sm whitespace-pre-wrap">{job.requirements}</p>
          </div>
        )}

        <div className="border-t border-gray-100 mt-4 pt-4">
          <h2 className="font-semibold text-gray-900 mb-2">About the Recruiter</h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
              {job.recruiter_name?.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-sm">{job.recruiter_name}</p>
              {job.recruiter_email && <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={11} />{job.recruiter_email}</p>}
              {job.recruiter_phone && <p className="text-xs text-gray-500 flex items-center gap-1"><Phone size={11} />{job.recruiter_phone}</p>}
            </div>
          </div>
        </div>

        {user?.role === 'job_seeker' && (
          <div className="flex gap-3 mt-5">
            <button onClick={() => setShowApplyModal(true)} className="btn-primary flex-1">Apply Now</button>
            {job.recruiter_phone && (
              <a href={`tel:${job.recruiter_phone}`} className="btn-outline flex items-center gap-2"><Phone size={15} />Contact</a>
            )}
          </div>
        )}

        {user?.id === job.recruiter_id && (
          <button onClick={loadApplications} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
            <Users size={16} />View Applications
          </button>
        )}
      </div>

      {/* Applications list (recruiter) */}
      {showApps && (
        <div className="card">
          <h2 className="font-display font-bold text-gray-900 mb-4">Applications ({applications.length})</h2>
          {applications.length === 0 ? (
            <p className="text-gray-400 text-center py-6">No applications yet</p>
          ) : (
            <div className="space-y-4">
              {applications.map(app => (
                <div key={app.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                      {app.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{app.name}</p>
                      <p className="text-xs text-gray-500">{app.email}</p>
                      {app.phone && <p className="text-xs text-gray-500">{app.phone}</p>}
                      {app.education && <p className="text-xs text-gray-600 mt-1">{app.education}</p>}
                      {app.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {app.skills.map((s: string) => <span key={s} className="tag text-xs">{s}</span>)}
                        </div>
                      )}
                      {app.cover_letter && <p className="text-sm text-gray-600 mt-2 italic">"{app.cover_letter}"</p>}
                    </div>
                    <span className={`badge text-xs flex-shrink-0 ${app.status === 'accepted' ? 'badge-green' : app.status === 'rejected' ? 'bg-red-100 text-red-700' : app.status === 'shortlisted' ? 'badge-orange' : 'badge-gray'}`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {['reviewed', 'shortlisted', 'accepted', 'rejected'].map(s => (
                      <button key={s} onClick={() => updateStatus(app.id, s)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${app.status === s ? 'bg-[#1d3a8a] text-white border-[#1d3a8a]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Apply modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="font-display font-bold text-lg mb-1">Apply for {job.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{job.company}</p>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Letter (optional)</label>
            <textarea className="input h-28 resize-none" placeholder="Tell them why you're a great fit..." value={coverLetter} onChange={e => setCoverLetter(e.target.value)} />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowApplyModal(false)} className="btn-outline flex-1">Cancel</button>
              <button onClick={handleApply} disabled={applying} className="btn-primary flex-1">{applying ? 'Submitting...' : 'Submit'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
