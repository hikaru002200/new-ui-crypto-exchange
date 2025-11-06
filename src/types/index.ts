export interface User {
  id: string;
  email: string;
  isKycVerified: boolean;
  is2faEnabled: boolean;
  country: string;
  createdAt: string;
}

export interface Asset {
  symbol: string;
  name: string;
  logo: string;
  balance: number;
  value: number;
  change24h: number;
  price: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'buy' | 'sell' | 'transfer';
  asset: string;
  amount: number;
  value: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  from?: string;
  to?: string;
}

export interface Order {
  id: string;
  pair: string;
  type: 'market' | 'limit' | 'stop-limit';
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  filled: number;
  status: 'open' | 'filled' | 'cancelled';
  timestamp: string;
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export interface Trade {
  id: string;
  price: number;
  amount: number;
  side: 'buy' | 'sell';
  timestamp: string;
}

export interface ChartData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type AppMode = 'hodl' | 'trade';

export interface AppState {
  mode: AppMode;
  user: User | null;
  isAuthenticated: boolean;
  hodlAssets: Asset[];
  tradeAssets: Asset[];
  currentPair: string;
  orders: Order[];
  transactions: Transaction[];
}