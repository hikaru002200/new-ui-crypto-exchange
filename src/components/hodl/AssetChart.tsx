import { useState } from 'react';

export function AssetChart() {
  const [timeframe, setTimeframe] = useState('1M');
  
  // Generate sample data for the chart
  const generateChartData = (days: number) => {
    const data = [];
    const baseValue = 50000;
    let currentValue = baseValue;
    
    for (let i = 0; i < days; i++) {
      const change = (Math.random() - 0.5) * 0.05; // ±2.5% daily change
      currentValue *= (1 + change);
      data.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000),
        value: currentValue
      });
    }
    return data;
  };

  const timeframes = {
    '1W': 7,
    '1M': 30,
    '1Y': 365,
    'ALL': 1000
  };

  const chartData = generateChartData(timeframes[timeframe as keyof typeof timeframes]);
  const minValue = Math.min(...chartData.map(d => d.value));
  const maxValue = Math.max(...chartData.map(d => d.value));
  const valueRange = maxValue - minValue;

  // Create SVG path for the chart
  const createPath = () => {
    const width = 800;
    const height = 200;
    const padding = 20;
    
    const points = chartData.map((point, index) => {
      const x = padding + (index / (chartData.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((point.value - minValue) / valueRange) * (height - 2 * padding);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  const createAreaPath = () => {
    const width = 800;
    const height = 200;
    const padding = 20;
    
    const points = chartData.map((point, index) => {
      const x = padding + (index / (chartData.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((point.value - minValue) / valueRange) * (height - 2 * padding);
      return `${x},${y}`;
    });
    
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const lastX = lastPoint.split(',')[0];
    const firstX = firstPoint.split(',')[0];
    
    return `M ${firstX},${height - padding} L ${points.join(' L ')} L ${lastX},${height - padding} Z`;
  };

  const currentValue = chartData[chartData.length - 1]?.value || 0;
  const firstValue = chartData[0]?.value || 0;
  const totalChange = ((currentValue - firstValue) / firstValue) * 100;

  return (
    <div className="w-full">
      {/* Timeframe Selector */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {Object.keys(timeframes).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeframe === tf
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg
          viewBox="0 0 800 200"
          className="w-full h-48 overflow-visible"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="80" height="40" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="800" height="200" fill="url(#grid)" />
          
          {/* Area fill */}
          <path
            d={createAreaPath()}
            fill="url(#gradient)"
            opacity="0.3"
          />
          
          {/* Line */}
          <path
            d={createPath()}
            fill="none"
            stroke={totalChange >= 0 ? '#10b981' : '#ef4444'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={totalChange >= 0 ? '#10b981' : '#ef4444'} stopOpacity="0.4"/>
              <stop offset="100%" stopColor={totalChange >= 0 ? '#10b981' : '#ef4444'} stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
        
        {/* Chart info overlay */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
          <div className="text-sm text-gray-600">Portfolio Growth</div>
          <div className={`text-lg font-semibold ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
}