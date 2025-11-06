import { Wallet, Eye, EyeOff, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { useState } from 'react';

export function HodlWallet() {
  const [showBalance, setShowBalance] = useState(true);

  const mockAssets = [
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.5234, value: 23456.78, change: 2.34, logo: '₿' },
    { symbol: 'ETH', name: 'Ethereum', balance: 5.4321, value: 9876.54, change: -1.23, logo: 'Ξ' },
    { symbol: 'USDT', name: 'Tether', balance: 10000, value: 10000, change: 0.01, logo: '₮' },
  ];

  const totalValue = mockAssets.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Total Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-100" />
              <span className="text-blue-100 text-sm">Total Balance</span>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              {showBalance ? (
                <Eye className="w-5 h-5 text-blue-100" />
              ) : (
                <EyeOff className="w-5 h-5 text-blue-100" />
              )}
            </button>
          </div>
          <div className="mb-2">
            <div className="text-3xl font-bold text-white">
              {showBalance ? `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '****'}
            </div>
          </div>
          <div className="flex items-center gap-1 text-blue-100 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+5.67% this month</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <Plus className="w-6 h-6 text-blue-600 mb-2" />
            <div className="text-sm font-medium text-gray-900">Deposit</div>
          </button>
          <button className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
            <div className="text-sm font-medium text-gray-900">Buy Crypto</div>
          </button>
        </div>

        {/* Assets List */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Your Assets</h2>
          <div className="space-y-3">
            {mockAssets.map((asset) => (
              <div
                key={asset.symbol}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg font-bold text-blue-600">
                      {asset.logo}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{asset.symbol}</div>
                      <div className="text-sm text-gray-500">{asset.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {showBalance ? `$${asset.value.toLocaleString()}` : '****'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {showBalance ? `${asset.balance} ${asset.symbol}` : '****'}
                    </div>
                    <div className={`text-sm font-medium flex items-center justify-end gap-1 ${
                      asset.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {asset.change >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {Math.abs(asset.change)}%
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
