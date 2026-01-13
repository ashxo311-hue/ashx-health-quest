
import React, { useState, useEffect, useCallback } from 'react';
import { DailyStats, FamilyMember, GeminiMotivationResponse } from './types';
import { INITIAL_STATS, MOCK_FAMILY } from './constants';
import StatCard from './components/StatCard';
import Leaderboard from './components/Leaderboard';
import { getHealthMotivation } from './services/geminiService';

const App: React.FC = () => {
  const [stats, setStats] = useState<DailyStats>(() => {
    const saved = localStorage.getItem('health_quest_stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [family] = useState<FamilyMember[]>(MOCK_FAMILY);
  const [motivation, setMotivation] = useState<GeminiMotivationResponse | null>(null);
  const [loadingMotivation, setLoadingMotivation] = useState(false);
  const [showXpCelebration, setShowXpCelebration] = useState(false);

  // Sync with local storage
  useEffect(() => {
    localStorage.setItem('health_quest_stats', JSON.stringify(stats));
  }, [stats]);

  // Check for goal completion and reward XP
  useEffect(() => {
    const goalMet = stats.steps >= stats.goalSteps && stats.waterMl >= stats.goalWaterMl;
    const wasAlreadyRewarded = localStorage.getItem(`xp_rewarded_${stats.date}`) === 'true';

    if (goalMet && !wasAlreadyRewarded) {
      setShowXpCelebration(true);
      localStorage.setItem(`xp_rewarded_${stats.date}`, 'true');
      setTimeout(() => setShowXpCelebration(false), 5000);
    }
  }, [stats]);

  const fetchMotivation = useCallback(async () => {
    setLoadingMotivation(true);
    const result = await getHealthMotivation(stats);
    setMotivation(result);
    setLoadingMotivation(false);
  }, [stats]);

  useEffect(() => {
    fetchMotivation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateSteps = (amount: number) => {
    setStats(prev => ({ ...prev, steps: prev.steps + amount }));
  };

  const handleUpdateWater = (amount: number) => {
    setStats(prev => ({ ...prev, waterMl: prev.waterMl + amount }));
  };

  const currentXpEarned = (localStorage.getItem(`xp_rewarded_${stats.date}`) === 'true' ? 1 : 0) + 4; // Mocking previous days

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-8">
      {/* XP Celebration Toast */}
      {showXpCelebration && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-bounce">
          <div className="text-3xl">✨</div>
          <div>
            <h4 className="font-bold">Goal Achieved!</h4>
            <p className="text-sm opacity-90">You earned +1 XP for today's health quest!</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-black italic">H</div>
            <h1 className="text-lg font-bold tracking-tight">HealthQuest</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-slate-100 rounded-full px-4 py-1.5 flex items-center gap-2">
              <span className="text-indigo-600 text-lg font-bold">⚡ {currentXpEarned}</span>
              <span className="text-[10px] font-black text-slate-400 uppercase">Weekly XP</span>
            </div>
            <img src="https://picsum.photos/seed/user/100" className="w-8 h-8 rounded-full ring-2 ring-indigo-50" alt="Avatar" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Dashboard Section */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* AI Motivation Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl">
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <span className="bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    AI Health Coach
                  </span>
                  <button 
                    onClick={fetchMotivation}
                    disabled={loadingMotivation}
                    className="text-xs font-bold hover:underline opacity-80"
                  >
                    {loadingMotivation ? 'Refining advice...' : 'Refresh Insights'}
                  </button>
                </div>
                
                {motivation ? (
                  <div className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
                      "{motivation.message}"
                    </h2>
                    <div className="flex items-start gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                      <span className="text-2xl">💡</span>
                      <p className="text-sm md:text-base opacity-90 leading-relaxed font-medium">
                        {motivation.tip}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-white/20 rounded w-3/4"></div>
                    <div className="h-20 bg-white/10 rounded"></div>
                  </div>
                )}
              </div>
              {/* Background abstract shapes */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
            </div>

            {/* Daily Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard 
                title="Step Tracker"
                value={stats.steps}
                goal={stats.goalSteps}
                unit="steps"
                icon="👟"
                color="text-indigo-600"
                onIncrement={handleUpdateSteps}
              />
              <StatCard 
                title="Hydration Level"
                value={stats.waterMl}
                goal={stats.goalWaterMl}
                unit="ml"
                icon="💧"
                color="text-blue-500"
                onIncrement={handleUpdateWater}
              />
            </div>

            {/* Goal Info */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Your Daily Quest</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${stats.steps >= stats.goalSteps ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                      {stats.steps >= stats.goalSteps ? '✅' : '🎯'}
                    </div>
                    <div>
                      <p className="font-bold text-sm">Hit {stats.goalSteps} Steps</p>
                      <p className="text-xs text-slate-500">Walk more to reach the goal</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400">{Math.round((stats.steps / stats.goalSteps) * 100)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${stats.waterMl >= stats.goalWaterMl ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                      {stats.waterMl >= stats.goalWaterMl ? '✅' : '🎯'}
                    </div>
                    <div>
                      <p className="font-bold text-sm">Drink {stats.goalWaterMl / 1000}L Water</p>
                      <p className="text-xs text-slate-500">Keep your body hydrated</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400">{Math.round((stats.waterMl / stats.goalWaterMl) * 100)}%</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-500">
                  Completing both goals earns you <span className="text-indigo-600 font-bold">1 XP Point</span> for the day. Accumulate points to win the Weekly Family Challenge!
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar / Leaderboard Section */}
          <div className="lg:col-span-4 space-y-8">
            <Leaderboard 
              family={family}
              currentUserXp={currentXpEarned}
            />
            
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🏆</div>
              <h4 className="font-bold text-slate-900 mb-1">Weekly Prize</h4>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                The winner of this week's Family Challenge gets to pick next Sunday's movie night! 🍿
              </p>
              <button className="w-full py-3 px-6 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
                Share Progress
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 py-3 px-8 flex justify-between items-center md:hidden z-50">
        <button className="flex flex-col items-center gap-1 text-indigo-600">
          <span className="text-xl">📊</span>
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <span className="text-xl">🏆</span>
          <span className="text-[10px] font-bold">Stats</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <span className="text-xl">👥</span>
          <span className="text-[10px] font-bold">Family</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <span className="text-xl">⚙️</span>
          <span className="text-[10px] font-bold">Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
