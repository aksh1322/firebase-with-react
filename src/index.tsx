import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Check if service workers are supported in the browser
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then((registration: ServiceWorkerRegistration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error: Error) => {
      console.error('Service Worker registration failed:', error);
    });
}

// Render the React application
const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
