import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";
import { dailyLogsService, cravingsService, userService } from "@/services/firestore";
import type {
  AppState,
  AppContextType,
  OnboardingData,
  DailyLog,
  Craving,
  Partner,
} from "../types/interface";

const defaultOnboarding: OnboardingData = {
  goal: null,
  lastPeriodDate: null,
  cycleLength: 28,
  notificationsEnabled: false,
};

const defaultState: AppState = {
  onboardingComplete: false,
  onboardingData: defaultOnboarding,
  dailyLogs: [],
  cravings: [],
  partners: [],
  userName: "Guest",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user, userData, loading: authLoading } = useAuth();
  const [state, setState] = useState<AppState>(defaultState);
  const [loading, setLoading] = useState(true);

  // Sync state from Firebase when user/userData changes
  useEffect(() => {
    if (authLoading) return;

    if (user && userData) {
      // User is logged in - use Firebase data
      setState((prev) => ({
        ...prev,
        userName: userData.displayName || user.email?.split("@")[0] || "User",
        onboardingComplete: userData.onboardingComplete,
        onboardingData: {
          ...defaultOnboarding,
          ...userData.onboardingData,
        },
      }));

      // Subscribe to daily logs
      const unsubLogs = dailyLogsService.subscribe(user.uid, (logs) => {
        setState((prev) => ({
          ...prev,
          dailyLogs: logs.map((log) => ({
            date: log.date,
            mood: log.mood,
            flow: log.flow,
            symptoms: log.symptoms,
            notes: log.notes,
          })),
        }));
      });

      // Subscribe to cravings
      const unsubCravings = cravingsService.subscribe(user.uid, (cravings) => {
        setState((prev) => ({
          ...prev,
          cravings: cravings.map((c) => ({
            id: c.id,
            item: c.item,
            category: c.category,
            notes: c.notes,
            addedToList: c.fulfilled,
          })),
        }));
      });

      setLoading(false);

      return () => {
        unsubLogs();
        unsubCravings();
      };
    } else {
      // No user - load from AsyncStorage (offline mode)
      loadLocalState();
    }
  }, [user, userData, authLoading]);

  // Load state from AsyncStorage (for offline/guest mode)
  const loadLocalState = async () => {
    try {
      const stored = await AsyncStorage.getItem("rheo_state");
      if (stored) {
        const parsed = JSON.parse(stored);
        setState((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      /* use defaults */
    }
    setLoading(false);
  };

  // Save to AsyncStorage when not logged in
  useEffect(() => {
    if (!user && !authLoading) {
      saveLocalState();
    }
  }, [state, user, authLoading]);

  const saveLocalState = async () => {
    try {
      await AsyncStorage.setItem("rheo_state", JSON.stringify(state));
    } catch {
      /* silent */
    }
  };

  const setOnboardingData = async (data: Partial<OnboardingData>) => {
    setState((prev) => ({
      ...prev,
      onboardingData: { ...prev.onboardingData, ...data },
    }));

    // Sync to Firebase if logged in
    if (user) {
      try {
        await userService.updateOnboardingData(user.uid, data);
      } catch (err) {
        console.error("Error syncing onboarding data:", err);
      }
    }
  };

  const completeOnboarding = async () => {
    const lastPeriodDate =
      state.onboardingData.lastPeriodDate ||
      new Date(Date.now() - 12 * 86_400_000).toISOString().split("T")[0];

    setState((prev) => ({
      ...prev,
      onboardingComplete: true,
      onboardingData: {
        ...prev.onboardingData,
        lastPeriodDate,
      },
    }));

    // Sync to Firebase if logged in
    if (user) {
      try {
        await userService.updateOnboardingData(user.uid, { lastPeriodDate });
        await userService.completeOnboarding(user.uid);
      } catch (err) {
        console.error("Error completing onboarding:", err);
      }
    }
  };

  const saveDailyLog = async (log: DailyLog) => {
    setState((prev) => {
      const idx = prev.dailyLogs.findIndex((l) => l.date === log.date);
      const logs = [...prev.dailyLogs];
      if (idx >= 0) logs[idx] = log;
      else logs.push(log);
      return { ...prev, dailyLogs: logs };
    });

    // Sync to Firebase if logged in
    if (user) {
      try {
        await dailyLogsService.upsert(user.uid, log.date, {
          mood: log.mood,
          flow: log.flow,
          symptoms: log.symptoms,
          notes: log.notes,
        });
      } catch (err) {
        console.error("Error saving daily log:", err);
      }
    }
  };

  const getTodayLog = (): DailyLog | undefined => {
    const today = new Date().toISOString().split("T")[0];
    return state.dailyLogs.find((l) => l.date === today);
  };

  const addCraving = async (craving: Craving) => {
    setState((p) => ({ ...p, cravings: [...p.cravings, craving] }));

    // Sync to Firebase if logged in
    if (user) {
      try {
        await cravingsService.add(user.uid, {
          item: craving.item,
          category: (craving.category as "food" | "activity" | "gift" | "other") || "other",
          notes: craving.notes,
          fulfilled: craving.addedToList || false,
        });
      } catch (err) {
        console.error("Error adding craving:", err);
      }
    }
  };

  const removeCraving = async (id: string) => {
    setState((p) => ({ ...p, cravings: p.cravings.filter((c) => c.id !== id) }));

    // Sync to Firebase if logged in
    if (user) {
      try {
        await cravingsService.delete(id);
      } catch (err) {
        console.error("Error removing craving:", err);
      }
    }
  };

  const toggleCravingList = async (id: string) => {
    const craving = state.cravings.find((c) => c.id === id);
    if (!craving) return;

    setState((p) => ({
      ...p,
      cravings: p.cravings.map((c) =>
        c.id === id ? { ...c, addedToList: !c.addedToList } : c
      ),
    }));

    // Sync to Firebase if logged in
    if (user) {
      try {
        await cravingsService.update(id, { fulfilled: !craving.addedToList });
      } catch (err) {
        console.error("Error toggling craving:", err);
      }
    }
  };

  const addPartner = (partner: Partner) =>
    setState((p) => ({ ...p, partners: [...p.partners, partner] }));

  const updatePartner = (id: string, data: Partial<Partner>) =>
    setState((p) => ({
      ...p,
      partners: p.partners.map((pt) => (pt.id === id ? { ...pt, ...data } : pt)),
    }));

  const removePartner = (id: string) =>
    setState((p) => ({ ...p, partners: p.partners.filter((pt) => pt.id !== id) }));

  return (
    <AppContext.Provider
      value={{
        ...state,
        setOnboardingData,
        completeOnboarding,
        saveDailyLog,
        getTodayLog,
        addCraving,
        removeCraving,
        toggleCravingList,
        addPartner,
        updatePartner,
        removePartner,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
