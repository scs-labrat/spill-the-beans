
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-brand-secondary p-4 shadow-md text-center">
      <h1 className="text-2xl md:text-3xl font-bold text-brand-accent">Elicitation Training Simulator</h1>
      <p className="text-brand-subtle text-sm md:text-base">Hone your communication skills with AI-powered role-playing scenarios.</p>
    </header>
  );
};

export default Header;
