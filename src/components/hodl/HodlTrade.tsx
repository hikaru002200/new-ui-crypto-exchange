import { TrendingUp, Search } from 'lucide-react';
import { useState } from 'react';

export function HodlTrade() {
  const [searchQuery, setSearchQuery] = useState('');

  const cryptos = [
    { symbol: 'BTC', name: 'Bitcoin', price: 44876.23, change: 2.34, logo: '₿' },
    { symbol: 'ETH', name: 'Ethereum', price: 3254.12, change: -1.23, logo: 'Ξ' },
    { symbol: 'BNB', name: 'Binance Coin', price: 423.45, change: 3.21, logo: 'B' },
    { symbol: 'SOL', name: 'Solana', price: 98.76, change: 5.67, logo: 'S' },
    { symbol: 'ADA', name: 'Cardano', price: 0.54, change: -0.89, logo: 'A' },
  ];

  const filteredCryptos = cryptos.filter(crypto =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Buy & Sell</h1>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Crypto List */}
        <div className="space-y-3">
          {filteredCryptos.map((crypto) => (
            <div
              key={crypto.symbol}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg font-bold text-blue-600">
                    {crypto.logo}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{crypto.symbol}</div>
                    <div className="text-sm text-gray-500">{crypto.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    ${crypto.price.toLocaleString()}
                  </div>
                  <div className={`text-sm font-medium ${
                    crypto.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Buy
                </button>
                <button className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                  Sell
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
