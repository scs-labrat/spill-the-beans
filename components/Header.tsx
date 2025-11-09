
import React from 'react';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="p-4 md:p-6 flex justify-between items-center">
      <h1 className="text-2xl md:text-3xl font-bold text-brand-primary tracking-wider">ElicitSim.</h1>
      <button 
        onClick={onLogout} 
        className="text-sm font-semibold text-brand-subtle hover:text-brand-text transition-colors"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
