import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Heart, Star, RotateCcw, Zap, MapPin, Briefcase, GraduationCap, ChevronUp, MessageCircle, Check, Settings, ArrowLeft } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import PhotoUpload from '../components/PhotoUpload';
import toast from 'react-hot-toast';

const INTEREST_OPTIONS = [
  { label: 'Technology', emoji: '💻' }, { label: 'Travel', emoji: '✈️' },
  { label: 'Coffee', emoji: '☕' }, { label: 'Fitness', emoji: '🏋️' },
  { label: 'Music', emoji: '🎵' }, { label: 'Cooking', emoji: '🍳' },
  { label: 'Reading', emoji: '📚' }, { label: 'Gaming', emoji: '🎮' },
  { label: 'Photography', emoji: '📸' }, { label: 'Hiking', emoji: '🏔️' },
  { label: 'Art', emoji: '🎨' }, { label: 'Cinema', emoji: '🎬' },
  { label: 'Yoga', emoji: '🧘' }, { label: 'Cycling', emoji: '🚴' },
  { label: 'Foodie', emoji: '🍜' }, { label: 'Dogs', emoji: '🐶' },
  { label: 'Cats', emoji: '🐱' }, { label: 'Data', emoji: '📊' },
  { label: 'Sports', emoji: '⚽' }, { label: 'Fashion', emoji: '👗' },
];

// ─── Setup Flow ───────────────────────────────────────────────────────────────
function SetupFlow({ onComplete }: { onComplete: () => void }) {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    age: '', gender: 'male', bio: '', interests: [] as string[],
    preferred_area: 'Yangon', preferred_age_min: '18', preferred_age_max: '40',
    preferred_work_field: 'IT & Software', photos: [] as string[],
  });
  const [saving, setSaving] = useState(false);

  const toggleInterest = (label: string) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(label)
        ? f.interests.filter(i => i !== label)
        : f.interests.length < 6 ? [...f.interests, label] : f.interests
    }));
  };

  const save = async () => {
    if (!form.age) { toast.error('Please enter your age'); return; }
    setSaving(true);
    try {
      await api.post('/matchmaking/profile', {
        ...form, age: parseInt(form.age),
        preferred_age_min: parseInt(form.preferred_age_min),
        preferred_age_max: parseInt(form.preferred_age_max),
      });
      toast.success('Profile created! 🎉');
      onComplete();
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const steps = [
    // 0 – Welcome
    <div key="w" className="flex flex-col items-center justify-center min-h-screen text-center px-8 bg-gradient-to-br from-[#0f1e4a] via-[#1d3a8a] to-[#7c3aed]">
      <div className="w-28 h-28 rounded-[36px] bg-white/10 backdrop-blur flex items-center justify-center mb-8 shadow-2xl border border-white/20">
        <Zap size={56} className="text-pink-400" />
      </div>
      <h1 className="text-4xl font-display font-bold text-white mb-4">Find Your Match</h1>
      <p className="text-white/60 text-base leading-relaxed mb-12 max-w-xs">Connect with professionals who share your values, interests and ambitions.</p>
      <button onClick={() => setStep(1)} className="w-full max-w-xs py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold text-lg shadow-2xl shadow-pink-500/30 active:scale-95 transition-transform">
        Get Started ✨
      </button>
    </div>,

    // 1 – Basic
    <div key="b" className="min-h-screen bg-[#f0f4ff] px-5 pt-16 pb-8 space-y-5">
      <div><h2 className="text-2xl font-display font-bold text-gray-900">About You</h2><p className="text-gray-400 text-sm mt-0.5">Let's start with the basics</p></div>
      <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Age</label>
        <input type="number" className="input text-2xl font-bold h-14" placeholder="25" min="18" max="80" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} /></div>
      <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">I am</label>
        <div className="grid grid-cols-3 gap-2">
          {[{ v: 'male', l: 'Man', e: '👨' }, { v: 'female', l: 'Woman', e: '👩' }, { v: 'other', l: 'Other', e: '🌈' }].map(g => (
            <button key={g.v} onClick={() => setForm(f => ({ ...f, gender: g.v }))}
              className={`py-4 rounded-2xl border-2 transition-all active:scale-95 ${form.gender === g.v ? 'border-pink-400 bg-pink-50' : 'border-gray-200'}`}>
              <div className="text-2xl mb-1">{g.e}</div>
              <div className={`text-sm font-semibold ${form.gender === g.v ? 'text-pink-600' : 'text-gray-500'}`}>{g.l}</div>
            </button>
          ))}
        </div>
      </div>
      <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bio</label>
        <textarea className="input resize-none h-24" placeholder="I'm a developer who loves street food..." value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} maxLength={200} />
        <p className="text-xs text-gray-300 text-right mt-1">{form.bio.length}/200</p>
      </div>
      <button onClick={() => setStep(2)} disabled={!form.age} className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold shadow-lg shadow-pink-100 active:scale-95 transition-transform disabled:opacity-40">Continue →</button>
    </div>,

    // 2 – Interests
    <div key="i" className="min-h-screen bg-[#f0f4ff] px-5 pt-16 pb-8 space-y-5">
      <div><h2 className="text-2xl font-display font-bold text-gray-900">Your Interests</h2><p className="text-gray-400 text-sm mt-0.5">Pick up to 6 things you love</p></div>
      <div className="flex flex-wrap gap-2">
        {INTEREST_OPTIONS.map(({ label, emoji }) => {
          const on = form.interests.includes(label);
          return (
            <button key={label} onClick={() => toggleInterest(label)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold border-2 transition-all active:scale-95 ${on ? 'border-pink-400 bg-pink-50 text-pink-700' : 'border-gray-200 bg-white text-gray-600'}`}>
              {emoji} {label} {on && <Check size={11} className="text-pink-500" />}
            </button>
          );
        })}
      </div>
      <p className="text-sm text-gray-400"><span className="font-bold text-gray-700">{form.interests.length}</span>/6 selected</p>
      <button onClick={() => setStep(3)} disabled={!form.interests.length} className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold shadow-lg shadow-pink-100 active:scale-95 transition-transform disabled:opacity-40">Continue →</button>
    </div>,

    // 3 – Photos
    <div key="p" className="min-h-screen bg-[#f0f4ff] px-5 pt-16 pb-8 space-y-5">
      <div><h2 className="text-2xl font-display font-bold text-gray-900">Add Photos</h2><p className="text-gray-400 text-sm mt-0.5">Add up to 6 photos. Profiles with photos get 10× more matches</p></div>
      <PhotoUpload photos={form.photos} onChange={photos => setForm(f => ({ ...f, photos }))} max={6} />
      <button onClick={() => setStep(4)} className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold shadow-lg shadow-pink-100 active:scale-95 transition-transform">
        {form.photos.length === 0 ? 'Skip for now →' : 'Continue →'}
      </button>
    </div>,

    // 4 – Preferences
    <div key="pr" className="min-h-screen bg-[#f0f4ff] px-5 pt-16 pb-8 space-y-5">
      <div><h2 className="text-2xl font-display font-bold text-gray-900">Your Preferences</h2><p className="text-gray-400 text-sm mt-0.5">Who are you looking to connect with?</p></div>
      <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Preferred Location</label>
        <select className="input" value={form.preferred_area} onChange={e => setForm(f => ({ ...f, preferred_area: e.target.value }))}>
          {['Yangon','Mandalay','Naypyidaw','Bago','Anywhere'].map(a => <option key={a}>{a}</option>)}
        </select>
      </div>
      <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Age Range: <span className="text-pink-600 normal-case font-bold">{form.preferred_age_min}–{form.preferred_age_max}</span></label>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-gray-400 mb-1 block">Min</label><input type="number" className="input" min="18" max="60" value={form.preferred_age_min} onChange={e => setForm(f => ({ ...f, preferred_age_min: e.target.value }))} /></div>
          <div><label className="text-xs text-gray-400 mb-1 block">Max</label><input type="number" className="input" min="18" max="80" value={form.preferred_age_max} onChange={e => setForm(f => ({ ...f, preferred_age_max: e.target.value }))} /></div>
        </div>
      </div>
      <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Preferred Work Field</label>
        <select className="input" value={form.preferred_work_field} onChange={e => setForm(f => ({ ...f, preferred_work_field: e.target.value }))}>
          {['IT & Software','Marketing','Finance','Healthcare','Engineering','Design','Education','Any'].map(f => <option key={f}>{f}</option>)}
        </select>
      </div>
      <button onClick={save} disabled={saving} className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold shadow-lg shadow-pink-100 active:scale-95 transition-transform disabled:opacity-60">
        {saving ? 'Creating Profile...' : '🚀 Start Matching!'}
      </button>
    </div>,
  ];

  return (
    <div className="relative">
      {step > 0 && (
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 pt-14 pb-3">
          <button onClick={() => setStep(s => s - 1)} className="w-9 h-9 bg-white/80 backdrop-blur rounded-xl flex items-center justify-center shadow-sm">
            <ArrowLeft size={16} className="text-gray-600" />
          </button>
          <div className="flex gap-1.5">
            {[1,2,3,4].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'bg-pink-500 w-7' : 'bg-gray-300 w-4'}`} />
            ))}
          </div>
          <span className="text-xs text-gray-400 font-medium">{step}/4</span>
        </div>
      )}
      {steps[step]}
    </div>
  );
}

// ─── Swipe Card ──────────────────────────────────────────────────────────────
function SwipeCard({ person, onAction, active, zIndex }: { person: any; onAction: (a: 'like'|'pass'|'super_like') => void; active: boolean; zIndex: number }) {
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [flyOut, setFlyOut] = useState<'left'|'right'|null>(null);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const startRef = useRef({ x: 0, y: 0 });
  const THRESHOLD = 80;

  const triggerAction = useCallback((dir: 'left'|'right') => {
    if (flyOut) return;
    setFlyOut(dir);
    setTimeout(() => onAction(dir === 'right' ? 'like' : 'pass'), 380);
  }, [flyOut, onAction]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!active || flyOut) return;
    setDragging(true);
    startRef.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !active || flyOut) return;
    setDrag({ x: e.clientX - startRef.current.x, y: e.clientY - startRef.current.y });
  };
  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (drag.x > THRESHOLD) triggerAction('right');
    else if (drag.x < -THRESHOLD) triggerAction('left');
    else setDrag({ x: 0, y: 0 });
  };

  const rotation = flyOut ? 0 : drag.x / 20;
  const likeOpacity = Math.min(1, Math.max(0, drag.x / THRESHOLD));
  const nopeOpacity = Math.min(1, Math.max(0, -drag.x / THRESHOLD));

  let transform = '';
  let transition = '';
  if (flyOut === 'left') { transform = 'translateX(-120vw) rotate(-25deg)'; transition = 'transform 0.4s cubic-bezier(0.4,0,1,1)'; }
  else if (flyOut === 'right') { transform = 'translateX(120vw) rotate(25deg)'; transition = 'transform 0.4s cubic-bezier(0.4,0,1,1)'; }
  else if (dragging) { transform = `translateX(${drag.x}px) translateY(${drag.y * 0.1}px) rotate(${rotation}deg)`; transition = 'none'; }
  else { transform = 'translateX(0) rotate(0deg)'; transition = drag.x !== 0 ? 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)' : 'none'; }

  const photos = person.photos || [];

  return (
    <div
      className="absolute inset-0"
      style={{ transform, transition, zIndex, touchAction: 'none', willChange: 'transform', cursor: active ? (dragging ? 'grabbing' : 'grab') : 'default' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Full screen photo */}
      <div className="absolute inset-0 bg-black">
        {photos.length > 0
          ? <img src={photos[photoIdx]} alt={person.name} className="w-full h-full object-cover pointer-events-none" draggable={false} />
          : <div className="w-full h-full bg-gradient-to-br from-pink-900 via-purple-900 to-blue-900 flex items-center justify-center">
              <span className="text-[120px] font-display font-bold text-white/20 select-none">{person.name?.charAt(0)}</span>
            </div>
        }
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
        {/* Top gradient for status bar */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Photo dots + tap zones */}
      {photos.length > 1 && (
        <>
          <div className="absolute top-14 left-0 right-0 flex gap-1.5 px-4 pointer-events-none" style={{ zIndex: 5 }}>
            {photos.map((_: any, i: number) => (
              <div key={i} className={`flex-1 h-0.5 rounded-full transition-all ${i === photoIdx ? 'bg-white' : 'bg-white/30'}`} />
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-1/3" style={{ zIndex: 4 }} onClick={e => { e.stopPropagation(); setPhotoIdx(i => Math.max(0, i - 1)); }} />
          <div className="absolute inset-y-0 right-0 w-1/3" style={{ zIndex: 4 }} onClick={e => { e.stopPropagation(); setPhotoIdx(i => Math.min(photos.length - 1, i + 1)); }} />
        </>
      )}

      {/* LIKE stamp */}
      <div className="absolute top-24 left-6 pointer-events-none" style={{ opacity: likeOpacity, zIndex: 10 }}>
        <div className="border-4 border-green-400 rounded-2xl px-5 py-2 rotate-[-12deg]">
          <span className="text-green-400 font-display font-black text-3xl tracking-widest" style={{ textShadow: '0 0 20px rgba(74,222,128,0.5)' }}>LIKE</span>
        </div>
      </div>
      {/* NOPE stamp */}
      <div className="absolute top-24 right-6 pointer-events-none" style={{ opacity: nopeOpacity, zIndex: 10 }}>
        <div className="border-4 border-red-400 rounded-2xl px-5 py-2 rotate-[12deg]">
          <span className="text-red-400 font-display font-black text-3xl tracking-widest" style={{ textShadow: '0 0 20px rgba(248,113,113,0.5)' }}>NOPE</span>
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 pb-52" style={{ zIndex: 5 }}>
        <div className="flex items-end justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-white font-display font-bold text-3xl drop-shadow-lg">{person.name}</h2>
              <span className="text-white/90 font-bold text-2xl">{person.age}</span>
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Check size={12} className="text-white" strokeWidth={3} />
              </div>
            </div>
            {person.address && <p className="text-white/70 text-sm flex items-center gap-1 mt-1 drop-shadow"><MapPin size={13} />{person.address.split(',')[0]}</p>}
            {person.experience && <p className="text-white/60 text-sm flex items-center gap-1 mt-0.5 drop-shadow"><Briefcase size={12} />{person.experience.split('.')[0]}</p>}
            {(person.interests || []).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(person.interests as string[]).slice(0, 4).map((tag: string) => {
                  const found = INTEREST_OPTIONS.find(i => i.label === tag);
                  return (
                    <span key={tag} className="text-white text-xs px-3 py-1.5 rounded-full font-semibold"
                      style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                      {found?.emoji} {tag}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="px-3 py-2 rounded-2xl flex items-center gap-1.5 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #ec4899, #f97316)', boxShadow: '0 4px 20px rgba(236,72,153,0.4)' }}>
              <Heart size={13} className="text-white fill-white" />
              <span className="text-white font-bold text-sm">{Math.floor(75 + (person.age % 20))}%</span>
            </div>
            <button onClick={e => { e.stopPropagation(); setShowInfo(b => !b); }}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
              <ChevronUp size={16} className={`text-white transition-transform duration-200 ${showInfo ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {showInfo && person.bio && (
          <div className="mt-3 p-4 rounded-2xl" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)' }}>
            <p className="text-white/90 text-sm leading-relaxed">{person.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MatchmakingPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [acting, setActing] = useState(false);
  const [matchPopup, setMatchPopup] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    api.get('/matchmaking/profile').then(res => {
      setProfile(res.data);
      if (!res.data) setShowSetup(true);
      else loadCandidates();
    }).catch(() => setShowSetup(true)).finally(() => setLoading(false));
  }, []);

  const loadCandidates = async () => {
    try { const res = await api.get('/matchmaking/candidates'); setCandidates(res.data); } catch {}
  };

  const handleAction = async (action: 'like'|'pass'|'super_like') => {
    if (!candidates.length || acting) return;
    const current = candidates[0];
    setActing(true);
    try {
      const res = await api.post('/matchmaking/action', { to_user_id: current.user_id, action });
      if (res.data.isMatch) setMatchPopup(current);
    } catch {}
    setTimeout(() => { setCandidates(prev => prev.slice(1)); setActing(false); }, 420);
  };

  const [btnAction, setBtnAction] = useState<'like'|'pass'|null>(null);

  const triggerBtn = async (action: 'like'|'pass'|'super_like') => {
    if (!candidates.length || acting) return;
    const current = candidates[0];
    setActing(true);
    setBtnAction(action === 'pass' ? 'pass' : 'like');
    try {
      const res = await api.post('/matchmaking/action', { to_user_id: current.user_id, action });
      if (res.data.isMatch) setMatchPopup(current);
    } catch {}
    setTimeout(() => { setCandidates(p => p.slice(1)); setActing(false); setBtnAction(null); }, 420);
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin w-10 h-10 border-4 border-pink-400 border-t-transparent rounded-full" />
    </div>
  );

  if (showSetup) return (
    <SetupFlow onComplete={() => {
      setShowSetup(false);
      setLoading(true);
      api.get('/matchmaking/profile').then(r => { setProfile(r.data); loadCandidates(); }).finally(() => setLoading(false));
    }} />
  );

  const current = candidates[0];
  const next = candidates[1];
  const third = candidates[2];

  return (
    <div className="relative w-full bg-black" style={{ height: '100dvh' }}>

      {/* Empty state */}
      {candidates.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0f1e4a] to-[#1d3a8a] text-center px-8">
          <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-6">
            <Zap size={40} className="text-pink-300" />
          </div>
          <h3 className="font-display font-bold text-white text-2xl mb-2">All caught up!</h3>
          <p className="text-white/50 text-sm mb-8">{t('checkBackLater')}</p>
          <button onClick={loadCandidates} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold">
            <RotateCcw size={16} /> Refresh
          </button>
        </div>
      )}

      {/* Card stack - full screen */}
      {candidates.length > 0 && (
        <>
          {/* Background cards (stacked behind) */}
          {third && (
            <div className="absolute inset-0" style={{ transform: 'scale(0.92) translateY(12px)', zIndex: 1, borderRadius: 0, overflow: 'hidden' }}>
              <div className="w-full h-full bg-gray-900" />
            </div>
          )}
          {next && (
            <div className="absolute inset-0" style={{ transform: 'scale(0.96) translateY(6px)', zIndex: 2, overflow: 'hidden' }}>
              {next.photos?.[0]
                ? <img src={next.photos[0]} alt="" className="w-full h-full object-cover opacity-60" />
                : <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900" />
              }
              <div className="absolute inset-0 bg-black/40" />
            </div>
          )}
          {current && (
            <SwipeCard
              key={current.user_id}
              person={{ ...current, _btnAction: btnAction }}
              onAction={handleAction}
              active={!acting}
              zIndex={10}
            />
          )}
        </>
      )}

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-12"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)' }}>
        <div className="flex items-center justify-between px-5 mb-3">
          <Link to="/matches" className="w-10 h-10 flex items-center justify-center rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
            <MessageCircle size={18} className="text-white" />
          </Link>
          <div className="flex items-center gap-1.5">
            <Zap size={18} className="text-orange-400 fill-orange-400" />
            <span className="font-display font-bold text-white text-lg">Matchmaking</span>
          </div>
          <button onClick={() => setShowSetup(true)} className="w-10 h-10 flex items-center justify-center rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
            <Settings size={18} className="text-white" />
          </button>
        </div>
        {/* Tinder-style filter tabs */}
        <div className="flex items-center justify-center gap-1 px-5 pb-2">
          {['For You', 'New', 'Online'].map(tab => (
            <button key={tab}
              className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{ background: tab === 'For You' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)', color: tab === 'For You' ? '#1d3a8a' : 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)' }}>
              {tab}
            </button>
          ))}
          <button className="ml-2 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* Action buttons */}
      {candidates.length > 0 && (
        <div className="absolute bottom-36 left-0 right-0 flex items-center justify-center gap-5 z-20 px-8">
          <button onClick={() => loadCandidates()}
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <RotateCcw size={18} className="text-white" />
          </button>
          <button onClick={() => triggerBtn('pass')} disabled={acting}
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all disabled:opacity-40"
            style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 8px 32px rgba(239,68,68,0.3)' }}>
            <X size={30} className="text-red-500" strokeWidth={2.5} />
          </button>
          <button onClick={() => triggerBtn('super_like')} disabled={acting}
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-40"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Star size={20} className="text-blue-400 fill-blue-400" />
          </button>
          <button onClick={() => triggerBtn('like')} disabled={acting}
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #ec4899, #f97316)', boxShadow: '0 8px 32px rgba(236,72,153,0.4)' }}>
            <Heart size={30} className="text-white fill-white" />
          </button>
          <button className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #f97316, #eab308)', boxShadow: '0 8px 32px rgba(249,115,22,0.3)' }}>
            <Zap size={20} className="text-white fill-white" />
          </button>
        </div>
      )}

      {/* Remaining count */}
      {candidates.length > 0 && (
        <div className="absolute bottom-32 left-0 right-0 flex justify-center z-20">
          <span className="text-white/40 text-xs">{candidates.length} profiles remaining</span>
        </div>
      )}

      {/* Match popup */}
      {matchPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }}>
          <div className="bg-white rounded-3xl p-8 text-center max-w-xs w-full shadow-2xl">
            <div className="text-6xl mb-3">🎉</div>
            <h2 className="text-2xl font-display font-bold mb-1" style={{ background: 'linear-gradient(135deg, #ec4899, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              It's a Match!
            </h2>
            <p className="text-gray-500 text-sm mt-1 mb-6">You and <strong>{matchPopup.name}</strong> liked each other</p>
            <div className="flex gap-3">
              <button onClick={() => setMatchPopup(null)} className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm active:scale-95 transition-transform">Keep Swiping</button>
              <Link to="/matches" className="flex-1 py-3 rounded-2xl text-white font-semibold text-sm text-center active:scale-95 transition-transform"
                style={{ background: 'linear-gradient(135deg, #ec4899, #f97316)' }} onClick={() => setMatchPopup(null)}>
                Send Message
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
