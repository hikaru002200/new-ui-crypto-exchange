import { Wallet, Eye, EyeOff, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useState } from 'react';

export function TradeWallet() {
  const [showBalance, setShowBalance] = useState(true);

  const mockAssets = [
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.5234, value: 23456.78, available: 0.5234, locked: 0, logo: '₿' },
    { symbol: 'ETH', name: 'Ethereum', balance: 5.4321, value: 9876.54, available: 5.4321, locked: 0, logo: 'Ξ' },
    { symbol: 'USDT', name: 'Tether', balance: 10000, value: 10000, available: 8500, locked: 1500, logo: '₮' },
  ];

  const totalValue = mockAssets.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Total Balance Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 mb-6 shadow-lg border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 text-sm">Total Balance</span>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
            >
              {showBalance ? (
                <Eye className="w-5 h-5 text-gray-400" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
          <div className="mb-2">
            <div className="text-3xl font-bold text-white">
              {showBalance ? `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '****'}
            </div>
          </div>
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+5.67% this month</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:bg-gray-750 transition-all">
            <ArrowDownLeft className="w-6 h-6 text-green-400 mb-2" />
            <div className="text-sm font-medium text-white">Deposit</div>
          </button>
          <button className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:bg-gray-750 transition-all">
            <ArrowUpRight className="w-6 h-6 text-red-400 mb-2" />
            <div className="text-sm font-medium text-white">Withdraw</div>
          </button>
        </div>

        {/* Assets List */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Your Assets</h2>
          <div className="space-y-3">
            {mockAssets.map((asset) => (
              <div
                key={asset.symbol}
                className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:bg-gray-750 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-lg font-bold text-green-400">
                      {asset.logo}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{asset.symbol}</div>
                      <div className="text-sm text-gray-400">{asset.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">
                      {showBalance ? `$${asset.value.toLocaleString()}` : '****'}
                    </div>
                    <div className="text-sm text-gray-400">
                      {showBalance ? `${asset.balance} ${asset.symbol}` : '****'}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-700">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Available</div>
                    <div className="text-sm font-medium text-white">
                      {showBalance ? asset.available.toFixed(4) : '****'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">In Orders</div>
                    <div className="text-sm font-medium text-white">
                      {showBalance ? asset.locked.toFixed(4) : '****'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
