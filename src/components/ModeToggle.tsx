import { Moon, Sun } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function ModeToggle() {
  const { mode, setMode } = useApp();

  return (
    <div className="relative">
      <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300">
        <button
          onClick={() => setMode('hodl')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
            mode === 'hodl'
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Sun className="w-4 h-4" />
          <span className="font-medium text-sm">HODL</span>
        </button>
        <button
          onClick={() => setMode('trade')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
            mode === 'trade'
              ? 'bg-gray-900 text-green-400 shadow-md'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Moon className="w-4 h-4" />
          <span className="font-medium text-sm">TRADE</span>
        </button>
      </div>
    </div>
  );
}