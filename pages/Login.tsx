import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Lock } from 'lucide-react';

export const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/dashboard');
    } else {
      setError('Invalid Access Code. (Try: ortho123)');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-10 border border-slate-100 dark:border-slate-700">
        <div className="flex justify-center mb-6">
          <div className="bg-teal-100 dark:bg-teal-900/30 p-4 rounded-full">
            <Stethoscope className="w-10 h-10 text-teal-600 dark:text-teal-400" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-2">SmileFree Admin</h2>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-8 text-lg">Dr. Chandima Weerasekera</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">Access Code</label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-4 py-4 text-xl border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                placeholder="Enter password"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30 font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
          >
            Access Dashboard
          </button>
        </form>
        
        <div className="mt-8 text-center">
            <p className="text-sm text-slate-400">Authorized personnel only.</p>
        </div>
      </div>
    </div>
  );
};