import { useEffect, useState, useCallback } from "react";
import { Alert } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { notificationsService, NOTIFICATION_TYPES, NOTIFICATION_TOPICS } from "@/services/notifications";

interface NotificationMessage {
  title?: string;
  body?: string;
  data?: Record<string, any>;
}

export function useNotifications() {
  const { user } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [lastNotification, setLastNotification] = useState<NotificationMessage | null>(null);

  // Register for notifications when user is authenticated
  useEffect(() => {
    if (!user) return;

    const setup = async () => {
      // Register device and get token
      await notificationsService.registerDevice(user.uid);
      const token = await notificationsService.getToken();
      setFcmToken(token);
      setHasPermission(!!token);

      // Subscribe to default topics
      await notificationsService.subscribeToTopic(NOTIFICATION_TOPICS.PERIOD_REMINDERS);
      await notificationsService.subscribeToTopic(NOTIFICATION_TOPICS.HEALTH_TIPS);
    };

    setup();

    // Listen for token refresh
    const unsubscribeTokenRefresh = notificationsService.onTokenRefresh(user.uid, (token) => {
      setFcmToken(token);
    });

    // Listen for foreground messages
    const unsubscribeForeground = notificationsService.onForegroundMessage((message) => {
      handleNotification(message);
    });

    // Set up background handler
    notificationsService.setBackgroundMessageHandler();

    // Check if app was opened from notification
    notificationsService.getInitialNotification().then((message) => {
      if (message) {
        handleNotificationOpen(message);
      }
    });

    return () => {
      unsubscribeTokenRefresh();
      unsubscribeForeground();
    };
  }, [user]);

  // Handle incoming notification in foreground
  const handleNotification = useCallback((message: any) => {
    const notification: NotificationMessage = {
      title: message.notification?.title,
      body: message.notification?.body,
      data: message.data,
    };

    setLastNotification(notification);

    // Show alert for foreground notifications
    if (notification.title || notification.body) {
      Alert.alert(
        notification.title || "Notification",
        notification.body || "",
        [{ text: "OK" }]
      );
    }

    // Handle specific notification types
    if (notification.data?.type) {
      handleNotificationType(notification.data.type, notification.data);
    }
  }, []);

  // Handle notification when user taps on it
  const handleNotificationOpen = useCallback((message: any) => {
    const data = message.data;
    if (data?.type) {
      handleNotificationType(data.type, data);
    }
  }, []);

  // Handle specific notification types
  const handleNotificationType = useCallback((type: string, data: Record<string, any>) => {
    switch (type) {
      case NOTIFICATION_TYPES.PERIOD_REMINDER:
        // Navigate to log screen or show reminder
        console.log("Period reminder received");
        break;
      case NOTIFICATION_TYPES.PARTNER_GIFT:
        // Navigate to gift reveal screen
        console.log("Partner gift received:", data);
        break;
      case NOTIFICATION_TYPES.PARTNER_INVITE:
        // Show partner invite dialog
        console.log("Partner invite received:", data);
        break;
      case NOTIFICATION_TYPES.HEALTH_TIP:
        // Show health tip
        console.log("Health tip received:", data);
        break;
      default:
        console.log("Unknown notification type:", type);
    }
  }, []);

  // Toggle period reminders
  const togglePeriodReminders = useCallback(async (enabled: boolean) => {
    if (enabled) {
      await notificationsService.subscribeToTopic(NOTIFICATION_TOPICS.PERIOD_REMINDERS);
    } else {
      await notificationsService.unsubscribeFromTopic(NOTIFICATION_TOPICS.PERIOD_REMINDERS);
    }
  }, []);

  // Toggle partner alerts
  const togglePartnerAlerts = useCallback(async (enabled: boolean) => {
    if (enabled) {
      await notificationsService.subscribeToTopic(NOTIFICATION_TOPICS.PARTNER_ALERTS);
    } else {
      await notificationsService.unsubscribeFromTopic(NOTIFICATION_TOPICS.PARTNER_ALERTS);
    }
  }, []);

  // Request permission manually
  const requestPermission = useCallback(async () => {
    const granted = await notificationsService.requestPermission();
    setHasPermission(granted);
    
    if (granted && user) {
      await notificationsService.registerDevice(user.uid);
      const token = await notificationsService.getToken();
      setFcmToken(token);
    }
    
    return granted;
  }, [user]);

  return {
    hasPermission,
    fcmToken,
    lastNotification,
    requestPermission,
    togglePeriodReminders,
    togglePartnerAlerts,
  };
}
