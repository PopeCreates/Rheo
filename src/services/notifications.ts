import messaging from "@react-native-firebase/messaging";
import { Platform, PermissionsAndroid } from "react-native";
import { userService } from "./firestore";

/**
 * Firebase Cloud Messaging Service
 * Handles push notifications for period reminders, partner alerts, etc.
 */

export const notificationsService = {
  /**
   * Request notification permissions from the user
   */
  async requestPermission(): Promise<boolean> {
    try {
      if (Platform.OS === "ios") {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        return enabled;
      } else {
        // Android 13+ requires runtime permission
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  },

  /**
   * Get the FCM token for this device
   */
  async getToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      return token;
    } catch (error) {
      console.error("Error getting FCM token:", error);
      return null;
    }
  },

  /**
   * Register the device for push notifications and save token to Firestore
   */
  async registerDevice(userId: string): Promise<void> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      console.log("Notification permission not granted");
      return;
    }

    const token = await this.getToken();
    if (token) {
      await userService.updateFcmToken(userId, token);
      console.log("FCM token saved successfully");
    }
  },

  /**
   * Listen for token refresh events
   */
  onTokenRefresh(userId: string, callback?: (token: string) => void): () => void {
    return messaging().onTokenRefresh(async (token) => {
      await userService.updateFcmToken(userId, token);
      callback?.(token);
    });
  },

  /**
   * Handle foreground messages
   */
  onForegroundMessage(callback: (message: any) => void): () => void {
    return messaging().onMessage(async (remoteMessage) => {
      console.log("Foreground message received:", remoteMessage);
      callback(remoteMessage);
    });
  },

  /**
   * Handle background/quit state messages
   */
  setBackgroundMessageHandler(): void {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Background message received:", remoteMessage);
      // Handle background message (e.g., update badge count, store notification)
    });
  },

  /**
   * Get initial notification if app was opened from a notification
   */
  async getInitialNotification(): Promise<any | null> {
    const remoteMessage = await messaging().getInitialNotification();
    return remoteMessage;
  },

  /**
   * Subscribe to a topic (e.g., for broadcast notifications)
   */
  async subscribeToTopic(topic: string): Promise<void> {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error(`Error subscribing to topic ${topic}:`, error);
    }
  },

  /**
   * Unsubscribe from a topic
   */
  async unsubscribeFromTopic(topic: string): Promise<void> {
    try {
      await messaging().unsubscribeFromTopic(topic);
      console.log(`Unsubscribed from topic: ${topic}`);
    } catch (error) {
      console.error(`Error unsubscribing from topic ${topic}:`, error);
    }
  },
};

// Notification topics
export const NOTIFICATION_TOPICS = {
  PERIOD_REMINDERS: "period_reminders",
  HEALTH_TIPS: "health_tips",
  PARTNER_ALERTS: "partner_alerts",
  APP_UPDATES: "app_updates",
} as const;

// Notification types for handling in the app
export const NOTIFICATION_TYPES = {
  PERIOD_REMINDER: "period_reminder",
  PERIOD_START: "period_start",
  PARTNER_GIFT: "partner_gift",
  PARTNER_MESSAGE: "partner_message",
  PARTNER_INVITE: "partner_invite",
  HEALTH_TIP: "health_tip",
  LOGGING_REMINDER: "logging_reminder",
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];
