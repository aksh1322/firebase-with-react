// src/notifications/notificationUtils.ts

import { updateDoc, doc } from 'firebase/firestore';
import { firestore } from './firebase';

export interface NotificationData {
  title: string;
  body: string;
}

export const markNotificationAsRead = async (id: string) => {
  try {
    await updateDoc(doc(firestore, 'notification', id), { is_read: true });
    console.log(`Notification ${id} marked as read.`);
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

export const showNotification = (id: string, title: string, body: string) => {
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
