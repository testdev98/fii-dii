import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, ExternalLink } from 'lucide-react';

const BrokerCredentialsForm = ({ broker, onSubmit, loading, error }) => {
  const [credentials, setCredentials] = useState({});
  const [showPassword, setShowPassword] = useState({});

  const handleChange = (fieldName, value) => {
    setCredentials(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const togglePasswordVisibility = (fieldName) => {
    setShowPassword(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(credentials);
  };

  if (broker.isDemo) {
    return (
      <div className="bg-green-500 bg-opacity-10 border border-green-500 rounded-lg p-6 text-center">
        <div className="text-4xl mb-3">🎮</div>
        <h3 className="text-xl font-bold text-green-400 mb-2">Demo Mode</h3>
        <p className="text-sm text-gray-300 mb-4">
          No credentials required! Click continue to explore the dashboard with sample data.
        </p>
        <button
          onClick={() => onSubmit({})}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
        >
          Continue with Demo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-300 font-semibold mb-1">How to get credentials?</p>
            <p className="text-gray-300">
              Visit your broker's API portal to generate API keys. Your credentials are stored locally and never sent to our servers.
            </p>
            {broker.documentation && (
              <a
                href={broker.documentation}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 mt-2"
              >
                <ExternalLink className="w-4 h-4" />
                View {broker.name} API Documentation
              </a>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {broker.fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-2">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <div className="relative">
              <input
                type={
                  field.type === 'password' && !showPassword[field.name]
                    ? 'password'
                    : 'text'
                }
                value={credentials[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                placeholder={field.placeholder}
                required={field.required}
              />
              {field.type === 'password' && (
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(field.name)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword[field.name] ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Login Failed</p>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? 'Connecting...' : 'Connect & Login'}
          </button>
        </div>
      </form>

      <div className="bg-slate-700 rounded-lg p-4">
        <p className="text-xs text-gray-400">
          🔒 <strong>Security Note:</strong> Your credentials are encrypted and stored locally in your browser. 
          We never send your credentials to any third-party servers except your chosen broker's official API.
        </p>
      </div>
    </div>
  );
};

export default BrokerCredentialsForm;
