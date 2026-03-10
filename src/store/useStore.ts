"use client";

import { create } from "zustand";
import type { StayFilter, SortOption } from "@/types";
import { toggleWishlistItem, getWishlistIds, isSupabaseUser } from "@/lib/user-api";

interface SearchState {
  region: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
}

interface AppState {
  // Search
  search: SearchState;
  setSearch: (search: Partial<SearchState>) => void;

  // Filter
  filter: StayFilter;
  setFilter: (filter: Partial<StayFilter>) => void;
  resetFilter: () => void;

  // Sort
  sort: SortOption;
  setSort: (sort: SortOption) => void;

  // Wishlist (persisted)
  wishlistIds: string[];
  toggleWishlist: (stayId: string) => void;
  initWishlist: () => void;

  // Auth
  user: { id: string; email: string; name: string; role?: string } | null;
  setUser: (user: { id: string; email: string; name: string; role?: string } | null) => void;

  // Toast
  toast: { message: string; type: "success" | "error" | "info" } | null;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  hideToast: () => void;

  // Recently viewed
  recentlyViewed: string[];
  addRecentlyViewed: (stayId: string) => void;

  // Compare
  compareIds: string[];
  toggleCompare: (stayId: string) => void;
  clearCompare: () => void;
}

const initialFilter: StayFilter = {};

export const useStore = create<AppState>((set) => ({
  // Search
  search: {
    region: "",
    checkIn: null,
    checkOut: null,
    guests: 2,
  },
  setSearch: (search) =>
    set((state) => ({ search: { ...state.search, ...search } })),

  // Filter
  filter: initialFilter,
  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),
  resetFilter: () => set({ filter: initialFilter }),

  // Sort
  sort: "recommended",
  setSort: (sort) => set({ sort }),

  // Wishlist
  wishlistIds: [],
  toggleWishlist: (stayId) => {
    set((state) => {
      const currentlyWished = state.wishlistIds.includes(stayId);
      const next = currentlyWished
        ? state.wishlistIds.filter((id) => id !== stayId)
        : [...state.wishlistIds, stayId];
      if (typeof window !== "undefined") {
        localStorage.setItem("staylog_wishlist", JSON.stringify(next));
      }
      // Supabase 비동기 동기화
      const userId = state.user?.id;
      if (userId && isSupabaseUser(userId)) {
        toggleWishlistItem(stayId, userId, currentlyWished);
      }
      return { wishlistIds: next };
    });
  },
  initWishlist: () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("staylog_wishlist");
      if (saved) {
        try {
          set({ wishlistIds: JSON.parse(saved) });
        } catch {
          // ignore
        }
      }
      // Supabase 유저라면 서버에서 찜 목록 로드
      const userStr = localStorage.getItem("staylog_user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user?.id && isSupabaseUser(user.id)) {
            getWishlistIds(user.id).then((ids) => {
              if (ids.length > 0) {
                set({ wishlistIds: ids });
                localStorage.setItem("staylog_wishlist", JSON.stringify(ids));
              }
            });
          }
        } catch {
          // ignore
        }
      }
    }
  },

  // Auth
  user: null,
  setUser: (user) => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("staylog_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("staylog_user");
      }
    }
    set({ user });
  },

  // Toast
  toast: null,
  showToast: (message, type = "info") => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),

  // Recently viewed
  recentlyViewed: [],
  addRecentlyViewed: (stayId) => {
    set((state) => {
      const filtered = state.recentlyViewed.filter((id) => id !== stayId);
      const next = [stayId, ...filtered].slice(0, 10);
      if (typeof window !== "undefined") {
        localStorage.setItem("staylog_recent", JSON.stringify(next));
      }
      return { recentlyViewed: next };
    });
  },
  // Compare
  compareIds: [],
  toggleCompare: (stayId) => {
    set((state) => {
      let next: string[];
      if (state.compareIds.includes(stayId)) {
        next = state.compareIds.filter((id) => id !== stayId);
      } else if (state.compareIds.length >= 3) {
        return state;
      } else {
        next = [...state.compareIds, stayId];
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("staylog_compare", JSON.stringify(next));
      }
      return { compareIds: next };
    });
  },
  clearCompare: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("staylog_compare");
    }
    set({ compareIds: [] });
  },
}));

// Initialize from localStorage on client
if (typeof window !== "undefined") {
  const savedWishlist = localStorage.getItem("staylog_wishlist");
  const savedUser = localStorage.getItem("staylog_user");
  const savedRecent = localStorage.getItem("staylog_recent");
  const savedCompare = localStorage.getItem("staylog_compare");

  const updates: Partial<AppState> = {};
  if (savedWishlist) {
    try { updates.wishlistIds = JSON.parse(savedWishlist); } catch { /* ignore */ }
  }
  if (savedUser) {
    try { updates.user = JSON.parse(savedUser); } catch { /* ignore */ }
  }
  if (savedRecent) {
    try { updates.recentlyViewed = JSON.parse(savedRecent); } catch { /* ignore */ }
  }
  if (savedCompare) {
    try { updates.compareIds = JSON.parse(savedCompare); } catch { /* ignore */ }
  }
  if (Object.keys(updates).length > 0) {
    useStore.setState(updates);
  }
}
