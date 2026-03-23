import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Heart, ArrowLeft, Zap } from 'lucide-react';
import api from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';

export default function MatchesPage() {
  const { t } = useLanguage();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/matchmaking/matches').then(res => setMatches(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-3">
      {[1,2,3].map(i => <div key={i} className="card h-16 shimmer" />)}
    </div>
  );

  return (
    <div className="space-y-4">
      <Link to="/matchmaking" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
        <ArrowLeft size={15} />{t('back')}
      </Link>
      <h1 className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
        <Heart size={18} className="text-pink-500 fill-pink-500" />{t('myMatches')}
      </h1>

      {matches.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center mx-auto mb-4">
            <Zap size={32} className="text-pink-200" />
          </div>
          <p className="font-semibold text-gray-600 mb-1">No matches yet</p>
          <p className="text-sm mb-6">{t('noMatches')}</p>
          <Link to="/matchmaking" className="btn-primary inline-flex items-center gap-2">
            <Zap size={15} />{t('startMatching')}
          </Link>
        </div>
      ) : (
        <div className="space-y-2 stagger">
          {matches.map(match => (
            <Link key={match.id} to={`/matches/${match.id}/chat`}
              className="card-hover flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center font-bold text-white text-lg flex-shrink-0 shadow-md">
                {match.match_name?.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{match.match_name}</p>
                <p className="text-xs text-gray-400">Matched {new Date(match.created_at).toLocaleDateString()}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center">
                <MessageCircle size={16} className="text-pink-500" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
