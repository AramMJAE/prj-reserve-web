import { supabase } from "./supabase";
import { mockStays } from "@/data/mock-stays";
import type { Stay, SortOption } from "@/types";

// Supabase에서 전체 숙소 가져오기 (fallback: mock data)
export async function getAllStays(): Promise<Stay[]> {
  if (!supabase) return mockStays;

  const { data, error } = await supabase
    .from("stays")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    console.warn("Supabase fetch failed, using mock data:", error?.message);
    return mockStays;
  }

  return data as Stay[];
}

// 필터링된 숙소 가져오기
export async function getFilteredStays(params: {
  region?: string;
  category?: string;
  sort?: SortOption;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  guests?: number;
}): Promise<Stay[]> {
  if (!supabase) return filterMockStays(params);

  let query = supabase.from("stays").select("*");

  if (params.region && params.region !== "전체") {
    query = query.eq("region", params.region);
  }
  if (params.category && params.category !== "전체") {
    query = query.eq("category", params.category);
  }
  if (params.minPrice) {
    query = query.gte("price", params.minPrice);
  }
  if (params.maxPrice) {
    query = query.lte("price", params.maxPrice);
  }
  if (params.guests) {
    query = query.gte("max_guests", params.guests);
  }

  // 정렬
  switch (params.sort) {
    case "price_low":
      query = query.order("price", { ascending: true });
      break;
    case "price_high":
      query = query.order("price", { ascending: false });
      break;
    case "rating":
      query = query.order("rating", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query.order("review_count", { ascending: false });
  }

  const { data, error } = await query;

  if (error || !data) {
    console.warn("Supabase query failed, using mock data:", error?.message);
    return filterMockStays(params);
  }

  let stays = data as Stay[];

  // amenities 필터는 클라이언트에서 처리 (Supabase array contains)
  if (params.amenities && params.amenities.length > 0) {
    stays = stays.filter((s) =>
      params.amenities!.every((a) => s.amenities.includes(a))
    );
  }

  return stays;
}

// 단일 숙소 가져오기 (UUID)
export async function getStayById(id: string): Promise<Stay | null> {
  if (!supabase) {
    return mockStays.find((s) => s.id === id) || null;
  }

  const { data, error } = await supabase
    .from("stays")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    // fallback to mock data
    const mock = mockStays.find((s) => s.id === id);
    return mock || null;
  }

  return data as Stay;
}

// 지역별 숙소 가져오기
export async function getStaysByRegion(region: string, limit = 7): Promise<Stay[]> {
  if (!supabase) {
    return mockStays
      .filter((s) => s.region === region)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  const { data, error } = await supabase
    .from("stays")
    .select("*")
    .eq("region", region)
    .order("rating", { ascending: false })
    .limit(limit);

  if (error || !data || data.length === 0) {
    return mockStays
      .filter((s) => s.region === region)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  return data as Stay[];
}

// 추천 숙소 가져오기 (평점 높은 순)
export async function getFeaturedStays(limit = 4): Promise<Stay[]> {
  if (!supabase) {
    return mockStays.sort((a, b) => b.rating - a.rating).slice(0, limit);
  }

  const { data, error } = await supabase
    .from("stays")
    .select("*")
    .order("rating", { ascending: false })
    .limit(limit);

  if (error || !data || data.length === 0) {
    return mockStays.sort((a, b) => b.rating - a.rating).slice(0, limit);
  }

  return data as Stay[];
}

// 비슷한 숙소 가져오기
export async function getSimilarStays(currentStay: Stay, limit = 4): Promise<Stay[]> {
  if (!supabase) {
    return mockStays
      .filter(
        (s) =>
          s.id !== currentStay.id &&
          (s.region === currentStay.region || s.category === currentStay.category)
      )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  const { data, error } = await supabase
    .from("stays")
    .select("*")
    .neq("id", currentStay.id)
    .or(`region.eq.${currentStay.region},category.eq.${currentStay.category}`)
    .order("rating", { ascending: false })
    .limit(limit);

  if (error || !data || data.length === 0) {
    return mockStays
      .filter(
        (s) =>
          s.id !== currentStay.id &&
          (s.region === currentStay.region || s.category === currentStay.category)
      )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  return data as Stay[];
}

// 여러 ID로 숙소 가져오기 (비교 페이지용)
export async function getStaysByIds(ids: string[]): Promise<Stay[]> {
  if (ids.length === 0) return [];

  if (!supabase) {
    return ids
      .map((id) => mockStays.find((s) => s.id === id))
      .filter(Boolean) as Stay[];
  }

  const { data, error } = await supabase
    .from("stays")
    .select("*")
    .in("id", ids);

  if (error || !data || data.length === 0) {
    return ids
      .map((id) => mockStays.find((s) => s.id === id))
      .filter(Boolean) as Stay[];
  }

  // 요청한 순서대로 정렬
  const stayMap = new Map((data as Stay[]).map((s) => [s.id, s]));
  return ids.map((id) => stayMap.get(id)).filter(Boolean) as Stay[];
}

// Mock data 클라이언트 필터링 (fallback)
function filterMockStays(params: {
  region?: string;
  category?: string;
  sort?: SortOption;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  guests?: number;
}): Stay[] {
  let stays = [...mockStays];

  if (params.region && params.region !== "전체") {
    stays = stays.filter((s) => s.region === params.region);
  }
  if (params.category && params.category !== "전체") {
    stays = stays.filter((s) => s.category === params.category);
  }
  if (params.minPrice) {
    stays = stays.filter((s) => s.price >= params.minPrice!);
  }
  if (params.maxPrice) {
    stays = stays.filter((s) => s.price <= params.maxPrice!);
  }
  if (params.amenities && params.amenities.length > 0) {
    stays = stays.filter((s) =>
      params.amenities!.every((a) => s.amenities.includes(a))
    );
  }
  if (params.guests) {
    stays = stays.filter((s) => s.max_guests >= params.guests!);
  }

  switch (params.sort) {
    case "price_low":
      stays.sort((a, b) => a.price - b.price);
      break;
    case "price_high":
      stays.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      stays.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      stays.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
    default:
      stays.sort((a, b) => b.review_count - a.review_count);
  }

  return stays;
}
