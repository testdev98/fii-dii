import React, { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import BrokerSelector from './BrokerSelector';
import BrokerCredentialsForm from './BrokerCredentialsForm';

const LoginModal = ({ onLogin, onClose }) => {
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBrokerSelect = (broker) => {
    setSelectedBroker(broker);
    setError('');
  };

  const handleBack = () => {
    setSelectedBroker(null);
    setError('');
  };

  const handleSubmit = async (credentials) => {
    setLoading(true);
    setError('');
    
    try {
      await onLogin({
        broker: selectedBroker,
        credentials
      });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {selectedBroker && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-2xl font-bold">
                {selectedBroker ? `Connect to ${selectedBroker.name}` : 'Connect Your Broker'}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {selectedBroker 
                  ? 'Enter your credentials to connect' 
                  : 'Choose your trading platform to get started'}
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto">
          {!selectedBroker ? (
            <BrokerSelector
              selectedBroker={selectedBroker}
              onSelectBroker={handleBrokerSelect}
            />
          ) : (
            <BrokerCredentialsForm
              broker={selectedBroker}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>🔒 Secure Connection</span>
            <span>Your data is encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
