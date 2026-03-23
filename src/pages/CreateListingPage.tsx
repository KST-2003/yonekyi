import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Clothing', 'Furniture', 'Vehicles', 'Books', 'Sports', 'Food', 'Services', 'Other'];
const CONDITIONS = [{ value: 'new', label: 'Brand New' }, { value: 'like_new', label: 'Like New' }, { value: 'good', label: 'Good' }, { value: 'fair', label: 'Fair' }];

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', price: '', currency: 'MMK', category: 'Electronics', condition: 'new', location: '', phone: '', images: [] as string[] });
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState('');

  const addImage = () => {
    if (imgUrl.trim() && form.images.length < 5) {
      setForm({ ...form, images: [...form.images, imgUrl.trim()] });
      setImgUrl('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.price || isNaN(Number(form.price))) { toast.error('Enter a valid price'); return; }
    setLoading(true);
    try {
      const res = await api.post('/marketplace', { ...form, price: parseInt(form.price) });
      toast.success('Listing created!');
      navigate(`/marketplace/${res.data.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"><ArrowLeft size={16} />Back</button>
      <h1 className="text-xl font-display font-bold text-gray-900">Create Listing</h1>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
          <input className="input" placeholder="e.g. Laptop HP Pavilion 15" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
            <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Condition *</label>
            <select className="input" value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}>
              {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price *</label>
            <input type="number" className="input" placeholder="850,000" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
            <select className="input" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
              <option>MMK</option><option>USD</option><option>THB</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Location *</label>
          <input className="input" placeholder="e.g. Yangon, Myanmar" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
          <input className="input" placeholder="09-666777888" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
          <textarea className="input h-24 resize-none" placeholder="Describe your item in detail..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URLs (up to 5)</label>
          <div className="flex gap-2 mb-2">
            <input className="input flex-1" placeholder="https://example.com/image.jpg" value={imgUrl} onChange={e => setImgUrl(e.target.value)} />
            <button type="button" onClick={addImage} className="btn-outline text-sm py-2 px-3 flex-shrink-0"><Plus size={14} /></button>
          </div>
          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.images.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, j) => j !== i) })} className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white">
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creating...' : 'Create Listing'}</button>
      </form>
    </div>
  );
}
