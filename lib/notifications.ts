import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  
  if (existingStatus === 'granted') {
    return true;
  }
  
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/**
 * Get current notification permission status
 */
export async function getNotificationPermissionStatus(): Promise<'granted' | 'denied' | 'undetermined'> {
  const { status } = await Notifications.getPermissionsAsync();
  return status;
}

/**
 * Check if notifications are enabled
 */
export async function hasNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

/**
 * Send a local notification when slop is ready
 */
export async function notifySlopReady(slopId: number): Promise<void> {
  const hasPermission = await hasNotificationPermission();
  
  if (!hasPermission) {
    console.log('Notification permission not granted, skipping notification');
    return;
  }
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Your Slop is Ready! 🎨',
      body: 'Your AI masterpiece has been generated. Tap to view!',
      data: { slopId },
      sound: true,
    },
    trigger: null, // Send immediately
  });
}

/**
 * Send a notification for processing error
 */
export async function notifySlopError(): Promise<void> {
  const hasPermission = await hasNotificationPermission();
  
  if (!hasPermission) {
    return;
  }
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Slop Generation Failed',
      body: 'Something went wrong. Please try again.',
      sound: true,
    },
    trigger: null,
  });
}
