
import React from 'react';

interface HeaderProps {
  currentUser: string | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  return (
    <header className="p-4 md:p-6 flex justify-between items-center">
      <h1 className="text-2xl md:text-3xl font-bold text-brand-primary tracking-wider">ElicitSim.</h1>
      {currentUser && (
        <div className="flex items-center gap-4">
          <span className="text-brand-subtle">Welcome, <span className="font-bold text-brand-text">{currentUser}</span></span>
          <button 
            onClick={onLogout} 
            className="border border-brand-primary text-brand-primary font-semibold hover:bg-brand-primary hover:text-white px-3 py-1 rounded-lg transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
