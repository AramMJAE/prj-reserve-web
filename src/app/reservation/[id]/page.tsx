"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Toast from "@/components/common/Toast";
import { mockReservations } from "@/data/mock-reservations";
import { mockStays } from "@/data/mock-stays";
import { formatPrice, formatDate } from "@/lib/utils";
import { useStore } from "@/store/useStore";

const statusMap = {
  pending: { label: "대기중", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "확정", color: "bg-green-100 text-green-700" },
  cancelled: { label: "취소됨", color: "bg-red-100 text-red-700" },
  completed: { label: "이용완료", color: "bg-gray-100 text-gray-600" },
};

export default function ReservationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useStore();

  const reservation = mockReservations.find((r) => r.id === params.id);
  const stay = reservation ? mockStays.find((s) => s.id === reservation.stay_id) : null;

  if (!reservation || !stay) {
    return (
      <>
        <Header />
        <main className="pt-[72px] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-[48px] mb-4">&#x1F4CB;</p>
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

  const status = statusMap[reservation.status];
  const canCancel = reservation.status === "pending" || reservation.status === "confirmed";

  const handleCancel = () => {
    showToast("예약이 취소되었습니다", "info");
  };

  return (
    <>
      <Header />
      <main className="pt-[72px] min-h-screen bg-bg-off">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <h1 className="text-title-sm font-serif font-bold text-primary mb-8">
            예약 확인
          </h1>

          <div className="bg-white rounded-modal border border-gray-100 overflow-hidden">
            {/* Stay Image & Info */}
            <div className="relative h-[200px]">
              <Image
                src={stay.images[0]}
                alt={stay.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <span className={`inline-block px-2.5 py-1 rounded text-[12px] font-medium ${status.color}`}>
                  {status.label}
                </span>
                <h2 className="text-white text-[22px] font-serif font-bold mt-2">
                  {stay.name}
                </h2>
                <p className="text-white/70 text-[13px]">
                  {stay.region} · {stay.category}
                </p>
              </div>
            </div>

            {/* Reservation Details */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[12px] font-semibold text-text-secondary uppercase mb-1">
                    체크인
                  </p>
                  <p className="text-[15px] font-medium text-primary">
                    {formatDate(reservation.check_in)}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-text-secondary uppercase mb-1">
                    체크아웃
                  </p>
                  <p className="text-[15px] font-medium text-primary">
                    {formatDate(reservation.check_out)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[12px] font-semibold text-text-secondary uppercase mb-1">
                    인원
                  </p>
                  <p className="text-[15px] font-medium text-primary">
                    {reservation.guests}명
                  </p>
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-text-secondary uppercase mb-1">
                    예약일
                  </p>
                  <p className="text-[15px] font-medium text-primary">
                    {formatDate(reservation.created_at)}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <div className="flex justify-between items-center">
                  <span className="text-[16px] font-semibold text-primary">
                    총 결제 금액
                  </span>
                  <span className="text-[20px] font-bold text-primary">
                    {formatPrice(reservation.total_price)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Link
                  href={`/stays/${stay.id}`}
                  className="flex-1 text-center py-3 border border-gray-200 rounded-button text-[14px] font-medium text-text-primary hover:bg-bg-off transition-colors"
                >
                  숙소 보기
                </Link>
                {canCancel && (
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-3 border border-error/30 rounded-button text-[14px] font-medium text-error hover:bg-error/5 transition-colors"
                  >
                    예약 취소
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Toast />
    </>
  );
}
