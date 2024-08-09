// src/App.tsx

import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Footer from './components/Footer';
import Notifications from './notifications/notifications';


const App: React.FC = () => {
  return (
    <div className="app-container">
      <Navbar />
      <Header />
      <div className="main-content">
        <Notifications />
        {/* Add more content here if needed */}
      </div>
      <Footer />
    </div>
  );
}

export default App;
