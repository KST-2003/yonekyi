import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['IT & Software', 'Marketing', 'Design', 'Finance', 'Engineering', 'Healthcare', 'Education', 'Sales', 'HR', 'Other'];
const JOB_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Freelance', 'Remote'];

export default function PostJobPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', requirements: '', location: '', salary_min: '', salary_max: '', currency: 'MMK', job_type: 'Full-Time', category: 'IT & Software' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/jobs', { ...form, salary_min: form.salary_min ? parseInt(form.salary_min) : null, salary_max: form.salary_max ? parseInt(form.salary_max) : null });
      toast.success('Job posted successfully!');
      navigate('/jobs/my');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"><ArrowLeft size={16} />Back</button>
      <h1 className="text-xl font-display font-bold text-gray-900">Post a Job</h1>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title *</label>
          <input className="input" placeholder="e.g. Senior React Developer" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
            <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Type *</label>
            <select className="input" value={form.job_type} onChange={e => setForm({ ...form, job_type: e.target.value })}>
              {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Location *</label>
          <input className="input" placeholder="e.g. Yangon, Myanmar" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Salary</label>
            <input type="number" className="input" placeholder="1,500,000" value={form.salary_min} onChange={e => setForm({ ...form, salary_min: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Salary</label>
            <input type="number" className="input" placeholder="2,500,000" value={form.salary_max} onChange={e => setForm({ ...form, salary_max: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
            <select className="input" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
              <option>MMK</option><option>USD</option><option>THB</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Description *</label>
          <textarea className="input h-32 resize-none" placeholder="Describe the role, responsibilities..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Requirements</label>
          <textarea className="input h-24 resize-none" placeholder="Required skills, experience, qualifications..." value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Posting...' : 'Post Job'}</button>
      </form>
    </div>
  );
}
