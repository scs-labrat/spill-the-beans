
import React from 'react';
import type { LeaderboardEntry } from '../types';
import { TrophyIcon } from './icons';

interface LeaderboardViewProps {
  leaderboard: LeaderboardEntry[];
  onBack: () => void;
}

const LeaderboardView: React.FC<LeaderboardViewProps> = ({ leaderboard, onBack }) => {
  const rankColors = [
    'text-yellow-500', // 1st
    'text-gray-400',  // 2nd
    'text-yellow-700' // 3rd
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-2">
            <TrophyIcon className="w-8 h-8 text-yellow-500"/> Leaderboard
        </h2>
        <button onClick={onBack} className="border border-brand-primary text-brand-primary font-semibold hover:bg-brand-primary hover:text-white px-4 py-2 rounded-lg transition-colors">
          Back to Menu
        </button>
      </div>

      <div className="bg-brand-content-bg rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {leaderboard.length === 0 ? (
          <div className="flex items-center justify-center p-12">
            <p className="text-brand-subtle text-lg">No scores yet. Be the first to get on the board!</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-brand-secondary border-b border-gray-200 z-10">
              <tr>
                <th className="p-3 text-sm font-semibold text-brand-subtle w-16 text-center">Rank</th>
                <th className="p-3 text-sm font-semibold text-brand-subtle">Name</th>
                <th className="p-3 text-sm font-semibold text-brand-subtle">Persona Faced</th>
                <th className="p-3 text-sm font-semibold text-brand-subtle">Date</th>
                <th className="p-3 text-sm font-semibold text-brand-subtle w-24 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-b-0 hover:bg-brand-secondary/50">
                  <td className={`p-3 font-bold text-center ${rankColors[index] || 'text-brand-text'}`}>
                    {index + 1}
                  </td>
                  <td className="p-3 font-semibold text-brand-primary">{entry.name}</td>
                  <td className="p-3 text-brand-text/90">{entry.personaName}</td>
                  <td className="p-3 text-sm text-brand-subtle">{entry.date}</td>
                  <td className="p-3 font-bold text-brand-accent text-right">{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LeaderboardView;
