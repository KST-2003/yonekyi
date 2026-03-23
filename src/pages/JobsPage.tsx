import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, DollarSign, Briefcase, Plus, BookmarkPlus, Clock } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'IT & Software', 'Marketing', 'Design', 'Finance', 'Engineering', 'Healthcare', 'Education', 'Sales', 'HR'];
const JOB_TYPES = ['All', 'Full-Time', 'Part-Time', 'Contract', 'Freelance', 'Remote'];

function JobCard({ job }: { job: any }) {
  const { t } = useLanguage();
  return (
    <Link to={`/jobs/${job.id}`} className="card-hover block">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            {job.is_promoted ? <span className="badge-blue text-xs">✦ Promoted</span> : null}
            <span className="badge-gray text-xs">{job.category}</span>
            <span className="badge-green text-xs">{job.job_type}</span>
          </div>
          <h3 className="font-display font-bold text-gray-900 text-base leading-snug">{job.title}</h3>
          <p className="text-blue-600 text-sm font-semibold mt-0.5">{job.company}</p>
          <p className="text-gray-400 text-sm mt-1.5 line-clamp-2 leading-relaxed">{job.description}</p>
          <div className="flex flex-wrap gap-2 mt-2.5">
            <span className="tag flex items-center gap-1 text-xs"><MapPin size={10} />{job.location}</span>
            {job.salary_min && <span className="tag flex items-center gap-1 text-xs"><DollarSign size={10} />{job.salary_min.toLocaleString()}–{job.salary_max?.toLocaleString()} {job.currency}</span>}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <button onClick={e => { e.preventDefault(); toast.success('Saved!'); }} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-blue-50 transition-colors">
            <BookmarkPlus size={16} className="text-gray-400" />
          </button>
          <span className="flex items-center gap-1 text-xs text-gray-300"><Clock size={10} />{new Date(job.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function JobsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [jobType, setJobType] = useState('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 10 };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (jobType !== 'All') params.job_type = jobType;
      const res = await api.get('/jobs', { params });
      setJobs(res.data.jobs);
      setTotal(res.data.total);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, [page, category, jobType]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-gray-900">{t('jobs')}</h1>
        {user?.role === 'recruiter'
          ? <Link to="/jobs/post" className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5"><Plus size={14} />{t('postJob')}</Link>
          : <Link to="/jobs/applications" className="btn-outline text-sm py-2 px-4">{t('myApplications')}</Link>}
      </div>

      {/* Search */}
      <form onSubmit={e => { e.preventDefault(); fetchJobs(); }} className="relative">
        <input className="input pl-10 pr-20 bg-white shadow-sm" placeholder={t('searchJobs')} value={search} onChange={e => setSearch(e.target.value)} />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary text-xs py-1.5 px-3">{t('search')}</button>
      </form>

      {/* Category tabs — scrollable, NO slider */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${category === cat ? 'bg-[#1d3a8a] text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Job type tabs — scrollable, NO slider */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        {JOB_TYPES.map(type => (
          <button key={type} onClick={() => { setJobType(type); setPage(1); }}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${jobType === type ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-white border border-gray-200 text-gray-500'}`}>
            {type}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-400">{total} {t('jobsFound')}</p>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="card h-32 shimmer" />)}</div>
      ) : (
        <div className="space-y-3 stagger">
          {jobs.length === 0
            ? <div className="text-center py-16 text-gray-400"><Briefcase size={40} className="mx-auto mb-3 opacity-20" /><p>No jobs found</p></div>
            : jobs.map(job => <JobCard key={job.id} job={job} />)}
        </div>
      )}

      {total > 10 && (
        <div className="flex justify-center gap-2 pt-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline text-sm py-2 px-4 disabled:opacity-30">Prev</button>
          <span className="flex items-center px-3 text-sm text-gray-500 font-medium">Page {page} of {Math.ceil(total / 10)}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 10)} className="btn-outline text-sm py-2 px-4 disabled:opacity-30">Next</button>
        </div>
      )}
    </div>
  );
}
