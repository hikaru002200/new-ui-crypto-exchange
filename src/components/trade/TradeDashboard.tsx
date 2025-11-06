import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { TradingViewChart } from './TradingViewChart';
import TradingViewAdvancedChart from './TradingViewAdvancedChart';
import { OrderBook } from './OrderBook';
import { OrderPanel } from './OrderPanel';
import { Activity, TrendingUp, Volume2, Clock } from 'lucide-react';

export function TradeDashboard() {
  const { currentPair, tradeAssets, setCurrentPair } = useApp();
  const [selectedTab, setSelectedTab] = useState('spot');
  const [selectedPair, setSelectedPair] = useState(currentPair);
  const [useAdvancedChart, setUseAdvancedChart] = useState(true); // TradingView Advanced Chart を使用

  // Mock market data
  const marketData = {
    price: 43247.82,
    change24h: 2.34,
    high24h: 44123.45,
    low24h: 42156.78,
    volume24h: 1234567890
  };

  const tabs = [
    { id: 'spot', label: 'Spot', icon: Activity },
    { id: 'futures', label: 'Futures', icon: TrendingUp },
    { id: 'options', label: 'Options', icon: Volume2 }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Market Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Pair Selector */}
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold text-white">{currentPair}</h2>
              <div className="text-xs text-gray-400">Perpetual</div>
            </div>

            {/* Price Info */}
            <div className="flex items-center space-x-6">
              <div>
                <div className="text-2xl font-bold text-green-400">
                  ${marketData.price.toLocaleString()}
                </div>
                <div className="flex items-center space-x-1 text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>+{marketData.change24h}%</span>
                </div>
              </div>

              <div className="text-sm">
                <div className="text-gray-400">24h High</div>
                <div className="text-white font-medium">
                  ${marketData.high24h.toLocaleString()}
                </div>
              </div>

              <div className="text-sm">
                <div className="text-gray-400">24h Low</div>
                <div className="text-white font-medium">
                  ${marketData.low24h.toLocaleString()}
                </div>
              </div>

              <div className="text-sm">
                <div className="text-gray-400">24h Volume</div>
                <div className="text-white font-medium">
                  ${(marketData.volume24h / 1000000).toFixed(1)}M
                </div>
              </div>
            </div>
          </div>

          {/* Performance Indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-mono text-gray-400">37M o/s</span>
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">0.1ms</span>
          </div>
        </div>

        {/* Trading Tabs */}
        <div className="flex space-x-1 mt-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trading Interface */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Chart Section */}
        <div className="flex-1 flex flex-col bg-gray-900">
          {useAdvancedChart ? (
            <div className="flex-1 p-4">
              <TradingViewAdvancedChart pair={selectedPair} theme="dark" />
            </div>
          ) : (
            <TradingViewChart
              pair={selectedPair}
              onPairChange={(pair) => {
                setSelectedPair(pair);
                setCurrentPair(pair);
              }}
            />
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-[640px] border-l border-gray-700 flex">
          {/* Order Book */}
          <div className="w-80 flex-shrink-0">
            <OrderBook />
          </div>

          {/* Order Panel */}
          <div className="w-80 border-l border-gray-700 flex-shrink-0">
            <OrderPanel />
          </div>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-sm">
              <span className="text-gray-400">Balance: </span>
              <span className="text-white font-medium">
                ${tradeAssets.reduce((sum, asset) => sum + asset.value, 0).toLocaleString()}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">P&L: </span>
              <span className="text-green-400 font-medium">+$1,234.56</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Margin: </span>
              <span className="text-white font-medium">125.4%</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
            <span>Connected to Swiss Exchange</span>
          </div>
        </div>
      </div>
    </div>
  );
}