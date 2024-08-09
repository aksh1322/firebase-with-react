// src/components/Header.tsx
import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="bg-primary text-white text-center py-4">
      <h1>Welcome to MyApp</h1>
      <p>Your one-stop solution for notifications</p>
    </header>
  );
}

export default Header;
