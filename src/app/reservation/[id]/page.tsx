"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Toast from "@/components/common/Toast";
import { mockReservations } from "@/data/mock-reservations";
import { mockStays } from "@/data/mock-stays";
import { formatPrice, formatDate, calculateNights } from "@/lib/utils";
import { getSimilarStays, getStayById } from "@/lib/stays-api";
import { useStore } from "@/store/useStore";
import type { Stay, Reservation } from "@/types";

function Confetti() {
  const colors = ["#C8A882", "#F5F0EB", "#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1"];
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: `${Math.random() * 8 + 4}px`,
  }));
  return (
    <>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            animationDelay: p.delay,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
          }}
        />
      ))}
    </>
  );
}

const statusMap = {
  pending: { label: "대기중", color: "bg-yellow-100 text-yellow-700", step: 1 },
  confirmed: { label: "확정", color: "bg-green-100 text-green-700", step: 2 },
  cancelled: { label: "취소됨", color: "bg-red-100 text-red-700", step: -1 },
  completed: { label: "이용완료", color: "bg-gray-100 text-gray-600", step: 4 },
};

const timelineSteps = [
  { label: "예약접수", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label: "확인중", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "확정", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "체크인", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" },
  { label: "이용완료", icon: "M5 13l4 4L19 7" },
];

export default function ReservationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useStore();

  const [localStatus, setLocalStatus] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [similarStays, setSimilarStays] = useState<Stay[]>([]);
  const [modifyGuests, setModifyGuests] = useState(0);
  const [modifyCheckIn, setModifyCheckIn] = useState("");
  const [modifyCheckOut, setModifyCheckOut] = useState("");
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [stay, setStay] = useState<Stay | null>(null);
  const [loading, setLoading] = useState(true);

  // mock + localStorage에서 예약 찾기
  useEffect(() => {
    const id = params.id as string;
    let found = mockReservations.find((r) => r.id === id) || null;

    if (!found && typeof window !== "undefined") {
      const saved: Reservation[] = JSON.parse(localStorage.getItem("staylog_reservations") || "[]");
      found = saved.find((r) => r.id === id) || null;
    }

    if (found) {
      setReservation(found);
      setModifyGuests(found.guests);
      setModifyCheckIn(found.check_in.split("T")[0]);
      setModifyCheckOut(found.check_out.split("T")[0]);

      // 숙소 정보 가져오기
      const mockStay = mockStays.find((s) => s.id === found!.stay_id);
      if (mockStay) {
        setStay(mockStay);
        getSimilarStays(mockStay, 3).then(setSimilarStays);
      } else {
        getStayById(found.stay_id).then((s) => {
          if (s) {
            setStay(s);
            getSimilarStays(s, 3).then(setSimilarStays);
          }
        });
      }
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-[72px] min-h-screen flex items-center justify-center bg-bg-off">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </main>
      </>
    );
  }

  if (!reservation || !stay) {
    return (
      <>
        <Header />
        <main className="pt-[72px] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" className="mx-auto mb-4">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" />
            </svg>
            <p className="text-[20px] font-semibold text-primary mb-2">
              예약 정보를 찾을 수 없습니다
            </p>
            <button
              onClick={() => router.push("/mypage")}
              className="mt-4 text-accent hover:underline text-[14px]"
            >
              마이페이지로 돌아가기
            </button>
          </div>
        </main>
      </>
    );
  }

  const currentStatus = (localStatus || reservation.status) as keyof typeof statusMap;
  const status = statusMap[currentStatus];
  const canCancel = currentStatus === "pending" || currentStatus === "confirmed";
  const canModify = currentStatus === "pending" || currentStatus === "confirmed";
  const nights = calculateNights(new Date(reservation.check_in), new Date(reservation.check_out));

  const updateReservationInStorage = (updates: Partial<Reservation>) => {
    const saved: Reservation[] = JSON.parse(localStorage.getItem("staylog_reservations") || "[]");
    const idx = saved.findIndex((r) => r.id === reservation.id);
    if (idx !== -1) {
      saved[idx] = { ...saved[idx], ...updates };
      localStorage.setItem("staylog_reservations", JSON.stringify(saved));
    }
  };

  const handleCancel = () => {
    setLocalStatus("cancelled");
    updateReservationInStorage({ status: "cancelled" });
    setShowCancelModal(false);
    showToast("예약이 취소되었습니다", "info");
  };

  const handleModify = () => {
    const newNights = calculateNights(new Date(modifyCheckIn), new Date(modifyCheckOut));
    if (newNights <= 0) {
      showToast("올바른 날짜를 선택해주세요", "error");
      return;
    }
    const newTotal = stay.price * newNights;
    updateReservationInStorage({
      check_in: modifyCheckIn,
      check_out: modifyCheckOut,
      guests: modifyGuests,
      total_price: newTotal,
    });
    setReservation({
      ...reservation,
      check_in: modifyCheckIn,
      check_out: modifyCheckOut,
      guests: modifyGuests,
      total_price: newTotal,
    });
    setShowModifyModal(false);
    showToast("예약이 변경되었습니다", "success");
  };

  const handleShareReservation = async () => {
    const text = `[STAYLOG 예약 확인]\n숙소: ${stay.name}\n체크인: ${formatDate(reservation.check_in)}\n체크아웃: ${formatDate(reservation.check_out)}\n인원: ${reservation.guests}명\n금액: ${formatPrice(reservation.total_price)}`;
    await navigator.clipboard.writeText(text);
    showToast("예약 내용이 복사되었습니다", "success");
  };

  const handleAddToCalendar = () => {
    const startDate = reservation.check_in.replace(/-/g, "").split("T")[0];
    const endDate = reservation.check_out.replace(/-/g, "").split("T")[0];
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(stay.name + " 숙박")}&dates=${startDate}/${endDate}&details=${encodeURIComponent(`숙소: ${stay.name}\n주소: ${stay.address}\n인원: ${reservation.guests}명`)}&location=${encodeURIComponent(stay.address)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <Header />
      <main className="pt-[72px] min-h-screen bg-bg-off">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Confetti */}
          {currentStatus !== "cancelled" && <Confetti />}

          {/* Success Header */}
          {currentStatus !== "cancelled" && (
            <div className="text-center mb-8 animate-fade-in-up">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-checkmark">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-[24px] sm:text-title-sm font-serif font-bold text-primary">
                예약이 완료되었습니다
              </h1>
              <p className="text-[14px] text-text-secondary mt-2">예약 번호: {reservation.id.toUpperCase()}</p>
            </div>
          )}

          {currentStatus === "cancelled" && (
            <div className="text-center mb-8 animate-fade-in-up">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </div>
              <h1 className="text-[24px] sm:text-title-sm font-serif font-bold text-primary">
                예약이 취소되었습니다
              </h1>
            </div>
          )}

          {/* Timeline */}
          {currentStatus !== "cancelled" && (
            <div className="bg-white rounded-modal border border-gray-100 p-5 sm:p-6 mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center justify-between relative">
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" />
                <div
                  className="absolute top-4 left-0 h-0.5 bg-accent transition-all duration-700"
                  style={{ width: `${((status.step - 1) / (timelineSteps.length - 1)) * 100}%` }}
                />
                {timelineSteps.map((step, i) => (
                  <div key={step.label} className="relative flex flex-col items-center z-10" style={{ width: "20%" }}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        i + 1 <= status.step
                          ? "bg-accent text-white"
                          : "bg-white border-2 border-gray-200 text-gray-400"
                      }`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={step.icon} />
                      </svg>
                    </div>
                    <span className={`text-[10px] sm:text-[11px] mt-2 font-medium text-center ${
                      i + 1 <= status.step ? "text-accent" : "text-text-secondary"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white rounded-modal border border-gray-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {/* Stay Image */}
            <div className="relative h-[200px] sm:h-[240px]">
              <Image src={stay.images[0]} alt={stay.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <span className={`inline-block px-2.5 py-1 rounded text-[12px] font-medium ${status.color}`}>
                  {status.label}
                </span>
                <h2 className="text-white text-[22px] font-serif font-bold mt-2">{stay.name}</h2>
                <p className="text-white/70 text-[13px]">{stay.region} · {stay.category}</p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Host Info */}
              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-card">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image src={stay.host_image} alt={stay.host_name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] text-text-secondary">호스트</p>
                  <p className="text-[14px] font-semibold text-primary">{stay.host_name}</p>
                </div>
                <button
                  onClick={() => showToast("메시지 기능은 준비 중입니다", "info")}
                  className="px-3 py-1.5 text-[12px] font-medium text-accent border border-accent/30 rounded-button hover:bg-accent/5 transition-colors"
                >
                  문의하기
                </button>
              </div>

              {/* Reservation Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-bg-off rounded-card p-3">
                  <p className="text-[11px] font-semibold text-text-secondary uppercase mb-1">체크인</p>
                  <p className="text-[15px] font-medium text-primary">{formatDate(reservation.check_in)}</p>
                  <p className="text-[12px] text-text-secondary mt-0.5">15:00 이후</p>
                </div>
                <div className="bg-bg-off rounded-card p-3">
                  <p className="text-[11px] font-semibold text-text-secondary uppercase mb-1">체크아웃</p>
                  <p className="text-[15px] font-medium text-primary">{formatDate(reservation.check_out)}</p>
                  <p className="text-[12px] text-text-secondary mt-0.5">11:00 이전</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-[11px] text-text-secondary uppercase mb-1">인원</p>
                  <p className="text-[16px] font-semibold text-primary">{reservation.guests}명</p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-text-secondary uppercase mb-1">숙박</p>
                  <p className="text-[16px] font-semibold text-primary">{nights}박</p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-text-secondary uppercase mb-1">예약일</p>
                  <p className="text-[13px] font-medium text-primary">{formatDate(reservation.created_at).split(" ")[0]}</p>
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-gray-100 pt-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-[14px]">
                    <span className="text-text-secondary">{formatPrice(stay.price)} x {nights}박</span>
                    <span className="text-primary">{formatPrice(stay.price * nights)}</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-text-secondary">서비스 수수료</span>
                    <span className="text-primary">{formatPrice(reservation.total_price - stay.price * nights)}</span>
                  </div>
                  <div className="flex justify-between text-[18px] font-bold pt-3 border-t border-gray-100">
                    <span>총 결제 금액</span>
                    <span className="text-primary">{formatPrice(reservation.total_price)}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  onClick={handleShareReservation}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-card bg-bg-off hover:bg-gray-200 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7M16 6l-4-4-4 4M12 2v13" />
                  </svg>
                  <span className="text-[11px] font-medium text-text-secondary">공유</span>
                </button>
                <button
                  onClick={handleAddToCalendar}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-card bg-bg-off hover:bg-gray-200 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  <span className="text-[11px] font-medium text-text-secondary">캘린더</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-card bg-bg-off hover:bg-gray-200 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  <span className="text-[11px] font-medium text-text-secondary">영수증</span>
                </button>
              </div>

              {/* Main Actions */}
              <div className="flex gap-3 pt-2">
                <Link
                  href={`/stays/${stay.id}`}
                  className="flex-1 text-center py-3 border border-gray-200 rounded-button text-[14px] font-medium text-text-primary hover:bg-bg-off transition-colors"
                >
                  숙소 보기
                </Link>
                {canModify && (
                  <button
                    onClick={() => setShowModifyModal(true)}
                    className="flex-1 py-3 border border-accent/30 rounded-button text-[14px] font-medium text-accent hover:bg-accent/5 transition-colors"
                  >
                    예약 변경
                  </button>
                )}
                {canCancel && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="flex-1 py-3 border border-error/30 rounded-button text-[14px] font-medium text-error hover:bg-error/5 transition-colors"
                  >
                    예약 취소
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Similar Stays */}
          {similarStays.length > 0 && (
            <div className="mt-10 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <h3 className="text-[18px] font-serif font-semibold text-primary mb-5">
                이런 숙소는 어떠세요?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {similarStays.map((s) => (
                  <Link
                    key={s.id}
                    href={`/stays/${s.id}`}
                    className="group bg-white rounded-card border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={s.images[0]}
                        alt={s.name}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        sizes="200px"
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="text-[14px] font-semibold text-primary group-hover:text-accent transition-colors truncate">
                        {s.name}
                      </h4>
                      <p className="text-[12px] text-text-secondary mt-0.5">{s.region} · {s.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[14px] font-semibold text-primary">
                          {formatPrice(s.price)}<span className="text-[11px] text-text-secondary font-normal"> /박</span>
                        </span>
                        <span className="text-[12px] text-text-secondary flex items-center gap-0.5">
                          <svg width="12" height="12" viewBox="0 0 14 14" fill="#C8A882">
                            <path d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.4 3.3 12.3l.7-4.1-3-2.9 4.2-.7L7 1z" />
                          </svg>
                          {s.rating}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in" onClick={() => setShowCancelModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-modal w-[90%] max-w-sm p-6 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[18px] font-semibold text-primary mb-2">예약을 취소하시겠습니까?</h3>
            <div className="bg-red-50 rounded-card p-3 mb-4">
              <p className="text-[13px] text-red-700 font-medium mb-1">취소 수수료 안내</p>
              <ul className="text-[12px] text-red-600 space-y-0.5">
                <li>· 체크인 7일 전: 전액 환불</li>
                <li>· 체크인 3일 전: 50% 환불</li>
                <li>· 체크인 1일 전: 환불 불가</li>
              </ul>
            </div>
            <p className="text-[14px] text-text-secondary mb-5">
              <strong className="text-primary">{stay.name}</strong> 예약을 취소하면 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-button text-[14px] font-medium text-text-primary hover:bg-bg-off transition-colors"
              >
                돌아가기
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 bg-error text-white rounded-button text-[14px] font-medium hover:bg-red-600 transition-colors"
              >
                취소 확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modify Modal */}
      {showModifyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in" onClick={() => setShowModifyModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-modal w-[90%] max-w-md p-6 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[18px] font-semibold text-primary mb-5">예약 변경</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-semibold text-text-secondary block mb-1">체크인</label>
                  <input
                    type="date"
                    value={modifyCheckIn}
                    onChange={(e) => setModifyCheckIn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-button text-[14px] outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-text-secondary block mb-1">체크아웃</label>
                  <input
                    type="date"
                    value={modifyCheckOut}
                    onChange={(e) => setModifyCheckOut(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-button text-[14px] outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="text-[12px] font-semibold text-text-secondary block mb-1">인원</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setModifyGuests(Math.max(1, modifyGuests - 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary transition-colors"
                  >
                    <svg width="12" height="2" viewBox="0 0 12 2" fill="none"><path d="M1 1h10" stroke="#333" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  </button>
                  <span className="text-[16px] font-medium text-primary">{modifyGuests}명</span>
                  <button
                    onClick={() => setModifyGuests(Math.min(stay.max_guests, modifyGuests + 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="#333" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  </button>
                </div>
              </div>

              {modifyCheckIn && modifyCheckOut && (
                <div className="bg-bg-off rounded-card p-3">
                  <div className="flex justify-between text-[14px]">
                    <span className="text-text-secondary">예상 금액</span>
                    <span className="font-semibold text-primary">
                      {formatPrice(stay.price * calculateNights(new Date(modifyCheckIn), new Date(modifyCheckOut)))}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModifyModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-button text-[14px] font-medium text-text-primary hover:bg-bg-off transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleModify}
                className="flex-1 py-2.5 bg-primary text-white rounded-button text-[14px] font-medium hover:bg-primary/90 transition-colors"
              >
                변경 확인
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <Toast />
    </>
  );
}
