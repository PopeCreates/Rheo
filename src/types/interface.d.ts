/* ─── Onboarding ─── */
export type AppGoal = "track_cycle" | "plan_pregnancy" | "health_insights";

export interface OnboardingData {
  goal: AppGoal | null;
  lastPeriodDate: string | null;
  cycleLength: number;
  notificationsEnabled: boolean;
}

/* ─── Cycle ─── */
export type CyclePhase =
  | "menstrual"
  | "follicular"
  | "ovulation"
  | "luteal"
  | "late_luteal";

/* ─── Moods ─── */
export type MoodType =
  | "happy"
  | "sensitive"
  | "tired"
  | "anxious"
  | "calm"
  | "other";

/* ─── Symptoms ─── */
export type SymptomType =
  | "bloating"
  | "headache"
  | "acne"
  | "cramps"
  | "backache"
  | "spotting";

/* ─── Flow ─── */
export type FlowIntensity = "none" | "light" | "medium" | "heavy";

/* ─── Daily Log ─── */
export interface DailyLog {
  date: string;
  mood: MoodType | null;
  flow: FlowIntensity;
  symptoms: SymptomType[];
  notes: string;
  waterIntake: number;
  sleepHours: number;
}

/* ─── Cravings ─── */
export type CravingCategory = "sweet" | "salty" | "cool" | "savory";

export interface Craving {
  id: string;
  name: string;
  description: string;
  category: CravingCategory;
  imageUrl?: string;
  addedToList: boolean;
}

/* ─── Partner ─── */
export type PartnerRole = "partner" | "friend" | "family";

export interface Partner {
  id: string;
  name: string;
  role: PartnerRole;
  moodSharing: boolean;
  periodAlerts: boolean;
  avatarUrl?: string;
}

/* ─── Gifts ─── */
export type GiftCategory = "flowers" | "chocolates" | "wellness";

export interface Gift {
  id: string;
  name: string;
  description: string;
  price: number;
  category: GiftCategory;
  imageUrl?: string;
}

/* ─── App State ─── */
export interface AppState {
  onboardingComplete: boolean;
  onboardingData: OnboardingData;
  dailyLogs: DailyLog[];
  cravings: Craving[];
  partners: Partner[];
  userName: string;
}

/* ─── Context API ─── */
export interface AppContextType extends AppState {
  setOnboardingData: (data: Partial<OnboardingData>) => void;
  completeOnboarding: () => void;
  saveDailyLog: (log: DailyLog) => void;
  getTodayLog: () => DailyLog | undefined;
  addCraving: (craving: Craving) => void;
  removeCraving: (id: string) => void;
  toggleCravingList: (id: string) => void;
  addPartner: (partner: Partner) => void;
  updatePartner: (id: string, data: Partial<Partner>) => void;
  removePartner: (id: string) => void;
}

/* ─── Reusable UI Props ─── */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  textClassName?: string;
}

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  stepText?: string;
}

export interface ProgressDotsProps {
  total: number;
  current: number;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
}

export interface ToggleSwitchProps {
  value: boolean;
  onToggle: (value: boolean) => void;
}

export interface IconCircleProps {
  name: string;
  size?: number;
  color?: string;
  bgClassName?: string;
}

/* ─── Goal option (onboarding) ─── */
export interface GoalOption {
  id: AppGoal;
  title: string;
  subtitle: string;
  icon: string;
}

/* ─── Mood / Symptom option (logger) ─── */
export interface MoodOption {
  id: MoodType;
  label: string;
  icon: string;
}

export interface SymptomOption {
  id: SymptomType;
  label: string;
  icon: string;
}
