import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, AppMode, User, Asset, Transaction, Order } from '../types';

interface AppContextType extends AppState {
  setMode: (mode: AppMode) => void;
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  transferAssets: (from: 'hodl' | 'trade', to: 'hodl' | 'trade', asset: string, amount: number) => void;
  addTransaction: (transaction: Transaction) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  setCurrentPair: (pair: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppAction =
  | { type: 'SET_MODE'; payload: AppMode }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'TRANSFER_ASSETS'; payload: { from: 'hodl' | 'trade'; to: 'hodl' | 'trade'; asset: string; amount: number } }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: { orderId: string; updates: Partial<Order> } }
  | { type: 'SET_CURRENT_PAIR'; payload: string }
  | { type: 'UPDATE_ASSET_PRICES'; payload: { hodl: Asset[]; trade: Asset[] } };

const initialState: AppState = {
  mode: 'trade',
  user: null,
  isAuthenticated: true, // Temporarily set to true for testing
  hodlAssets: [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      logo: '₿',
      balance: 0.5432,
      value: 23456.78,
      change24h: 2.34,
      price: 43200.50
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      logo: 'Ξ',
      balance: 12.8765,
      value: 28934.12,
      change24h: -1.23,
      price: 2247.89
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      logo: '$',
      balance: 5000.00,
      value: 5000.00,
      change24h: 0.01,
      price: 1.00
    }
  ],
  tradeAssets: [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      logo: '₿',
      balance: 0.1234,
      value: 5334.78,
      change24h: 2.34,
      price: 43200.50
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      logo: 'Ξ',
      balance: 5.4321,
      value: 12210.45,
      change24h: -1.23,
      price: 2247.89
    },
    {
      symbol: 'USDT',
      name: 'Tether',
      logo: '₮',
      balance: 10000.00,
      value: 10000.00,
      change24h: -0.02,
      price: 1.00
    }
  ],
  currentPair: 'BTC/USDT',
  orders: [],
  transactions: []
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'TRANSFER_ASSETS': {
      const { from, to, asset, amount } = action.payload;
      const fromAssets = from === 'hodl' ? state.hodlAssets : state.tradeAssets;
      const toAssets = to === 'hodl' ? state.hodlAssets : state.tradeAssets;
      
      const fromAssetIndex = fromAssets.findIndex(a => a.symbol === asset);
      const toAssetIndex = toAssets.findIndex(a => a.symbol === asset);
      
      if (fromAssetIndex === -1 || fromAssets[fromAssetIndex].balance < amount) {
        return state;
      }
      
      const newFromAssets = [...fromAssets];
      const newToAssets = [...toAssets];
      
      newFromAssets[fromAssetIndex] = {
        ...newFromAssets[fromAssetIndex],
        balance: newFromAssets[fromAssetIndex].balance - amount,
        value: (newFromAssets[fromAssetIndex].balance - amount) * newFromAssets[fromAssetIndex].price
      };
      
      if (toAssetIndex === -1) {
        newToAssets.push({
          ...fromAssets[fromAssetIndex],
          balance: amount,
          value: amount * fromAssets[fromAssetIndex].price
        });
      } else {
        newToAssets[toAssetIndex] = {
          ...newToAssets[toAssetIndex],
          balance: newToAssets[toAssetIndex].balance + amount,
          value: (newToAssets[toAssetIndex].balance + amount) * newToAssets[toAssetIndex].price
        };
      }
      
      return {
        ...state,
        hodlAssets: from === 'hodl' ? newFromAssets : to === 'hodl' ? newToAssets : state.hodlAssets,
        tradeAssets: from === 'trade' ? newFromAssets : to === 'trade' ? newToAssets : state.tradeAssets
      };
    }
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, ...action.payload.updates }
            : order
        )
      };
    case 'SET_CURRENT_PAIR':
      return { ...state, currentPair: action.payload };
    case 'UPDATE_ASSET_PRICES':
      return {
        ...state,
        hodlAssets: action.payload.hodl,
        tradeAssets: action.payload.trade
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const updatePrices = (assets: Asset[]) =>
        assets.map(asset => {
          const priceChange = (Math.random() - 0.5) * 0.02; // ±1% random change
          const newPrice = asset.price * (1 + priceChange);
          return {
            ...asset,
            price: newPrice,
            value: asset.balance * newPrice,
            change24h: asset.change24h + priceChange * 100
          };
        });

      dispatch({
        type: 'UPDATE_ASSET_PRICES',
        payload: {
          hodl: updatePrices(state.hodlAssets),
          trade: updatePrices(state.tradeAssets)
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [state.hodlAssets, state.tradeAssets]);

  const contextValue: AppContextType = {
    ...state,
    setMode: (mode: AppMode) => dispatch({ type: 'SET_MODE', payload: mode }),
    setUser: (user: User | null) => dispatch({ type: 'SET_USER', payload: user }),
    setAuthenticated: (authenticated: boolean) => dispatch({ type: 'SET_AUTHENTICATED', payload: authenticated }),
    transferAssets: (from: 'hodl' | 'trade', to: 'hodl' | 'trade', asset: string, amount: number) =>
      dispatch({ type: 'TRANSFER_ASSETS', payload: { from, to, asset, amount } }),
    addTransaction: (transaction: Transaction) => dispatch({ type: 'ADD_TRANSACTION', payload: transaction }),
    addOrder: (order: Order) => dispatch({ type: 'ADD_ORDER', payload: order }),
    updateOrder: (orderId: string, updates: Partial<Order>) =>
      dispatch({ type: 'UPDATE_ORDER', payload: { orderId, updates } }),
    setCurrentPair: (pair: string) => dispatch({ type: 'SET_CURRENT_PAIR', payload: pair })
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}