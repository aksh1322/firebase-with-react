import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getMessaging, getToken, Messaging } from 'firebase/messaging';

// Firebase configuration object
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY!,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.REACT_APP_FIREBASE_APP_ID!,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID!,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Messaging
const firestore: Firestore = getFirestore(app);
const messaging: Messaging = getMessaging(app);

// Export Firestore and Messaging
export { firestore, messaging };

export const generateToken = async (): Promise<void> => {
  try {
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY!,
      });
      console.log('FCM Token:', token);
    } else {
      console.error('Notification permission denied.');
    }
  } catch (error) {
    console.error('Error generating token:', error);
  }
};
