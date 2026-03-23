import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Briefcase, User } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'job_seeker' as 'job_seeker' | 'recruiter', phone: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success(t('registerSuccess'));
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0f1e4a 0%, #1d3a8a 50%, #2563eb 100%)' }}>
      <div className="absolute top-20 right-10 w-40 h-40 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #60a5fa, transparent)' }} />
      <div className="absolute bottom-20 left-10 w-60 h-60 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />

      <div className="w-full max-w-sm relative">
        <div className="text-center mb-6 fade-up">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-2xl">
            <span className="text-2xl font-display font-bold text-[#1d3a8a]">Y</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-white">Yone Kyi</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-7" style={{ animation: 'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards' }}>
          <h2 className="text-xl font-display font-bold text-gray-900 mb-5">{t('signUp')}</h2>

          <div className="flex gap-3 mb-5">
            {[{ v: 'job_seeker', l: t('jobSeeker'), icon: User }, { v: 'recruiter', l: t('recruiter'), icon: Briefcase }].map(({ v, l, icon: Icon }) => (
              <button key={v} type="button" onClick={() => setForm({ ...form, role: v as any })}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3.5 rounded-2xl border-2 text-sm font-semibold transition-all ${form.role === v ? 'border-[#1d3a8a] bg-blue-50 text-[#1d3a8a]' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                <Icon size={18} />{l}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('name')}</label>
              <input className="input" placeholder="Aung Kyaw" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('email')}</label>
              <input type="email" className="input" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('phone')} <span className="normal-case font-normal">(optional)</span></label>
              <input className="input" placeholder="09-123456789" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('password')}</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className="input pr-11" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading ? t('creating') : t('signUp')}
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-5">
            {t('alreadyAccount')}{' '}
            <Link to="/login" className="text-[#1d3a8a] font-bold hover:underline">{t('signIn')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
