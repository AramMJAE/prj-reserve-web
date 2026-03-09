"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Toast from "@/components/common/Toast";
import ScrollToTop from "@/components/common/ScrollToTop";
import { useStore } from "@/store/useStore";
import { getStaysByIds } from "@/lib/stays-api";
import { formatPrice, cn } from "@/lib/utils";
import type { Stay } from "@/types";

export default function ComparePage() {
  const { compareIds, clearCompare } = useStore();
  const [stays, setStays] = useState<Stay[]>([]);

  useEffect(() => {
    if (compareIds.length > 0) {
      getStaysByIds(compareIds).then(setStays);
    } else {
      setStays([]);
    }
  }, [compareIds]);

  const allAmenities = Array.from(new Set(stays.flatMap((s) => s.amenities))).sort();
  const minPrice = stays.length > 0 ? Math.min(...stays.map((s) => s.price)) : 0;
  const maxRating = stays.length > 0 ? Math.max(...stays.map((s) => s.rating)) : 0;

  return (
    <>
      <Header />
      <main className="pt-[72px] min-h-screen bg-bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[24px] font-serif font-bold text-primary">숙소 비교</h1>
              <p className="text-[14px] text-text-secondary mt-1">
                선택한 숙소를 한눈에 비교해보세요
              </p>
            </div>
            {stays.length > 0 && (
              <button
                onClick={clearCompare}
                className="px-4 py-2 text-[13px] text-text-secondary border border-gray-200 rounded-button hover:border-error hover:text-error transition-colors"
              >
                초기화
              </button>
            )}
          </div>

          {stays.length === 0 ? (
            <div className="text-center py-20">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mx-auto mb-4 text-gray-300">
                <rect x="4" y="8" width="24" height="48" rx="4" stroke="currentColor" strokeWidth="2" />
                <rect x="36" y="8" width="24" height="48" rx="4" stroke="currentColor" strokeWidth="2" />
                <path d="M28 32h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="text-[18px] font-semibold text-primary mb-2">비교할 숙소가 없습니다</p>
              <p className="text-[14px] text-text-secondary mb-6">숙소 목록에서 비교할 숙소를 선택해주세요</p>
              <Link
                href="/stays"
                className="inline-block px-6 py-2.5 bg-primary text-white text-[14px] font-medium rounded-button hover:bg-primary/90 transition-colors"
              >
                숙소 둘러보기
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-3 text-[13px] font-medium text-text-secondary bg-bg-off rounded-tl-card w-[120px] sm:w-[140px]">
                      항목
                    </th>
                    {stays.map((stay) => (
                      <th key={stay.id} className="p-3 bg-bg-off text-center last:rounded-tr-card" style={{ minWidth: "180px" }}>
                        <Link href={`/stays/${stay.id}`} className="group">
                          <div className="relative w-full aspect-[4/3] rounded-card overflow-hidden mb-2">
                            <Image
                              src={stay.images[0]}
                              alt={stay.name}
                              fill
                              className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                              sizes="200px"
                            />
                          </div>
                          <p className="text-[14px] font-semibold text-primary group-hover:text-accent transition-colors truncate">
                            {stay.name}
                          </p>
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <Row label="카테고리">
                    {stays.map((s) => (
                      <td key={s.id} className="p-3 text-center border-b border-gray-100">
                        <span className="text-[12px] font-medium text-accent bg-secondary px-2 py-0.5 rounded">{s.category}</span>
                      </td>
                    ))}
                  </Row>
                  <Row label="지역">
                    {stays.map((s) => (
                      <td key={s.id} className="p-3 text-center text-[14px] text-primary border-b border-gray-100">{s.region}</td>
                    ))}
                  </Row>
                  <Row label="가격">
                    {stays.map((s) => (
                      <td key={s.id} className={cn(
                        "p-3 text-center text-[15px] font-semibold border-b border-gray-100",
                        s.price === minPrice ? "text-accent" : "text-primary"
                      )}>
                        {formatPrice(s.price)}
                        <span className="text-[11px] text-text-secondary font-normal"> /박</span>
                        {s.price === minPrice && <span className="block text-[11px] text-accent font-medium mt-0.5">최저가</span>}
                      </td>
                    ))}
                  </Row>
                  <Row label="평점">
                    {stays.map((s) => (
                      <td key={s.id} className={cn(
                        "p-3 text-center border-b border-gray-100",
                        s.rating === maxRating ? "text-accent" : "text-primary"
                      )}>
                        <span className="flex items-center justify-center gap-1">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill={s.rating === maxRating ? "#C8A882" : "#ddd"}>
                            <path d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.4 3.3 12.3l.7-4.1-3-2.9 4.2-.7L7 1z" />
                          </svg>
                          <span className="text-[15px] font-semibold">{s.rating}</span>
                        </span>
                        <span className="text-[12px] text-text-secondary">{s.review_count}개 리뷰</span>
                        {s.rating === maxRating && <span className="block text-[11px] text-accent font-medium mt-0.5">최고 평점</span>}
                      </td>
                    ))}
                  </Row>
                  <Row label="최대 인원">
                    {stays.map((s) => (
                      <td key={s.id} className="p-3 text-center text-[14px] text-primary border-b border-gray-100">
                        {s.max_guests}인
                      </td>
                    ))}
                  </Row>
                  {allAmenities.map((amenity) => (
                    <Row key={amenity} label={amenity}>
                      {stays.map((s) => (
                        <td key={s.id} className="p-3 text-center border-b border-gray-100">
                          {s.amenities.includes(amenity) ? (
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="mx-auto text-accent">
                              <path d="M4 9l3.5 3.5L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      ))}
                    </Row>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Toast />
      <ScrollToTop />
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="hover:bg-bg-off/50 transition-colors">
      <td className="p-3 text-[13px] font-medium text-text-secondary border-b border-gray-100 whitespace-nowrap">
        {label}
      </td>
      {children}
    </tr>
  );
}
