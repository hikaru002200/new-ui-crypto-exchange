import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries, LineSeries, HistogramSeries } from 'lightweight-charts';
import { TrendingUp, TrendingDown, BarChart3, Activity, LineChart } from 'lucide-react';

interface TradingViewChartProps {
  pair: string;
  onPairChange: (pair: string) => void;
}

const AVAILABLE_PAIRS = [
  { symbol: 'BTC/USDT', binanceSymbol: 'BTCUSDT' },
  { symbol: 'ETH/USDT', binanceSymbol: 'ETHUSDT' },
  { symbol: 'BNB/USDT', binanceSymbol: 'BNBUSDT' },
  { symbol: 'SOL/USDT', binanceSymbol: 'SOLUSDT' },
  { symbol: 'ADA/USDT', binanceSymbol: 'ADAUSDT' },
  { symbol: 'XRP/USDT', binanceSymbol: 'XRPUSDT' },
];

// Binance API helper functions (no API key required for public endpoints)
const fetchCurrentPrice = async (binanceSymbol: string): Promise<number> => {
  try {
    const response = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${binanceSymbol}`
    );
    const data = await response.json();
    return parseFloat(data.price) || 0;
  } catch (error) {
    console.error('Error fetching price:', error);
    return 0;
  }
};

const fetchHistoricalData = async (binanceSymbol: string): Promise<any[]> => {
  try {
    // Get 1 day of 1-hour candlestick data (24 candles)
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=1h&limit=168`
    );
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return [];
  }
};

export function TradingViewChart({ pair, onPairChange }: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);
  const ma7SeriesRef = useRef<any>(null);
  const ma25SeriesRef = useRef<any>(null);
  const ma99SeriesRef = useRef<any>(null);
  const [timeframe, setTimeframe] = useState('1H');
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [showPairSelector, setShowPairSelector] = useState(false);
  const [indicators, setIndicators] = useState({
    ma7: true,
    ma25: true,
    ma99: false,
    volume: true,
  });

  const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D', '1W'];

  // Calculate Simple Moving Average
  const calculateSMA = (data: any[], period: number) => {
    const smaData = [];
    for (let i = period - 1; i < data.length; i++) {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
      }
      smaData.push({
        time: data[i].time,
        value: sum / period,
      });
    }
    return smaData;
  };

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1f2937' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#374151',
      },
      rightPriceScale: {
        borderColor: '#374151',
      },
      crosshair: {
        mode: 1,
      },
    });

    chartRef.current = chart;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Generate and update chart data
  useEffect(() => {
    if (!chartRef.current) return;

    const selectedPair = AVAILABLE_PAIRS.find(p => p.symbol === pair);
    if (!selectedPair) return;

    // Remove old series if it exists
    try {
      if (seriesRef.current) {
        chartRef.current.removeSeries(seriesRef.current);
        seriesRef.current = null;
      }
    } catch (error) {
      // Series might already be removed, ignore the error
      seriesRef.current = null;
    }

    // Load real data from Binance
    const loadRealData = async () => {
      const klines = await fetchHistoricalData(selectedPair.binanceSymbol);

      if (klines.length === 0) {
        console.error('No historical data available');
        return;
      }

      // Convert Binance kline data to candlestick format
      // Binance kline format: [timestamp, open, high, low, close, volume, ...]
      const data: any[] = klines.map((kline: any) => ({
        time: Math.floor(kline[0] / 1000), // Convert milliseconds to seconds
        open: parseFloat(kline[1]),
        high: parseFloat(kline[2]),
        low: parseFloat(kline[3]),
        close: parseFloat(kline[4]),
        volume: parseFloat(kline[5]),
      }));

      return data;
    };

    let cleanupInterval: NodeJS.Timeout | null = null;

    loadRealData().then(data => {
      if (!data || data.length === 0) return;
      if (!chartRef.current) return;

      // Add new series
      let newSeries;
      if (chartType === 'candlestick') {
        newSeries = chartRef.current.addSeries(CandlestickSeries, {
          upColor: '#10b981',
          downColor: '#ef4444',
          borderUpColor: '#10b981',
          borderDownColor: '#ef4444',
          wickUpColor: '#10b981',
          wickDownColor: '#ef4444',
        });
        newSeries.setData(data);
      } else {
        newSeries = chartRef.current.addSeries(LineSeries, {
          color: '#10b981',
          lineWidth: 2,
        });
        const lineData = data.map(d => ({ time: d.time, value: d.close }));
        newSeries.setData(lineData);
      }

      seriesRef.current = newSeries;

      // Add Volume indicator
      if (indicators.volume) {
        try {
          if (volumeSeriesRef.current) {
            chartRef.current.removeSeries(volumeSeriesRef.current);
          }
          const volumeSeries = chartRef.current.addSeries(HistogramSeries, {
            color: '#26a69a',
            priceFormat: {
              type: 'volume',
            },
            priceScaleId: '',
            scaleMargins: {
              top: 0.8,
              bottom: 0,
            },
          });
          const volumeData = data.map(d => ({
            time: d.time,
            value: d.volume,
            color: d.close >= d.open ? '#26a69a80' : '#ef535080',
          }));
          volumeSeries.setData(volumeData);
          volumeSeriesRef.current = volumeSeries;
        } catch (error) {
          console.error('Error adding volume series:', error);
        }
      }

      // Add Moving Averages
      if (indicators.ma7) {
        try {
          if (ma7SeriesRef.current) {
            chartRef.current.removeSeries(ma7SeriesRef.current);
          }
          const ma7Series = chartRef.current.addSeries(LineSeries, {
            color: '#2962FF',
            lineWidth: 2,
            title: 'MA7',
          });
          ma7Series.setData(calculateSMA(data, 7));
          ma7SeriesRef.current = ma7Series;
        } catch (error) {
          console.error('Error adding MA7 series:', error);
        }
      }

      if (indicators.ma25) {
        try {
          if (ma25SeriesRef.current) {
            chartRef.current.removeSeries(ma25SeriesRef.current);
          }
          const ma25Series = chartRef.current.addSeries(LineSeries, {
            color: '#FF6D00',
            lineWidth: 2,
            title: 'MA25',
          });
          ma25Series.setData(calculateSMA(data, 25));
          ma25SeriesRef.current = ma25Series;
        } catch (error) {
          console.error('Error adding MA25 series:', error);
        }
      }

      if (indicators.ma99) {
        try {
          if (ma99SeriesRef.current) {
            chartRef.current.removeSeries(ma99SeriesRef.current);
          }
          const ma99Series = chartRef.current.addSeries(LineSeries, {
            color: '#E040FB',
            lineWidth: 2,
            title: 'MA99',
          });
          ma99Series.setData(calculateSMA(data, 99));
          ma99SeriesRef.current = ma99Series;
        } catch (error) {
          console.error('Error adding MA99 series:', error);
        }
      }

      // Set initial price
      const lastCandle = data[data.length - 1];
      setCurrentPrice(lastCandle.close);
      const firstPrice = data[0].open;
      setPriceChange(((lastCandle.close - firstPrice) / firstPrice) * 100);

      chartRef.current.timeScale().fitContent();

      // Real-time price updates from API
      const updatePrice = async () => {
        try {
          const currentPrice = await fetchCurrentPrice(selectedPair.binanceSymbol);

          if (currentPrice > 0 && seriesRef.current && data.length > 0) {
            const now = Math.floor(Date.now() / 1000);
            const lastData = data[data.length - 1];

            const newCandle = {
              time: now,
              open: lastData.close,
              high: Math.max(lastData.close, currentPrice),
              low: Math.min(lastData.close, currentPrice),
              close: currentPrice,
            };

            if (chartType === 'candlestick') {
              seriesRef.current.update(newCandle);
            } else {
              seriesRef.current.update({ time: now, value: currentPrice });
            }

            setCurrentPrice(currentPrice);
            setPriceChange(((currentPrice - firstPrice) / firstPrice) * 100);

            data.push(newCandle);
            if (data.length > 500) {
              data.shift();
            }
          }
        } catch (error) {
          console.error('Error updating real-time price:', error);
        }
      };

      // Update price every 30 seconds to respect API rate limits
      cleanupInterval = setInterval(updatePrice, 30000);

      // Initial update
      updatePrice();
    });

    return () => {
      if (cleanupInterval) {
        clearInterval(cleanupInterval);
      }
    };
  }, [pair, timeframe, chartType, indicators]);

  return (
    <div className="flex-1 bg-gray-900 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        {/* Chart Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Currency Pair Selector */}
            <div className="relative">
              <button
                onClick={() => setShowPairSelector(!showPairSelector)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-semibold transition-colors"
              >
                <span>{pair}</span>
                <svg className={`w-4 h-4 transition-transform ${showPairSelector ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showPairSelector && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 max-h-64 overflow-y-auto">
                  {AVAILABLE_PAIRS.map((p) => (
                    <button
                      key={p.symbol}
                      onClick={() => {
                        onPairChange(p.symbol);
                        setShowPairSelector(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
                        pair === p.symbol ? 'bg-gray-700 text-green-400' : 'text-gray-300'
                      }`}
                    >
                      {p.symbol}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chart Type */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setChartType('candlestick')}
                className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
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
                className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
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

            {/* Indicators */}
            <div className="flex bg-gray-800 rounded-lg p-1 gap-1">
              <button
                onClick={() => setIndicators(prev => ({ ...prev, ma7: !prev.ma7 }))}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  indicators.ma7
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="7期間移動平均線"
              >
                MA7
              </button>
              <button
                onClick={() => setIndicators(prev => ({ ...prev, ma25: !prev.ma25 }))}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  indicators.ma25
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="25期間移動平均線"
              >
                MA25
              </button>
              <button
                onClick={() => setIndicators(prev => ({ ...prev, ma99: !prev.ma99 }))}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  indicators.ma99
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="99期間移動平均線"
              >
                MA99
              </button>
              <button
                onClick={() => setIndicators(prev => ({ ...prev, volume: !prev.volume }))}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  indicators.volume
                    ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="出来高"
              >
                VOL
              </button>
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
      <div className="flex-1 px-4 pb-4">
        <div ref={chartContainerRef} className="w-full h-full rounded-lg" />
      </div>
    </div>
  );
}
