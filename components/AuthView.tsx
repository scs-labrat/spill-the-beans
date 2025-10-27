
import React, { useState } from 'react';

interface AuthViewProps {
  onLogin: (username: string, pass: string) => boolean;
  onSignup: (username: string, pass: string) => boolean;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password.trim()) {
        setError("Username and password cannot be empty.");
        return;
    }
    
    let success = false;
    if (isLogin) {
      success = onLogin(username, password);
      if (!success) setError('Invalid username or password.');
    } else {
      success = onSignup(username, password);
      if (!success) setError('Username already taken.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-brand-secondary p-4">
      <div className="w-full max-w-md bg-brand-content-bg p-8 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-brand-primary mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
        <p className="text-center text-brand-subtle mb-8">to access the Elicitation Simulator</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-brand-subtle mb-1">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              required 
              className="w-full bg-brand-secondary p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-subtle mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-brand-secondary p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full bg-brand-accent hover:bg-brand-accent/80 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg">
            {isLogin ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-brand-subtle mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="font-semibold text-brand-accent hover:underline ml-1">
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthView;
