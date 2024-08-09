// src/notifications/notifications.tsx

import React, { useEffect } from 'react';
import { firestore, generateToken, messaging } from './firebase';
import { onMessage, MessagePayload } from 'firebase/messaging';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { showNotification, NotificationData } from './notificationUtils';
import 'bootstrap/dist/css/bootstrap.min.css'; 

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
      if (payload.notification) {
        const { title, body } = payload.notification;

        if (title && body) {
          showNotification('default-id', title, body);
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
    <div className="container mt-5">
      <h1 className="text-center mb-4">Notification Demo</h1>
      <div className="row">
        <div className="col-md-4 mb-3">
          <button
            className="btn btn-primary btn-lg btn-block"
            onClick={() => handleButtonClick('1', 'Button 1 Clicked', 'Notification for Button 1')}
          >
            Button 1
          </button>
        </div>
        <div className="col-md-4 mb-3">
          <button
            className="btn btn-success btn-lg btn-block"
            onClick={() => handleButtonClick('2', 'Button 2 Clicked', 'Notification for Button 2')}
          >
            Button 2
          </button>
        </div>
        <div className="col-md-4 mb-3">
          <button
            className="btn btn-warning btn-lg btn-block"
            onClick={() => handleButtonClick('3', 'Button 3 Clicked', 'Notification for Button 3')}
          >
            Button 3
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
