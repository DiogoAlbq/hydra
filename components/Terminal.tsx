
import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';

interface TerminalProps {
  logs: LogEntry[];
}

export const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-rose-400 font-bold';
      case 'WARN': return 'text-amber-400';
      case 'DEBUG': return 'text-blue-400';
      case 'CHAOS': return 'text-fuchsia-400 italic';
      case 'DOCTOR': return 'text-cyan-400 border border-cyan-400/20 px-1 bg-cyan-400/5';
      default: return 'text-emerald-400';
    }
  };

  return (
    <div className="bg-[#050505] rounded-lg border border-white/10 overflow-hidden flex flex-col h-full shadow-2xl">
      <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50 shadow-[0_0_5px_rgba(244,63,94,0.5)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50 shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
          </div>
          <span className="text-xs font-black tracking-widest text-slate-400 ml-2 uppercase">HYDRA_OS_V0.1.0</span>
        </div>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest mono">Stream: /dev/hydra_0</span>
      </div>
      <div className="p-4 terminal-scroll overflow-y-auto flex-1 mono text-[11px] leading-relaxed space-y-1 bg-black/50">
        {logs.map((log, idx) => (
          <div key={idx} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-slate-600 shrink-0 whitespace-nowrap">[{log.timestamp.toLocaleTimeString()}]</span>
            <span className={`shrink-0 uppercase w-14 ${getLevelColor(log.level)}`}>{log.level}</span>
            <span className="text-slate-500 shrink-0 italic">[{log.module}]</span>
            <span className="text-slate-300 break-all">{log.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
