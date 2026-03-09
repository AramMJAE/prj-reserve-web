"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Stay } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";

interface StayCardProps {
  stay: Stay;
}

export default function StayCard({ stay }: StayCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const { wishlistIds, toggleWishlist, showToast, compareIds, toggleCompare } = useStore();
  const isWished = wishlistIds.includes(stay.id);
  const isCompared = compareIds.includes(stay.id);

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isCompared && compareIds.length >= 3) {
      showToast("최대 3개까지 비교할 수 있습니다", "error");
      return;
    }
    toggleCompare(stay.id);
  };
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % stay.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + stay.images.length) % stay.images.length);
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipe = 50;
    if (Math.abs(diff) > minSwipe) {
      e.preventDefault();
      if (diff > 0) {
        setCurrentImage((prev) => (prev + 1) % stay.images.length);
      } else {
        setCurrentImage((prev) => (prev - 1 + stay.images.length) % stay.images.length);
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  }, [stay.images.length]);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isWished;
    toggleWishlist(stay.id);
    showToast(next ? "찜 목록에 추가되었습니다" : "찜 목록에서 제거되었습니다", next ? "success" : "info");
  };

  return (
    <Link href={`/stays/${stay.id}`} className="group block transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 rounded-card">
      {/* Image */}
      <div
        className="relative aspect-[4/3] rounded-card overflow-hidden mb-3"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={stay.images[currentImage]}
          alt={stay.name}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Image Navigation */}
        {stay.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M7.5 9L4.5 6l3-3" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 3l3 3-3 3" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </>
        )}

        {/* Image Dots */}
        {stay.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {stay.images.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-colors",
                  i === currentImage ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill={isWished ? "#D94040" : "none"}
            stroke={isWished ? "#D94040" : "white"}
            strokeWidth="1.5"
            className={cn(
              "drop-shadow transition-transform",
              isWished && "scale-110 animate-heart-pop"
            )}
          >
            <path d="M10 18C5.38 14.27 2 11.16 2 7.5 2 4.42 4.42 2 7.5 2c1.74 0 3.41.81 4.5 2.09A6.04 6.04 0 0116.5 2C19.58 2 22 4.42 22 7.5c0 3.66-3.38 6.77-8 10.5L10 18z" transform="scale(0.91) translate(1, 0)" />
          </svg>
        </button>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-medium text-primary">
          {stay.category}
        </div>
      </div>

      {/* Info */}
      <h3 className="text-[15px] font-semibold text-primary group-hover:text-accent transition-colors">
        {stay.name}
      </h3>
      <p className="text-[13px] text-text-secondary mt-0.5">
        {stay.region} · 최대 {stay.max_guests}인
      </p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[15px] font-semibold text-primary">
          {formatPrice(stay.price)}
          <span className="text-[12px] text-text-secondary font-normal"> / 1박</span>
        </span>
        <span className="text-[13px] text-text-secondary flex items-center gap-1">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="currentColor"
            className="text-accent"
          >
            <path d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.4 3.3 12.3l.7-4.1-3-2.9 4.2-.7L7 1z" />
          </svg>
          {stay.rating} ({stay.review_count})
        </span>
      </div>
      {/* Compare Button */}
      <button
        onClick={handleCompare}
        className={cn(
          "mt-2 w-full py-1.5 rounded-button text-[12px] font-medium border transition-all",
          isCompared
            ? "border-accent bg-accent/10 text-accent"
            : "border-gray-200 text-text-secondary hover:border-accent hover:text-accent"
        )}
      >
        {isCompared ? "비교 선택됨" : "비교하기"}
      </button>
    </Link>
  );
}
