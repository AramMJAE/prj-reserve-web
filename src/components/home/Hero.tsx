"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

const regions = [
  { value: "전체", label: "전체" },
  { value: "제주", label: "제주도" },
  { value: "강원", label: "강원도" },
  { value: "경상", label: "경상도" },
  { value: "전라", label: "전라도" },
  { value: "서울", label: "서울" },
  { value: "경기", label: "경기도" },
];

export default function Hero() {
  const router = useRouter();
  const { setSearch } = useStore();
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [guests, setGuests] = useState(2);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedRegion && selectedRegion !== "전체") {
      params.set("region", selectedRegion);
    }
    if (guests > 1) {
      params.set("guests", String(guests));
    }
    if (dateRange?.from) {
      params.set("checkIn", dateRange.from.toISOString().split("T")[0]);
      setSearch({ checkIn: dateRange.from });
    }
    if (dateRange?.to) {
      params.set("checkOut", dateRange.to.toISOString().split("T")[0]);
      setSearch({ checkOut: dateRange.to });
    }
    setSearch({ region: selectedRegion === "전체" ? "" : selectedRegion, guests });
    router.push(`/stays${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const dateLabel = dateRange?.from
    ? dateRange.to
      ? `${dateRange.from.getMonth() + 1}/${dateRange.from.getDate()} - ${dateRange.to.getMonth() + 1}/${dateRange.to.getDate()}`
      : `${dateRange.from.getMonth() + 1}/${dateRange.from.getDate()} ~`
    : "날짜 선택";

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-3xl w-full">
        <p className="text-white/70 text-[13px] sm:text-[14px] tracking-[0.3em] uppercase mb-4 font-inter animate-fade-in-up">
          Curated Stays for Your Journey
        </p>
        <h1 className="text-white text-[32px] sm:text-[44px] md:text-[56px] font-serif font-bold leading-[1.15] mb-5 sm:mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          당신만의
          <br />
          특별한 스테이를 발견하세요
        </h1>
        <p className="text-white/70 text-[14px] md:text-[16px] mb-8 sm:mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          감성 가득한 국내 숙소를 큐레이션합니다
        </p>

        {/* Search Bar */}
        <div className="bg-white rounded-modal shadow-2xl max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          {/* Desktop Search */}
          <div className="hidden sm:flex items-center divide-x divide-gray-200">
            {/* Region */}
            <div className="flex-1 relative px-1">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-4 text-[14px] text-text-primary bg-transparent border-none outline-none appearance-none cursor-pointer"
              >
                {regions.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.value === "전체" ? "어디로 떠나시나요?" : r.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-text-secondary">
                  <path d="M3.5 5.25l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Date */}
            <div className="flex-1 relative">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full text-left px-4 py-4 text-[14px] text-text-primary hover:bg-bg-off/50 transition-colors"
              >
                <span className={dateRange?.from ? "text-text-primary" : "text-text-secondary"}>
                  {dateLabel}
                </span>
              </button>
            </div>

            {/* Guests */}
            <div className="w-[120px] flex items-center justify-center gap-2 px-3">
              <button
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-text-secondary hover:border-primary transition-colors"
              >
                <svg width="10" height="2" viewBox="0 0 10 2"><path d="M1 1h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
              <span className="text-[14px] font-medium text-primary w-8 text-center">{guests}명</span>
              <button
                onClick={() => setGuests(Math.min(10, guests + 1))}
                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-text-secondary hover:border-primary transition-colors"
              >
                <svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </div>

            {/* Search Button */}
            <div className="px-2 py-2">
              <button
                onClick={handleSearch}
                className="bg-primary text-white px-6 py-2.5 rounded-card text-[14px] font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="7" cy="7" r="5" />
                  <path d="M11 11l3.5 3.5" strokeLinecap="round" />
                </svg>
                검색
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden p-4 space-y-3">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-4 py-3 text-[14px] text-text-primary bg-bg-off border border-gray-200 rounded-card outline-none"
            >
              {regions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.value === "전체" ? "어디로 떠나시나요?" : r.label}
                </option>
              ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex-1 px-4 py-3 text-[14px] text-left bg-bg-off border border-gray-200 rounded-card"
              >
                <span className={dateRange?.from ? "text-text-primary" : "text-text-secondary"}>
                  {dateLabel}
                </span>
              </button>
              <div className="flex items-center gap-1.5 px-3 bg-bg-off border border-gray-200 rounded-card">
                <button onClick={() => setGuests(Math.max(1, guests - 1))} className="text-text-secondary">
                  <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
                <span className="text-[14px] font-medium w-6 text-center">{guests}</span>
                <button onClick={() => setGuests(Math.min(10, guests + 1))} className="text-text-secondary">
                  <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="w-full bg-primary text-white py-3 rounded-card text-[14px] font-medium"
            >
              검색
            </button>
          </div>

          {/* Calendar Dropdown */}
          {showCalendar && (
            <div className="border-t border-gray-100 p-4 animate-fade-in">
              <DayPicker
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range);
                  if (range?.from && range?.to) setShowCalendar(false);
                }}
                disabled={{ before: new Date() }}
                numberOfMonths={typeof window !== "undefined" && window.innerWidth >= 640 ? 2 : 1}
                className="!font-sans mx-auto"
              />
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/50">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  );
}
