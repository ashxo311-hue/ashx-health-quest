
import React from 'react';
import { FamilyMember } from '../types';

interface LeaderboardProps {
  family: FamilyMember[];
  currentUserXp: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ family, currentUserXp }) => {
  const sortedFamily = [...family, { id: 'me', name: 'You (Me)', avatar: 'https://picsum.photos/seed/user/100', xp: 120, weeklyXP: currentUserXp }]
    .sort((a, b) => b.weeklyXP - a.weeklyXP);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">Family Leaderboard</h2>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Week 42</span>
      </div>

      <div className="space-y-4">
        {sortedFamily.map((member, index) => (
          <div 
            key={member.id} 
            className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${member.id === 'me' ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50'}`}
          >
            <div className="w-8 text-center font-bold text-slate-400">
              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
            </div>
            <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
              <p className="text-xs text-slate-500">Total Lifetime XP: {member.xp + member.weeklyXP}</p>
            </div>
            <div className="text-right">
              <span className="text-indigo-600 font-extrabold">{member.weeklyXP}</span>
              <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-tighter">XP THIS WEEK</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
        <p className="text-xs text-yellow-800 leading-relaxed">
          <strong className="block mb-1">Weekly Prize Drawing! 🎁</strong>
          The family member with the most XP by Sunday midnight wins the Weekly Champion badge!
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
