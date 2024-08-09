import React, { useEffect } from 'react';
import { generateToken, messaging, firestore } from './notifications/firebase';
import { onMessage, MessagePayload } from 'firebase/messaging';
import { addDoc, collection, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';

interface NotificationData {
  title: string;
  body: string;
}

const markNotificationAsRead = async (id: string) => {
  try {
    await updateDoc(doc(firestore, 'notification', id), { is_read: true });
    console.log(`Notification ${id} marked as read.`);
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

const showNotification = (id: string, title: string, body: string) => {
  if (Notification.permission === 'granted') {
    const notificationOptions: NotificationOptions = {
      body,
      icon: '/firebase-logo.png',
      data: { id }
    };

    const notification = new Notification(title, notificationOptions);

    notification.onclick = async () => {
      await markNotificationAsRead(id);
      notification.close();
    };
  } else {
    console.error('Notification permission not granted.');
  }
};

const App: React.FC = () => {
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const q = query(collection(firestore, 'notification'), where('is_read', '==', false));
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
          const data = doc.data() as NotificationData;
          showNotification(doc.id, data.title, data.body);
        });
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    generateToken();
    onMessage(messaging, (payload: MessagePayload) => {
      console.log(payload);
      // Assuming payload contains notification details
      if (payload.notification) {
        const { title, body } = payload.notification;

        if (title && body) {
          showNotification('default-id', title, body); // Use a default id or modify based on your payload
        } else {
          console.error('Notification title or body is missing.');
        }
      }
    });
  }, []);

  const handleButtonClick = async (id: string, title: string, body: string) => {
    try {
      await addDoc(collection(firestore, 'notification'), {
        id,
        title,
        body,
        is_read: false
      });
      showNotification(id, title, body);
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  return (
    <div className="App">
      <h1>Notification Demo</h1>
      <button onClick={() => handleButtonClick('1', 'Button 1 Clicked', 'Notification for Button 1')}>
        Show Notification 1
      </button>
      <button onClick={() => handleButtonClick('2', 'Button 2 Clicked', 'Notification for Button 2')}>
        Show Notification 2
      </button>
      <button onClick={() => handleButtonClick('3', 'Button 3 Clicked', 'Notification for Button 3')}>
        Show Notification 3
      </button>
    </div>
  );
}

export default App;
