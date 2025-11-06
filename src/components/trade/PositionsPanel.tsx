import { TrendingUp, TrendingDown, X } from 'lucide-react';
import { useState } from 'react';

interface Position {
  id: string;
  pair: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  leverage: number;
}

export function PositionsPanel() {
  const [positions] = useState<Position[]>([
    {
      id: '1',
      pair: 'BTC/USDT',
      side: 'long',
      size: 0.5,
      entryPrice: 43250,
      currentPrice: 43876,
      pnl: 313,
      pnlPercent: 1.45,
      leverage: 10
    },
    {
      id: '2',
      pair: 'ETH/USDT',
      side: 'short',
      size: 5,
      entryPrice: 3280,
      currentPrice: 3254,
      pnl: 130,
      pnlPercent: 0.79,
      leverage: 5
    }
  ]);

  if (positions.length === 0) {
    return (
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <h3 className="text-white font-semibold mb-2">Open Positions</h3>
        <div className="text-gray-400 text-sm text-center py-4">
          No open positions
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border-t border-gray-700">
      <div className="p-4">
        <h3 className="text-white font-semibold mb-3">Open Positions</h3>

        <div className="space-y-2">
          {positions.map((position) => (
            <div
              key={position.id}
              className="bg-gray-900 rounded-lg p-3 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">{position.pair}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      position.side === 'long'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {position.side.toUpperCase()} {position.leverage}x
                  </span>
                </div>

                <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 text-sm">
                <div>
                  <div className="text-gray-400 text-xs mb-1">Size</div>
                  <div className="text-white font-medium">{position.size}</div>
                </div>

                <div>
                  <div className="text-gray-400 text-xs mb-1">Entry</div>
                  <div className="text-white font-medium">
                    ${position.entryPrice.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="text-gray-400 text-xs mb-1">Current</div>
                  <div className="text-white font-medium">
                    ${position.currentPrice.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="text-gray-400 text-xs mb-1">PnL</div>
                  <div
                    className={`font-medium flex items-center gap-1 ${
                      position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {position.pnl >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>
                      ${Math.abs(position.pnl).toFixed(2)} ({position.pnl >= 0 ? '+' : '-'}
                      {Math.abs(position.pnlPercent)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
