import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success(t('loginSuccess'));
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.error || t('invalidCredentials'));
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" 
      style={{ background: 'linear-gradient(135deg, #0f1e4a 0%, #1d3a8a 50%, #2563eb 100%)' }}>
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-40 h-40 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #60a5fa, transparent)' }} />
      <div className="absolute bottom-20 left-10 w-60 h-60 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />
      
      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8 fade-up">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <span className="text-4xl font-display font-bold text-[#1d3a8a]">Y</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white">Yone Kyi</h1>
          <p className="text-blue-200 mt-1 text-sm">Jobs • Marketplace • Matchmaking</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-7" style={{ animation: 'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards' }}>
          <h2 className="text-xl font-display font-bold text-gray-900 mb-6">{t('signIn')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('email')}</label>
              <input type="email" className="input" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('password')}</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className="input pr-11" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 py-3.5 text-base">
              {loading ? t('signingIn') : t('signIn')}
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-5">
            {t('noAccount')}{' '}
            <Link to="/register" className="text-[#1d3a8a] font-bold hover:underline">{t('register')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
