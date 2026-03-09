"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Toast from "@/components/common/Toast";
import ScrollToTop from "@/components/common/ScrollToTop";
import { mockReviews } from "@/data/mock-reviews";
import { mockReservations } from "@/data/mock-reservations";
import { getStayById } from "@/lib/stays-api";
import { formatPrice, formatDate, calculateNights } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import HouseRules from "@/components/detail/HouseRules";
import CancellationPolicy from "@/components/detail/CancellationPolicy";
import SimilarStays from "@/components/detail/SimilarStays";
import PriceBreakdown from "@/components/detail/PriceBreakdown";
import Breadcrumb from "@/components/common/Breadcrumb";
import type { Stay } from "@/types";

export default function StayDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { wishlistIds, toggleWishlist, showToast, user } = useStore();

  const [stay, setStay] = useState<Stay | null>(null);
  const [stayLoading, setStayLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
  const [showAllImages, setShowAllImages] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [showMobileReserve, setShowMobileReserve] = useState(false);

  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [localReviews, setLocalReviews] = useState<typeof mockReviews>([]);
  const [reviewSort, setReviewSort] = useState<"latest" | "rating_high" | "rating_low">("latest");

  useEffect(() => {
    if (params.id) {
      getStayById(params.id as string).then((data) => {
        setStay(data);
        if (data) {
          const reviews = mockReviews.filter((r) => r.stay_id === data.id || r.stay_id === params.id);
          setLocalReviews(reviews);
        }
        setStayLoading(false);
      });
    }
  }, [params.id]);

  const isWished = stay ? wishlistIds.includes(stay.id) : false;
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // 기존 예약된 날짜들을 비활성화
  const bookedDates = useMemo(() => {
    if (!stay) return [];
    const dates: Date[] = [];
    mockReservations
      .filter((r) => r.stay_id === stay.id && (r.status === "confirmed" || r.status === "pending"))
      .forEach((r) => {
        const start = new Date(r.check_in);
        const end = new Date(r.check_out);
        const current = new Date(start);
        while (current < end) {
          dates.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
      });
    return dates;
  }, [stay]);

  const nights = useMemo(() => {
    if (selectedRange?.from && selectedRange?.to) {
      return calculateNights(selectedRange.from, selectedRange.to);
    }
    return 0;
  }, [selectedRange]);

  const totalPrice = stay ? nights * stay.price : 0;

  const sortedReviews = useMemo(() => {
    const sorted = [...localReviews];
    switch (reviewSort) {
      case "rating_high":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "rating_low":
        sorted.sort((a, b) => a.rating - b.rating);
        break;
      default:
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return sorted;
  }, [localReviews, reviewSort]);

  const handleShare = useCallback(async () => {
    if (!stay) return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: stay.name, url });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      showToast("링크가 복사되었습니다", "success");
    }
  }, [stay, showToast]);

  const handleWishlistToggle = useCallback(() => {
    if (!stay) return;
    toggleWishlist(stay.id);
    const next = !isWished;
    showToast(next ? "찜 목록에 추가되었습니다" : "찜 목록에서 제거되었습니다", next ? "success" : "info");
  }, [stay, isWished, toggleWishlist, showToast]);

  if (stayLoading) {
    return (
      <>
        <Header />
        <main className="pt-[72px] min-h-screen flex items-center justify-center bg-bg-off">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[14px] text-text-secondary">숙소 정보를 불러오는 중...</p>
          </div>
        </main>
      </>
    );
  }

  if (!stay) {
    return (
      <>
        <Header />
        <main className="pt-[72px] min-h-screen flex items-center justify-center bg-bg-off">
          <div className="text-center">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mx-auto mb-4 text-gray-300">
              <rect x="8" y="16" width="48" height="36" rx="4" stroke="currentColor" strokeWidth="2" />
              <path d="M8 28h48" stroke="currentColor" strokeWidth="2" />
              <circle cx="32" cy="40" r="4" stroke="currentColor" strokeWidth="2" />
            </svg>
            <p className="text-[20px] font-semibold text-primary mb-2">
              숙소를 찾을 수 없습니다
            </p>
            <button
              onClick={() => router.push("/stays")}
              className="mt-4 text-accent hover:underline text-[14px]"
            >
              숙소 목록으로 돌아가기
            </button>
          </div>
        </main>
      </>
    );
  }

  const handleReserve = () => {
    if (!user) {
      showToast("로그인이 필요합니다", "error");
      router.push("/auth/login");
      return;
    }
    if (!selectedRange?.from || !selectedRange?.to) {
      showToast("날짜를 선택해주세요", "error");
      return;
    }
    if (guests < 1) {
      showToast("인원을 선택해주세요", "error");
      return;
    }
    // 예약 생성 후 확인 페이지로 이동
    showToast("예약이 완료되었습니다!", "success");
    router.push("/reservation/rsv-001");
  };

  const handleReviewSubmit = () => {
    if (!user) {
      showToast("로그인이 필요합니다", "error");
      return;
    }
    if (!reviewContent.trim()) {
      showToast("리뷰 내용을 입력해주세요", "error");
      return;
    }
    const newReview = {
      id: `rev-local-${Date.now()}`,
      stay_id: stay.id,
      user_id: user.id,
      rating: reviewRating,
      content: reviewContent,
      created_at: new Date().toISOString(),
      user_name: user.name,
      user_image: "",
    };
    setLocalReviews([newReview, ...localReviews]);
    setReviewContent("");
    setShowReviewForm(false);
    showToast("리뷰가 등록되었습니다", "success");
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: localReviews.filter((r) => r.rating === rating).length,
  }));

  return (
    <>
      <Header />
      <main className="pt-[72px] bg-bg-white pb-20 lg:pb-0">
        {/* Image Gallery */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
          {/* Mobile: single image with swipe */}
          <div className="block md:hidden relative aspect-[4/3] rounded-card overflow-hidden"
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; touchEndX.current = null; }}
            onTouchMove={(e) => { touchEndX.current = e.touches[0].clientX; }}
            onTouchEnd={() => {
              if (touchStartX.current !== null && touchEndX.current !== null) {
                const diff = touchStartX.current - touchEndX.current;
                if (Math.abs(diff) > 50) {
                  if (diff > 0) setCurrentImage((prev) => (prev + 1) % stay.images.length);
                  else setCurrentImage((prev) => (prev - 1 + stay.images.length) % stay.images.length);
                  touchStartX.current = null; touchEndX.current = null;
                  return;
                }
              }
              touchStartX.current = null; touchEndX.current = null;
              setShowAllImages(true);
            }}
          >
            <Image src={stay.images[currentImage]} alt={stay.name} fill className="object-cover" priority />
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[12px] px-2 py-1 rounded">
              {currentImage + 1} / {stay.images.length}
            </div>
          </div>

          {/* Desktop: grid */}
          <div className="hidden md:grid grid-cols-4 gap-2 rounded-card overflow-hidden">
            <div
              className="col-span-2 row-span-2 relative aspect-auto min-h-[400px] cursor-pointer"
              onClick={() => { setCurrentImage(0); setShowAllImages(true); }}
            >
              <Image src={stay.images[0]} alt={stay.name} fill className="object-cover hover:brightness-95 transition-all" priority />
            </div>
            {stay.images.slice(1, 5).map((img, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] cursor-pointer"
                onClick={() => { setCurrentImage(i + 1); setShowAllImages(true); }}
              >
                <Image src={img} alt={`${stay.name} ${i + 2}`} fill className="object-cover hover:brightness-95 transition-all" />
                {i === 3 && stay.images.length > 5 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-[14px] font-medium">+{stay.images.length - 5} more</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Breadcrumb items={[
            { label: "홈", href: "/" },
            { label: "숙소", href: "/stays" },
            { label: stay.name },
          ]} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left - Stay Info */}
            <div className="lg:col-span-2 space-y-8 sm:space-y-10">
              {/* Title */}
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[12px] font-medium text-accent bg-secondary px-2 py-0.5 rounded">
                    {stay.category}
                  </span>
                  <span className="text-[13px] text-text-secondary">{stay.region}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-[22px] sm:text-title-sm md:text-title-md font-serif font-bold text-primary">
                    {stay.name}
                  </h1>
                  <div className="flex items-center gap-1 mt-1 shrink-0">
                    <button onClick={handleShare} className="p-1 text-gray-400 hover:text-accent transition-colors" title="공유하기">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button onClick={handleWishlistToggle} className="p-1">
                      <svg
                        width="24" height="24" viewBox="0 0 24 24"
                        fill={isWished ? "#D94040" : "none"}
                        stroke={isWished ? "#D94040" : "#999"}
                        strokeWidth="1.5"
                        className={`transition-transform hover:scale-110 ${isWished ? "animate-heart-pop" : ""}`}
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <span className="flex items-center gap-1 text-[14px]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-accent">
                      <path d="M8 1l2 4.1 4.5.7-3.3 3.2.8 4.5L8 11.3 3.9 13.5l.8-4.5L1.5 5.8 6 5.1 8 1z" />
                    </svg>
                    <span className="font-semibold">{stay.rating}</span>
                    <span className="text-text-secondary">({stay.review_count}개 리뷰)</span>
                  </span>
                  <span className="text-text-secondary">·</span>
                  <span className="text-[14px] text-text-secondary">최대 {stay.max_guests}인</span>
                  <span className="text-text-secondary hidden sm:inline">·</span>
                  <span className="text-[14px] text-text-secondary hidden sm:inline">{stay.address}</span>
                </div>
              </div>

              {/* Host */}
              <div className="py-6 border-y border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-accent/20">
                    <Image src={stay.host_image} alt={stay.host_name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] text-text-secondary">호스트</p>
                    <p className="text-[16px] font-semibold text-primary">{stay.host_name}</p>
                  </div>
                  <span className="text-[12px] text-accent bg-secondary px-2.5 py-1 rounded-button font-medium">
                    슈퍼호스트
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-50">
                  <div className="text-center">
                    <p className="text-[16px] font-semibold text-primary">95%</p>
                    <p className="text-[11px] text-text-secondary mt-0.5">응답률</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[16px] font-semibold text-primary">1시간 이내</p>
                    <p className="text-[11px] text-text-secondary mt-0.5">응답 시간</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[16px] font-semibold text-primary">3년</p>
                    <p className="text-[11px] text-text-secondary mt-0.5">호스팅 경력</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-[18px] font-semibold text-primary mb-4">숙소 소개</h2>
                <p className="text-[15px] leading-[1.8] text-text-primary">{stay.description}</p>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-[18px] font-semibold text-primary mb-4">편의시설</h2>
                {(() => {
                  const amenityCategories: Record<string, { icon: string; items: string[] }> = {
                    "숙박 시설": { icon: "M3 10h10M5 6h6M4 14h8", items: ["와이파이", "에어컨", "세탁기", "독채"] },
                    "야외 / 전망": { icon: "M8 1v2M1 8h2M14 8h-2M3.5 3.5l1.4 1.4M12.5 3.5l-1.4 1.4M8 5a3 3 0 100 6 3 3 0 000-6z", items: ["수영장", "바베큐", "오션뷰", "마운틴뷰", "테라스", "정원", "루프탑"] },
                    "식음 / 부대시설": { icon: "M4 2v6a4 4 0 008 0V2M8 8v6M5 14h6", items: ["조식", "카페", "벽난로", "피트니스"] },
                    "기타": { icon: "M8 1l2 4 4.5.7-3.3 3.2.8 4.6L8 11.3 3.9 13.5l.8-4.6L1.5 5.7 6 5 8 1z", items: ["주차", "스파", "자쿠지"] },
                  };
                  return Object.entries(amenityCategories).map(([category, { icon, items }]) => {
                    const matched = items.filter((item) => stay.amenities.includes(item));
                    if (matched.length === 0) return null;
                    return (
                      <div key={category} className="mb-4 last:mb-0">
                        <p className="text-[13px] font-medium text-text-secondary mb-2">{category}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {matched.map((amenity) => (
                            <div key={amenity} className="flex items-center gap-2.5 py-2 px-3 bg-bg-off rounded-card text-[14px] text-text-primary">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent shrink-0">
                                <path d={icon} strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              {amenity}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Location */}
              <div>
                <h2 className="text-[18px] font-semibold text-primary mb-4">위치</h2>
                <div className="bg-bg-off rounded-card p-5 border border-gray-100">
                  <div className="flex items-start gap-3">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#C8A882" strokeWidth="1.5" className="shrink-0 mt-0.5">
                      <path d="M10 18s-6-5.34-6-9a6 6 0 1112 0c0 3.66-6 9-6 9z" />
                      <circle cx="10" cy="9" r="2" />
                    </svg>
                    <div>
                      <p className="text-[14px] text-text-primary font-medium">{stay.address}</p>
                      <p className="text-[13px] text-text-secondary mt-1">
                        {stay.region} 지역
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[18px] font-semibold text-primary">
                    리뷰 ({localReviews.length})
                  </h2>
                  <button
                    onClick={() => {
                      if (!user) { showToast("로그인이 필요합니다", "error"); return; }
                      setShowReviewForm(!showReviewForm);
                    }}
                    className="text-[13px] font-medium text-accent hover:underline"
                  >
                    리뷰 작성
                  </button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <div className="mb-8 p-5 border border-accent/20 rounded-card bg-secondary/30 animate-fade-in-up">
                    <p className="text-[14px] font-medium text-primary mb-3">리뷰 작성</p>
                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setReviewRating(star)}>
                          <svg
                            width="24" height="24" viewBox="0 0 24 24"
                            fill={star <= reviewRating ? "#C8A882" : "#ddd"}
                            className="cursor-pointer hover:scale-110 transition-transform"
                          >
                            <path d="M12 2l2.9 6.3 6.9.9-5 4.8 1.2 6.9L12 17.3 6 20.9l1.2-6.9-5-4.8 6.9-.9L12 2z" />
                          </svg>
                        </button>
                      ))}
                      <span className="text-[13px] text-text-secondary ml-2">{reviewRating}점</span>
                    </div>
                    <textarea
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      placeholder="숙소 이용 경험을 공유해주세요"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-button text-[14px] outline-none focus:border-accent resize-none bg-white"
                    />
                    <div className="flex gap-2 mt-3 justify-end">
                      <button
                        onClick={() => setShowReviewForm(false)}
                        className="px-4 py-2 text-[13px] text-text-secondary hover:bg-gray-100 rounded-button transition-colors"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleReviewSubmit}
                        className="px-4 py-2 bg-primary text-white text-[13px] font-medium rounded-button hover:bg-primary/90 transition-colors"
                      >
                        등록
                      </button>
                    </div>
                  </div>
                )}

                {/* Rating Distribution */}
                {localReviews.length > 0 && (
                  <div className="flex items-center gap-6 sm:gap-8 mb-8 p-5 sm:p-6 bg-bg-off rounded-card">
                    <div className="text-center shrink-0">
                      <p className="text-[32px] sm:text-[36px] font-bold text-primary">{stay.rating}</p>
                      <div className="flex gap-0.5 mt-1 justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} width="14" height="14" viewBox="0 0 14 14" fill={star <= Math.round(stay.rating) ? "#C8A882" : "#ddd"}>
                            <path d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.4 3.3 12.3l.7-4.1-3-2.9 4.2-.7L7 1z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {ratingDistribution.map(({ rating, count }) => (
                        <div key={rating} className="flex items-center gap-2 text-[12px]">
                          <span className="w-3 text-text-secondary">{rating}</span>
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent rounded-full transition-all duration-500"
                              style={{ width: localReviews.length > 0 ? `${(count / localReviews.length) * 100}%` : "0%" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Sort */}
                {localReviews.length > 0 && (
                  <div className="flex gap-2 mb-6">
                    {([["latest", "최신순"], ["rating_high", "평점 높은순"], ["rating_low", "평점 낮은순"]] as const).map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => setReviewSort(value)}
                        className={`px-3 py-1.5 rounded-button text-[13px] font-medium transition-all ${
                          reviewSort === value
                            ? "bg-accent text-white"
                            : "bg-bg-off text-text-secondary hover:bg-gray-200"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Review List */}
                <div className="space-y-6">
                  {sortedReviews.map((review) => (
                    <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[12px] font-medium text-accent">
                            {review.user_name?.[0] || "U"}
                          </div>
                          <span className="text-[14px] font-medium text-primary">{review.user_name}</span>
                        </div>
                        <span className="text-[12px] text-text-secondary">{formatDate(review.created_at)}</span>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} width="12" height="12" viewBox="0 0 12 12" fill={star <= review.rating ? "#C8A882" : "#ddd"}>
                            <path d="M6 1l1.5 3 3.3.5-2.4 2.3.6 3.4L6 8.5 3 10.2l.6-3.4L1.2 4.5 4.5 4 6 1z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-[14px] text-text-primary leading-relaxed">{review.content}</p>
                    </div>
                  ))}
                </div>

                {localReviews.length === 0 && (
                  <div className="text-center py-12">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto mb-3 text-gray-300">
                      <path d="M24 4l6 12.2 13.4 1.9-9.7 9.4 2.3 13.3L24 34.2l-12 6.6 2.3-13.3-9.7-9.4L18 16.2 24 4z" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <p className="text-[15px] font-medium text-text-secondary">아직 리뷰가 없습니다</p>
                    <p className="text-[13px] text-text-secondary mt-1">첫 번째 리뷰를 작성해보세요</p>
                  </div>
                )}
              </div>

              {/* House Rules */}
              <HouseRules />

              {/* Cancellation Policy */}
              <CancellationPolicy />
            </div>

            {/* Right - Reservation Widget (Desktop) */}
            <div className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-[100px] bg-white border border-gray-200 rounded-modal p-6 shadow-sm">
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-[24px] font-bold text-primary">{formatPrice(stay.price)}</span>
                  <span className="text-[14px] text-text-secondary">/ 1박</span>
                </div>

                {/* Calendar */}
                <div className="mb-4">
                  <DayPicker
                    mode="range"
                    selected={selectedRange}
                    onSelect={setSelectedRange}
                    disabled={[{ before: new Date() }, ...bookedDates.map((d) => d)]}
                    numberOfMonths={1}
                    className="!font-sans"
                    modifiersStyles={{
                      disabled: { color: "#ccc", textDecoration: "line-through" },
                    }}
                    styles={{
                      caption: { fontSize: "14px" },
                      day: { fontSize: "13px" },
                    }}
                  />
                  {bookedDates.length > 0 && (
                    <p className="text-[11px] text-text-secondary mt-1 flex items-center gap-1">
                      <span className="inline-block w-3 h-3 bg-gray-200 rounded-sm line-through text-[8px] text-center leading-3">0</span>
                      예약 불가 날짜
                    </p>
                  )}
                </div>

                {/* Guests */}
                <div className="border border-gray-200 rounded-card p-4 mb-4">
                  <p className="text-[12px] font-semibold text-text-secondary uppercase mb-2">인원</p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary transition-colors"
                    >
                      <svg width="12" height="2" viewBox="0 0 12 2" fill="none"><path d="M1 1h10" stroke="#333" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </button>
                    <span className="text-[16px] font-medium text-primary">{guests}명</span>
                    <button
                      onClick={() => setGuests(Math.min(stay.max_guests, guests + 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="#333" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                {nights > 0 && (
                  <PriceBreakdown pricePerNight={stay.price} nights={nights} />
                )}

                <button
                  onClick={handleReserve}
                  className="w-full bg-primary text-white py-3.5 rounded-button text-[15px] font-medium hover:bg-primary/90 transition-colors"
                >
                  예약하기
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Bottom Reserve Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
        <div>
          <span className="text-[18px] font-bold text-primary">{formatPrice(stay.price)}</span>
          <span className="text-[13px] text-text-secondary"> / 1박</span>
          {nights > 0 && (
            <p className="text-[12px] text-text-secondary">
              총 {formatPrice(totalPrice)} ({nights}박)
            </p>
          )}
        </div>
        <button
          onClick={() => setShowMobileReserve(true)}
          className="bg-primary text-white px-6 py-2.5 rounded-button text-[14px] font-medium hover:bg-primary/90 transition-colors"
        >
          {nights > 0 ? "예약하기" : "날짜 선택"}
        </button>
      </div>

      {/* Mobile Reserve Modal */}
      {showMobileReserve && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-black/50 flex items-end animate-fade-in">
          <div className="bg-white w-full rounded-t-[16px] max-h-[85vh] overflow-y-auto animate-fade-in-up">
            <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-[16px] font-semibold text-primary">예약하기</h3>
              <button onClick={() => setShowMobileReserve(false)} className="p-1">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#333" strokeWidth="1.5">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              <div>
                <p className="text-[13px] font-semibold text-text-secondary mb-2">날짜 선택</p>
                <DayPicker
                  mode="range"
                  selected={selectedRange}
                  onSelect={setSelectedRange}
                  disabled={[{ before: new Date() }, ...bookedDates]}
                  numberOfMonths={1}
                  className="!font-sans mx-auto"
                  modifiersStyles={{
                    disabled: { color: "#ccc", textDecoration: "line-through" },
                  }}
                />
              </div>

              <div className="border border-gray-200 rounded-card p-4">
                <p className="text-[12px] font-semibold text-text-secondary uppercase mb-2">인원</p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center"
                  >
                    <svg width="12" height="2" viewBox="0 0 12 2" fill="none"><path d="M1 1h10" stroke="#333" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  </button>
                  <span className="text-[18px] font-medium text-primary">{guests}명</span>
                  <button
                    onClick={() => setGuests(Math.min(stay.max_guests, guests + 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="#333" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  </button>
                </div>
              </div>

              {nights > 0 && (
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-[14px]">
                    <span className="text-text-secondary">{formatPrice(stay.price)} x {nights}박</span>
                    <span className="text-primary font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-[18px] font-bold pt-2 border-t border-gray-100">
                    <span>총 금액</span>
                    <span className="text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => { setShowMobileReserve(false); handleReserve(); }}
                className="w-full bg-primary text-white py-4 rounded-button text-[15px] font-medium hover:bg-primary/90 transition-colors"
              >
                예약하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Similar Stays */}
      <SimilarStays currentStay={stay} />

      <Footer />
      <Toast />
      <ScrollToTop />

      {/* Image Modal */}
      {showAllImages && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center gallery-modal animate-fade-in">
          <button
            onClick={() => setShowAllImages(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white z-10"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l16 16M22 6L6 22" />
            </svg>
          </button>

          <button
            onClick={() => setCurrentImage((prev) => (prev - 1 + stay.images.length) % stay.images.length)}
            className="absolute left-2 sm:left-6 text-white/70 hover:text-white z-10"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 8l-8 8 8 8" />
            </svg>
          </button>

          <div className="relative w-full max-w-4xl aspect-[3/2] sm:aspect-[16/9] mx-4 sm:mx-8">
            <Image
              src={stay.images[currentImage]}
              alt={`${stay.name} ${currentImage + 1}`}
              fill
              className="object-contain"
            />
          </div>

          <button
            onClick={() => setCurrentImage((prev) => (prev + 1) % stay.images.length)}
            className="absolute right-2 sm:right-6 text-white/70 hover:text-white z-10"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8l8 8-8 8" />
            </svg>
          </button>

          <div className="absolute bottom-4 sm:bottom-6 text-white/50 text-[14px]">
            {currentImage + 1} / {stay.images.length}
          </div>
        </div>
      )}
    </>
  );
}
