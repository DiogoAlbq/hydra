
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Proxy, ProxyStatus, ProxyProtocol, HeadStatus, LogEntry, DoctorReport, ProxyGroup } from './types';
import { HeadCard } from './components/HeadCard';
import { ProxyTable } from './components/ProxyTable';
import { Terminal } from './components/Terminal';
import { Icons, PROTOCOL_WEIGHTS } from './constants';

const INITIAL_HEADS: HeadStatus[] = [
  { protocol: ProxyProtocol.TOR, active: 1, total: 1, lastSync: new Date(), isSyncing: false, failureRate: 0, threads: 1 },
  { protocol: ProxyProtocol.SOCKS5, active: 0, total: 0, lastSync: new Date(), isSyncing: true, failureRate: 0, threads: 4 },
  { protocol: ProxyProtocol.SOCKS4, active: 0, total: 0, lastSync: new Date(), isSyncing: true, failureRate: 0, threads: 4 },
  { protocol: ProxyProtocol.HTTP, active: 0, total: 0, lastSync: new Date(), isSyncing: true, failureRate: 0, threads: 8 },
];

const generateRandomIP = () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
const COUNTRIES = ['USA', 'DEU', 'BRA', 'JPN', 'CAN', 'FRA', 'GBR', 'NLD'];
const USER_AGENTS = ['Mozilla/5.0', 'Chrome/120.0', 'Safari/605.1', 'Firefox/121.0'];

const App: React.FC = () => {
  const [heads, setHeads] = useState<HeadStatus[]>(INITIAL_HEADS);
  const [proxies, setProxies] = useState<Proxy[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(true);
  const [chaosMode, setChaosMode] = useState(false);
  const [doctorMode, setDoctorMode] = useState(false);
  const [doctorReport, setDoctorReport] = useState<DoctorReport | null>(null);

  const addLog = useCallback((level: LogEntry['level'], module: string, message: string) => {
    setLogs(prev => [...prev.slice(-150), {
      timestamp: new Date(),
      level,
      module,
      message
    }]);
  }, []);

  const runDoctorDiagnostic = async () => {
    setDoctorMode(true);
    addLog('DOCTOR', 'SYS', 'Initiating full diagnostic suite...');
    await new Promise(r => setTimeout(r, 800));
    addLog('DOCTOR', 'TOR', 'Checking Tor circuit status via control port 9051...');
    await new Promise(r => setTimeout(r, 600));
    addLog('DOCTOR', 'NET', 'Testing for DNS Leaks against 8.8.8.8 and 1.1.1.1...');
    await new Promise(r => setTimeout(r, 1000));
    addLog('DOCTOR', 'FS', 'Verifying write permissions for /home/user/.proxychains/proxychains.conf');
    
    setDoctorReport({
      torStatus: 'CONNECTED',
      dnsLeak: 'SECURE',
      configWrite: 'AUTHORIZED',
      lastRun: new Date()
    });
    addLog('INFO', 'DOCTOR', 'Diagnostic complete. System health: 100%');
  };

  // Lifecycle Simulation Logic
  useEffect(() => {
    if (!isRunning) return;

    const engineInterval = setInterval(() => {
      // 1. Discovery Phase
      const protocol = [ProxyProtocol.SOCKS5, ProxyProtocol.SOCKS4, ProxyProtocol.HTTP][Math.floor(Math.random() * 3)];
      const group: ProxyGroup = ['FAST', 'STABLE', 'AGGRESSIVE'][Math.floor(Math.random() * 3)] as ProxyGroup;
      
      const newProxy: Proxy = {
        id: Math.random().toString(36).substring(7),
        ip: generateRandomIP(),
        port: [8080, 1080, 443, 80, 9050, 3128][Math.floor(Math.random() * 6)],
        protocol,
        status: ProxyStatus.VALIDATED,
        latency: Math.floor(Math.random() * 800) + 20,
        movingAverageLatency: 0,
        failureCount: 0,
        score: 0,
        lastChecked: new Date(),
        country: COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)],
        isSticky: Math.random() > 0.9,
        isMalicious: Math.random() > 0.98,
        group
      };
      newProxy.movingAverageLatency = newProxy.latency;

      // 2. Fingerprint Rotation
      const ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
      addLog('DEBUG', 'VALIDATE', `Rotating Fingerprint: Using UA "${ua}" for ${newProxy.ip}`);

      // 3. Validation Logic
      let scoreModifier = PROTOCOL_WEIGHTS[protocol as keyof typeof PROTOCOL_WEIGHTS];
      const latencyScore = Math.max(0, 100 - (newProxy.latency / 8));
      newProxy.score = Math.floor(latencyScore * scoreModifier);

      if (newProxy.isMalicious) {
        newProxy.status = ProxyStatus.BLACKLISTED;
        newProxy.score = 0;
        addLog('ERROR', 'SEC', `Security Alert: Proxy ${newProxy.ip} injected malicious payload. Blacklisting.`);
      } else if (newProxy.score > 35) {
        newProxy.status = ProxyStatus.ACTIVE;
        setProxies(prev => {
            const list = [newProxy, ...prev].slice(0, 40);
            return chaosMode ? [...list].sort(() => Math.random() - 0.5) : list;
        });
        setHeads(prev => prev.map(h => h.protocol === protocol ? { ...h, active: h.active + 1, total: h.total + 1, threads: Math.min(32, h.threads + 1) } : h));
      } else {
        addLog('WARN', 'VALIDATE', `Discarded degraded proxy ${newProxy.ip} (Score: ${newProxy.score})`);
      }

    }, 2500);

    // Dynamic Degradation Simulation
    const degradationInterval = setInterval(() => {
        setProxies(prev => prev.map(p => {
            if (p.status !== ProxyStatus.ACTIVE) return p;
            
            const jitter = Math.floor(Math.random() * 40) - 20;
            const newLatency = Math.max(20, p.latency + jitter);
            const failure = Math.random() > 0.95;
            
            const updated = {
                ...p,
                latency: newLatency,
                movingAverageLatency: (p.movingAverageLatency * 0.7) + (newLatency * 0.3),
                failureCount: failure ? p.failureCount + 1 : p.failureCount,
                score: Math.max(0, p.score - (failure ? 10 : 0))
            };

            if (updated.failureCount > 3) {
                updated.status = ProxyStatus.DEAD;
                addLog('WARN', 'LIFECYCLE', `Proxy ${updated.ip} expired after multiple failures.`);
            }

            return updated;
        }));
    }, 4000);

    return () => {
        clearInterval(engineInterval);
        clearInterval(degradationInterval);
    };
  }, [isRunning, chaosMode, addLog]);

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-slate-200">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-white/5 bg-black/60 backdrop-blur-xl flex items-center px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 hydra-gradient rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic leading-none">HydraChain</h1>
            <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <p className="text-[9px] text-emerald-400 font-bold mono leading-none tracking-widest uppercase">Kernel Node Primary</p>
            </div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-6">
          <div className="flex gap-6 border-r border-white/10 pr-6 mr-6">
             <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Chaos Engine</p>
                <button onClick={() => {
                    setChaosMode(!chaosMode);
                    addLog('CHAOS', 'CORE', `Chaos Mode ${!chaosMode ? 'ENABLED' : 'DISABLED'}. Jitter injection initiated.`);
                }} className={`text-xs font-bold mono underline transition-colors ${chaosMode ? 'text-fuchsia-400' : 'text-slate-400'}`}>
                    {chaosMode ? 'ACTIVE_RANDOM' : 'STABLE_SEQ'}
                </button>
             </div>
             <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Thread Pool</p>
                <p className="text-xs text-white font-bold mono">
                    {heads.reduce((acc, h) => acc + h.threads, 0)} / 128
                </p>
             </div>
          </div>
          <button 
            onClick={runDoctorDiagnostic}
            className="group px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <Icons.Shield />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Run Doctor</span>
          </button>
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`px-5 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${isRunning ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}
          >
            {isRunning ? 'KILL_PROCESS' : 'SPAWN_PROCESS'}
          </button>
        </div>
      </nav>

      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-6 h-full overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {heads.map(head => <HeadCard key={head.protocol} status={head} />)}
          </div>

          <div className="flex-1 flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl p-6 overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Icons.Shield />
                </div>
                <div>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Registry Monitor</h2>
                    <p className="text-[10px] text-slate-500 mono">Active routing table for dynamic chaining</p>
                </div>
              </div>
              <div className="flex gap-3">
                 <div className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 flex flex-col items-end">
                    <span className="text-[8px] text-slate-500 font-bold uppercase">Health Factor</span>
                    <span className="text-xs font-bold text-emerald-500 mono">0.982</span>
                 </div>
                 <div className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 flex flex-col items-end">
                    <span className="text-[8px] text-slate-500 font-bold uppercase">Cycle Time</span>
                    <span className="text-xs font-bold text-blue-500 mono">250ms</span>
                 </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden relative">
              <ProxyTable proxies={proxies} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
           <div className="flex-1 h-2/3">
              <Terminal logs={logs} />
           </div>

           {/* Quick Stats & Controls */}
           <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Icons.Cpu />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Advanced Control Plane
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                        <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Writer Queue</p>
                        <p className="text-sm font-black text-white mono tracking-tighter">0 Pending</p>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                        <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Memory Pressure</p>
                        <p className="text-sm font-black text-amber-500 mono tracking-tighter">4.2%</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-slate-500">Validation Throughput</span>
                        <span className="text-white">42 p/s</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="w-[42%] h-full hydra-gradient" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button className="py-2.5 bg-white/5 rounded-lg border border-white/10 text-[10px] font-black uppercase tracking-wider text-slate-300 hover:bg-white/10 transition-all active:scale-95">
                    Clear Blacklist
                  </button>
                  <button className="py-2.5 bg-white/5 rounded-lg border border-white/10 text-[10px] font-black uppercase tracking-wider text-slate-300 hover:bg-white/10 transition-all active:scale-95">
                    Re-Verify All
                  </button>
                </div>

                <button className="w-full mt-4 py-3 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-lg shadow-[0_10px_20px_rgba(255,255,255,0.05)] hover:bg-emerald-400 hover:text-black transition-all active:translate-y-1">
                    Deploy Current Chain
                </button>
              </div>
           </div>
        </div>
      </main>

      {/* Doctor Report Overlay */}
      {doctorMode && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.1)]">
              <div className="p-8 border-b border-white/10 flex justify-between items-center">
                 <div>
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Doctor Diagnostic Report</h2>
                    <p className="text-xs text-slate-500 mt-1">HydraChain System Integrity Check</p>
                 </div>
                 <button onClick={() => setDoctorMode(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
              <div className="p-8 space-y-6">
                 {doctorReport ? (
                    <>
                       <div className="grid grid-cols-2 gap-6">
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                             <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Tor Fallback Status</p>
                             <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                <span className="text-sm font-bold text-white mono">{doctorReport.torStatus}</span>
                             </div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                             <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">DNS Privacy Leak</p>
                             <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-sm font-bold text-white mono">{doctorReport.dnsLeak}</span>
                             </div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                             <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Conf Write Access</p>
                             <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-sm font-bold text-white mono">{doctorReport.configWrite}</span>
                             </div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                             <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Report Timestamp</p>
                             <span className="text-sm font-bold text-slate-400 mono">{doctorReport.lastRun.toLocaleTimeString()}</span>
                          </div>
                       </div>
                       <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                          <p className="text-sm text-emerald-400 font-medium">No critical leaks or unauthorized access patterns detected. HydraChain is operating within established security parameters.</p>
                       </div>
                    </>
                 ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                       <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
                       <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Running Diagnostic Suite...</p>
                    </div>
                 )}
              </div>
              <div className="p-8 bg-white/5 flex justify-end">
                 <button onClick={() => setDoctorMode(false)} className="px-8 py-3 bg-emerald-500 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-emerald-400 transition-colors">
                    Acknowledge
                 </button>
              </div>
           </div>
        </div>
      )}

      <footer className="h-12 bg-black border-t border-white/5 flex items-center px-6 justify-between text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em] mono bg-black/90">
        <div className="flex gap-8">
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            Sys_Tick: {new Date().toLocaleTimeString()}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            Orchestrator: ACTIVE
          </span>
          <span className="text-emerald-500/50">Runtime: 04:12:33_STABLE</span>
        </div>
        <div className="flex gap-6 items-center">
          <span className="text-slate-500">ProxyChains Sync: OK</span>
          <div className="flex items-center gap-2 text-fuchsia-500/50">
            <span>Entropy Engine: {chaosMode ? 'ENABLED' : 'STRICT'}</span>
            <div className={`w-2 h-2 rounded-full ${chaosMode ? 'bg-fuchsia-500 animate-ping' : 'bg-slate-800'}`} />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
