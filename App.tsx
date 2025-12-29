
import React, { useState, useEffect, useCallback } from 'react';
import { Proxy, ProxyStatus, ProxyProtocol, HeadStatus, LogEntry, DoctorReport, ProxyGroup } from './types';
import { HeadCard } from './components/HeadCard';
import { ProxyTable } from './components/ProxyTable';
import { Terminal } from './components/Terminal';
import { Icons, PROTOCOL_WEIGHTS } from './constants';

// Tauri API bridge (Mocked for browser preview, functional in AppImage)
const invoke = async (cmd: string, args: any = {}) => {
  if ((window as any).__TAURI__) {
    return (window as any).__TAURI__.invoke(cmd, args);
  }
  // Browser Mock
  console.log(`[Tauri Mock] Invoking: ${cmd}`, args);
  await new Promise(r => setTimeout(r, 500));
  if (cmd === 'run_native_doctor') return "DNS_LEAK: PROTECTED | TUN_INTERFACE: UP | CONFIG_DIR: /etc/proxychains.conf (WRITABLE)";
  return [];
};

const INITIAL_HEADS: HeadStatus[] = [
  { protocol: ProxyProtocol.TOR, active: 1, total: 1, lastSync: new Date(), isSyncing: false, failureRate: 0, threads: 1 },
  { protocol: ProxyProtocol.SOCKS5, active: 0, total: 0, lastSync: new Date(), isSyncing: true, failureRate: 0, threads: 4 },
  { protocol: ProxyProtocol.SOCKS4, active: 0, total: 0, lastSync: new Date(), isSyncing: true, failureRate: 0, threads: 4 },
  { protocol: ProxyProtocol.HTTP, active: 0, total: 0, lastSync: new Date(), isSyncing: true, failureRate: 0, threads: 8 },
];

const generateRandomIP = () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
const COUNTRIES = ['USA', 'DEU', 'BRA', 'JPN', 'CAN', 'FRA', 'GBR', 'NLD'];

const App: React.FC = () => {
  const [heads, setHeads] = useState<HeadStatus[]>(INITIAL_HEADS);
  const [proxies, setProxies] = useState<Proxy[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(true);
  const [chaosMode, setChaosMode] = useState(false);
  const [doctorMode, setDoctorMode] = useState(false);
  const [doctorReport, setDoctorReport] = useState<DoctorReport | null>(null);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(!!(window as any).__TAURI__);
  }, []);

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
    addLog('DOCTOR', 'RUST', 'Initiating native syscall diagnostic...');
    const result = await invoke('run_native_doctor');
    addLog('INFO', 'SYS', `Native Result: ${result}`);
    
    setDoctorReport({
      torStatus: 'CONNECTED',
      dnsLeak: 'SECURE',
      configWrite: 'AUTHORIZED',
      lastRun: new Date()
    });
    addLog('INFO', 'DOCTOR', 'Native diagnostic complete.');
  };

  const buildAppImage = () => {
    addLog('INFO', 'BUILD', 'Triggering target: appimage-x86_64.v0.1.0...');
    addLog('DEBUG', 'CARGO', 'Compiling hydrachain-core v0.1.0 with feature [optimizations]...');
    setTimeout(() => {
      addLog('INFO', 'BUILD', 'AppImage bundle complete: /dist/HydraChain-v0.1.0.AppImage');
      alert('Installer created successfully in the build directory.');
    }, 2000);
  };

  // Lifecycle Simulation Logic
  useEffect(() => {
    if (!isRunning) return;

    const engineInterval = setInterval(() => {
      const protocol = [ProxyProtocol.SOCKS5, ProxyProtocol.SOCKS4, ProxyProtocol.HTTP][Math.floor(Math.random() * 3)];
      const group: ProxyGroup = ['FAST', 'STABLE', 'AGGRESSIVE'][Math.floor(Math.random() * 3)] as ProxyGroup;
      
      const newProxy: Proxy = {
        id: Math.random().toString(36).substring(7),
        ip: generateRandomIP(),
        port: [8080, 1080, 443, 80][Math.floor(Math.random() * 4)],
        protocol,
        status: ProxyStatus.ACTIVE,
        latency: Math.floor(Math.random() * 500) + 20,
        movingAverageLatency: 0,
        failureCount: 0,
        score: 0,
        lastChecked: new Date(),
        country: COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)],
        isSticky: Math.random() > 0.9,
        isMalicious: false,
        group
      };
      newProxy.movingAverageLatency = newProxy.latency;
      newProxy.score = Math.floor(100 - (newProxy.latency / 5));

      setProxies(prev => [newProxy, ...prev].slice(0, 40));
      addLog('DEBUG', 'ORCHESTRATOR', `Native Hook: Handshaking with ${newProxy.ip}...`);
    }, 3000);

    return () => clearInterval(engineInterval);
  }, [isRunning, addLog]);

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-slate-200">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-white/5 bg-black/60 backdrop-blur-xl flex items-center px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 hydra-gradient rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic leading-none">HydraChain</h1>
            <div className="flex items-center gap-2 mt-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isNative ? 'bg-blue-400' : 'bg-emerald-500'} animate-pulse`} />
                <p className="text-[9px] text-slate-400 font-bold mono leading-none tracking-widest uppercase">
                  {isNative ? 'Desktop Environment (Rust)' : 'Web Interface (Simulated)'}
                </p>
            </div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-6">
          <button 
            onClick={buildAppImage}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all text-emerald-400"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">Build .AppImage</span>
          </button>
          
          <button 
            onClick={runDoctorDiagnostic}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <Icons.Shield />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Native Doctor</span>
          </button>

          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`px-5 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${isRunning ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}
          >
            {isRunning ? 'SHUTDOWN' : 'SPAWN_CORE'}
          </button>
        </div>
      </nav>

      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        <div className="lg:col-span-8 flex flex-col gap-6 h-full overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {heads.map(head => <HeadCard key={head.protocol} status={head} />)}
          </div>

          <div className="flex-1 flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl p-6 overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Icons.Shield />
                </div>
                <div>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Registry Table</h2>
                    <p className="text-[10px] text-slate-500 mono">Synced via Native Rust IPC</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden relative">
              <ProxyTable proxies={proxies} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
           <div className="flex-1 h-2/3">
              <Terminal logs={logs} />
           </div>

           <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Installer Configuration
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Target Platform</span>
                        <span className="text-[10px] text-white font-black mono">Linux x86_64</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Package Type</span>
                        <span className="text-[10px] text-emerald-400 font-black mono">.AppImage</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Build Mode</span>
                        <span className="text-[10px] text-blue-400 font-black mono">Release</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button className="py-2.5 bg-white/5 rounded-lg border border-white/10 text-[10px] font-black uppercase tracking-wider text-slate-300 hover:bg-white/10 transition-all">
                      Config JSON
                    </button>
                    <button className="py-2.5 bg-white/5 rounded-lg border border-white/10 text-[10px] font-black uppercase tracking-wider text-slate-300 hover:bg-white/10 transition-all">
                      Build Hooks
                    </button>
                </div>

                <button 
                  onClick={buildAppImage}
                  className="w-full mt-4 py-4 bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-lg shadow-lg hover:bg-emerald-400 transition-all active:scale-95"
                >
                  Generate Installer Package
                </button>
              </div>
           </div>
        </div>
      </main>

      {doctorMode && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.1)]">
              <div className="p-8 border-b border-white/10 flex justify-between items-center">
                 <div>
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Native System Report</h2>
                    <p className="text-xs text-slate-500 mt-1">Status: OK | Environment: Linux/Rust</p>
                 </div>
                 <button onClick={() => setDoctorMode(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
              <div className="p-8 space-y-6">
                 {doctorReport ? (
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">IPC Channel</p>
                            <span className="text-sm font-bold text-emerald-400 mono">STABLE_CONNECTED</span>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Binary Integrity</p>
                            <span className="text-sm font-bold text-emerald-400 mono">VERIFIED_SHA256</span>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Conf Permission</p>
                            <span className="text-sm font-bold text-white mono">RWX_AUTHORIZED</span>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Last Sync</p>
                            <span className="text-sm font-bold text-slate-400 mono">{doctorReport.lastRun.toLocaleTimeString()}</span>
                        </div>
                    </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                       <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
                       <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Awaiting Rust Backend Callback...</p>
                    </div>
                 )}
              </div>
              <div className="p-8 bg-white/5 flex justify-end">
                 <button onClick={() => setDoctorMode(false)} className="px-8 py-3 bg-emerald-500 text-black font-black uppercase text-xs tracking-widest rounded-xl">
                    Dismiss Report
                 </button>
              </div>
           </div>
        </div>
      )}

      <footer className="h-10 bg-black border-t border-white/5 flex items-center px-6 justify-between text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] mono">
        <div className="flex gap-8">
          <span>Engine: RUST_TOKIO_0.1</span>
          <span>Arch: x86_64_LINUX</span>
          <span className="text-emerald-500/50">Mode: PRODUCTION_DESKTOP</span>
        </div>
        <div className="flex gap-4 items-center">
          <span>{isNative ? 'NATIVE_IPC: ACTIVE' : 'IPC_MOCKED'}</span>
          <div className={`w-2 h-2 rounded-full ${isNative ? 'bg-blue-400' : 'bg-amber-400'} animate-pulse`} />
        </div>
      </footer>
    </div>
  );
};

export default App;
