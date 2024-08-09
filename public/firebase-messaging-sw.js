/* eslint-env serviceworker */
/* global firebase */
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id",
});

const messaging = firebase.messaging();

// Corrected section for showing notifications
self.addEventListener("push", (event) => {
  const data = event.data.json();
  console.log("[firebase-messaging-sw.js] Received push message", data);

  const notificationTitle = data.notification.title;
  const notificationOptions = {
    body: data.notification.body,
    icon: data.notification.image,
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});
