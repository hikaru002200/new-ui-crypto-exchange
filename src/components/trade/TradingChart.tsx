import { useState, useEffect } from 'react';
import { ChartData } from '../../types';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
import { PositionsPanel } from './PositionsPanel';

export function TradingChart() {
  const [timeframe, setTimeframe] = useState('1H');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');

  const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D', '1W'];

  // Generate realistic candlestick data
  useEffect(() => {
    const generateData = () => {
      const data: ChartData[] = [];
      let basePrice = 43200;
      const intervals = timeframe === '1m' ? 100 : timeframe === '5m' ? 200 : 300;
      
      for (let i = 0; i < intervals; i++) {
        const timestamp = Date.now() - (intervals - i) * 60000;
        const volatility = 0.002; // 0.2% volatility
        
        const change = (Math.random() - 0.5) * volatility;
        const open = basePrice;
        const close = open * (1 + change);
        const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
        const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);
        const volume = Math.random() * 1000000;
        
        data.push({
          timestamp,
          open,
          high,
          low,
          close,
          volume
        });
        
        basePrice = close;
      }
      
      return data;
    };

    setChartData(generateData());
    
    // Update data every 2 seconds for real-time effect
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev];
        const lastCandle = newData[newData.length - 1];
        const change = (Math.random() - 0.5) * 0.001;
        
        // Update the last candle
        newData[newData.length - 1] = {
          ...lastCandle,
          close: lastCandle.close * (1 + change),
          high: Math.max(lastCandle.high, lastCandle.close * (1 + change)),
          low: Math.min(lastCandle.low, lastCandle.close * (1 + change)),
          volume: lastCandle.volume + Math.random() * 10000
        };
        
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [timeframe]);

  const renderCandlestick = (candle: ChartData, index: number, minPrice: number, maxPrice: number) => {
    const width = 800;
    const height = 400;
    const padding = 40;
    
    const x = padding + (index / (chartData.length - 1)) * (width - 2 * padding);
    const candleWidth = Math.max(2, (width - 2 * padding) / chartData.length * 0.8);
    
    const priceRange = maxPrice - minPrice;
    const openY = height - padding - ((candle.open - minPrice) / priceRange) * (height - 2 * padding);
    const closeY = height - padding - ((candle.close - minPrice) / priceRange) * (height - 2 * padding);
    const highY = height - padding - ((candle.high - minPrice) / priceRange) * (height - 2 * padding);
    const lowY = height - padding - ((candle.low - minPrice) / priceRange) * (height - 2 * padding);
    
    const isGreen = candle.close > candle.open;
    const bodyTop = Math.min(openY, closeY);
    const bodyHeight = Math.abs(closeY - openY);
    
    return (
      <g key={index}>
        {/* Wick */}
        <line
          x1={x}
          y1={highY}
          x2={x}
          y2={lowY}
          stroke={isGreen ? '#10b981' : '#ef4444'}
          strokeWidth="1"
        />
        {/* Body */}
        <rect
          x={x - candleWidth / 2}
          y={bodyTop}
          width={candleWidth}
          height={Math.max(1, bodyHeight)}
          fill={isGreen ? '#10b981' : '#ef4444'}
          stroke={isGreen ? '#10b981' : '#ef4444'}
        />
      </g>
    );
  };

  const renderLine = () => {
    if (chartData.length === 0) return null;
    
    const width = 800;
    const height = 400;
    const padding = 40;
    
    const minPrice = Math.min(...chartData.map(d => d.low));
    const maxPrice = Math.max(...chartData.map(d => d.high));
    const priceRange = maxPrice - minPrice;
    
    const points = chartData.map((candle, index) => {
      const x = padding + (index / (chartData.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((candle.close - minPrice) / priceRange) * (height - 2 * padding);
      return `${x},${y}`;
    });
    
    return (
      <path
        d={`M ${points.join(' L ')}`}
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  };

  if (chartData.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-gray-400">Loading chart data...</div>
      </div>
    );
  }

  const minPrice = Math.min(...chartData.map(d => d.low));
  const maxPrice = Math.max(...chartData.map(d => d.high));
  const currentPrice = chartData[chartData.length - 1]?.close || 0;
  const priceChange = chartData.length > 1 ? 
    ((currentPrice - chartData[0].close) / chartData[0].close) * 100 : 0;

  return (
    <div className="flex-1 bg-gray-900 flex flex-col overflow-hidden">
      <div className="p-4">
      {/* Chart Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          {/* Chart Type */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setChartType('candlestick')}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-sm ${
                chartType === 'candlestick'
                  ? 'bg-green-500/20 text-green-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Candles</span>
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-sm ${
                chartType === 'line'
                  ? 'bg-green-500/20 text-green-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Line</span>
            </button>
          </div>

          {/* Timeframes */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  timeframe === tf
                    ? 'bg-green-500/20 text-green-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Price Info */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              ${currentPrice.toFixed(2)}
            </div>
            <div className={`flex items-center space-x-1 ${
              priceChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {priceChange >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 flex flex-col min-h-0 px-4">
        {/* Main Chart */}
        <div className="bg-gray-800 rounded-lg p-4 flex-1 min-h-[300px]">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          {/* Grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="800" height="400" fill="url(#grid)" />
          
          {/* Price levels */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
            const y = 40 + ratio * 320;
            const price = maxPrice - (maxPrice - minPrice) * ratio;
            return (
              <g key={ratio}>
                <line x1="40" y1={y} x2="760" y2={y} stroke="#4b5563" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="765" y={y + 4} fill="#9ca3af" fontSize="12" textAnchor="start">
                  ${price.toFixed(0)}
                </text>
              </g>
            );
          })}
          
          {/* Chart content */}
          {chartType === 'candlestick' 
            ? chartData.map((candle, index) => renderCandlestick(candle, index, minPrice, maxPrice))
            : renderLine()
          }
        </svg>
      </div>

        {/* Volume Chart */}
        <div className="bg-gray-800 rounded-lg p-4 h-20 mt-2">
        <svg viewBox="0 0 800 80" className="w-full h-full">
          {chartData.map((candle, index) => {
            const x = 40 + (index / (chartData.length - 1)) * 720;
            const maxVolume = Math.max(...chartData.map(d => d.volume));
            const height = (candle.volume / maxVolume) * 60;
            const isGreen = candle.close > candle.open;
            
            return (
              <rect
                key={index}
                x={x - 1}
                y={70 - height}
                width="2"
                height={height}
                fill={isGreen ? '#10b981' : '#ef4444'}
                opacity="0.7"
              />
            );
          })}
        </svg>
      </div>
      </div>
      
      {/* Positions Panel - Now directly below chart */}
      <div className="flex-shrink-0">
        <PositionsPanel />
      </div>
    </div>
  );
}