"use client";

import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/store/useStore";
import { mockStays } from "@/data/mock-stays";

export default function CompareBar() {
  const { compareIds, clearCompare, toggleCompare } = useStore();

  if (compareIds.length === 0) return null;

  const stays = compareIds.map((id) => mockStays.find((s) => s.id === id)).filter(Boolean);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {stays.map((stay) =>
            stay ? (
              <div key={stay.id} className="flex items-center gap-2 bg-bg-off rounded-button px-2.5 py-1.5 min-w-0">
                <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                  <Image src={stay.images[0]} alt={stay.name} fill className="object-cover" sizes="32px" />
                </div>
                <span className="text-[13px] text-primary font-medium truncate hidden sm:block max-w-[120px]">
                  {stay.name}
                </span>
                <button
                  onClick={() => toggleCompare(stay.id)}
                  className="shrink-0 text-gray-400 hover:text-error transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4l6 6M10 4l-6 6" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ) : null
          )}
          {compareIds.length < 3 && (
            <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0">
              <span className="text-[11px] text-gray-400">+</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompare}
            className="px-3 py-1.5 text-[13px] text-text-secondary hover:text-error transition-colors"
          >
            초기화
          </button>
          <Link
            href="/compare"
            className="px-4 py-2 bg-primary text-white text-[13px] font-medium rounded-button hover:bg-primary/90 transition-colors"
          >
            비교하기 ({compareIds.length})
          </Link>
        </div>
      </div>
    </div>
  );
}
