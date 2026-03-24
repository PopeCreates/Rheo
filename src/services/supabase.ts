import { supabase } from "@/lib/supabase";
import type { DailyLog, Craving, PartnerLink, Gift, Profile } from "@/types/database";

// ============== DAILY LOGS ==============

export async function getDailyLogs(userId: string) {
  const { data, error } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw error;
  return data as DailyLog[];
}

export async function getDailyLogByDate(userId: string, date: string) {
  const { data, error } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data as DailyLog | null;
}

export async function saveDailyLog(userId: string, log: Omit<DailyLog, "id" | "user_id" | "created_at" | "updated_at">) {
  // Check if log exists for this date
  const existing = await getDailyLogByDate(userId, log.date);

  if (existing) {
    // Update
    const { data, error } = await supabase
      .from("daily_logs")
      .update({
        ...log,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;
    return data as DailyLog;
  } else {
    // Insert
    const { data, error } = await supabase
      .from("daily_logs")
      .insert({
        user_id: userId,
        ...log,
      })
      .select()
      .single();

    if (error) throw error;
    return data as DailyLog;
  }
}

export async function deleteDailyLog(logId: string) {
  const { error } = await supabase
    .from("daily_logs")
    .delete()
    .eq("id", logId);

  if (error) throw error;
}

// ============== CRAVINGS ==============

export async function getCravings(userId: string) {
  const { data, error } = await supabase
    .from("cravings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Craving[];
}

export async function addCraving(userId: string, craving: Omit<Craving, "id" | "user_id" | "created_at">) {
  const { data, error } = await supabase
    .from("cravings")
    .insert({
      user_id: userId,
      ...craving,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Craving;
}

export async function updateCraving(cravingId: string, updates: Partial<Craving>) {
  const { data, error } = await supabase
    .from("cravings")
    .update(updates)
    .eq("id", cravingId)
    .select()
    .single();

  if (error) throw error;
  return data as Craving;
}

export async function deleteCraving(cravingId: string) {
  const { error } = await supabase
    .from("cravings")
    .delete()
    .eq("id", cravingId);

  if (error) throw error;
}

// ============== PARTNER LINKS ==============

export async function getPartnerLink(userId: string) {
  const { data, error } = await supabase
    .from("partner_links")
    .select("*")
    .or(`owner_id.eq.${userId},partner_id.eq.${userId}`)
    .eq("status", "accepted")
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data as PartnerLink | null;
}

export async function getPendingPartnerRequests(userId: string) {
  const { data, error } = await supabase
    .from("partner_links")
    .select("*")
    .eq("partner_id", userId)
    .eq("status", "pending");

  if (error) throw error;
  return data as PartnerLink[];
}

export async function sendPartnerRequest(
  ownerId: string,
  partnerEmail: string,
  permissions: PartnerLink["permissions"]
) {
  // Find user by email
  const { data: profiles, error: searchError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", partnerEmail)
    .single();

  if (searchError || !profiles) {
    throw new Error("User not found with that email");
  }

  const { data, error } = await supabase
    .from("partner_links")
    .insert({
      owner_id: ownerId,
      partner_id: profiles.id,
      partner_email: partnerEmail,
      status: "pending",
      permissions,
    })
    .select()
    .single();

  if (error) throw error;
  return data as PartnerLink;
}

export async function respondToPartnerRequest(linkId: string, accept: boolean) {
  const { data, error } = await supabase
    .from("partner_links")
    .update({
      status: accept ? "accepted" : "rejected",
      accepted_at: accept ? new Date().toISOString() : null,
    })
    .eq("id", linkId)
    .select()
    .single();

  if (error) throw error;
  return data as PartnerLink;
}

export async function removePartnerLink(linkId: string) {
  const { error } = await supabase
    .from("partner_links")
    .delete()
    .eq("id", linkId);

  if (error) throw error;
}

// ============== GIFTS ==============

export async function getGifts(userId: string) {
  const { data, error } = await supabase
    .from("gifts")
    .select("*")
    .eq("recipient_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Gift[];
}

export async function sendGift(
  senderId: string,
  recipientId: string,
  gift: Omit<Gift, "id" | "sender_id" | "recipient_id" | "created_at" | "status">
) {
  const { data, error } = await supabase
    .from("gifts")
    .insert({
      sender_id: senderId,
      recipient_id: recipientId,
      status: "pending",
      ...gift,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Gift;
}

export async function updateGiftStatus(giftId: string, status: Gift["status"]) {
  const { data, error } = await supabase
    .from("gifts")
    .update({ status })
    .eq("id", giftId)
    .select()
    .single();

  if (error) throw error;
  return data as Gift;
}

// ============== PROFILE ==============

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data as Profile | null;
}

export async function updateUserProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}
