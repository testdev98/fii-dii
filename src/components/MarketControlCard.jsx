import React from 'react';
import { Crown, Shield, Users } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

const MarketControlCard = ({ control }) => {
  const getIcon = () => {
    if (control.controller === 'FII') return <Crown className="w-8 h-8 text-yellow-400" />;
    if (control.controller === 'DII') return <Shield className="w-8 h-8 text-blue-400" />;
    return <Users className="w-8 h-8 text-purple-400" />;
  };

  const getColor = () => {
    if (control.controller === 'FII') return '#fbbf24';
    if (control.controller === 'DII') return '#3b82f6';
    return '#a855f7';
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border-2" style={{ borderColor: getColor() }}>
      <div className="flex items-center gap-4 mb-4">
        {getIcon()}
        <div className="flex-1">
          <h3 className="text-2xl font-bold flex items-center" style={{ color: getColor() }}>
            {control.controller} IN CONTROL
            <InfoTooltip
              title="Market Control Indicator"
              content="Shows which institutional group (FII or DII) is dominating the market based on their net activity. The dominant player's actions drive market direction."
              tradingLogic="FII Control = Follow FII direction, they create trends. DII Control = Market stabilizing, less directional. Mixed = Watch for clear winner before taking positions. Always align your trades with the controller."
            />
          </h3>
          <p className="text-sm text-gray-400">{control.strength} Control</p>
        </div>
      </div>
      
      <div className="bg-slate-700 rounded-lg p-4">
        <p className="text-sm">{control.description}</p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="bg-slate-700 rounded p-2">
          <div className="text-xs text-gray-400">Role</div>
          <div className="text-sm font-semibold">
            {control.controller === 'FII' ? 'Trend Creator' : 
             control.controller === 'DII' ? 'Stabilizer' : 'Mixed'}
          </div>
        </div>
        <div className="bg-slate-700 rounded p-2">
          <div className="text-xs text-gray-400">Impact</div>
          <div className="text-sm font-semibold">{control.strength}</div>
        </div>
        <div className="bg-slate-700 rounded p-2">
          <div className="text-xs text-gray-400">Action</div>
          <div className="text-sm font-semibold">
            {control.controller === 'FII' ? 'Follow' : 
             control.controller === 'DII' ? 'Support' : 'Watch'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketControlCard;
