
import React from 'react';
import { Proxy, ProxyStatus, ProxyProtocol } from '../types';

interface ProxyTableProps {
  proxies: Proxy[];
}

const getStatusColor = (status: ProxyStatus) => {
  switch (status) {
    case ProxyStatus.ACTIVE: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case ProxyStatus.DEGRADED: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case ProxyStatus.DEAD: return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    case ProxyStatus.BLACKLISTED: return 'bg-slate-800 text-slate-500 border-white/5';
    default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

const getProtocolBadge = (protocol: ProxyProtocol) => {
  switch (protocol) {
    case ProxyProtocol.SOCKS5: return 'text-blue-400';
    case ProxyProtocol.SOCKS4: return 'text-purple-400';
    case ProxyProtocol.HTTP: return 'text-cyan-400';
    case ProxyProtocol.TOR: return 'text-fuchsia-400';
    default: return 'text-gray-400';
  }
};

const getGroupBadge = (group: string) => {
  switch (group) {
    case 'FAST': return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
    case 'STABLE': return 'text-blue-500 border-blue-500/20 bg-blue-500/5';
    case 'AGGRESSIVE': return 'text-rose-500 border-rose-500/20 bg-rose-500/5';
    default: return 'text-slate-500';
  }
};

export const ProxyTable: React.FC<ProxyTableProps> = ({ proxies }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/5 bg-white/5">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <th className="px-4 py-3 border-b border-white/5">Endpoint</th>
            <th className="px-4 py-3 border-b border-white/5">Protocol</th>
            <th className="px-4 py-3 border-b border-white/5">Group</th>
            <th className="px-4 py-3 border-b border-white/5">Latency (Avg)</th>
            <th className="px-4 py-3 border-b border-white/5">Score</th>
            <th className="px-4 py-3 border-b border-white/5">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {proxies.map((proxy) => (
            <tr key={proxy.id} className={`hover:bg-white/5 transition-colors group ${proxy.status === ProxyStatus.BLACKLISTED ? 'opacity-40 grayscale' : ''}`}>
              <td className="px-4 py-3 mono text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  {proxy.isSticky && (
                    <span title="Sticky Proxy" className="text-amber-500">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    </span>
                  )}
                  <span className="group-hover:text-white transition-colors">
                    {proxy.ip.replace(/\d+$/, '***')}:{proxy.port}
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">{proxy.country}</span>
                </div>
              </td>
              <td className={`px-4 py-3 text-xs font-bold ${getProtocolBadge(proxy.protocol)}`}>
                {proxy.protocol}
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getGroupBadge(proxy.group)}`}>
                  {proxy.group}
                </span>
              </td>
              <td className="px-4 py-3 mono text-xs text-slate-400">
                {proxy.latency}ms <span className="text-[10px] text-slate-600">({Math.round(proxy.movingAverageLatency)}ms)</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${proxy.score > 80 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : proxy.score > 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${proxy.score}%` }}
                    />
                  </div>
                  <span className="text-[10px] mono text-slate-400">{proxy.score}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium uppercase ${getStatusColor(proxy.status)}`}>
                  {proxy.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
