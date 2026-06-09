import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageCircle, FiBook, FiBarChart3, FiCamera, FiMic, FiHeart } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import { api } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.get('/dashboard/summary');
        setSummary(data);
      } catch (err) {
        setError('Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  const features = [
    { name: 'Chat with AI', path: '/chat', description: 'Talk to the AI companion anytime.', icon: FiMessageCircle, color: 'violet' },
    { name: 'Journal', path: '/journal', description: 'Capture your thoughts and feelings.', icon: FiBook, color: 'blue' },
    { name: 'Mood Tracker', path: '/mood', description: 'Track mood trends over time.', icon: FiBarChart3, color: 'emerald' },
    { name: 'Face Emotion', path: '/face', description: 'Detect your emotional state from camera input.', icon: FiCamera, color: 'pink' },
    { name: 'Voice Emotion', path: '/voice', description: 'Record your voice and capture mood cues.', icon: FiMic, color: 'cyan' },
    { name: 'Self Care', path: '/selfcare', description: 'Build healthy habits for wellbeing.', icon: FiHeart, color: 'rose' },
  ];

  function moodEmoji(level) {
    if (level == null) return '🙂';
    if (level >= 8) return '😁';
    if (level >= 6) return '🙂';
    if (level >= 4) return '😐';
    if (level >= 2) return '😟';
    return '😢';
  }

  return (
    <div className='min-h-screen bg-slate-950 text-white'>
      <Navbar />
      <main className='mx-auto max-w-7xl px-6 py-10'>
        <div className='mb-8 rounded-3xl bg-gradient-to-r from-violet-700 via-slate-900 to-slate-950 p-10 shadow-2xl shadow-black/40'>
          <h1 className='text-4xl font-semibold tracking-tight'>Your MindCare Hub</h1>
          <p className='mt-3 max-w-2xl text-slate-300'>Explore your mental wellness tools in one place: AI chat, mood tracking, journals, face and voice emotion detection, plus self-care guidance.</p>
        </div>

        <div className='grid gap-6 lg:grid-cols-[1.4fr_1fr]'>
          <div className='space-y-6'>
            <div className='rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-lg shadow-black/30'>
              <div className='flex items-center justify-between gap-4'>
                <div>
                  <div className='flex items-center gap-4'>
                    <div>
                      <p className='text-sm uppercase tracking-[.3em] text-violet-300'>Dashboard preview</p>
                      <h2 className='mt-3 text-3xl font-semibold text-white'>Live insights</h2>
                    </div>
                    <div className='ml-4 flex items-center gap-3'>
                      <div className='rounded-full bg-slate-900/70 px-3 py-1 text-xs font-semibold text-slate-200'>Avg: {summary?.mood_average ?? '—'}</div>
                      <div className='rounded-full bg-slate-900/70 px-3 py-1 text-xs font-semibold text-slate-200'>Journals: {summary?.journal_count ?? 0}</div>
                    </div>
                  </div>
                </div>
                <button
                  className='rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-400'
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </button>
              </div>

              {loading ? (
                <div className='mt-8 space-y-4'>
                  <div className='h-6 rounded-full bg-slate-800/70 w-3/4 animate-pulse' />
                  <div className='h-6 rounded-full bg-slate-800/70 w-2/3 animate-pulse' />
                  <div className='h-6 rounded-full bg-slate-800/70 w-1/2 animate-pulse' />
                </div>
              ) : error ? (
                <p className='mt-8 text-red-400'>{error}</p>
              ) : (
                <div className='mt-6 space-y-6'>
                  {/* Weekly mood chart */}
                  <div className='rounded-2xl bg-slate-950/80 p-4'>
                    <p className='text-sm uppercase tracking-[.2em] text-slate-400'>Weekly mood</p>
                    <div className='mt-3 flex items-end gap-2 h-24'>
                      {(
                        (summary.weekly_mood && summary.weekly_mood.slice(-7)) ||
                        Array.from({ length: 7 }).map((_, i) => (summary.mood_history ? (summary.mood_history[i] || 0) : 0))
                      ).map((val, idx) => {
                        const normalized = Math.max(0, Math.min(10, Number(val || 0)));
                        const heightPercent = Math.max(8, Math.round((normalized / 10) * 100));
                        return (
                          <div key={idx} className='flex-1'>
                            <div
                              className='mx-auto w-4 rounded-t-full'
                              style={{
                                height: `${heightPercent}%`,
                                background: 'linear-gradient(180deg, #34d399 0%, #7c3aed 100%)',
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent activity compact list */}
                  <div className='rounded-2xl bg-slate-950/80 p-4'>
                    <p className='text-sm uppercase tracking-[.2em] text-slate-400'>Recent activity</p>
                    <div className='mt-3 space-y-3'>
                      {(
                        summary.recent_activity || [
                          summary.latest_mood ? { type: 'mood', date: summary.latest_mood.date || 'Today', level: summary.latest_mood.level, note: summary.latest_mood.note } : null,
                          summary.latest_journal ? { type: 'journal', date: summary.latest_journal.date || 'Today', title: summary.latest_journal.title, content: summary.latest_journal.content } : null,
                        ].filter(Boolean)
                      ).slice(0, 5).map((item, i) => (
                        <div key={i} className='flex items-start gap-4'>
                          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-xl'>
                            {item.type === 'mood' ? moodEmoji(item.level) : '📝'}
                          </div>
                          <div className='flex-1'>
                            <div className='flex items-center justify-between'>
                              <p className='text-sm font-semibold text-white'>{item.type === 'mood' ? `Mood — Level ${item.level}` : item.title || 'Journal'}</p>
                              <p className='text-xs text-slate-400'>{item.date || '—'}</p>
                            </div>
                            <p className='mt-1 text-sm text-slate-400 line-clamp-2'>{item.note || item.content || ''}</p>
                          </div>
                        </div>
                      ))}
                      {(!summary.recent_activity && !summary.latest_mood && !summary.latest_journal) && (
                        <p className='mt-2 text-slate-400'>No recent activity. Log a mood or write a journal to see it here.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='space-y-6'>
            {features.map((feature) => {
              const IconComponent = feature.icon;
              const colorClasses = {
                violet: 'bg-violet-500/20 text-violet-300',
                blue: 'bg-blue-500/20 text-blue-300',
                emerald: 'bg-emerald-500/20 text-emerald-300',
                pink: 'bg-pink-500/20 text-pink-300',
                cyan: 'bg-cyan-500/20 text-cyan-300',
                rose: 'bg-rose-500/20 text-rose-300',
              };
              const buttonClasses = {
                violet: 'bg-violet-500 hover:bg-violet-400',
                blue: 'bg-blue-500 hover:bg-blue-400',
                emerald: 'bg-emerald-500 hover:bg-emerald-400',
                pink: 'bg-pink-500 hover:bg-pink-400',
                cyan: 'bg-cyan-500 hover:bg-cyan-400',
                rose: 'bg-rose-500 hover:bg-rose-400',
              };

              return (
                <div
                  key={feature.name}
                  className='group w-full rounded-3xl border border-white/10 bg-slate-900/90 p-7 text-left transition hover:-translate-y-1 hover:bg-slate-800 flex items-center justify-between'
                >
                  <div className='flex items-start gap-4 flex-1'>
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl flex-shrink-0 ${colorClasses[feature.color]}`}>
                      <IconComponent size={28} />
                    </div>
                    <div className='flex-1'>
                      <h2 className='text-xl font-semibold text-white'>{feature.name}</h2>
                      <p className='mt-2 text-slate-400'>{feature.description}</p>
                    </div>
                  </div>
                  <div className='ml-4 flex-shrink-0'>
                    {(feature.name === 'Chat with AI') && (
                      <button onClick={() => navigate(feature.path)} className={`rounded-lg ${buttonClasses[feature.color]} px-4 py-2 text-sm font-semibold text-white transition`}>Start chat</button>
                    )}
                    {(feature.name === 'Mood Tracker') && (
                      <button onClick={() => navigate(feature.path)} className={`rounded-lg ${buttonClasses[feature.color]} px-4 py-2 text-sm font-semibold text-white transition`}>Log mood</button>
                    )}
                    {(!['Chat with AI','Mood Tracker'].includes(feature.name)) && (
                      <button onClick={() => navigate(feature.path)} className='rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 transition'>Open</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
