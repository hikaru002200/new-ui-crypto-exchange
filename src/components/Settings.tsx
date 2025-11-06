import { User, Bell, Shield, Globe, HelpCircle, LogOut } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function Settings() {
  const { mode } = useApp();
  const isDark = mode === 'trade';

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile Settings', description: 'Manage your account information' },
        { icon: Shield, label: 'Security', description: 'Password and 2FA settings' },
        { icon: Bell, label: 'Notifications', description: 'Manage your alerts and notifications' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Globe, label: 'Language & Region', description: 'Change language and currency' },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', description: 'Get help and support' },
      ]
    }
  ];

  return (
    <div className={`min-h-screen pb-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Settings
        </h1>

        <div className="space-y-6">
          {settingsSections.map((section) => (
            <div key={section.title}>
              <h2 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {section.title}
              </h2>
              <div className={`rounded-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                {section.items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      className={`w-full flex items-center gap-4 p-4 transition-colors ${
                        index !== section.items.length - 1
                          ? isDark
                            ? 'border-b border-gray-700'
                            : 'border-b border-gray-100'
                          : ''
                      } ${
                        isDark
                          ? 'hover:bg-gray-700 text-white'
                          : 'hover:bg-gray-50 text-gray-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.description}
                        </div>
                      </div>
                      <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>›</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <button
            className={`w-full flex items-center gap-4 p-4 rounded-lg transition-colors ${
              isDark
                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                : 'bg-red-50 hover:bg-red-100 text-red-600'
            }`}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
