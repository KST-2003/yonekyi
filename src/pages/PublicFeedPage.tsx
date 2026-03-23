import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Briefcase, Heart, MessageCircle, Share2, ShoppingBag, Flame, Megaphone, Search, X } from 'lucide-react';
import api from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';

export default function PublicFeedPage() {
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [searching, setSearching] = useState(false);

  // Scroll-hide search bar
  const [showSearch, setShowSearch] = useState(true);
  const lastScrollY = useRef(0);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 10) {
        setShowSearch(true);
      } else if (currentY > lastScrollY.current + 5) {
        setShowSearch(false); // scrolling down
      } else if (currentY < lastScrollY.current - 5) {
        setShowSearch(true); // scrolling up
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    Promise.all([api.get('/jobs?limit=6'), api.get('/marketplace?limit=4')])
      .then(([j, m]) => { setJobs(j.data.jobs); setListings(m.data.listings); })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) { setSearchResults(null); return; }
    setSearching(true);
    try {
      const [jobsRes, listingsRes] = await Promise.all([
        api.get(`/jobs?search=${encodeURIComponent(search)}&limit=5`),
        api.get(`/marketplace?search=${encodeURIComponent(search)}&limit=5`),
      ]);
      setSearchResults([
        ...jobsRes.data.jobs.map((j: any) => ({ ...j, _type: 'job' })),
        ...listingsRes.data.listings.map((l: any) => ({ ...l, _type: 'listing' })),
      ]);
    } catch {} finally { setSearching(false); }
  };

  const clearSearch = () => { setSearch(''); setSearchResults(null); };

  if (loading) return (
    <div className="space-y-4">
      {[1,2,3].map(i => <div key={i} className="card h-48 shimmer" />)}
    </div>
  );

  return (
    <div className="space-y-4 stagger">
      {/* Sticky scroll-hide search bar */}
      <div
        ref={searchRef}
        className="sticky top-0 z-30 -mx-4 px-4 pb-3 pt-1 transition-all duration-300"
        style={{
          transform: showSearch ? 'translateY(0)' : 'translateY(-110%)',
          opacity: showSearch ? 1 : 0,
          background: 'linear-gradient(to bottom, #f0f4ff 70%, transparent)',
          pointerEvents: showSearch ? 'auto' : 'none',
        }}
      >
        <form onSubmit={handleSearch} className="relative">
          <input
            className="input pl-10 pr-20 bg-white shadow-sm"
            placeholder="Search jobs, listings, people..."
            value={search}
            onChange={e => { setSearch(e.target.value); if (!e.target.value) setSearchResults(null); }}
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          {search ? (
            <button type="button" onClick={clearSearch} className="absolute right-14 top-1/2 -translate-y-1/2">
              <X size={14} className="text-gray-400" />
            </button>
          ) : null}
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary text-xs py-1.5 px-3">
            {searching ? '...' : t('search')}
          </button>
        </form>
      </div>

      {/* Search results */}
      {searchResults !== null && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-600">{searchResults.length} results for "{search}"</p>
            <button onClick={clearSearch} className="text-xs text-[#1d3a8a] font-semibold">Clear</button>
          </div>
          {searchResults.length === 0 ? (
            <div className="text-center py-8 text-gray-400"><p>No results found</p></div>
          ) : searchResults.map(item => (
            item._type === 'job' ? (
              <Link key={item.id} to={`/jobs/${item.id}`} className="card-hover block">
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge-blue text-xs">Job</span>
                  <span className="badge-gray text-xs">{item.category}</span>
                </div>
                <p className="font-bold text-gray-900">{item.title}</p>
                <p className="text-blue-600 text-sm">{item.company}</p>
                <p className="text-gray-400 text-sm mt-1 flex items-center gap-1"><MapPin size={11} />{item.location}</p>
              </Link>
            ) : (
              <Link key={item.id} to={`/marketplace/${item.id}`} className="card-hover flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0">
                  {item.images?.[0] ? <img src={item.images[0]} alt="" className="w-full h-full object-cover" /> : <ShoppingBag size={20} className="m-auto mt-4 text-gray-300" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5"><span className="badge-orange text-xs">Item</span></div>
                  <p className="font-bold text-gray-900">{item.title}</p>
                  <p className="text-orange-500 font-bold text-sm">{item.price?.toLocaleString()} {item.currency}</p>
                </div>
              </Link>
            )
          ))}
        </div>
      )}

      {/* Feed */}
      {searchResults === null && (
        <>
          {jobs.map(job => (
            <div key={job.id} className="card">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                  {job.recruiter_name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-gray-900">{job.recruiter_name}</span>
                    {job.is_promoted ? <span className="badge-blue text-xs">Promoted</span> : null}
                    <span className="badge-orange text-xs flex items-center gap-0.5"><Flame size={9} />Hot</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(job.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <Link to={`/jobs/${job.id}`}>
                <h3 className="font-display font-bold text-gray-900 text-lg leading-snug hover:text-[#1d3a8a] transition-colors">{job.title}</h3>
                <p className="text-blue-600 font-semibold text-sm mt-0.5">{job.company}</p>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2 leading-relaxed">{job.description}</p>
              </Link>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="tag flex items-center gap-1 text-xs"><MapPin size={10} />{job.location}</span>
                {job.salary_min && <span className="tag flex items-center gap-1 text-xs"><DollarSign size={10} />{job.salary_min.toLocaleString()}–{job.salary_max?.toLocaleString()} {job.currency}</span>}
                <span className="tag flex items-center gap-1 text-xs"><Briefcase size={10} />{job.job_type}</span>
              </div>
              <div className="flex gap-3 mt-4">
                <Link to={`/jobs/${job.id}`} className="btn-primary text-sm py-2 px-5">{t('applyNow')}</Link>
                <button className="btn-outline text-sm py-2 px-4">{t('contact')}</button>
              </div>
              <div className="border-t border-gray-100 mt-4 pt-3 flex items-center justify-between">
                <span className="text-xs text-gray-400">24 likes</span>
                <div className="flex gap-4">
                  {[{ icon: Heart, label: t('like') }, { icon: MessageCircle, label: t('comment') }, { icon: Share2, label: t('share') }].map(({ icon: Icon, label }) => (
                    <button key={label} onClick={() => toast.success(`${label}d!`)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#1d3a8a] transition-colors font-medium">
                      <Icon size={13} />{label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <div className="flex items-center gap-1.5 text-xs text-blue-400 mb-2 font-medium"><Megaphone size={11} />{t('sponsored')}</div>
            <h3 className="font-bold text-gray-800">Learn Digital Marketing – Free Workshop</h3>
            <p className="text-sm text-gray-500 mt-1">Join our free online workshop on digital marketing fundamentals. Limited seats!</p>
          </div>

          {listings.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-bold text-gray-900 flex items-center gap-2"><ShoppingBag size={17} />{t('marketplace_title')}</h2>
                <Link to="/marketplace" className="text-sm text-[#1d3a8a] font-bold hover:underline">See all →</Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {listings.slice(0, 4).map(l => (
                  <Link key={l.id} to={`/marketplace/${l.id}`} className="card p-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                    <div className="w-full h-24 bg-gray-100 rounded-2xl mb-2 overflow-hidden">
                      {l.images?.[0] ? <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><ShoppingBag size={22} /></div>}
                    </div>
                    <p className="font-semibold text-sm text-gray-900 line-clamp-1">{l.title}</p>
                    <p className="text-orange-500 font-bold text-sm mt-0.5">{l.price.toLocaleString()} <span className="text-xs font-normal">{l.currency}</span></p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
