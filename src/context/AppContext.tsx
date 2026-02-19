import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  partners: [
    {
      id: "1",
      name: "John Doe",
      role: "partner",
      moodSharing: true,
      periodAlerts: true,
    },
  ],
  userName: "Sarah",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);

  useEffect(() => {
    loadState();
  }, []);

  useEffect(() => {
    saveState();
  }, [state]);

  const loadState = async () => {
    try {
      const stored = await AsyncStorage.getItem("hercircle_state");
      if (stored) setState(JSON.parse(stored));
    } catch {
      /* use defaults */
    }
  };

  const saveState = async () => {
    try {
      await AsyncStorage.setItem("hercircle_state", JSON.stringify(state));
    } catch {
      /* silent */
    }
  };

  const setOnboardingData = (data: Partial<OnboardingData>) => {
    setState((prev) => ({
      ...prev,
      onboardingData: { ...prev.onboardingData, ...data },
    }));
  };

  const completeOnboarding = () => {
    setState((prev) => ({
      ...prev,
      onboardingComplete: true,
      onboardingData: {
        ...prev.onboardingData,
        lastPeriodDate:
          prev.onboardingData.lastPeriodDate ||
          new Date(Date.now() - 12 * 86_400_000).toISOString().split("T")[0],
      },
    }));
  };

  const saveDailyLog = (log: DailyLog) => {
    setState((prev) => {
      const idx = prev.dailyLogs.findIndex((l) => l.date === log.date);
      const logs = [...prev.dailyLogs];
      if (idx >= 0) logs[idx] = log;
      else logs.push(log);
      return { ...prev, dailyLogs: logs };
    });
  };

  const getTodayLog = (): DailyLog | undefined => {
    const today = new Date().toISOString().split("T")[0];
    return state.dailyLogs.find((l) => l.date === today);
  };

  const addCraving = (craving: Craving) =>
    setState((p) => ({ ...p, cravings: [...p.cravings, craving] }));

  const removeCraving = (id: string) =>
    setState((p) => ({ ...p, cravings: p.cravings.filter((c) => c.id !== id) }));

  const toggleCravingList = (id: string) =>
    setState((p) => ({
      ...p,
      cravings: p.cravings.map((c) =>
        c.id === id ? { ...c, addedToList: !c.addedToList } : c
      ),
    }));

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
