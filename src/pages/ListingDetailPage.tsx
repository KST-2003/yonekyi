import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Tag, Phone, Mail, Heart, Share2, Eye } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    api.get(`/marketplace/${id}`).then(res => setListing(res.data)).catch(() => navigate('/marketplace')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;
  if (!listing) return null;

  const images = listing.images || [];

  return (
    <div className="space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"><ArrowLeft size={16} />Back</button>

      {/* Image carousel */}
      <div className="relative bg-gray-100 rounded-2xl overflow-hidden h-64">
        {images.length > 0 ? (
          <>
            <img src={images[imgIdx]} alt={listing.title} className="w-full h-full object-cover" />
            {images.length > 1 && (
              <>
                <button onClick={() => setImgIdx(i => Math.max(0, i - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white">‹</button>
                <button onClick={() => setImgIdx(i => Math.min(images.length - 1, i + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white">›</button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_: any, i: number) => <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imgIdx ? 'bg-white' : 'bg-white/50'}`} />)}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">📦</div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {listing.is_promoted ? <span className="badge-blue text-xs">Promoted</span> : null}
          <span className="badge-green text-xs capitalize">{listing.condition?.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-display font-bold text-gray-900">{listing.title}</h1>
            <p className="text-2xl font-bold text-orange-500 mt-1">{listing.price.toLocaleString()} <span className="text-base">{listing.currency}</span></p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => toast.success('Liked!')} className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-red-50"><Heart size={16} className="text-gray-400" /></button>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }} className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50"><Share2 size={16} className="text-gray-400" /></button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-3">
          <span className="flex items-center gap-1.5 text-sm text-gray-600"><MapPin size={14} />{listing.location}</span>
          <span className="flex items-center gap-1.5 text-sm text-gray-600"><Tag size={14} />{listing.category}</span>
          <span className="flex items-center gap-1.5 text-sm text-gray-600"><Eye size={14} />{listing.views} views</span>
        </div>

        <div className="border-t border-gray-100 mt-4 pt-4">
          <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
          <p className="text-gray-600 text-sm whitespace-pre-wrap">{listing.description}</p>
        </div>

        <div className="border-t border-gray-100 mt-4 pt-4">
          <h2 className="font-semibold text-gray-900 mb-3">Seller</h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-700">{listing.seller_name?.charAt(0)}</div>
            <div>
              <p className="font-semibold text-sm">{listing.seller_name}</p>
              {listing.seller_phone && <p className="text-xs text-gray-500">{listing.seller_phone}</p>}
            </div>
          </div>
        </div>

        {user?.id !== listing.seller_id && (
          <div className="flex gap-3 mt-5">
            {listing.seller_phone && (
              <a href={`tel:${listing.seller_phone}`} className="btn-primary flex-1 flex items-center justify-center gap-2"><Phone size={15} />Talk to Seller</a>
            )}
            <button className="btn-accent flex-1">Promote</button>
          </div>
        )}
      </div>
    </div>
  );
}
