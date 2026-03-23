import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, GraduationCap, Briefcase, Star, Edit3, Plus, X, LogOut, Globe, Check, Zap, Heart, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage, Language } from '../contexts/LanguageContext';
import PhotoUpload from '../components/PhotoUpload';
import api from '../lib/api';
import toast from 'react-hot-toast';

const LANGUAGES: { code: Language; label: string; flag: string; native: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧', native: 'English' },
  { code: 'my', label: 'Burmese', flag: '🇲🇲', native: 'မြန်မာဘာသာ' },
  { code: 'th', label: 'Thai', flag: '🇹🇭', native: 'ภาษาไทย' },
];

const INTEREST_OPTIONS = [
  { label: 'Technology', emoji: '💻' }, { label: 'Travel', emoji: '✈️' },
  { label: 'Coffee', emoji: '☕' }, { label: 'Fitness', emoji: '🏋️' },
  { label: 'Music', emoji: '🎵' }, { label: 'Cooking', emoji: '🍳' },
  { label: 'Reading', emoji: '📚' }, { label: 'Gaming', emoji: '🎮' },
  { label: 'Photography', emoji: '📸' }, { label: 'Hiking', emoji: '🏔️' },
  { label: 'Art', emoji: '🎨' }, { label: 'Cinema', emoji: '🎬' },
  { label: 'Yoga', emoji: '🧘' }, { label: 'Cycling', emoji: '🚴' },
  { label: 'Foodie', emoji: '🍜' }, { label: 'Dogs', emoji: '🐶' },
  { label: 'Cats', emoji: '🐱' }, { label: 'Fashion', emoji: '👗' },
  { label: 'Sports', emoji: '⚽' }, { label: 'Data', emoji: '📊' },
];

type ProfileTab = 'yonekyi' | 'matching';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTab>('yonekyi');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [skillInput, setSkillInput] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);

  // Matching profile state
  const [matchProfile, setMatchProfile] = useState<any>(null);
  const [matchForm, setMatchForm] = useState<any>({
    age: '', gender: 'male', bio: '', interests: [] as string[],
    preferred_area: 'Yangon', preferred_age_min: '18', preferred_age_max: '40',
    preferred_work_field: 'Any', preferred_education: 'Any',
    looking_for: 'relationship', photos: [] as string[],
  });
  const [editingMatch, setEditingMatch] = useState(false);
  const [savingMatch, setSavingMatch] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '', phone: user.phone || '', address: user.address || '',
        birthday: user.birthday || '', education: user.education || '',
        experience: user.experience || '', skills: [...(user.skills || [])],
        bio: user.bio || '', company_name: user.company_name || '',
        company_description: user.company_description || '',
      });
    }
    api.get(`/reviews/user/${user?.id}`).then(res => { setReviews(res.data.reviews); setAvgRating(res.data.average); }).catch(() => {});
    api.get('/matchmaking/profile').then(res => {
      if (res.data) {
        setMatchProfile(res.data);
        setMatchForm({
          age: res.data.age || '',
          gender: res.data.gender || 'male',
          bio: res.data.bio || '',
          interests: res.data.interests || [],
          preferred_area: res.data.preferred_area || 'Yangon',
          preferred_age_min: res.data.preferred_age_min || '18',
          preferred_age_max: res.data.preferred_age_max || '40',
          preferred_work_field: res.data.preferred_work_field || 'Any',
          preferred_education: res.data.preferred_education || 'Any',
          looking_for: res.data.looking_for || 'relationship',
          photos: res.data.photos || [],
        });
      }
    }).catch(() => {});
  }, [user]);

  const save = async () => {
    setSaving(true);
    try { await updateUser(form); toast.success(t('updateSuccess')); setEditing(false); }
    catch { toast.error('Update failed'); } finally { setSaving(false); }
  };

  const saveMatch = async () => {
    setSavingMatch(true);
    try {
      await api.post('/matchmaking/profile', {
        ...matchForm,
        age: parseInt(matchForm.age) || null,
        preferred_age_min: parseInt(matchForm.preferred_age_min),
        preferred_age_max: parseInt(matchForm.preferred_age_max),
      });
      toast.success('Matching profile saved!');
      setEditingMatch(false);
      const res = await api.get('/matchmaking/profile');
      setMatchProfile(res.data);
    } catch { toast.error('Failed to save'); } finally { setSavingMatch(false); }
  };

  const toggleInterest = (label: string) => {
    setMatchForm((f: any) => ({
      ...f,
      interests: f.interests.includes(label)
        ? f.interests.filter((i: string) => i !== label)
        : f.interests.length < 8 ? [...f.interests, label] : f.interests
    }));
  };

  const completion = () => {
    const fields = ['name', 'phone', 'address', 'birthday', 'education', 'experience', 'bio'];
    const filled = fields.filter(f => user?.[f as keyof typeof user]).length;
    const hasSkills = (user?.skills?.length || 0) > 0 ? 1 : 0;
    return Math.round(((filled + hasSkills) / (fields.length + 1)) * 100);
  };

  if (!user) return null;
  const pct = completion();

  return (
    <div className="space-y-4 pb-4">
      {/* Profile type tabs */}
      <div className="flex gap-2 bg-blue-50 p-1 rounded-2xl">
        <button onClick={() => setActiveTab('yonekyi')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${activeTab === 'yonekyi' ? 'bg-white text-[#1d3a8a] shadow-sm' : 'text-gray-500'}`}>
          <Briefcase size={14} /> Yone Kyi
        </button>
        <button onClick={() => setActiveTab('matching')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${activeTab === 'matching' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500'}`}>
          <Heart size={14} /> Matching
        </button>
      </div>

      {/* ── YONE KYI PROFILE ───────────────────────────────────────────────── */}
      {activeTab === 'yonekyi' && (
        <div className="space-y-4 stagger">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-display font-bold text-gray-900">{t('myProfile')}</h1>
            <div className="flex gap-2">
              {editing ? (
                <><button onClick={() => setEditing(false)} className="btn-outline text-sm py-2 px-3">{t('cancel')}</button>
                  <button onClick={save} disabled={saving} className="btn-primary text-sm py-2 px-3">{saving ? t('saving') : t('save')}</button></>
              ) : (
                <button onClick={() => setEditing(true)} className="btn-outline text-sm py-2 px-3 flex items-center gap-1.5"><Edit3 size={14} />{t('edit')}</button>
              )}
            </div>
          </div>

          {/* Completion */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">{t('profileCompletion')}</span>
              <span className={`text-sm font-bold ${pct === 100 ? 'text-emerald-500' : 'text-[#1d3a8a]'}`}>{pct}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: pct === 100 ? '#10b981' : 'linear-gradient(90deg, #1d3a8a, #3b82f6)' }} />
            </div>
          </div>

          {/* Personal info */}
          <div className="card space-y-4">
            <h2 className="font-display font-bold text-gray-900">{t('personalInfo')}</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1d3a8a] to-[#3b82f6] flex items-center justify-center text-white text-2xl font-display font-bold flex-shrink-0 shadow-md">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                {editing ? <input className="input text-base font-semibold" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  : <p className="font-semibold text-lg text-gray-900">{user.name}</p>}
                <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-0.5"><Mail size={12} />{user.email}</p>
                <span className={`badge text-xs mt-1 ${user.role === 'recruiter' ? 'badge-blue' : 'badge-green'}`}>{user.role === 'recruiter' ? t('recruiter') : t('jobSeeker')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 flex items-center gap-1"><Phone size={10} />{t('phone')}</label>
                {editing ? <input className="input text-sm" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /> : <p className="text-sm text-gray-700 font-medium">{user.phone || '—'}</p>}
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">{t('birthday')}</label>
                {editing ? <input type="date" className="input text-sm" value={form.birthday} onChange={e => setForm({ ...form, birthday: e.target.value })} /> : <p className="text-sm text-gray-700 font-medium">{user.birthday || '—'}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5 flex items-center gap-1"><MapPin size={10} />{t('address')}</label>
              {editing ? <input className="input text-sm" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /> : <p className="text-sm text-gray-700 font-medium">{user.address || '—'}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 flex items-center gap-1"><GraduationCap size={10} />{t('education')}</label>
              {editing ? <input className="input text-sm" value={form.education} onChange={e => setForm({ ...form, education: e.target.value })} /> : <p className="text-sm text-gray-700 font-medium">{user.education || '—'}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 flex items-center gap-1"><Briefcase size={10} />{t('experience')}</label>
              {editing ? <textarea className="input text-sm h-16 resize-none" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} /> : <p className="text-sm text-gray-700 font-medium">{user.experience || '—'}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">{t('skills')}</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {(editing ? form.skills : user.skills)?.map((s: string) => (
                  <span key={s} className="tag text-xs flex items-center gap-1">{s}
                    {editing && <button onClick={() => setForm({ ...form, skills: form.skills.filter((sk: string) => sk !== s) })} className="ml-0.5 hover:text-red-400 transition-colors"><X size={10} /></button>}
                  </span>
                ))}
              </div>
              {editing && (
                <div className="flex gap-2">
                  <input className="input text-sm flex-1" placeholder={t('addSkill')} value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); const s = skillInput.trim(); if (s && !form.skills.includes(s)) { setForm({ ...form, skills: [...form.skills, s] }); setSkillInput(''); } } }} />
                  <button onClick={() => { const s = skillInput.trim(); if (s && !form.skills.includes(s)) { setForm({ ...form, skills: [...form.skills, s] }); setSkillInput(''); } }} className="btn-outline text-sm py-2 px-3"><Plus size={14} /></button>
                </div>
              )}
            </div>
            {user.role === 'recruiter' && (
              <>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">{t('company')}</label>
                  {editing ? <input className="input text-sm" value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} /> : <p className="text-sm text-gray-700 font-medium">{user.company_name || '—'}</p>}
                </div>
              </>
            )}
          </div>

          {/* Reviews */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-gray-900 flex items-center gap-2"><Star size={16} className="text-amber-400 fill-amber-400" />{t('reviews')}</h2>
              {avgRating > 0 && <div className="flex items-center gap-1.5"><div className="flex">{[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= avgRating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />)}</div><span className="text-sm font-bold">{avgRating}</span></div>}
            </div>
            {reviews.length === 0 ? <p className="text-sm text-gray-400 text-center py-4">{t('noReviews')}</p> : (
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r.id} className="border-t border-gray-100 pt-3 first:border-0 first:pt-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm">{r.reviewer_name}{r.context ? `, ${r.context}` : ''}</p>
                      <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} size={11} className={s <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />)}</div>
                    </div>
                    {r.comment && <p className="text-sm text-gray-500">{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Language */}
          <div className="card">
            <button onClick={() => setShowLangPicker(!showLangPicker)} className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Globe size={18} className="text-[#1d3a8a]" /></div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-gray-900">{t('language')}</p>
                  <p className="text-xs text-gray-400">{LANGUAGES.find(l => l.code === language)?.flag} {LANGUAGES.find(l => l.code === language)?.native}</p>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-gray-400 transition-transform duration-200 ${showLangPicker ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
            </button>
            {showLangPicker && (
              <div className="mt-4 space-y-2">
                {LANGUAGES.map(lang => (
                  <button key={lang.code} onClick={() => { setLanguage(lang.code); setShowLangPicker(false); toast.success(`Language: ${lang.label}`); }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all duration-200 ${language === lang.code ? 'border-[#1d3a8a] bg-blue-50' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                    <div className="flex items-center gap-3"><span className="text-2xl">{lang.flag}</span>
                      <div className="text-left"><p className={`font-semibold text-sm ${language === lang.code ? 'text-[#1d3a8a]' : 'text-gray-700'}`}>{lang.label}</p><p className="text-xs text-gray-400">{lang.native}</p></div>
                    </div>
                    {language === lang.code && <Check size={16} className="text-[#1d3a8a]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Logout */}
          <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center justify-center gap-2 text-red-400 font-semibold py-3.5 rounded-2xl border-2 border-red-100 hover:bg-red-50 active:scale-95 transition-all duration-200">
            <LogOut size={16} />{t('logout')}
          </button>
        </div>
      )}

      {/* ── MATCHING PROFILE ───────────────────────────────────────────────── */}
      {activeTab === 'matching' && (
        <div className="space-y-4 stagger">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
              <Heart size={18} className="text-pink-500 fill-pink-500" /> Matching Profile
            </h1>
            <div className="flex gap-2">
              {editingMatch ? (
                <><button onClick={() => setEditingMatch(false)} className="btn-outline text-sm py-2 px-3">{t('cancel')}</button>
                  <button onClick={saveMatch} disabled={savingMatch} className="btn-primary text-sm py-2 px-3" style={{ background: 'linear-gradient(135deg,#ec4899,#f97316)' }}>{savingMatch ? 'Saving...' : t('save')}</button></>
              ) : (
                <button onClick={() => setEditingMatch(true)} className="btn-outline text-sm py-2 px-3 flex items-center gap-1.5"><Edit3 size={14} />{t('edit')}</button>
              )}
            </div>
          </div>

          {/* Photos section */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Camera size={16} className="text-pink-500" />My Photos <span className="text-xs text-gray-400 font-normal">(min 3, max 6)</span></h3>
            {editingMatch ? (
              <PhotoUpload photos={matchForm.photos} onChange={photos => setMatchForm((f: any) => ({ ...f, photos }))} min={3} max={6} />
            ) : (
              matchForm.photos.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  <Camera size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No photos yet. Edit to add photos.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {matchForm.photos.map((src: string, i: number) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      {i === 0 && <div className="absolute bottom-1.5 left-1.5 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Main</div>}
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

          {/* Basic info */}
          <div className="card space-y-4">
            <h3 className="font-semibold text-gray-900">Basic Info</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Age</label>
                {editingMatch ? <input type="number" className="input text-sm" min="18" max="80" value={matchForm.age} onChange={e => setMatchForm((f: any) => ({ ...f, age: e.target.value }))} />
                  : <p className="text-sm font-medium text-gray-700">{matchForm.age || '—'}</p>}
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Gender</label>
                {editingMatch ? (
                  <select className="input text-sm" value={matchForm.gender} onChange={e => setMatchForm((f: any) => ({ ...f, gender: e.target.value }))}>
                    <option value="male">Man</option><option value="female">Woman</option><option value="other">Other</option>
                  </select>
                ) : <p className="text-sm font-medium text-gray-700 capitalize">{matchForm.gender || '—'}</p>}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Looking for</label>
              {editingMatch ? (
                <div className="flex gap-2 flex-wrap">
                  {['relationship', 'friendship', 'networking', 'casual'].map(opt => (
                    <button key={opt} onClick={() => setMatchForm((f: any) => ({ ...f, looking_for: opt }))}
                      className={`px-3.5 py-2 rounded-full text-xs font-semibold border-2 capitalize transition-all ${matchForm.looking_for === opt ? 'border-pink-400 bg-pink-50 text-pink-700' : 'border-gray-200 text-gray-500'}`}>
                      {opt === 'relationship' ? '💕 Relationship' : opt === 'friendship' ? '🤝 Friendship' : opt === 'networking' ? '💼 Networking' : '✨ Casual'}
                    </button>
                  ))}
                </div>
              ) : <p className="text-sm font-medium text-gray-700 capitalize">{matchForm.looking_for || '—'}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Bio</label>
              {editingMatch ? <textarea className="input text-sm h-20 resize-none" placeholder="Tell people about yourself..." value={matchForm.bio} onChange={e => setMatchForm((f: any) => ({ ...f, bio: e.target.value }))} maxLength={200} />
                : <p className="text-sm text-gray-700">{matchForm.bio || '—'}</p>}
              {editingMatch && <p className="text-xs text-gray-300 text-right mt-1">{matchForm.bio.length}/200</p>}
            </div>
          </div>

          {/* Interests */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">Interests <span className="text-xs text-gray-400 font-normal">({matchForm.interests.length}/8)</span></h3>
            {editingMatch ? (
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map(({ label, emoji }) => {
                  const on = matchForm.interests.includes(label);
                  return (
                    <button key={label} onClick={() => toggleInterest(label)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${on ? 'border-pink-400 bg-pink-50 text-pink-700' : 'border-gray-200 text-gray-600'}`}>
                      {emoji} {label} {on && <Check size={10} />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {matchForm.interests.length === 0 ? <p className="text-sm text-gray-400">No interests added</p> : matchForm.interests.map((i: string) => {
                  const found = INTEREST_OPTIONS.find(opt => opt.label === i);
                  return <span key={i} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-pink-50 text-pink-700 border border-pink-200">{found?.emoji} {i}</span>;
                })}
              </div>
            )}
          </div>

          {/* Preferences — Tinder-style */}
          <div className="card space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Zap size={15} className="text-orange-500" />Match Preferences</h3>

            <div>
              <label className="block text-xs text-gray-400 mb-2">Interested in</label>
              {editingMatch ? (
                <div className="flex gap-2">
                  {['men', 'women', 'everyone'].map(opt => (
                    <button key={opt} onClick={() => setMatchForm((f: any) => ({ ...f, interested_in: opt }))}
                      className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-semibold capitalize transition-all ${matchForm.interested_in === opt ? 'border-pink-400 bg-pink-50 text-pink-700' : 'border-gray-200 text-gray-500'}`}>
                      {opt === 'men' ? '👨 Men' : opt === 'women' ? '👩 Women' : '💫 Everyone'}
                    </button>
                  ))}
                </div>
              ) : <p className="text-sm font-medium text-gray-700 capitalize">{matchForm.interested_in || 'Everyone'}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Age Range: <span className="text-pink-600 font-bold">{matchForm.preferred_age_min}–{matchForm.preferred_age_max}</span></label>
              {editingMatch ? (
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-400 mb-1 block">Min</label><input type="number" className="input text-sm" min="18" max="80" value={matchForm.preferred_age_min} onChange={e => setMatchForm((f: any) => ({ ...f, preferred_age_min: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-400 mb-1 block">Max</label><input type="number" className="input text-sm" min="18" max="80" value={matchForm.preferred_age_max} onChange={e => setMatchForm((f: any) => ({ ...f, preferred_age_max: e.target.value }))} /></div>
                </div>
              ) : null}
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Location</label>
              {editingMatch ? (
                <select className="input text-sm" value={matchForm.preferred_area} onChange={e => setMatchForm((f: any) => ({ ...f, preferred_area: e.target.value }))}>
                  {['Yangon','Mandalay','Naypyidaw','Bago','Anywhere'].map(a => <option key={a}>{a}</option>)}
                </select>
              ) : <p className="text-sm font-medium text-gray-700">{matchForm.preferred_area}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Education</label>
              {editingMatch ? (
                <select className="input text-sm" value={matchForm.preferred_education} onChange={e => setMatchForm((f: any) => ({ ...f, preferred_education: e.target.value }))}>
                  {["Any","High School","Bachelor's Degree","Master's Degree","PhD"].map(e => <option key={e}>{e}</option>)}
                </select>
              ) : <p className="text-sm font-medium text-gray-700">{matchForm.preferred_education}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Work Field</label>
              {editingMatch ? (
                <select className="input text-sm" value={matchForm.preferred_work_field} onChange={e => setMatchForm((f: any) => ({ ...f, preferred_work_field: e.target.value }))}>
                  {['Any','IT & Software','Marketing','Finance','Healthcare','Engineering','Design','Education'].map(f => <option key={f}>{f}</option>)}
                </select>
              ) : <p className="text-sm font-medium text-gray-700">{matchForm.preferred_work_field}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">Lifestyle</label>
              {editingMatch ? (
                <div className="space-y-2">
                  {[
                    { key: 'smoking', label: 'Smoking', opts: ["Don't smoke","Sometimes","Socially","Regularly"] },
                    { key: 'drinking', label: 'Drinking', opts: ["Don't drink","Sometimes","Socially","Regularly"] },
                    { key: 'exercise', label: 'Exercise', opts: ['Never','Sometimes','Often','Daily'] },
                  ].map(({ key, label, opts }) => (
                    <div key={key}>
                      <p className="text-xs text-gray-500 mb-1.5">{label}</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {opts.map(opt => (
                          <button key={opt} onClick={() => setMatchForm((f: any) => ({ ...f, [key]: opt }))}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${matchForm[key] === opt ? 'border-pink-400 bg-pink-50 text-pink-700' : 'border-gray-200 text-gray-500'}`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {['smoking','drinking','exercise'].map(key => matchForm[key] && (
                    <span key={key} className="tag text-xs">{key}: {matchForm[key]}</span>
                  ))}
                  {!matchForm.smoking && !matchForm.drinking && !matchForm.exercise && <p className="text-sm text-gray-400">Not set</p>}
                </div>
              )}
            </div>
          </div>

          {!matchProfile && (
            <div className="card text-center py-6 border-dashed border-2 border-pink-200 bg-pink-50">
              <Heart size={32} className="mx-auto mb-2 text-pink-300" />
              <p className="text-sm font-semibold text-gray-700 mb-1">No matching profile yet</p>
              <p className="text-xs text-gray-400 mb-4">Set up your profile to start matching!</p>
              <button onClick={() => setEditingMatch(true)} className="btn-primary text-sm py-2 px-5" style={{ background: 'linear-gradient(135deg,#ec4899,#f97316)' }}>Create Matching Profile</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
