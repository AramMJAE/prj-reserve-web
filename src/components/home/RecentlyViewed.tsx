"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/store/useStore";
import { getStaysByIds } from "@/lib/stays-api";
import { formatPrice } from "@/lib/utils";
import type { Stay } from "@/types";

export default function RecentlyViewed() {
  const { recentlyViewed } = useStore();
  const [stays, setStays] = useState<Stay[]>([]);

  useEffect(() => {
    if (recentlyViewed.length > 0) {
      getStaysByIds(recentlyViewed).then(setStays);
    }
  }, [recentlyViewed]);

  if (stays.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-[22px] sm:text-[26px] font-serif font-bold text-primary">
              최근 본 숙소
            </h2>
            <p className="text-[14px] text-text-secondary mt-1">
              다시 한번 둘러보세요
            </p>
          </div>
          <Link
            href="/stays"
            className="text-[13px] font-medium text-accent hover:underline"
          >
            전체보기
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {stays.map((stay, i) => (
            <Link
              key={stay.id}
              href={`/stays/${stay.id}`}
              className="group shrink-0 w-[200px] sm:w-[220px] animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="relative aspect-[4/3] rounded-card overflow-hidden mb-2">
                <Image
                  src={stay.images[0]}
                  alt={stay.name}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  sizes="220px"
                />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium text-primary">
                  {stay.category}
                </div>
              </div>
              <h3 className="text-[14px] font-semibold text-primary group-hover:text-accent transition-colors truncate">
                {stay.name}
              </h3>
              <p className="text-[12px] text-text-secondary mt-0.5">
                {stay.region} · {stay.category}
              </p>
              <p className="text-[14px] font-semibold text-primary mt-1">
                {formatPrice(stay.price)}
                <span className="text-[11px] text-text-secondary font-normal"> / 1박</span>
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
