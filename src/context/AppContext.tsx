import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";
import * as supabaseService from "@/services/supabase";
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
  const { user, profile, loading: authLoading } = useAuth();
  const [state, setState] = useState<AppState>(defaultState);
  const [loading, setLoading] = useState(true);

  // Sync state from Supabase when user/profile changes
  useEffect(() => {
    if (authLoading) return;

    if (user && profile) {
      // User is logged in - use Supabase data
      setState((prev) => ({
        ...prev,
        userName: profile.display_name || user.email?.split("@")[0] || "User",
        onboardingComplete: profile.onboarding_complete || false,
        onboardingData: {
          ...defaultOnboarding,
          goal: profile.goal as OnboardingData["goal"],
          lastPeriodDate: profile.last_period_date,
          cycleLength: profile.cycle_length || 28,
          notificationsEnabled: profile.notifications_enabled || false,
        },
      }));

      // Load daily logs from Supabase
      loadDailyLogs(user.id);

      // Load cravings from Supabase
      loadCravings(user.id);

      setLoading(false);
    } else {
      // No user - load from AsyncStorage (offline mode)
      loadLocalState();
    }
  }, [user, profile, authLoading]);

  const loadDailyLogs = async (userId: string) => {
    try {
      const logs = await supabaseService.getDailyLogs(userId);
      setState((prev) => ({
        ...prev,
        dailyLogs: logs.map((log) => ({
          date: log.date,
          mood: log.mood as DailyLog["mood"],
          flow: log.flow as DailyLog["flow"],
          symptoms: log.symptoms || [],
          notes: log.notes || "",
        })),
      }));
    } catch (err) {
      console.error("Error loading daily logs:", err);
    }
  };

  const loadCravings = async (userId: string) => {
    try {
      const cravings = await supabaseService.getCravings(userId);
      setState((prev) => ({
        ...prev,
        cravings: cravings.map((c) => ({
          id: c.id,
          item: c.item,
          category: c.category,
          notes: c.notes || "",
          addedToList: c.fulfilled || false,
        })),
      }));
    } catch (err) {
      console.error("Error loading cravings:", err);
    }
  };

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

    // Sync to Supabase if logged in
    if (user) {
      try {
        await supabaseService.updateUserProfile(user.id, {
          goal: data.goal || undefined,
          last_period_date: data.lastPeriodDate || undefined,
          cycle_length: data.cycleLength || undefined,
          notifications_enabled: data.notificationsEnabled || undefined,
        });
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

    // Sync to Supabase if logged in
    if (user) {
      try {
        await supabaseService.updateUserProfile(user.id, {
          last_period_date: lastPeriodDate,
          onboarding_complete: true,
        });
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

    // Sync to Supabase if logged in
    if (user) {
      try {
        await supabaseService.saveDailyLog(user.id, {
          date: log.date,
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

    // Sync to Supabase if logged in
    if (user) {
      try {
        await supabaseService.addCraving(user.id, {
          item: craving.item,
          category: (craving.category as "food" | "activity" | "gift" | "other") || "other",
          notes: craving.notes || null,
          fulfilled: craving.addedToList || false,
        });
      } catch (err) {
        console.error("Error adding craving:", err);
      }
    }
  };

  const removeCraving = async (id: string) => {
    setState((p) => ({ ...p, cravings: p.cravings.filter((c) => c.id !== id) }));

    // Sync to Supabase if logged in
    if (user) {
      try {
        await supabaseService.deleteCraving(id);
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

    // Sync to Supabase if logged in
    if (user) {
      try {
        await supabaseService.updateCraving(id, { fulfilled: !craving.addedToList });
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
