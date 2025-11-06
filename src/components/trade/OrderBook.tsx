import { useState, useEffect } from 'react';
import { OrderBookEntry } from '../../types';

export function OrderBook() {
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [spread, setSpread] = useState(0);

  // Generate realistic order book data
  useEffect(() => {
    const generateOrderBook = () => {
      const basePrice = 43200;
      const newBids: OrderBookEntry[] = [];
      const newAsks: OrderBookEntry[] = [];
      
      // Generate bids (buy orders) - prices below current price
      for (let i = 0; i < 15; i++) {
        const price = basePrice - (i + 1) * (Math.random() * 5 + 1);
        const amount = Math.random() * 10 + 0.1;
        const total = price * amount;
        newBids.push({ price, amount, total });
      }
      
      // Generate asks (sell orders) - prices above current price
      for (let i = 0; i < 15; i++) {
        const price = basePrice + (i + 1) * (Math.random() * 5 + 1);
        const amount = Math.random() * 10 + 0.1;
        const total = price * amount;
        newAsks.push({ price, amount, total });
      }
      
      setBids(newBids);
      setAsks(newAsks.reverse()); // Reverse asks to show highest price first
      setSpread(newAsks[newAsks.length - 1]?.price - newBids[0]?.price || 0);
    };

    generateOrderBook();
    
    // Update order book every 500ms for high-frequency simulation
    const interval = setInterval(() => {
      generateOrderBook();
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const maxTotal = Math.max(
    ...bids.map(b => b.total),
    ...asks.map(a => a.total)
  );

  return (
    <div className="bg-gray-800 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-white font-semibold mb-2">Order Book</h3>
        <div className="grid grid-cols-3 text-xs text-gray-400">
          <div>Price (USDT)</div>
          <div className="text-right">Amount (BTC)</div>
          <div className="text-right">Total</div>
        </div>
      </div>

      {/* Order Book Content */}
      <div className="flex-1 overflow-hidden">
        {/* Asks (Sell Orders) */}
        <div className="h-1/2 overflow-y-auto">
          <div className="space-y-0.5 p-2">
            {asks.map((ask, index) => (
              <div
                key={`ask-${index}`}
                className="relative grid grid-cols-3 text-xs py-0.5 hover:bg-gray-700/50 transition-colors"
              >
                {/* Background bar */}
                <div
                  className="absolute inset-y-0 right-0 bg-red-500/10"
                  style={{ width: `${(ask.total / maxTotal) * 100}%` }}
                />
                
                <div className="text-red-400 font-mono relative z-10">
                  {ask.price.toFixed(2)}
                </div>
                <div className="text-white text-right font-mono relative z-10">
                  {ask.amount.toFixed(4)}
                </div>
                <div className="text-gray-400 text-right font-mono relative z-10">
                  {ask.total.toFixed(0)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spread */}
        <div className="bg-gray-700 px-4 py-2 border-y border-gray-600">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Spread</span>
            <span className="text-white font-mono">
              {spread.toFixed(2)} ({((spread / bids[0]?.price) * 100).toFixed(3)}%)
            </span>
          </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="h-1/2 overflow-y-auto">
          <div className="space-y-0.5 p-2">
            {bids.map((bid, index) => (
              <div
                key={`bid-${index}`}
                className="relative grid grid-cols-3 text-xs py-0.5 hover:bg-gray-700/50 transition-colors"
              >
                {/* Background bar */}
                <div
                  className="absolute inset-y-0 right-0 bg-green-500/10"
                  style={{ width: `${(bid.total / maxTotal) * 100}%` }}
                />
                
                <div className="text-green-400 font-mono relative z-10">
                  {bid.price.toFixed(2)}
                </div>
                <div className="text-white text-right font-mono relative z-10">
                  {bid.amount.toFixed(4)}
                </div>
                <div className="text-gray-400 text-right font-mono relative z-10">
                  {bid.total.toFixed(0)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Stats */}
      <div className="p-4 border-t border-gray-700 bg-gray-800/50">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-gray-400">24h Volume</div>
            <div className="text-white font-mono">1,234.56 BTC</div>
          </div>
          <div>
            <div className="text-gray-400">Market Depth</div>
            <div className="text-white font-mono">±2% $2.1M</div>
          </div>
        </div>
      </div>
    </div>
  );
}