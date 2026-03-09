export interface Stay {
  id: string;
  name: string;
  description: string;
  category: "펜션" | "한옥" | "호텔" | "게스트하우스";
  region: "제주" | "강원" | "경상" | "전라" | "서울" | "경기";
  address: string;
  latitude: number;
  longitude: number;
  price: number;
  max_guests: number;
  images: string[];
  amenities: string[];
  host_name: string;
  host_image: string;
  rating: number;
  review_count: number;
  created_at: string;
}

export interface Reservation {
  id: string;
  stay_id: string;
  user_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  created_at: string;
  stay?: Stay;
}

export interface Review {
  id: string;
  stay_id: string;
  user_id: string;
  rating: number;
  content: string;
  created_at: string;
  user_name?: string;
  user_image?: string;
}

export interface Wishlist {
  id: string;
  stay_id: string;
  user_id: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}

export type SortOption = "recommended" | "price_low" | "price_high" | "rating" | "newest";

export interface StayFilter {
  region?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
}
