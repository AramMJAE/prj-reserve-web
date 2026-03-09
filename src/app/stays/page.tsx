"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Toast from "@/components/common/Toast";
import ScrollToTop from "@/components/common/ScrollToTop";
import { StayCardSkeleton } from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import StayCard from "@/components/stays/StayCard";
import StayFilter from "@/components/stays/StayFilter";
import CompareBar from "@/components/common/CompareBar";
import { getFilteredStays } from "@/lib/stays-api";
import type { Stay, SortOption } from "@/types";

function StaysContent() {
  const searchParams = useSearchParams();
  const region = searchParams.get("region") || "";
  const category = searchParams.get("category") || "";
  const sort = (searchParams.get("sort") as SortOption) || "recommended";
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const amenities = useMemo(() => searchParams.get("amenities")?.split(",").filter(Boolean) || [], [searchParams]);
  const guestsParam = searchParams.get("guests") ? Number(searchParams.get("guests")) : undefined;

  const [stays, setStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getFilteredStays({
      region,
      category,
      sort,
      minPrice,
      maxPrice,
      amenities,
      guests: guestsParam,
    }).then((data) => {
      setStays(data);
      setLoading(false);
    });
  }, [region, category, sort, minPrice, maxPrice, amenities, guestsParam]);

  return (
    <>
      {/* Filters */}
      <div className="bg-white border-b border-gray-100 sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <StayFilter
            currentRegion={region}
            currentCategory={category}
            currentSort={sort}
            currentMinPrice={minPrice}
            currentMaxPrice={maxPrice}
            currentAmenities={amenities}
            currentGuests={guestsParam}
          />
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[14px] text-text-secondary">
            {loading ? "검색 중..." : `${stays.length}개의 숙소`}
            {region && region !== "전체" && <span className="font-medium text-primary"> · {region}</span>}
            {category && category !== "전체" && <span className="font-medium text-primary"> · {category}</span>}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <StayCardSkeleton key={i} />
            ))}
          </div>
        ) : stays.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {stays.map((stay, i) => (
              <div key={stay.id} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(i, 7) * 0.05}s` }}>
                <StayCard stay={stay} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState type="search" />
        )}
      </div>
    </>
  );
}

export default function StaysPage() {
  return (
    <>
      <Header />
      <main className="pt-[72px] min-h-screen bg-bg-white">
        <Suspense
          fallback={
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {Array.from({ length: 8 }).map((_, i) => (
                  <StayCardSkeleton key={i} />
                ))}
              </div>
            </div>
          }
        >
          <StaysContent />
        </Suspense>
      </main>
      <CompareBar />
      <Footer />
      <Toast />
      <ScrollToTop />
    </>
  );
}
