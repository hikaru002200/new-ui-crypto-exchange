import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Minus, Zap, Target, TrendingUp } from 'lucide-react';

export function OrderPanel() {
  const { addOrder, tradeAssets } = useApp();
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop-limit'>('limit');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('43200.50');
  const [stopPrice, setStopPrice] = useState('');
  const [leverage, setLeverage] = useState(1);

  const usdtBalance = tradeAssets.find(asset => asset.symbol === 'USDT')?.balance || 0;
  const btcBalance = tradeAssets.find(asset => asset.symbol === 'BTC')?.balance || 0;

  const handleSubmitOrder = () => {
    if (!amount || (orderType !== 'market' && !price)) return;

    const order = {
      id: Date.now().toString(),
      pair: 'BTC/USDT',
      type: orderType,
      side,
      amount: parseFloat(amount),
      price: orderType === 'market' ? undefined : parseFloat(price),
      filled: 0,
      status: 'open' as const,
      timestamp: new Date().toISOString()
    };

    addOrder(order);
    
    // Reset form
    setAmount('');
    if (orderType === 'market') {
      setPrice('43200.50');
    }
  };

  const orderTypes = [
    { id: 'market', label: 'Market', icon: Zap },
    { id: 'limit', label: 'Limit', icon: Target },
    { id: 'stop-limit', label: 'Stop Limit', icon: TrendingUp }
  ];

  const leverageOptions = [1, 2, 5, 10, 20, 50, 100];

  return (
    <div className="bg-gray-800 p-4">
      {/* Order Type Selector */}
      <div className="flex bg-gray-700 rounded-lg p-1 mb-4">
        {orderTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setOrderType(type.id as 'market' | 'limit' | 'stop-limit')}
              className={`flex-1 flex items-center justify-center space-x-1 py-2 rounded text-sm transition-colors ${
                orderType === type.id
                  ? 'bg-green-500/20 text-green-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Buy/Sell Toggle */}
      <div className="flex bg-gray-700 rounded-lg p-1 mb-4">
        <button
          onClick={() => setSide('buy')}
          className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
            side === 'buy'
              ? 'bg-green-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide('sell')}
          className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
            side === 'sell'
              ? 'bg-red-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Sell
        </button>
      </div>

      {/* Leverage Selector */}
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">Leverage</label>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLeverage(Math.max(1, leverage - 1))}
            className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-gray-400 hover:text-white"
          >
            <Minus className="w-4 h-4" />
          </button>
          <select
            value={leverage}
            onChange={(e) => setLeverage(parseInt(e.target.value))}
            className="flex-1 bg-gray-700 text-white rounded px-3 py-2 text-sm"
          >
            {leverageOptions.map(lev => (
              <option key={lev} value={lev}>{lev}x</option>
            ))}
          </select>
          <button
            onClick={() => setLeverage(Math.min(100, leverage + 1))}
            className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-gray-400 hover:text-white"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Price Input */}
      {orderType !== 'market' && (
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">
            {orderType === 'stop-limit' ? 'Limit Price' : 'Price'} (USDT)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
            placeholder="0.00"
            step="0.01"
          />
        </div>
      )}

      {/* Stop Price Input */}
      {orderType === 'stop-limit' && (
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Stop Price (USDT)</label>
          <input
            type="number"
            value={stopPrice}
            onChange={(e) => setStopPrice(e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
            placeholder="0.00"
            step="0.01"
          />
        </div>
      )}

      {/* Amount Input */}
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">Amount (BTC)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
          placeholder="0.00000000"
          step="0.00000001"
        />
        
        {/* Quick Amount Buttons */}
        <div className="flex space-x-1 mt-2">
          {['25%', '50%', '75%', '100%'].map((percent) => (
            <button
              key={percent}
              onClick={() => {
                const maxAmount = side === 'buy' 
                  ? usdtBalance / parseFloat(price || '43200')
                  : btcBalance;
                const percentage = parseInt(percent) / 100;
                setAmount((maxAmount * percentage).toFixed(8));
              }}
              className="flex-1 py-1 bg-gray-700 text-gray-400 rounded text-xs hover:bg-gray-600 hover:text-white transition-colors"
            >
              {percent}
            </button>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-700 rounded-lg p-3 mb-4 text-xs">
        <div className="flex justify-between mb-1">
          <span className="text-gray-400">Available:</span>
          <span className="text-white">
            {side === 'buy' 
              ? `${usdtBalance.toFixed(2)} USDT`
              : `${btcBalance.toFixed(8)} BTC`
            }
          </span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-gray-400">Est. Total:</span>
          <span className="text-white">
            {amount && price 
              ? `${(parseFloat(amount) * parseFloat(price)).toFixed(2)} USDT`
              : '0.00 USDT'
            }
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Fee (0.1%):</span>
          <span className="text-white">
            {amount && price 
              ? `${(parseFloat(amount) * parseFloat(price) * 0.001).toFixed(2)} USDT`
              : '0.00 USDT'
            }
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmitOrder}
        disabled={!amount || (orderType !== 'market' && !price)}
        className={`w-full py-3 rounded-lg font-medium transition-colors ${
          side === 'buy'
            ? 'bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-600'
            : 'bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-600'
        } disabled:cursor-not-allowed`}
      >
        {side === 'buy' ? 'Buy' : 'Sell'} BTC
      </button>

      {/* Balance Info */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 mb-2">Wallet Balance</div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">BTC:</span>
            <span className="text-white font-mono">{btcBalance.toFixed(8)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">USDT:</span>
            <span className="text-white font-mono">{usdtBalance.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}