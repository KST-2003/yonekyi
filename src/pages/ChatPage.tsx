import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export default function ChatPage() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    const res = await api.get(`/matchmaking/matches/${matchId}/messages`);
    setMessages(res.data);
    setLoading(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  useEffect(() => { load(); const interval = setInterval(load, 5000); return () => clearInterval(interval); }, [matchId]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const content = text.trim();
    setText('');
    await api.post(`/matchmaking/matches/${matchId}/messages`, { content });
    load();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100"><ArrowLeft size={18} /></button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center font-bold text-purple-700">
          {messages[0]?.sender_name !== user?.name ? messages[0]?.sender_name?.charAt(0) : messages.find(m => m.sender_id !== user?.id)?.sender_name?.charAt(0) || '?'}
        </div>
        <p className="font-semibold text-gray-900">
          {messages.find(m => m.sender_id !== user?.id)?.sender_name || 'Match'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            <p>🎉 You matched! Say hello!</p>
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.sender_id === user?.id;
          return (
            <div key={msg.id} className={`flex gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
              {!isMe && (
                <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700 flex-shrink-0 mt-auto">
                  {msg.sender_name?.charAt(0)}
                </div>
              )}
              <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-[#1d3a8a] text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-900 rounded-bl-sm shadow-sm'}`}>
                {msg.content}
                <div className={`text-xs mt-0.5 ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="flex gap-2 pt-4 border-t border-gray-100">
        <input className="input flex-1" placeholder="Type a message..." value={text} onChange={e => setText(e.target.value)} />
        <button type="submit" disabled={!text.trim()} className="btn-primary px-4 py-2.5 disabled:opacity-40"><Send size={16} /></button>
      </form>
    </div>
  );
}
