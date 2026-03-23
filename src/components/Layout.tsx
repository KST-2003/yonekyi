import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Briefcase, ShoppingBag, Sparkles, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Layout() {
  const { t } = useLanguage();
  const location = useLocation();
  const isMatchmaking = location.pathname === '/matchmaking';

  const navItems = [
    { to: '/', icon: Home, label: t('public'), end: true },
    { to: '/jobs', icon: Briefcase, label: t('jobs'), end: false },
    { to: '/marketplace', icon: ShoppingBag, label: t('marketplace'), end: false },
    { to: '/matchmaking', icon: Sparkles, label: t('matchmaking'), end: false },
    { to: '/profile', icon: User, label: t('profile'), end: false },
  ];

  return (
    <div className="min-h-screen bg-[#f0f4ff] flex flex-col">
      <main className={`flex-1 ${isMatchmaking ? '' : 'max-w-2xl mx-auto w-full px-4 py-4 pb-32'}`}>
        <div className={isMatchmaking ? '' : 'page-enter'}>
          <Outlet />
        </div>
      </main>

      {/* Floating bottom nav — wider, more padding */}
      <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-md">
        <div
          className="flex items-center bg-white/85 backdrop-blur-2xl rounded-[32px] border border-white/70 px-3 py-2"
          style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)' }}
        >
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-1.5 gap-0.5 text-[10px] font-semibold transition-all duration-200 ${
                  isActive ? 'text-[#1d3a8a]' : 'text-gray-400 hover:text-gray-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-[#1d3a8a] shadow-sm' : ''}`}>
                    <Icon size={17} strokeWidth={isActive ? 2.5 : 1.8} className={isActive ? 'text-white' : ''} />
                  </div>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
