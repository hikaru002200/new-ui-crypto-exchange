import { useEffect, useRef, memo } from 'react';

interface TradingViewAdvancedChartProps {
  pair: string;
  theme?: 'light' | 'dark';
}

// Convert pair format from "BTC/USDT" to "BTCUSDT" for TradingView
const convertPairFormat = (pair: string): string => {
  return pair.replace('/', '');
};

function TradingViewAdvancedChart({ pair, theme = 'dark' }: TradingViewAdvancedChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Load TradingView widget script
    if (!scriptLoadedRef.current) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        initWidget();
      };
      document.head.appendChild(script);
    } else {
      initWidget();
    }

    function initWidget() {
      if (containerRef.current && (window as any).TradingView) {
        // Clear previous widget
        containerRef.current.innerHTML = '';

        const symbol = `BINANCE:${convertPairFormat(pair)}`;

        new (window as any).TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: '60', // 1 hour
          timezone: 'Asia/Tokyo',
          theme: theme,
          style: '1', // Candlestick
          locale: 'ja_JP',
          toolbar_bg: '#111827', // Darker toolbar to match UI
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          details: true,
          hotlist: true,
          calendar: true,
          studies: [
            // デフォルトで表示する指標
            'MASimple@tv-basicstudies', // 移動平均線
            'Volume@tv-basicstudies', // 出来高
          ],
          container_id: containerRef.current.id,
          // プロフェッショナル機能を有効化
          studies_overrides: {
            'volume.volume.color.0': '#ef535080',
            'volume.volume.color.1': '#26a69a80',
          },
          overrides: {
            // Candlestick colors
            'mainSeriesProperties.candleStyle.upColor': '#10b981',
            'mainSeriesProperties.candleStyle.downColor': '#ef4444',
            'mainSeriesProperties.candleStyle.borderUpColor': '#10b981',
            'mainSeriesProperties.candleStyle.borderDownColor': '#ef4444',
            'mainSeriesProperties.candleStyle.wickUpColor': '#10b981',
            'mainSeriesProperties.candleStyle.wickDownColor': '#ef4444',

            // Background colors - match UI theme
            'paneProperties.background': '#1f2937',
            'paneProperties.backgroundGradientStartColor': '#1f2937',
            'paneProperties.backgroundGradientEndColor': '#1f2937',
            'paneProperties.backgroundType': 'solid',

            // Grid colors
            'paneProperties.vertGridProperties.color': '#374151',
            'paneProperties.horzGridProperties.color': '#374151',
            'paneProperties.vertGridProperties.style': 0,
            'paneProperties.horzGridProperties.style': 0,

            // Scale colors
            'scalesProperties.backgroundColor': '#1f2937',
            'scalesProperties.textColor': '#d1d5db',
            'scalesProperties.lineColor': '#374151',
          },
          disabled_features: [
            'use_localstorage_for_settings',
            'header_symbol_search',
            'header_compare',
          ],
          enabled_features: [
            'study_templates',
            'side_toolbar_in_fullscreen_mode',
            'header_in_fullscreen_mode',
          ],
          loading_screen: {
            backgroundColor: '#1f2937',
            foregroundColor: '#10b981',
          },
          // Additional theme customization
          custom_css_url: '',
          favorites: {
            intervals: ['1', '5', '15', '60', '240', '1D', '1W'],
          },
        });
      }
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [pair, theme]);

  return (
    <div
      ref={containerRef}
      id={`tradingview-widget-${pair}`}
      className="w-full h-full"
      style={{ minHeight: '500px' }}
    />
  );
}

export default memo(TradingViewAdvancedChart);
