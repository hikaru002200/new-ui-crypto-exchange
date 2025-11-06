import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { ArrowRightLeft, Wallet, TrendingUp, X } from 'lucide-react';

interface WalletTransferProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletTransfer({ isOpen, onClose }: WalletTransferProps) {
  const { hodlAssets, tradeAssets, transferAssets, mode } = useApp();
  const [fromWallet, setFromWallet] = useState<'hodl' | 'trade'>('hodl');
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const sourceAssets = fromWallet === 'hodl' ? hodlAssets : tradeAssets;
  const selectedAssetData = sourceAssets.find(asset => asset.symbol === selectedAsset);
  const maxAmount = selectedAssetData?.balance || 0;

  const handleTransfer = () => {
    if (!amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxAmount) return;

    const toWallet = fromWallet === 'hodl' ? 'trade' : 'hodl';
    transferAssets(fromWallet, toWallet, selectedAsset, parseFloat(amount));
    
    // Reset form
    setAmount('');
    onClose();
  };

  const handleSwapWallets = () => {
    setFromWallet(fromWallet === 'hodl' ? 'trade' : 'hodl');
    setAmount('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl ${
        mode === 'hodl' 
          ? 'bg-white' 
          : 'bg-gray-800 text-white'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Transfer Assets</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Wallet Selection */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                fromWallet === 'hodl' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-700 text-green-400'
              }`}>
                {fromWallet === 'hodl' ? <Wallet className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
              </div>
              <div>
                <div className="font-semibold">
                  {fromWallet === 'hodl' ? 'HODL Wallet' : 'Trade Wallet'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {fromWallet === 'hodl' ? 'Long-term storage' : 'Active trading'}
                </div>
              </div>
            </div>

            <button
              onClick={handleSwapWallets}
              className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                fromWallet === 'trade' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-700 text-green-400'
              }`}>
                {fromWallet === 'trade' ? <Wallet className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
              </div>
              <div>
                <div className="font-semibold">
                  {fromWallet === 'trade' ? 'HODL Wallet' : 'Trade Wallet'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {fromWallet === 'trade' ? 'Long-term storage' : 'Active trading'}
                </div>
              </div>
            </div>
          </div>

          {/* Asset Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Select Asset</label>
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className={`w-full p-3 rounded-xl border transition-colors ${
                mode === 'hodl'
                  ? 'bg-gray-50 border-gray-200 focus:border-blue-500'
                  : 'bg-gray-700 border-gray-600 focus:border-green-500'
              }`}
            >
              {sourceAssets.map((asset) => (
                <option key={asset.symbol} value={asset.symbol}>
                  {asset.name} ({asset.symbol}) - {asset.balance.toFixed(8)}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Amount</label>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Available: {maxAmount.toFixed(8)} {selectedAsset}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00000000"
                step="0.00000001"
                max={maxAmount}
                className={`w-full p-3 rounded-xl border transition-colors ${
                  mode === 'hodl'
                    ? 'bg-gray-50 border-gray-200 focus:border-blue-500'
                    : 'bg-gray-700 border-gray-600 focus:border-green-500'
                }`}
              />
              <button
                onClick={() => setAmount(maxAmount.toString())}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium ${
                  mode === 'hodl' ? 'text-blue-600' : 'text-green-400'
                }`}
              >
                MAX
              </button>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex space-x-2 mt-3">
              {['25%', '50%', '75%'].map((percent) => (
                <button
                  key={percent}
                  onClick={() => {
                    const percentage = parseInt(percent) / 100;
                    setAmount((maxAmount * percentage).toFixed(8));
                  }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    mode === 'hodl'
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {percent}
                </button>
              ))}
            </div>
          </div>

          {/* Transfer Summary */}
          {amount && parseFloat(amount) > 0 && (
            <div className={`p-4 rounded-xl mb-6 ${
              mode === 'hodl' ? 'bg-blue-50' : 'bg-gray-700'
            }`}>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Transfer Amount:</span>
                  <span className="font-medium">{amount} {selectedAsset}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Transfer Fee:</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Processing Time:</span>
                  <span className="font-medium">Instant</span>
                </div>
              </div>
            </div>
          )}

          {/* Transfer Button */}
          <button
            onClick={handleTransfer}
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxAmount}
            className={`w-full py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              mode === 'hodl'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            Transfer {amount ? `${amount} ${selectedAsset}` : 'Assets'}
          </button>

          {/* Security Notice */}
          <div className={`mt-4 p-3 rounded-lg text-xs ${
            mode === 'hodl' ? 'bg-gray-50 text-gray-600' : 'bg-gray-700 text-gray-400'
          }`}>
            🔒 Transfers between your HODL and Trade wallets are instant, secure, and completely free. 
            Your assets remain under your full control at all times.
          </div>
        </div>
      </div>
    </div>
  );
}