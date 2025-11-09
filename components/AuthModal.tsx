
import React, { useState } from 'react';
import { UserIcon, LockClosedIcon, XCircleIcon } from './icons';

interface AuthModalProps {
  initialView: 'login' | 'register';
  onClose: () => void;
  onLogin: (data: any) => void;
  onRegister: (data: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ initialView, onClose, onLogin, onRegister }) => {
  const [view, setView] = useState<'login' | 'register'>(initialView);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.trim() }));
  };

  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email and password are required.');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (view === 'register') {
      if (!formData.name) {
        setError('Name is required for registration.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      // Simulate successful registration
      onRegister({ name: formData.name, email: formData.email });
    } else {
      // Simulate successful login
      onLogin({ email: formData.email });
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-brand-content-bg rounded-lg shadow-xl w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
            <XCircleIcon className="w-8 h-8"/>
        </button>

        <div className="p-8">
            <div className="flex border-b mb-6">
                <button 
                    onClick={() => setView('login')}
                    className={`flex-1 py-3 text-lg font-bold transition-colors ${view === 'login' ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-brand-subtle'}`}
                >
                    Login
                </button>
                 <button 
                    onClick={() => setView('register')}
                    className={`flex-1 py-3 text-lg font-bold transition-colors ${view === 'register' ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-brand-subtle'}`}
                >
                    Register
                </button>
            </div>

            <h2 className="text-3xl font-bold text-center text-brand-primary mb-2">
                {view === 'login' ? 'Welcome Back' : 'Create Your Account'}
            </h2>
            <p className="text-center text-brand-subtle mb-6">
                {view === 'login' ? 'Login to continue your training.' : 'Start your journey to becoming a master communicator.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {view === 'register' && (
                    <div className="relative">
                        <UserIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-brand-secondary p-3 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        />
                    </div>
                )}
                <div className="relative">
                    <UserIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-brand-secondary p-3 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    />
                </div>
                <div className="relative">
                     <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-brand-secondary p-3 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    />
                </div>
                 {view === 'register' && (
                    <div className="relative">
                        <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-brand-secondary p-3 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        />
                    </div>
                )}

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-brand-accent text-white p-3 rounded-lg font-semibold hover:bg-brand-accent/80 transition-colors duration-200"
                >
                    {view === 'login' ? 'Login' : 'Create Account'}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
