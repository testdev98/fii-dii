import React, { useState } from 'react';
import { getAllBrokers } from '../config/brokers';
import { ExternalLink, CheckCircle } from 'lucide-react';

const BrokerSelector = ({ selectedBroker, onSelectBroker }) => {
  const brokers = getAllBrokers();
  const [showAll, setShowAll] = useState(false);

  const displayedBrokers = showAll ? brokers : brokers.slice(0, 6);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-3">Select Your Broker</h3>
        <p className="text-sm text-gray-400 mb-4">
          Choose your trading platform to connect and fetch market data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {displayedBrokers.map((broker) => (
          <button
            key={broker.id}
            onClick={() => onSelectBroker(broker)}
            className={`relative p-4 rounded-lg border-2 transition-all text-left ${
              selectedBroker?.id === broker.id
                ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                : 'border-slate-600 bg-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{broker.logo}</div>
                <div>
                  <div className="font-semibold">{broker.name}</div>
                  {broker.isDemo && (
                    <div className="text-xs text-green-400 mt-1">
                      ✓ No credentials required
                    </div>
                  )}
                </div>
              </div>
              {selectedBroker?.id === broker.id && (
                <CheckCircle className="w-5 h-5 text-blue-400" />
              )}
            </div>

            {broker.documentation && (
              <a
                href={broker.documentation}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2"
              >
                <ExternalLink className="w-3 h-3" />
                API Documentation
              </a>
            )}
          </button>
        ))}
      </div>

      {!showAll && brokers.length > 6 && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Show More Brokers ({brokers.length - 6} more)
        </button>
      )}

      {showAll && (
        <button
          onClick={() => setShowAll(false)}
          className="w-full py-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
        >
          Show Less
        </button>
      )}
    </div>
  );
};

export default BrokerSelector;
