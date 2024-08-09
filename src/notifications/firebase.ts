import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getMessaging, getToken, Messaging } from 'firebase/messaging';

// Define the Firebase config type
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string; // Optional field
  vapidKey?: string; // Optional field for web push
}

// Retrieve and validate environment variables
const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY ?? '',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.REACT_APP_FIREBASE_APP_ID ?? '',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
};

// Ensure that no required field is empty
for (const [key, value] of Object.entries(firebaseConfig)) {
  if (!value) {
    throw new Error(`Firebase configuration error: ${key} is missing.`);
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized successfully : ', app);

// Initialize Firestore and Messaging
const firestore: Firestore = getFirestore(app);
const messaging: Messaging = getMessaging(app);

// Export Firestore and Messaging
export { firestore, messaging };

// Function to check Firestore connection
const checkFirestoreConnection = async () => {
  try {
    // Add a test document
    const testCollection = collection(firestore, 'test');
    const docRef = await addDoc(testCollection, { timestamp: new Date() });
    console.log(`Test document added with ID: ${docRef.id}`);

    // Read test documents
    const snapshot = await getDocs(testCollection);
    console.log('Test documents:');
    snapshot.forEach((doc) => {
      console.log(`Document ID: ${doc.id}, Data:`, doc.data());
    });
  } catch (error) {
    console.error('Error connecting to Firestore:', error);
  }
};

export const generateToken = async (): Promise<void> => {
  try {
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: firebaseConfig.vapidKey,
      });
      console.log('FCM Token:', token);
    } else {
      console.error('Notification permission denied.');
    }
  } catch (error) {
    console.error('Error generating token:', error);
  }
};

// Run diagnostic checks
checkFirestoreConnection();