"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { mockStays } from "@/data/mock-stays";
import { formatPrice, cn } from "@/lib/utils";

const regions = [
  { name: "제주", emoji: "" },
  { name: "강원", emoji: "" },
  { name: "경상", emoji: "" },
  { name: "전라", emoji: "" },
];

function StayCard({ stay }: { stay: (typeof mockStays)[number] }) {
  return (
    <Link href={`/stays/${stay.id}`} className="group block flex-shrink-0">
      <div className="relative aspect-[4/3] rounded-card overflow-hidden mb-3">
        <Image
          src={stay.images[0]}
          alt={stay.name}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          sizes="(max-width: 768px) 85vw, 33vw"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[12px] font-medium text-primary">
          {stay.category}
        </div>
      </div>
      <h4 className="text-[16px] font-semibold text-primary group-hover:text-accent transition-colors truncate">
        {stay.name}
      </h4>
      <p className="text-[13px] text-text-secondary mt-1">
        {stay.region} · {stay.address.split(" ").slice(0, 2).join(" ")}
      </p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[15px] font-semibold text-primary">
          {formatPrice(stay.price)}
          <span className="text-[12px] text-text-secondary font-normal"> / 1박</span>
        </span>
        <span className="text-[13px] text-text-secondary flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="text-accent">
            <path d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.4 3.3 12.3l.7-4.1-3-2.9 4.2-.7L7 1z" />
          </svg>
          {stay.rating} ({stay.review_count})
        </span>
      </div>
    </Link>
  );
}

function RegionCarousel({ regionName }: { regionName: string }) {
  const stays = mockStays
    .filter((s) => s.region === regionName)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 7);

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Desktop shows 3, mobile shows 1
  const maxDesktop = Math.max(0, stays.length - 3);
  const maxMobile = stays.length - 1;

  const next = useCallback(() => {
    setCurrent((prev) => {
      const max = window.innerWidth >= 768 ? maxDesktop : maxMobile;
      return prev >= max ? 0 : prev + 1;
    });
  }, [maxDesktop, maxMobile]);

  const prev = useCallback(() => {
    setCurrent((prev) => {
      const max = window.innerWidth >= 768 ? maxDesktop : maxMobile;
      return prev <= 0 ? max : prev - 1;
    });
  }, [maxDesktop, maxMobile]);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [isPaused, next]);

  // gap in px
  const gap = 24;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[20px] font-semibold text-primary">
          {regionName}
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {stays.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "transition-all duration-300 rounded-full",
                  i === current
                    ? "w-5 h-1.5 bg-accent"
                    : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
                )}
              />
            ))}
          </div>
          <div className="flex gap-1">
            <button
              onClick={prev}
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M7.5 9L4.5 6l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <button
              onClick={next}
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <Link
            href={`/stays?region=${encodeURIComponent(regionName)}`}
            className="text-[13px] text-text-secondary hover:text-accent transition-colors hidden sm:block"
          >
            더보기 &rarr;
          </Link>
        </div>
      </div>

      {/* Slide Track */}
      <div
        className="overflow-hidden"
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; touchEndX.current = null; }}
        onTouchMove={(e) => { touchEndX.current = e.touches[0].clientX; }}
        onTouchEnd={() => {
          if (touchStartX.current !== null && touchEndX.current !== null) {
            const diff = touchStartX.current - touchEndX.current;
            if (Math.abs(diff) > 50) {
              if (diff > 0) next();
              else prev();
            }
          }
          touchStartX.current = null;
          touchEndX.current = null;
        }}
      >
        <div
          ref={trackRef}
          className="flex transition-transform duration-500 ease-out"
          style={{
            gap: `${gap}px`,
            transform: `translateX(calc(-${current} * (calc((100% - ${gap * 2}px) / 3) + ${gap}px)))`,
          }}
        >
          {stays.map((stay) => (
            <div
              key={stay.id}
              className="flex-shrink-0"
              style={{ width: `calc((100% - ${gap * 2}px) / 3)` }}
            >
              <StayCard stay={stay} />
            </div>
          ))}
        </div>

        {/* Mobile override: show cards at full width */}
        <style jsx>{`
          @media (max-width: 767px) {
            div[class*="flex-shrink-0"] {
              width: 85vw !important;
            }
            div[class*="transition-transform"] {
              transform: translateX(calc(-${current} * (85vw + ${gap}px))) !important;
            }
          }
        `}</style>
      </div>

      <Link
        href={`/stays?region=${encodeURIComponent(regionName)}`}
        className="text-[13px] text-text-secondary hover:text-accent transition-colors mt-4 block sm:hidden"
      >
        더보기 &rarr;
      </Link>
    </div>
  );
}

export default function RegionSection() {
  return (
    <section className="py-section bg-bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-accent text-[13px] tracking-[0.2em] uppercase mb-3 font-inter">
            By Region
          </p>
          <h2 className="text-title-md font-serif font-bold text-primary">
            지역별 인기 숙소
          </h2>
        </div>

        <div className="space-y-16">
          {regions.map((region) => (
            <RegionCarousel key={region.name} regionName={region.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
