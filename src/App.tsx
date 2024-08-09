// src/App.tsx

import React from 'react';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Footer from './components/Footer';
import Notifications from './notifications/notifications';


const App: React.FC = () => {
  return (
    <div className="App">
      <Navbar />
      <Header />
      <Notifications />
      <Footer />
    </div>
  );
}

export default App;
