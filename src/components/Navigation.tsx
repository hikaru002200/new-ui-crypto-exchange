import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { WalletTransfer } from './WalletTransfer';
import { Settings } from './Settings';
import { HodlWallet } from './hodl/HodlWallet';
import { HodlTrade } from './hodl/HodlTrade';
import { TradeWallet } from './trade/TradeWallet';
import { 
  Home, 
  Wallet, 
  TrendingUp, 
  BarChart3, 
  ArrowRightLeft,
  History,
  Settings as SettingsIcon
} from 'lucide-react';

export function Navigation() {
  const { mode } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  const [showTransfer, setShowTransfer] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const hodlTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'trade', label: 'Buy/Sell', icon: TrendingUp },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  const tradeTabs = [
    { id: 'markets', label: 'Markets', icon: BarChart3 },
    { id: 'trade', label: 'Trade', icon: TrendingUp },
    { id: 'positions', label: 'Positions', icon: History },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  const tabs = mode === 'hodl' ? hodlTabs : tradeTabs;

  const handleTabClick = (tabId: string) => {
    if (tabId === 'settings') {
      setShowSettings(true);
    } else {
      setActiveTab(tabId);
      setShowSettings(false);
    }
  };

  // Render content based on active tab
  const renderContent = () => {
    if (showSettings) {
      return <Settings />;
    }

    if (mode === 'hodl') {
      switch (activeTab) {
        case 'wallet':
          return <HodlWallet />;
        case 'trade':
          return <HodlTrade />;
        default:
          return null;
      }
    } else {
      switch (activeTab) {
        case 'wallet':
          return <TradeWallet />;
        default:
          return null;
      }
    }
  };

  return (
    <>
      {/* Content Overlay */}
      {(activeTab !== 'home' || showSettings) && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
          <div className="h-full overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => {
                  setActiveTab('home');
                  setShowSettings(false);
                }}
                className="fixed top-4 right-4 z-50 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              >
                <span className="text-xl font-bold text-gray-600">×</span>
              </button>
              {renderContent()}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 border-t transition-all duration-300 ${
        mode === 'hodl'
          ? 'bg-white/90 backdrop-blur-sm border-gray-200'
          : 'bg-gray-900/90 backdrop-blur-sm border-gray-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around h-16">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    (isActive && !showSettings) || (tab.id === 'settings' && showSettings)
                      ? mode === 'hodl'
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-green-400 bg-green-500/10'
                      : mode === 'hodl'
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${(isActive && !showSettings) || (tab.id === 'settings' && showSettings) ? 'scale-110' : ''} transition-transform`} />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Floating Transfer Button */}
      <button
        onClick={() => setShowTransfer(true)}
        className={`fixed bottom-20 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          mode === 'hodl'
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-green-500 hover:bg-green-600 text-black'
        }`}
      >
        <ArrowRightLeft className="w-6 h-6" />
      </button>

      {/* Transfer Modal */}
      <WalletTransfer 
        isOpen={showTransfer} 
        onClose={() => setShowTransfer(false)} 
      />

      {/* Spacer for fixed navigation */}
      <div className="h-16" />
    </>
  );
}