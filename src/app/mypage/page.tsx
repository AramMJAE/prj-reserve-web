"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Toast from "@/components/common/Toast";
import ScrollToTop from "@/components/common/ScrollToTop";
import EmptyState from "@/components/common/EmptyState";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { getUserReservations, getUserReviews, deleteReview } from "@/lib/user-api";
import { getAllStays } from "@/lib/stays-api";
import type { Reservation, Review, Stay } from "@/types";

const statusMap = {
  pending: { label: "대기중", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "확정", color: "bg-green-100 text-green-700" },
  cancelled: { label: "취소됨", color: "bg-red-100 text-red-700" },
  completed: { label: "이용완료", color: "bg-gray-100 text-gray-600" },
};

type Tab = "reservations" | "wishlist" | "reviews";
type ReservationFilter = "all" | "upcoming" | "completed" | "cancelled";

export default function MyPage() {
  const router = useRouter();
  const { user, setUser, wishlistIds, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>("reservations");
  const [reservationFilter, setReservationFilter] = useState<ReservationFilter>("all");
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [allStays, setAllStays] = useState<Stay[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      setDataLoading(true);
      const [reservations, reviews, stays] = await Promise.all([
        getUserReservations(user.id),
        getUserReviews(user.id),
        getAllStays(),
      ]);
      setAllReservations(reservations);
      setUserReviews(reviews);
      setAllStays(stays);
      setDataLoading(false);
    };
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Redirect if not logged in
  if (!user) {
    return (
      <>
        <Header />
        <main className="pt-[72px] min-h-screen flex items-center justify-center bg-bg-off">
          <div className="text-center">
            <p className="text-[48px] mb-4">&#x1F512;</p>
            <p className="text-[20px] font-semibold text-primary mb-2">
              로그인이 필요합니다
            </p>
            <Link
              href="/auth/login"
              className="inline-block mt-4 bg-primary text-white px-6 py-2.5 rounded-button text-[14px] font-medium hover:bg-primary/90 transition-colors"
            >
              로그인하기
            </Link>
          </div>
        </main>
      </>
    );
  }

  const filteredReservations = allReservations.filter((r: Reservation) => {
    if (reservationFilter === "all") return true;
    if (reservationFilter === "upcoming") return r.status === "pending" || r.status === "confirmed";
    if (reservationFilter === "completed") return r.status === "completed";
    if (reservationFilter === "cancelled") return r.status === "cancelled";
    return true;
  });

  const wishedStays = allStays.filter((s) => wishlistIds.includes(s.id));

  const handleLogout = () => {
    setUser(null);
    showToast("로그아웃되었습니다", "info");
    router.push("/");
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "reservations", label: "예약 내역", count: allReservations.length },
    { key: "wishlist", label: "찜 목록", count: wishedStays.length },
    { key: "reviews", label: "내 리뷰", count: userReviews.length },
  ];

  return (
    <>
      <Header />
      <main className="pt-[72px] min-h-screen bg-bg-off">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Profile */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-white text-[20px] font-bold">
                {user.name[0]}
              </div>
              <div>
                <h1 className="text-[20px] font-semibold text-primary">
                  {user.name}
                </h1>
                <p className="text-[13px] text-text-secondary">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-[13px] text-text-secondary hover:text-error transition-colors"
            >
              로그아웃
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "px-5 py-3 text-[14px] font-medium transition-colors border-b-2 -mb-px",
                  activeTab === tab.key
                    ? "text-primary border-primary"
                    : "text-text-secondary border-transparent hover:text-primary"
                )}
              >
                {tab.label}
                <span className="ml-1.5 text-[12px] text-text-secondary">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {dataLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!dataLoading && activeTab === "reservations" && (
            <div>
              {/* Filter */}
              <div className="flex gap-2 mb-6">
                {(
                  [
                    { key: "all", label: "전체" },
                    { key: "upcoming", label: "예정" },
                    { key: "completed", label: "이용완료" },
                    { key: "cancelled", label: "취소" },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setReservationFilter(f.key)}
                    className={cn(
                      "px-3 py-1.5 rounded-button text-[13px] font-medium transition-colors",
                      reservationFilter === f.key
                        ? "bg-primary text-white"
                        : "bg-white text-text-secondary hover:bg-gray-100"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {filteredReservations.length > 0 ? (
                <div className="space-y-4">
                  {filteredReservations.map((rsv) => {
                    const stay = allStays.find((s) => s.id === rsv.stay_id);
                    if (!stay) return null;
                    const status = statusMap[rsv.status as keyof typeof statusMap];

                    return (
                      <Link
                        key={rsv.id}
                        href={`/reservation/${rsv.id}`}
                        className="block bg-white rounded-card border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="flex">
                          <div className="relative w-[140px] md:w-[200px] shrink-0">
                            <Image
                              src={stay.images[0]}
                              alt={stay.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 p-4 md:p-5">
                            <div className="flex items-start justify-between">
                              <div>
                                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${status.color}`}>
                                  {status.label}
                                </span>
                                <h3 className="text-[16px] font-semibold text-primary mt-1.5">
                                  {stay.name}
                                </h3>
                                <p className="text-[13px] text-text-secondary mt-0.5">
                                  {stay.region} · {stay.category}
                                </p>
                              </div>
                              <span className="text-[15px] font-semibold text-primary hidden md:block">
                                {formatPrice(rsv.total_price)}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-3 text-[13px] text-text-secondary">
                              <span>{formatDate(rsv.check_in)}</span>
                              <span>~</span>
                              <span>{formatDate(rsv.check_out)}</span>
                              <span className="hidden md:inline">· {rsv.guests}명</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <EmptyState type="reservation" linkHref="/stays" linkText="숙소 둘러보기" />
              )}
            </div>
          )}

          {!dataLoading && activeTab === "wishlist" && (
            <div>
              {wishedStays.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishedStays.map((stay) => (
                    <Link
                      key={stay.id}
                      href={`/stays/${stay.id}`}
                      className="group bg-white rounded-card border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={stay.images[0]}
                          alt={stay.name}
                          fill
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-[15px] font-semibold text-primary">
                          {stay.name}
                        </h3>
                        <p className="text-[13px] text-text-secondary mt-0.5">
                          {stay.region} · {stay.category}
                        </p>
                        <p className="text-[15px] font-semibold text-primary mt-2">
                          {formatPrice(stay.price)}
                          <span className="text-[12px] text-text-secondary font-normal"> / 1박</span>
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState type="wishlist" linkHref="/stays" linkText="숙소 둘러보기" />
              )}
            </div>
          )}

          {!dataLoading && activeTab === "reviews" && (
            <div>
              {userReviews.length > 0 ? (
                <div className="space-y-4">
                  {userReviews.map((review) => {
                    const stay = allStays.find((s) => s.id === review.stay_id);
                    return (
                      <div
                        key={review.id}
                        className="bg-white rounded-card border border-gray-100 p-5"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <Link
                            href={`/stays/${review.stay_id}`}
                            className="text-[15px] font-semibold text-primary hover:text-accent transition-colors"
                          >
                            {stay?.name || "숙소"}
                          </Link>
                          <div className="flex items-center gap-3">
                            <span className="text-[12px] text-text-secondary">
                              {formatDate(review.created_at)}
                            </span>
                            <button
                              onClick={async () => {
                                await deleteReview(review.id, user.id);
                                setUserReviews((prev) => prev.filter((r) => r.id !== review.id));
                                showToast("리뷰가 삭제되었습니다", "info");
                              }}
                              className="text-text-secondary hover:text-error transition-colors"
                              title="삭제"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-0.5 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill={star <= review.rating ? "#C8A882" : "#ddd"}
                            >
                              <path d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.4 3.3 12.3l.7-4.1-3-2.9 4.2-.7L7 1z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-[14px] text-text-primary leading-relaxed">
                          {review.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState type="review" />
              )}
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
