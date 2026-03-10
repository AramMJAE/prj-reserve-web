"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllStays } from "@/lib/stays-api";
import { formatPrice } from "@/lib/utils";
import type { Stay } from "@/types";

interface Theme {
  label: string;
  icon: string;
  filter: (stays: Stay[]) => Stay[];
  reason: (stay: Stay) => string;
}

const themes: Theme[] = [
  {
    label: "조용한 힐링",
    icon: "M12 3c.3 0 .5.1.7.3l5.7 5.7c.2.2.3.4.3.7V20c0 .6-.4 1-1 1H6.3c-.6 0-1-.4-1-1V9.7c0-.3.1-.5.3-.7l5.7-5.7c.2-.2.4-.3.7-.3z",
    filter: (stays) =>
      stays.filter(
        (s) =>
          s.category === "펜션" &&
          (s.amenities.includes("독채") || s.amenities.includes("정원"))
      ),
    reason: (stay) =>
      `${stay.amenities.includes("독채") ? "독채" : "정원"}이 있는 ${stay.region} ${stay.category}으로, 조용한 힐링에 적합해요`,
  },
  {
    label: "감성 한옥",
    icon: "M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6",
    filter: (stays) => stays.filter((s) => s.category === "한옥"),
    reason: (stay) =>
      `${stay.region}의 전통 한옥으로, 평점 ${stay.rating}의 감성 넘치는 공간이에요`,
  },
  {
    label: "오션뷰 휴양",
    icon: "M2 12c1.3-1.3 3-2 5-2s3.7.7 5 2c1.3-1.3 3-2 5-2s3.7.7 5 2M2 17c1.3-1.3 3-2 5-2s3.7.7 5 2c1.3-1.3 3-2 5-2s3.7.7 5 2",
    filter: (stays) =>
      stays.filter(
        (s) =>
          s.amenities.includes("오션뷰") || s.amenities.includes("수영장")
      ),
    reason: (stay) =>
      `${stay.amenities.includes("오션뷰") ? "바다 전망" : "수영장"}을 갖춘 ${stay.region} 숙소로, 휴양에 딱이에요`,
  },
  {
    label: "가족과 함께",
    icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    filter: (stays) => stays.filter((s) => s.max_guests >= 4),
    reason: (stay) =>
      `최대 ${stay.max_guests}인까지 수용 가능한 ${stay.region} ${stay.category}으로, 가족 여행에 안성맞춤이에요`,
  },
  {
    label: "럭셔리 스테이",
    icon: "M12 2l2.9 6.3 6.9.9-5 4.8 1.2 6.9L12 17.3 6 20.9l1.2-6.9-5-4.8 6.9-.9L12 2z",
    filter: (stays) => stays.filter((s) => s.price >= 200000),
    reason: (stay) =>
      `${stay.region}의 프리미엄 ${stay.category}, 평점 ${stay.rating}로 특별한 경험을 선사해요`,
  },
  {
    label: "자연 속 독채",
    icon: "M5 10l7-7 7 7M4 10v10h16V10M9 21v-6h6v6",
    filter: (stays) =>
      stays.filter(
        (s) =>
          s.amenities.includes("독채") &&
          (s.amenities.includes("마운틴뷰") || s.amenities.includes("정원"))
      ),
    reason: (stay) =>
      `${stay.region}의 자연 속 독채로, ${stay.amenities.includes("마운틴뷰") ? "산 전망" : "넓은 정원"}이 매력적이에요`,
  },
];

export default function AIRecommendation() {
  const [allStays, setAllStays] = useState<Stay[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<number | null>(null);
  const [results, setResults] = useState<Stay[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState("");

  useEffect(() => {
    getAllStays().then(setAllStays);
  }, []);

  const handleThemeClick = (index: number) => {
    if (isThinking) return;
    setSelectedTheme(index);
    setIsThinking(true);
    setResults([]);

    const texts = [
      "취향을 분석하고 있어요",
      "최적의 숙소를 찾고 있어요",
      "추천 결과를 정리하고 있어요",
    ];
    let step = 0;
    setThinkingText(texts[0]);

    const interval = setInterval(() => {
      step++;
      if (step < texts.length) {
        setThinkingText(texts[step]);
      } else {
        clearInterval(interval);
        const theme = themes[index];
        const filtered = theme
          .filter(allStays)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 4);
        setResults(filtered);
        setIsThinking(false);
      }
    }, 600);
  };

  const currentTheme = selectedTheme !== null ? themes[selectedTheme] : null;

  return (
    <section className="py-16 sm:py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-[12px] font-semibold px-3 py-1.5 rounded-button mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a4 4 0 014 4c0 1.5-.8 2.8-2 3.5v1h-4v-1c-1.2-.7-2-2-2-3.5a4 4 0 014-4zM10 14.5V16h4v-1.5M10 17.5V19h4v-1.5M10 20.5V21a1 1 0 001 1h2a1 1 0 001-1v-.5" strokeLinecap="round" />
            </svg>
            AI 맞춤 추천
          </div>
          <h2 className="text-[22px] sm:text-[28px] font-serif font-bold text-primary">
            어떤 여행을 꿈꾸고 계신가요?
          </h2>
          <p className="text-[14px] text-text-secondary mt-2">
            테마를 선택하면 AI가 맞춤 숙소를 추천해드려요
          </p>
        </div>

        {/* Theme Chips */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          {themes.map((theme, i) => (
            <button
              key={theme.label}
              onClick={() => handleThemeClick(i)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-button text-[13px] sm:text-[14px] font-medium transition-all duration-300 ${
                selectedTheme === i
                  ? "bg-primary text-white shadow-lg scale-105"
                  : "bg-white text-text-primary border border-gray-200 hover:border-accent hover:text-accent hover:shadow-md"
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={theme.icon} />
              </svg>
              {theme.label}
            </button>
          ))}
        </div>

        {/* Thinking Animation */}
        {isThinking && (
          <div className="text-center py-12 animate-fade-in">
            <div className="inline-flex items-center gap-3 bg-white rounded-modal px-6 py-4 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <p className="text-[14px] text-text-secondary">{thinkingText}...</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!isThinking && results.length > 0 && currentTheme && (
          <div className="animate-fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {results.map((stay, i) => (
                <Link
                  key={stay.id}
                  href={`/stays/${stay.id}`}
                  className="group bg-white rounded-card overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={stay.images[0]}
                      alt={stay.name}
                      fill
                      className="object-cover group-hover:scale-[1.05] transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute top-2 right-2 bg-accent text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                      AI 추천
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-1">
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="#C8A882">
                        <path d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.4 3.3 12.3l.7-4.1-3-2.9 4.2-.7L7 1z" />
                      </svg>
                      <span className="text-[12px] font-semibold text-primary">{stay.rating}</span>
                      <span className="text-[11px] text-text-secondary">({stay.review_count})</span>
                    </div>
                    <h3 className="text-[15px] font-semibold text-primary group-hover:text-accent transition-colors">
                      {stay.name}
                    </h3>
                    <p className="text-[12px] text-text-secondary mt-0.5">
                      {stay.region} · {stay.category}
                    </p>
                    <p className="text-[14px] font-semibold text-primary mt-2">
                      {formatPrice(stay.price)}
                      <span className="text-[11px] text-text-secondary font-normal"> / 1박</span>
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-[11px] text-accent leading-relaxed">
                        {currentTheme.reason(stay)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {results.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[14px] text-text-secondary">해당 테마에 맞는 숙소를 찾지 못했어요</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
