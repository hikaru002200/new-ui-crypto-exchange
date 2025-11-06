import { useApp } from '../../contexts/AppContext';
import { AssetChart } from './AssetChart';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Wallet, Plus, Minus } from 'lucide-react';

export function HodlDashboard() {
  const { hodlAssets } = useApp();

  const totalValue = hodlAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalChange = hodlAssets.reduce((sum, asset) => sum + (asset.value * asset.change24h / 100), 0);
  const changePercent = (totalChange / totalValue) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Portfolio Overview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <div className="text-center mb-8">
          <h2 className="text-sm font-medium text-gray-600 mb-2">Total Portfolio Value</h2>
          <div className="text-5xl font-bold text-gray-900 mb-4">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`flex items-center justify-center space-x-2 ${
            changePercent >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {changePercent >= 0 ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
            <span className="text-lg font-semibold">
              {changePercent >= 0 ? '+' : ''}
              {changePercent.toFixed(2)}% (24h)
            </span>
          </div>
        </div>

        {/* Asset Chart */}
        <AssetChart />
      </div>

      {/* Holdings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Your Holdings</h3>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Buy</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Minus className="w-4 h-4" />
              <span>Sell</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {hodlAssets.map((asset) => (
            <div key={asset.symbol} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {asset.logo}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{asset.name}</h4>
                  <p className="text-sm text-gray-600">{asset.symbol}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {asset.balance.toFixed(6)} {asset.symbol}
                </div>
                <div className="text-sm text-gray-600">
                  ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className={`flex items-center space-x-1 ${
                asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {asset.change24h >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span className="font-medium">
                  {asset.change24h >= 0 ? '+' : ''}
                  {asset.change24h.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Deposit</h4>
          </div>
          <p className="text-sm text-gray-600">Add funds to your HODL wallet</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Transfer</h4>
          </div>
          <p className="text-sm text-gray-600">Move funds to Trade wallet</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Auto-Invest</h4>
          </div>
          <p className="text-sm text-gray-600">Set up recurring purchases</p>
        </div>
      </div>
    </div>
  );
}