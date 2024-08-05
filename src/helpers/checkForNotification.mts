import { store } from './store.mjs';
import { app, dialog, shell } from 'electron';
import { API_URL } from '../globals.mjs';

const fetchNotifications = async () => {
  try {
    const notificationTimestamp = store.get('notifications.startTimestamp');
    console.log(`notificationTimestamp: ${notificationTimestamp}`);
    const notificationArray = store.get('notifications.notifications', []) as any[];

    /* notificationArray holds an array of objects with the following structure:
 {
    title: 'string',
    message: 'string',
    button1Text: 'string',
    urlForButton1: 'string',
    read: 'boolean',
    timestamp: 'string'

}
*/

    const endpoint = `${API_URL}/node/notifications/get`;

    const response = await fetch(endpoint);

    const data = await response.json();

    /* data is an array of objects with the following structure:
    {
        title: 'string',
        message: 'string',
        url: 'string',
        timestamp: 'string'
    }
    */
    // console.log(data);

    const newNotifications = data.notificationArray.filter((notification: any) => {
      return new Date(notification.timestamp) > new Date(notificationTimestamp as any);
    });

    newNotifications.forEach((notification: any) => {
      console.log(notification);
      notificationArray.push({
        title: notification.title,
        message: notification.message,
        button1Text: notification.button1Text,
        urlForButton1: notification.urlForButton1,
        read: false,
        timestamp: notification.timestamp,
      });
    });

    store.set('notifications.notifications', notificationArray);

    store.set('notifications.startTimestamp', new Date().toISOString());

    return newNotifications;
  } catch (error) {
    // console.error(error);
    return [];
  }
};

const generateNotification = (
  title: any,
  message: any,
  button1Text: string,
  urlForButton1: string,
  timestamp: string,
) => {
  dialog
    .showMessageBox({
      title,
      message,
      type: 'info',
      buttons: [button1Text, 'Close'],
    })
    .then((response) => {
      if (response.response === 0) {
        shell.openExternal(urlForButton1);
      }

      // Mark the notification as read
      const notificationsArray = store.get('notifications.notifications', []) as any[];
      const notificationIndex = notificationsArray.findIndex((notification: any) => {
        return notification.timestamp === timestamp;
      });

      notificationsArray[notificationIndex].read = true;
      store.set('notifications.notifications', notificationsArray);
    });
};

const checkForNotification = async () => {
  await fetchNotifications();

  const notificationsArray = store.get('notifications.notifications', []) as any[];

  // Check if there are any unread notifications
  const unreadNotifications = notificationsArray.filter((notification: any) => {
    return notification.read === false;
  });

  // If there are unread notifications, generate a notification for the first one
  if (unreadNotifications.length > 0) {
    const notification = unreadNotifications[0];
    generateNotification(
      notification.title,
      notification.message,
      notification.button1Text,
      notification.urlForButton1,
      notification.timestamp,
    );
  }
};

const fifteenMinutes = 15 * 60 * 1000;

const checkForNotificationsPeriodically = () => {
  // Check on boot
  checkForNotification();

  // Check every 15 minutes
  setInterval(() => {
    checkForNotification();
  }, fifteenMinutes);
};

export { checkForNotificationsPeriodically };
