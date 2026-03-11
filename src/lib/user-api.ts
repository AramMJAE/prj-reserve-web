import { supabase } from "./supabase";
import type { Reservation, Review } from "@/types";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isSupabaseUser(userId: string): boolean {
  return UUID_REGEX.test(userId);
}

// ─── Availability ───

export async function checkAvailability(
  stayId: string,
  checkIn: string,
  checkOut: string
): Promise<boolean> {
  if (supabase && UUID_REGEX.test(stayId)) {
    const { data, error } = await supabase.rpc("check_availability", {
      p_stay_id: stayId,
      p_check_in: checkIn,
      p_check_out: checkOut,
    });
    if (!error && typeof data === "boolean") return data;
    console.warn("[checkAvailability] RPC error:", error?.message);
  }

  // localStorage fallback
  const saved: Reservation[] = JSON.parse(
    localStorage.getItem("staylog_reservations") || "[]"
  );
  const overlap = saved.some(
    (r) =>
      r.stay_id === stayId &&
      (r.status === "confirmed" || r.status === "pending") &&
      r.check_in < checkOut &&
      r.check_out > checkIn
  );
  return !overlap;
}

export async function getBookedDateRanges(
  stayId: string
): Promise<{ check_in: string; check_out: string }[]> {
  if (supabase && UUID_REGEX.test(stayId)) {
    const { data, error } = await supabase.rpc("get_booked_dates", {
      p_stay_id: stayId,
    });
    if (!error && data) return data;
    console.warn("[getBookedDates] RPC error:", error?.message);
  }

  // localStorage fallback
  const saved: Reservation[] = JSON.parse(
    localStorage.getItem("staylog_reservations") || "[]"
  );
  return saved
    .filter(
      (r) =>
        r.stay_id === stayId &&
        (r.status === "confirmed" || r.status === "pending")
    )
    .map((r) => ({ check_in: r.check_in, check_out: r.check_out }));
}

// ─── Reservations ───

export async function createReservation(data: {
  stay_id: string;
  user_id: string;
  user_name: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
}): Promise<{ id: string; source: "supabase" | "local" }> {
  if (supabase && isSupabaseUser(data.user_id)) {
    const { data: row, error } = await supabase
      .from("reservations")
      .insert({
        stay_id: data.stay_id,
        user_id: data.user_id,
        user_name: data.user_name,
        check_in: data.check_in,
        check_out: data.check_out,
        guests: data.guests,
        total_price: data.total_price,
        status: "confirmed",
      })
      .select("id")
      .single();

    if (!error && row) {
      return { id: row.id, source: "supabase" };
    }
    console.warn("[createReservation] Supabase error:", error?.message);
  }

  // localStorage fallback
  const id = `rsv-${Date.now()}`;
  const reservation = {
    id,
    ...data,
    status: "confirmed" as const,
    created_at: new Date().toISOString(),
  };
  const saved = JSON.parse(localStorage.getItem("staylog_reservations") || "[]");
  saved.push(reservation);
  localStorage.setItem("staylog_reservations", JSON.stringify(saved));
  return { id, source: "local" };
}

export async function getUserReservations(userId: string): Promise<Reservation[]> {
  const localSaved: Reservation[] = JSON.parse(
    localStorage.getItem("staylog_reservations") || "[]"
  );

  if (supabase && isSupabaseUser(userId)) {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      const supabaseIds = new Set(data.map((r: Reservation) => r.id));
      const localOnly = localSaved.filter((r) => !supabaseIds.has(r.id));
      return [...(data as Reservation[]), ...localOnly];
    }
  }

  return localSaved;
}

export async function getReservationById(id: string, userId: string): Promise<Reservation | null> {
  if (supabase && isSupabaseUser(userId) && UUID_REGEX.test(id)) {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) return data as Reservation;
  }

  // localStorage fallback
  const saved: Reservation[] = JSON.parse(
    localStorage.getItem("staylog_reservations") || "[]"
  );
  return saved.find((r) => r.id === id) || null;
}

export async function updateReservation(
  id: string,
  userId: string,
  updates: Partial<Pick<Reservation, "check_in" | "check_out" | "guests" | "total_price" | "status">>
): Promise<boolean> {
  if (supabase && isSupabaseUser(userId) && UUID_REGEX.test(id)) {
    const { error } = await supabase
      .from("reservations")
      .update(updates)
      .eq("id", id)
      .eq("user_id", userId);

    if (!error) return true;
    console.warn("[updateReservation] Supabase error:", error?.message);
  }

  // localStorage fallback
  const saved: Reservation[] = JSON.parse(
    localStorage.getItem("staylog_reservations") || "[]"
  );
  const idx = saved.findIndex((r) => r.id === id);
  if (idx !== -1) {
    saved[idx] = { ...saved[idx], ...updates };
    localStorage.setItem("staylog_reservations", JSON.stringify(saved));
    return true;
  }
  return false;
}

// ─── Reviews ───

export async function createReview(data: {
  stay_id: string;
  user_id: string;
  rating: number;
  content: string;
  user_name: string;
}): Promise<{ id: string; source: "supabase" | "local" }> {
  if (supabase && isSupabaseUser(data.user_id)) {
    const { data: row, error } = await supabase
      .from("reviews")
      .insert({
        stay_id: data.stay_id,
        user_id: data.user_id,
        rating: data.rating,
        content: data.content,
        user_name: data.user_name,
      })
      .select("id")
      .single();

    if (!error && row) {
      return { id: row.id, source: "supabase" };
    }
    console.warn("[createReview] Supabase error:", error?.message);
  }

  // localStorage fallback
  const id = `rev-local-${Date.now()}`;
  const review = {
    id,
    stay_id: data.stay_id,
    user_id: data.user_id,
    rating: data.rating,
    content: data.content,
    created_at: new Date().toISOString(),
    user_name: data.user_name,
    user_image: "",
  };
  const saved = JSON.parse(localStorage.getItem("staylog_reviews") || "[]");
  saved.unshift(review);
  localStorage.setItem("staylog_reviews", JSON.stringify(saved));
  return { id, source: "local" };
}

export async function getReviewsByStay(stayId: string): Promise<Review[]> {
  const localSaved: Review[] = JSON.parse(
    localStorage.getItem("staylog_reviews") || "[]"
  ).filter((r: Review) => r.stay_id === stayId);

  if (supabase) {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("stay_id", stayId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      const supabaseIds = new Set(data.map((r: Review) => r.id));
      const localOnly = localSaved.filter((r) => !supabaseIds.has(r.id));
      return [...(data as Review[]), ...localOnly];
    }
  }

  return localSaved;
}

export async function getUserReviews(userId: string): Promise<Review[]> {
  const localSaved: Review[] = JSON.parse(
    localStorage.getItem("staylog_reviews") || "[]"
  ).filter((r: Review) => r.user_id === userId);

  if (supabase && isSupabaseUser(userId)) {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      const supabaseIds = new Set(data.map((r: Review) => r.id));
      const localOnly = localSaved.filter((r) => !supabaseIds.has(r.id));
      return [...(data as Review[]), ...localOnly];
    }
  }

  return localSaved;
}

export async function updateReview(
  id: string,
  userId: string,
  updates: { rating?: number; content?: string }
): Promise<boolean> {
  if (supabase && isSupabaseUser(userId) && UUID_REGEX.test(id)) {
    const { error } = await supabase
      .from("reviews")
      .update(updates)
      .eq("id", id)
      .eq("user_id", userId);

    if (!error) return true;
    console.warn("[updateReview] Supabase error:", error?.message);
  }

  // localStorage fallback
  const saved: Review[] = JSON.parse(localStorage.getItem("staylog_reviews") || "[]");
  const idx = saved.findIndex((r) => r.id === id);
  if (idx !== -1) {
    saved[idx] = { ...saved[idx], ...updates };
    localStorage.setItem("staylog_reviews", JSON.stringify(saved));
    return true;
  }
  return false;
}

export async function deleteReview(id: string, userId: string): Promise<boolean> {
  if (supabase && isSupabaseUser(userId) && UUID_REGEX.test(id)) {
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (!error) return true;
    console.warn("[deleteReview] Supabase error:", error?.message);
  }

  // localStorage fallback
  const saved: Review[] = JSON.parse(localStorage.getItem("staylog_reviews") || "[]");
  const filtered = saved.filter((r) => r.id !== id);
  localStorage.setItem("staylog_reviews", JSON.stringify(filtered));
  return true;
}

// ─── Wishlists ───

export async function getWishlistIds(userId: string): Promise<string[]> {
  if (supabase && isSupabaseUser(userId)) {
    const { data, error } = await supabase
      .from("wishlists")
      .select("stay_id")
      .eq("user_id", userId);

    if (!error && data) {
      return data.map((w: { stay_id: string }) => w.stay_id);
    }
  }

  return JSON.parse(localStorage.getItem("staylog_wishlist") || "[]");
}

export async function toggleWishlistItem(
  stayId: string,
  userId: string,
  currentlyWished: boolean
): Promise<boolean> {
  if (supabase && isSupabaseUser(userId)) {
    if (currentlyWished) {
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("stay_id", stayId)
        .eq("user_id", userId);
      if (!error) return true;
      console.warn("[toggleWishlist delete] error:", error?.message);
    } else {
      const { error } = await supabase
        .from("wishlists")
        .insert({ stay_id: stayId, user_id: userId });
      if (!error) return true;
      console.warn("[toggleWishlist insert] error:", error?.message);
    }
  }
  return false;
}
