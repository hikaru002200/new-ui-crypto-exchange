import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Navigation } from './Navigation';
import { ModeToggle } from './ModeToggle';
import { Shield, Award } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { mode } = useApp();

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      mode === 'hodl' 
        ? 'bg-gradient-to-br from-gray-50 to-blue-50' 
        : 'bg-gradient-to-br from-gray-900 to-black'
    }`}>
      {/* Header */}
      <header className={`border-b transition-all duration-300 ${
        mode === 'hodl'
          ? 'bg-white/80 backdrop-blur-sm border-gray-200'
          : 'bg-gray-900/80 backdrop-blur-sm border-gray-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                mode === 'hodl' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-green-500 text-black'
              }`}>
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className={`text-xl font-bold transition-colors duration-300 ${
                  mode === 'hodl' ? 'text-gray-900' : 'text-white'
                }`}>
                  SwissCrypto
                </h1>
                <div className="flex items-center space-x-1">
                  <Award className={`w-3 h-3 transition-colors duration-300 ${
                    mode === 'hodl' ? 'text-blue-600' : 'text-green-400'
                  }`} />
                  <span className={`text-xs transition-colors duration-300 ${
                    mode === 'hodl' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    Swiss DLT Licensed
                  </span>
                </div>
              </div>
            </div>

            {/* Mode Toggle */}
            <ModeToggle />

            {/* Performance Indicator */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                mode === 'trade' ? 'bg-green-400' : 'bg-blue-500'
              }`} />
              <span className={`text-sm font-mono transition-colors duration-300 ${
                mode === 'hodl' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {mode === 'trade' ? '37M o/s' : 'Secure'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Navigation */}
      <Navigation />
    </div>
  );
}