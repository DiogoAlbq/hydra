
export enum ProxyProtocol {
  HTTP = 'HTTP',
  SOCKS4 = 'SOCKS4',
  SOCKS5 = 'SOCKS5',
  TOR = 'TOR'
}

export enum ProxyStatus {
  FETCHED = 'FETCHED',
  VALIDATED = 'VALIDATED',
  ACTIVE = 'ACTIVE',
  DEGRADED = 'DEGRADED',
  DEAD = 'DEAD',
  BLACKLISTED = 'BLACKLISTED'
}

export type ProxyGroup = 'FAST' | 'STABLE' | 'AGGRESSIVE';

export interface Proxy {
  id: string;
  ip: string;
  port: number;
  protocol: ProxyProtocol;
  status: ProxyStatus;
  latency: number;
  movingAverageLatency: number;
  failureCount: number;
  score: number;
  lastChecked: Date;
  country: string;
  isSticky: boolean;
  isMalicious: boolean;
  group: ProxyGroup;
  blacklistUntil?: Date;
}

export interface HeadStatus {
  protocol: ProxyProtocol;
  active: number;
  total: number;
  lastSync: Date;
  isSyncing: boolean;
  failureRate: number;
  threads: number;
}

export interface LogEntry {
  timestamp: Date;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'CHAOS' | 'DOCTOR';
  message: string;
  module: string;
}

export interface DoctorReport {
  torStatus: 'CONNECTED' | 'DISCONNECTED' | 'RESTARTING';
  dnsLeak: 'SECURE' | 'LEAK_DETECTED';
  configWrite: 'AUTHORIZED' | 'DENIED';
  lastRun: Date;
}
