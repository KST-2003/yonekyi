import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Trash2, ShoppingBag } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function MyListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await api.get('/marketplace/my/listings');
    setListings(res.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const deleteListing = async (id: string) => {
    if (!confirm('Delete this listing?')) return;
    await api.delete(`/marketplace/${id}`);
    toast.success('Listing deleted');
    load();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-gray-900">My Listings</h1>
        <Link to="/marketplace/create" className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5"><Plus size={15} />Sell Item</Link>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
          <p className="mb-4">No listings yet</p>
          <Link to="/marketplace/create" className="btn-primary">Create First Listing</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map(l => (
            <div key={l.id} className="card flex items-center gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                {l.images?.[0] ? <img src={l.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><ShoppingBag size={20} /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/marketplace/${l.id}`} className="font-semibold text-gray-900 hover:text-[#1d3a8a] line-clamp-1">{l.title}</Link>
                <p className="text-orange-500 font-bold text-sm">{l.price.toLocaleString()} {l.currency}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                  <span className="flex items-center gap-1"><Eye size={10} />{l.views} views</span>
                  <span className={`badge text-xs ${l.is_active ? 'badge-green' : 'badge-gray'}`}>{l.is_active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              <button onClick={() => deleteListing(l.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 flex-shrink-0">
                <Trash2 size={16} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
