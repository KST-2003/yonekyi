import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, ShoppingBag, MapPin } from 'lucide-react';
import api from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';

const CATEGORIES = ['Electronics', 'Clothing', 'Furniture', 'Vehicles', 'Books', 'Sports', 'Food', 'Services', 'Other'];

const CONDITION_BADGE: Record<string, string> = {
  new: 'badge-green', like_new: 'badge-blue', good: 'badge-orange', fair: 'badge-gray'
};
const CONDITION_LABEL: Record<string, string> = {
  new: 'Brand New', like_new: 'Like New', good: 'Good', fair: 'Fair'
};

function ListingCard({ listing }: { listing: any }) {
  return (
    <Link to={`/marketplace/${listing.id}`} className="card p-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 block">
      <div className="relative mb-2.5">
        <div className="w-full h-32 bg-gray-100 rounded-2xl overflow-hidden">
          {listing.images?.[0]
            ? <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-gray-300"><ShoppingBag size={28} /></div>
          }
        </div>
        {listing.is_promoted && <span className="absolute top-2 left-2 badge-blue text-xs">✦ Promoted</span>}
        <span className={`absolute top-2 right-2 text-xs badge ${CONDITION_BADGE[listing.condition] || 'badge-gray'}`}>
          {CONDITION_LABEL[listing.condition] || listing.condition}
        </span>
      </div>
      <p className="font-semibold text-sm text-gray-900 line-clamp-2 leading-tight">{listing.title}</p>
      <p className="text-orange-500 font-bold mt-1">{listing.price.toLocaleString()} <span className="text-xs font-normal text-gray-400">{listing.currency}</span></p>
      <div className="flex items-center gap-1 text-xs text-gray-400 mt-1"><MapPin size={9} />{listing.location}</div>
    </Link>
  );
}

export default function MarketplacePage() {
  const { t } = useLanguage();
  const [allListings, setAllListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [total, setTotal] = useState(0);

  const fetchListings = async (searchTerm = '') => {
    setLoading(true);
    try {
      const params: any = { limit: 100 };
      if (searchTerm) params.search = searchTerm;
      const res = await api.get('/marketplace', { params });
      setAllListings(res.data.listings);
      setTotal(res.data.total);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchListings(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings(search);
    setActiveCategory('All');
  };

  // Filter by active category
  const filtered = activeCategory === 'All'
    ? allListings
    : allListings.filter(l => l.category === activeCategory);

  // Group by category for "All" view
  const grouped: Record<string, any[]> = {};
  if (activeCategory === 'All') {
    for (const listing of filtered) {
      if (!grouped[listing.category]) grouped[listing.category] = [];
      grouped[listing.category].push(listing);
    }
  }

  const categoriesWithItems = CATEGORIES.filter(cat => grouped[cat]?.length > 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-gray-900">{t('marketplace_title')}</h1>
        <div className="flex gap-2">
          <Link to="/marketplace/my" className="btn-outline text-sm py-2 px-3">{t('myListings')}</Link>
          <Link to="/marketplace/create" className="btn-primary text-sm py-2 px-3 flex items-center gap-1"><Plus size={14} />{t('sellItem')}</Link>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative">
        <input className="input pl-10 pr-20 bg-white shadow-sm" placeholder={t('searchItems')} value={search}
          onChange={e => { setSearch(e.target.value); if (!e.target.value) { fetchListings(); setActiveCategory('All'); } }} />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary text-xs py-1.5 px-3">{t('search')}</button>
      </form>

      {/* Category filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {['All', ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${activeCategory === cat ? 'bg-[#1d3a8a] text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'}`}>
            {cat}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-400">{filtered.length} {t('itemsAvailable')}</p>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="card h-52 shimmer rounded-3xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <ShoppingBag size={40} className="mx-auto mb-3 opacity-20" />
          <p className="font-medium">No listings found</p>
        </div>
      ) : activeCategory === 'All' ? (
        /* Grouped by category */
        <div className="space-y-6">
          {categoriesWithItems.map(cat => (
            <div key={cat}>
              {/* Category header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base font-display font-bold text-gray-900">{cat}</span>
                  <span className="badge-gray text-xs">{grouped[cat].length}</span>
                </div>
                <button onClick={() => setActiveCategory(cat)} className="text-xs text-[#1d3a8a] font-semibold hover:underline">
                  See all →
                </button>
              </div>
              {/* Horizontal scroll for this category */}
              <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4">
                {grouped[cat].map(listing => (
                  <Link key={listing.id} to={`/marketplace/${listing.id}`}
                    className="card p-3 hover:shadow-lg transition-all duration-200 flex-shrink-0 w-44">
                    <div className="relative mb-2">
                      <div className="w-full h-28 bg-gray-100 rounded-2xl overflow-hidden">
                        {listing.images?.[0]
                          ? <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-gray-300"><ShoppingBag size={24} /></div>
                        }
                      </div>
                      {listing.is_promoted && <span className="absolute top-1.5 left-1.5 badge-blue text-xs">✦</span>}
                      <span className={`absolute top-1.5 right-1.5 text-xs badge ${CONDITION_BADGE[listing.condition] || 'badge-gray'}`}>
                        {CONDITION_LABEL[listing.condition]}
                      </span>
                    </div>
                    <p className="font-semibold text-xs text-gray-900 line-clamp-2 leading-tight">{listing.title}</p>
                    <p className="text-orange-500 font-bold text-sm mt-1">{listing.price.toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5"><MapPin size={9} />{listing.location}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Single category grid */
        <div className="grid grid-cols-2 gap-3 stagger">
          {filtered.map(l => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  );
}
