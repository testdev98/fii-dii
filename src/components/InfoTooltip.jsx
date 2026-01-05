import React, { useState } from 'react';
import { Info, HelpCircle } from 'lucide-react';

const InfoTooltip = ({ title, content, tradingLogic }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="ml-2 p-1.5 rounded-full bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500 transition-all duration-200"
        aria-label="Information"
      >
        <HelpCircle className="w-4 h-4 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-96 bg-slate-800 border border-slate-600 rounded-lg shadow-xl left-0 top-8 overflow-hidden">
          {/* Header */}
          <div className="bg-slate-700 border-b border-slate-600 px-5 py-3">
            {title && (
              <h4 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" />
                {title}
              </h4>
            )}
          </div>

          <div className="p-5 space-y-4">
            {/* Description Section */}
            {content && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                  <p className="font-semibold text-slate-200 text-xs uppercase tracking-wide">Overview</p>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed pl-3">{content}</p>
              </div>
            )}
            
            {/* Trading Logic Section */}
            {tradingLogic && (
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">💡</span>
                  </div>
                  <p className="font-semibold text-slate-200 text-xs uppercase tracking-wide">Trading Strategy</p>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{tradingLogic}</p>
              </div>
            )}
          </div>

          {/* Simple bottom border */}
          <div className="h-0.5 bg-slate-600"></div>
          
          {/* Arrow pointer */}
          <div className="absolute -top-2 left-4 w-4 h-4 bg-slate-800 border-t border-l border-slate-600 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
