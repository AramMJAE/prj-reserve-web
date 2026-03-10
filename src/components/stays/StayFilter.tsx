"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import type { SortOption } from "@/types";

const regions = [
  { value: "전체", label: "전체" },
  { value: "제주", label: "제주도" },
  { value: "강원", label: "강원도" },
  { value: "경상", label: "경상도" },
  { value: "전라", label: "전라도" },
  { value: "서울", label: "서울" },
  { value: "경기", label: "경기도" },
];
const categories = ["전체", "한옥", "펜션", "호텔", "게스트하우스"];
const sortOptions: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "추천순" },
  { value: "price_low", label: "가격 낮은순" },
  { value: "price_high", label: "가격 높은순" },
  { value: "rating", label: "평점순" },
  { value: "newest", label: "최신순" },
];

const allAmenities = [
  "와이파이", "주차", "조식", "수영장", "바베큐", "오션뷰",
  "마운틴뷰", "테라스", "세탁기", "에어컨", "스파", "자쿠지",
  "독채", "정원", "벽난로", "카페", "피트니스", "루프탑",
];

interface StayFilterProps {
  currentRegion: string;
  currentCategory: string;
  currentSort: SortOption;
  currentMinPrice?: number;
  currentMaxPrice?: number;
  currentAmenities?: string[];
  currentGuests?: number;
}

export default function StayFilter({
  currentRegion,
  currentCategory,
  currentSort,
  currentMinPrice,
  currentMaxPrice,
  currentAmenities = [],
}: StayFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    currentMinPrice || 30000,
    currentMaxPrice || 500000,
  ]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(currentAmenities);

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "전체" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/stays${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const applyAdvancedFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (priceRange[0] > 30000) params.set("minPrice", String(priceRange[0]));
    else params.delete("minPrice");
    if (priceRange[1] < 500000) params.set("maxPrice", String(priceRange[1]));
    else params.delete("maxPrice");
    if (selectedAmenities.length > 0) params.set("amenities", selectedAmenities.join(","));
    else params.delete("amenities");
    router.push(`/stays?${params.toString()}`);
    setShowAdvanced(false);
  };

  const clearAll = () => {
    router.push("/stays");
    setPriceRange([30000, 500000]);
    setSelectedAmenities([]);
  };

  const hasActiveFilters = currentRegion || currentCategory || currentMinPrice || currentMaxPrice || currentAmenities.length > 0;

  return (
    <div className="space-y-4">
      {/* Top Row: Region + Category */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap gap-1.5">
            {regions.map((r) => (
              <button
                key={r.value}
                onClick={() => updateParams("region", r.value)}
                className={cn(
                  "px-3 py-1.5 rounded-button text-[13px] font-medium transition-all",
                  (currentRegion === r.value || (!currentRegion && r.value === "전체"))
                    ? "bg-primary text-white"
                    : "bg-bg-off text-text-secondary hover:bg-gray-200"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: Category + Sort + Advanced */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => updateParams("category", c)}
              className={cn(
                "px-3 py-1.5 rounded-button text-[13px] font-medium transition-all",
                (currentCategory === c || (!currentCategory && c === "전체"))
                  ? "bg-primary text-white"
                  : "bg-bg-off text-text-secondary hover:bg-gray-200"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-button text-[13px] font-medium border transition-all",
              showAdvanced || hasActiveFilters
                ? "border-accent text-accent bg-accent/5"
                : "border-gray-200 text-text-secondary hover:border-gray-300"
            )}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 3.5h10M4 7h6M5.5 10.5h3" strokeLinecap="round" />
            </svg>
            필터
            {hasActiveFilters && (
              <span className="w-4 h-4 bg-accent text-white text-[10px] rounded-full flex items-center justify-center">
                !
              </span>
            )}
          </button>

          <select
            value={currentSort}
            onChange={(e) => updateParams("sort", e.target.value)}
            className="text-[13px] text-text-primary bg-bg-off border border-gray-200 rounded-button px-3 py-1.5 outline-none"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-[12px] text-text-secondary hover:text-error transition-colors"
            >
              초기화
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="bg-bg-off border border-gray-100 rounded-card p-5 animate-fade-in-up space-y-5">
          {/* Price Range */}
          <div>
            <h4 className="text-[13px] font-semibold text-primary mb-3">가격 범위</h4>
            <div className="space-y-3">
              {/* Quick Presets */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "~10만", min: 30000, max: 100000 },
                  { label: "10~20만", min: 100000, max: 200000 },
                  { label: "20~30만", min: 200000, max: 300000 },
                  { label: "30만~", min: 300000, max: 500000 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setPriceRange([preset.min, preset.max])}
                    className={cn(
                      "px-3 py-1 rounded-button text-[12px] font-medium border transition-all",
                      priceRange[0] === preset.min && priceRange[1] === preset.max
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-gray-200 text-text-secondary hover:border-gray-300"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              {/* Dual Range Slider */}
              <div className="relative pt-2 pb-1">
                <div className="relative h-1.5 bg-gray-200 rounded-full">
                  <div
                    className="absolute h-full bg-accent rounded-full"
                    style={{
                      left: `${((priceRange[0] - 30000) / (500000 - 30000)) * 100}%`,
                      right: `${100 - ((priceRange[1] - 30000) / (500000 - 30000)) * 100}%`,
                    }}
                  />
                </div>
                <input
                  type="range"
                  min={30000}
                  max={500000}
                  step={10000}
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1] - 10000), priceRange[1]])}
                  className="absolute top-1 w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-accent [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm"
                />
                <input
                  type="range"
                  min={30000}
                  max={500000}
                  step={10000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0] + 10000)])}
                  className="absolute top-1 w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-accent [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm"
                />
              </div>
              <div className="flex justify-between text-[13px] text-text-secondary">
                <span className="font-medium text-primary">{formatPrice(priceRange[0])}</span>
                <span className="text-[12px]">—</span>
                <span className="font-medium text-primary">{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h4 className="text-[13px] font-semibold text-primary mb-3">편의시설</h4>
            <div className="flex flex-wrap gap-2">
              {allAmenities.map((a) => (
                <button
                  key={a}
                  onClick={() => {
                    setSelectedAmenities((prev) =>
                      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
                    );
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-button text-[12px] font-medium border transition-all",
                    selectedAmenities.includes(a)
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-gray-200 text-text-secondary hover:border-gray-300"
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Apply */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setShowAdvanced(false)}
              className="px-4 py-2 text-[13px] text-text-secondary hover:bg-white rounded-button transition-colors"
            >
              취소
            </button>
            <button
              onClick={applyAdvancedFilters}
              className="px-5 py-2 bg-primary text-white text-[13px] font-medium rounded-button hover:bg-primary/90 transition-colors"
            >
              적용하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
