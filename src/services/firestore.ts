import firestore from "@react-native-firebase/firestore";
import {
  COLLECTIONS,
  type FirestoreDailyLog,
  type FirestoreCraving,
  type FirestorePartnerLink,
  type FirestoreGift,
  type FirestoreUser,
} from "@/lib/firebase";

// ============================================
// DAILY LOGS SERVICE
// ============================================

export const dailyLogsService = {
  // Get all logs for a user
  async getAll(userId: string): Promise<FirestoreDailyLog[]> {
    const snapshot = await firestore()
      .collection(COLLECTIONS.DAILY_LOGS)
      .where("userId", "==", userId)
      .orderBy("date", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirestoreDailyLog[];
  },

  // Get log for a specific date
  async getByDate(userId: string, date: string): Promise<FirestoreDailyLog | null> {
    const snapshot = await firestore()
      .collection(COLLECTIONS.DAILY_LOGS)
      .where("userId", "==", userId)
      .where("date", "==", date)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as FirestoreDailyLog;
  },

  // Create or update a daily log
  async upsert(userId: string, date: string, data: Partial<FirestoreDailyLog>): Promise<string> {
    const existing = await this.getByDate(userId, date);
    const now = firestore.Timestamp.now();

    if (existing) {
      await firestore()
        .collection(COLLECTIONS.DAILY_LOGS)
        .doc(existing.id)
        .update({
          ...data,
          updatedAt: now,
        });
      return existing.id;
    } else {
      const docRef = await firestore()
        .collection(COLLECTIONS.DAILY_LOGS)
        .add({
          userId,
          date,
          ...data,
          createdAt: now,
          updatedAt: now,
        });
      return docRef.id;
    }
  },

  // Subscribe to logs (real-time)
  subscribe(userId: string, callback: (logs: FirestoreDailyLog[]) => void) {
    return firestore()
      .collection(COLLECTIONS.DAILY_LOGS)
      .where("userId", "==", userId)
      .orderBy("date", "desc")
      .onSnapshot((snapshot) => {
        const logs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FirestoreDailyLog[];
        callback(logs);
      });
  },
};

// ============================================
// CRAVINGS SERVICE
// ============================================

export const cravingsService = {
  async getAll(userId: string): Promise<FirestoreCraving[]> {
    const snapshot = await firestore()
      .collection(COLLECTIONS.CRAVINGS)
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirestoreCraving[];
  },

  async add(userId: string, data: Omit<FirestoreCraving, "id" | "userId" | "createdAt">): Promise<string> {
    const docRef = await firestore()
      .collection(COLLECTIONS.CRAVINGS)
      .add({
        userId,
        ...data,
        createdAt: firestore.Timestamp.now(),
      });
    return docRef.id;
  },

  async update(id: string, data: Partial<FirestoreCraving>): Promise<void> {
    await firestore()
      .collection(COLLECTIONS.CRAVINGS)
      .doc(id)
      .update(data);
  },

  async delete(id: string): Promise<void> {
    await firestore()
      .collection(COLLECTIONS.CRAVINGS)
      .doc(id)
      .delete();
  },

  subscribe(userId: string, callback: (cravings: FirestoreCraving[]) => void) {
    return firestore()
      .collection(COLLECTIONS.CRAVINGS)
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const cravings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FirestoreCraving[];
        callback(cravings);
      });
  },
};

// ============================================
// PARTNER LINKS SERVICE
// ============================================

export const partnerService = {
  // Get partner link for a user
  async getPartnerLink(userId: string): Promise<FirestorePartnerLink | null> {
    const snapshot = await firestore()
      .collection(COLLECTIONS.PARTNER_LINKS)
      .where("userId", "==", userId)
      .where("status", "==", "active")
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as FirestorePartnerLink;
  },

  // Get pending invites for a user (by email)
  async getPendingInvites(email: string): Promise<FirestorePartnerLink[]> {
    const snapshot = await firestore()
      .collection(COLLECTIONS.PARTNER_LINKS)
      .where("partnerEmail", "==", email)
      .where("status", "==", "pending")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirestorePartnerLink[];
  },

  // Send partner invite
  async sendInvite(userId: string, partnerEmail: string): Promise<string> {
    const docRef = await firestore()
      .collection(COLLECTIONS.PARTNER_LINKS)
      .add({
        userId,
        partnerEmail,
        partnerId: "",
        status: "pending",
        createdAt: firestore.Timestamp.now(),
      });
    return docRef.id;
  },

  // Accept partner invite
  async acceptInvite(linkId: string, partnerId: string): Promise<void> {
    await firestore()
      .collection(COLLECTIONS.PARTNER_LINKS)
      .doc(linkId)
      .update({
        partnerId,
        status: "active",
      });
  },

  // Decline partner invite
  async declineInvite(linkId: string): Promise<void> {
    await firestore()
      .collection(COLLECTIONS.PARTNER_LINKS)
      .doc(linkId)
      .update({
        status: "declined",
      });
  },

  // Unlink partner
  async unlinkPartner(linkId: string): Promise<void> {
    await firestore()
      .collection(COLLECTIONS.PARTNER_LINKS)
      .doc(linkId)
      .delete();
  },

  // Get partner's user data (for partner dashboard)
  async getPartnerData(partnerId: string): Promise<FirestoreUser | null> {
    const doc = await firestore()
      .collection(COLLECTIONS.USERS)
      .doc(partnerId)
      .get();

    if (!doc.exists) return null;
    return { uid: doc.id, ...doc.data() } as FirestoreUser;
  },
};

// ============================================
// GIFTS SERVICE
// ============================================

export const giftsService = {
  async getReceivedGifts(userId: string): Promise<FirestoreGift[]> {
    const snapshot = await firestore()
      .collection(COLLECTIONS.GIFTS)
      .where("toUserId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirestoreGift[];
  },

  async getSentGifts(userId: string): Promise<FirestoreGift[]> {
    const snapshot = await firestore()
      .collection(COLLECTIONS.GIFTS)
      .where("fromUserId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirestoreGift[];
  },

  async sendGift(
    fromUserId: string,
    toUserId: string,
    giftType: string,
    message?: string
  ): Promise<string> {
    const docRef = await firestore()
      .collection(COLLECTIONS.GIFTS)
      .add({
        fromUserId,
        toUserId,
        giftType,
        message,
        status: "pending",
        createdAt: firestore.Timestamp.now(),
      });
    return docRef.id;
  },

  async markAsViewed(giftId: string): Promise<void> {
    await firestore()
      .collection(COLLECTIONS.GIFTS)
      .doc(giftId)
      .update({
        status: "viewed",
      });
  },

  subscribeToReceivedGifts(userId: string, callback: (gifts: FirestoreGift[]) => void) {
    return firestore()
      .collection(COLLECTIONS.GIFTS)
      .where("toUserId", "==", userId)
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const gifts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FirestoreGift[];
        callback(gifts);
      });
  },
};

// ============================================
// USER SERVICE
// ============================================

export const userService = {
  async updateOnboardingData(
    userId: string,
    data: Partial<FirestoreUser["onboardingData"]>
  ): Promise<void> {
    const userRef = firestore().collection(COLLECTIONS.USERS).doc(userId);
    const doc = await userRef.get();

    if (doc.exists) {
      const currentData = doc.data()?.onboardingData || {};
      await userRef.update({
        onboardingData: { ...currentData, ...data },
        updatedAt: firestore.Timestamp.now(),
      });
    }
  },

  async completeOnboarding(userId: string): Promise<void> {
    await firestore()
      .collection(COLLECTIONS.USERS)
      .doc(userId)
      .update({
        onboardingComplete: true,
        updatedAt: firestore.Timestamp.now(),
      });
  },

  async updateFcmToken(userId: string, token: string): Promise<void> {
    await firestore()
      .collection(COLLECTIONS.USERS)
      .doc(userId)
      .update({
        fcmToken: token,
        updatedAt: firestore.Timestamp.now(),
      });
  },
};
