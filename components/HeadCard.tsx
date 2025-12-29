
import React from 'react';
import { HeadStatus, ProxyProtocol } from '../types';

interface HeadCardProps {
  status: HeadStatus;
}

export const HeadCard: React.FC<HeadCardProps> = ({ status }) => {
  const percentage = (status.active / (status.total || 1)) * 100;
  
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-emerald-500/30 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase mb-1">{status.protocol} Head</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">{status.active}</span>
            <span className="text-xs text-slate-500 mt-1">/ {status.total} active</span>
          </div>
        </div>
        <div className={`p-2 rounded-lg ${status.isSyncing ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
          {status.isSyncing ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase font-bold tracking-widest">
          <span>Health: {Math.round(percentage)}%</span>
          <span className="mono group-hover:text-emerald-400 transition-colors">v0.1.0-STABLE</span>
        </div>
      </div>
    </div>
  );
};
