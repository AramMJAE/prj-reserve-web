"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Toast from "@/components/common/Toast";
import { mockStays } from "@/data/mock-stays";
import { mockReservations } from "@/data/mock-reservations";
import { mockReviews } from "@/data/mock-reviews";
import { formatPrice, cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import type { Stay } from "@/types";

type AdminTab = "dashboard" | "stays" | "reservations";

const statusMap = {
  pending: { label: "대기중", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "확정", color: "bg-green-100 text-green-700" },
  cancelled: { label: "취소됨", color: "bg-red-100 text-red-700" },
  completed: { label: "이용완료", color: "bg-gray-100 text-gray-600" },
};

export default function AdminPage() {
  const { user, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [editStay, setEditStay] = useState<Stay | null>(null);
  const [showStayModal, setShowStayModal] = useState(false);

  // localStorage에서 관리자 수정/추가/삭제 데이터 관리
  const [adminStays, setAdminStays] = useState<Stay[]>(() => {
    if (typeof window === "undefined") return mockStays;
    const deleted: string[] = JSON.parse(localStorage.getItem("staylog_admin_deleted") || "[]");
    const edits: Record<string, Partial<Stay>> = JSON.parse(localStorage.getItem("staylog_admin_edits") || "{}");
    const added: Stay[] = JSON.parse(localStorage.getItem("staylog_admin_added") || "[]");
    let stays = mockStays.filter((s) => !deleted.includes(s.id));
    stays = stays.map((s) => edits[s.id] ? { ...s, ...edits[s.id] } : s);
    return [...stays, ...added];
  });

  const [adminReservations, setAdminReservations] = useState(() => {
    const localSaved = typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("staylog_reservations") || "[]")
      : [];
    return [...mockReservations, ...localSaved];
  });

  const saveStay = (formData: Partial<Stay>) => {
    if (editStay) {
      // 수정
      const edits: Record<string, Partial<Stay>> = JSON.parse(localStorage.getItem("staylog_admin_edits") || "{}");
      edits[editStay.id] = { ...edits[editStay.id], ...formData };
      localStorage.setItem("staylog_admin_edits", JSON.stringify(edits));
      setAdminStays((prev) => prev.map((s) => s.id === editStay.id ? { ...s, ...formData } : s));
      showToast("숙소가 수정되었습니다", "success");
    } else {
      // 등록
      const newStay: Stay = {
        id: `stay-admin-${Date.now()}`,
        name: formData.name || "새 숙소",
        description: formData.description || "",
        category: (formData.category as Stay["category"]) || "펜션",
        region: (formData.region as Stay["region"]) || "제주",
        address: formData.address || "",
        latitude: 33.45,
        longitude: 126.57,
        price: formData.price || 100000,
        max_guests: formData.max_guests || 4,
        images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"],
        amenities: ["와이파이", "주차", "에어컨"],
        host_name: "관리자",
        host_image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
        rating: 0,
        review_count: 0,
        created_at: new Date().toISOString(),
      };
      const added: Stay[] = JSON.parse(localStorage.getItem("staylog_admin_added") || "[]");
      added.push(newStay);
      localStorage.setItem("staylog_admin_added", JSON.stringify(added));
      setAdminStays((prev) => [...prev, newStay]);
      showToast("숙소가 등록되었습니다", "success");
    }
    setShowStayModal(false);
  };

  const deleteStay = (stayId: string) => {
    const deleted: string[] = JSON.parse(localStorage.getItem("staylog_admin_deleted") || "[]");
    if (!deleted.includes(stayId)) {
      deleted.push(stayId);
      localStorage.setItem("staylog_admin_deleted", JSON.stringify(deleted));
    }
    // admin에서 추가한 숙소면 added에서도 제거
    const added: Stay[] = JSON.parse(localStorage.getItem("staylog_admin_added") || "[]");
    const filtered = added.filter((s) => s.id !== stayId);
    localStorage.setItem("staylog_admin_added", JSON.stringify(filtered));

    setAdminStays((prev) => prev.filter((s) => s.id !== stayId));
    showToast("숙소가 삭제되었습니다", "info");
  };

  const updateReservationStatus = (rsvId: string, newStatus: string) => {
    // localStorage 예약 업데이트
    const saved = JSON.parse(localStorage.getItem("staylog_reservations") || "[]");
    const idx = saved.findIndex((r: { id: string }) => r.id === rsvId);
    if (idx !== -1) {
      saved[idx].status = newStatus;
      localStorage.setItem("staylog_reservations", JSON.stringify(saved));
    }
    setAdminReservations((prev: typeof mockReservations) =>
      prev.map((r) => r.id === rsvId ? { ...r, status: newStatus } : r)
    );
    showToast("예약 상태가 변경되었습니다", "success");
  };

  // 관리자 권한 체크
  if (!user) {
    return (
      <>
        <Header />
        <main className="pt-[72px] min-h-screen flex items-center justify-center bg-bg-off">
          <div className="text-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" className="mx-auto mb-4">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
            </svg>
            <p className="text-[20px] font-semibold text-primary mb-2">로그인이 필요합니다</p>
            <p className="text-[14px] text-text-secondary mb-4">관리자 페이지에 접근하려면 로그인하세요</p>
            <Link href="/auth/login" className="inline-block bg-primary text-white px-6 py-2.5 rounded-button text-[14px] font-medium hover:bg-primary/90 transition-colors">
              로그인하기
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (user.role !== "admin") {
    return (
      <>
        <Header />
        <main className="pt-[72px] min-h-screen flex items-center justify-center bg-bg-off">
          <div className="text-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.5" className="mx-auto mb-4">
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
            </svg>
            <p className="text-[20px] font-semibold text-primary mb-2">접근 권한이 없습니다</p>
            <p className="text-[14px] text-text-secondary mb-4">관리자 계정으로 로그인해주세요</p>
            <Link href="/" className="inline-block bg-primary text-white px-6 py-2.5 rounded-button text-[14px] font-medium hover:bg-primary/90 transition-colors">
              홈으로 돌아가기
            </Link>
          </div>
        </main>
      </>
    );
  }

  const tabs: { key: AdminTab; label: string }[] = [
    { key: "dashboard", label: "대시보드" },
    { key: "stays", label: "숙소 관리" },
    { key: "reservations", label: "예약 관리" },
  ];

  // Dashboard stats
  const stats = [
    { label: "총 숙소", value: adminStays.length, unit: "개" },
    { label: "총 예약", value: adminReservations.length, unit: "건" },
    { label: "총 리뷰", value: mockReviews.length, unit: "개" },
    {
      label: "평균 평점",
      value: adminStays.length > 0
        ? (adminStays.reduce((acc, s) => acc + s.rating, 0) / adminStays.length).toFixed(1)
        : "0",
      unit: "점",
    },
  ];

  const categoryStats = ["한옥", "펜션", "호텔", "게스트하우스"].map((cat) => ({
    category: cat,
    count: adminStays.filter((s) => s.category === cat).length,
  }));

  const regionStats = ["제주", "강원", "경상", "전라", "서울", "경기"].map((r) => ({
    region: r,
    count: adminStays.filter((s) => s.region === r).length,
  }));

  return (
    <>
      <Header />
      <main className="pt-[72px] min-h-screen bg-bg-off">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-title-sm font-serif font-bold text-primary mb-8">
            관리자 페이지
          </h1>

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
              </button>
            ))}
          </div>

          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white rounded-card border border-gray-100 p-5"
                  >
                    <p className="text-[13px] text-text-secondary mb-1">
                      {stat.label}
                    </p>
                    <p className="text-[28px] font-bold text-primary">
                      {stat.value}
                      <span className="text-[14px] font-normal text-text-secondary ml-1">
                        {stat.unit}
                      </span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Distribution */}
                <div className="bg-white rounded-card border border-gray-100 p-6">
                  <h3 className="text-[16px] font-semibold text-primary mb-4">
                    카테고리별 숙소
                  </h3>
                  <div className="space-y-3">
                    {categoryStats.map((cs) => (
                      <div key={cs.category} className="flex items-center gap-3">
                        <span className="w-24 text-[14px] text-text-primary">
                          {cs.category}
                        </span>
                        <div className="flex-1 h-6 bg-bg-off rounded overflow-hidden">
                          <div
                            className="h-full bg-accent/70 rounded"
                            style={{
                              width: `${adminStays.length > 0 ? (cs.count / adminStays.length) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <span className="text-[14px] font-medium text-primary w-8 text-right">
                          {cs.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Region Distribution */}
                <div className="bg-white rounded-card border border-gray-100 p-6">
                  <h3 className="text-[16px] font-semibold text-primary mb-4">
                    지역별 숙소
                  </h3>
                  <div className="space-y-3">
                    {regionStats.map((rs) => (
                      <div key={rs.region} className="flex items-center gap-3">
                        <span className="w-24 text-[14px] text-text-primary">
                          {rs.region}
                        </span>
                        <div className="flex-1 h-6 bg-bg-off rounded overflow-hidden">
                          <div
                            className="h-full bg-primary/30 rounded"
                            style={{
                              width: `${adminStays.length > 0 ? (rs.count / adminStays.length) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <span className="text-[14px] font-medium text-primary w-8 text-right">
                          {rs.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stays Management */}
          {activeTab === "stays" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <p className="text-[14px] text-text-secondary">
                  총 {adminStays.length}개 숙소
                </p>
                <button
                  onClick={() => {
                    setEditStay(null);
                    setShowStayModal(true);
                  }}
                  className="bg-primary text-white px-4 py-2 rounded-button text-[13px] font-medium hover:bg-primary/90 transition-colors"
                >
                  + 숙소 등록
                </button>
              </div>

              <div className="bg-white rounded-card border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left px-4 py-3 text-[12px] font-semibold text-text-secondary uppercase">
                          숙소
                        </th>
                        <th className="text-left px-4 py-3 text-[12px] font-semibold text-text-secondary uppercase hidden md:table-cell">
                          카테고리
                        </th>
                        <th className="text-left px-4 py-3 text-[12px] font-semibold text-text-secondary uppercase hidden md:table-cell">
                          지역
                        </th>
                        <th className="text-right px-4 py-3 text-[12px] font-semibold text-text-secondary uppercase">
                          가격
                        </th>
                        <th className="text-center px-4 py-3 text-[12px] font-semibold text-text-secondary uppercase hidden sm:table-cell">
                          평점
                        </th>
                        <th className="text-center px-4 py-3 text-[12px] font-semibold text-text-secondary uppercase">
                          관리
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminStays.map((stay) => (
                        <tr
                          key={stay.id}
                          className="border-b border-gray-50 last:border-0 hover:bg-bg-off/50"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded overflow-hidden shrink-0">
                                <Image
                                  src={stay.images[0]}
                                  alt={stay.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-[14px] font-medium text-primary truncate max-w-[160px]">
                                {stay.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[13px] text-text-secondary hidden md:table-cell">
                            {stay.category}
                          </td>
                          <td className="px-4 py-3 text-[13px] text-text-secondary hidden md:table-cell">
                            {stay.region}
                          </td>
                          <td className="px-4 py-3 text-[13px] text-primary font-medium text-right">
                            {formatPrice(stay.price)}
                          </td>
                          <td className="px-4 py-3 text-center hidden sm:table-cell">
                            <span className="text-[13px] text-text-secondary">
                              {stay.rating}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setEditStay(stay);
                                  setShowStayModal(true);
                                }}
                                className="text-[12px] text-accent hover:underline"
                              >
                                수정
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`"${stay.name}" 숙소를 삭제하시겠습니까?`)) {
                                    deleteStay(stay.id);
                                  }
                                }}
                                className="text-[12px] text-error hover:underline"
                              >
                                삭제
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Reservations Management */}
          {activeTab === "reservations" && (
            <div>
              <p className="text-[14px] text-text-secondary mb-6">
                총 {adminReservations.length}건 예약
              </p>

              <div className="space-y-3">
                {adminReservations.map((rsv) => {
                  const rsvStay = adminStays.find((s) => s.id === rsv.stay_id) || mockStays.find((s) => s.id === rsv.stay_id);
                  if (!rsvStay) return null;
                  const status = statusMap[rsv.status as keyof typeof statusMap];

                  return (
                    <div
                      key={rsv.id}
                      className="bg-white rounded-card border border-gray-100 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded overflow-hidden shrink-0">
                          <Image
                            src={rsvStay.images[0]}
                            alt={rsvStay.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-[15px] font-medium text-primary">
                            {rsvStay.name}
                          </h3>
                          <p className="text-[13px] text-text-secondary">
                            {rsv.check_in} ~ {rsv.check_out} · {rsv.guests}명
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-[14px] font-medium text-primary">
                          {formatPrice(rsv.total_price)}
                        </span>
                        <span className={`px-2.5 py-1 rounded text-[12px] font-medium ${status.color}`}>
                          {status.label}
                        </span>
                        <select
                          value={rsv.status}
                          onChange={(e) => updateReservationStatus(rsv.id, e.target.value)}
                          className="text-[12px] border border-gray-200 rounded px-2 py-1 outline-none"
                        >
                          <option value="pending">대기중</option>
                          <option value="confirmed">확정</option>
                          <option value="cancelled">취소</option>
                          <option value="completed">이용완료</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Stay Modal */}
        {showStayModal && (
          <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center px-6">
            <div className="bg-white rounded-modal w-full max-w-lg max-h-[80vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[18px] font-semibold text-primary">
                  {editStay ? "숙소 수정" : "숙소 등록"}
                </h2>
                <button
                  onClick={() => setShowStayModal(false)}
                  className="text-text-secondary hover:text-primary"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 5l10 10M15 5L5 15" />
                  </svg>
                </button>
              </div>

              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                saveStay({
                  name: fd.get("name") as string,
                  category: fd.get("category") as Stay["category"],
                  region: fd.get("region") as Stay["region"],
                  price: Number(fd.get("price")) || 100000,
                  max_guests: Number(fd.get("max_guests")) || 4,
                  address: fd.get("address") as string,
                  description: fd.get("description") as string,
                });
              }}>
                <div>
                  <label className="block text-[13px] font-medium text-text-secondary mb-1">숙소명</label>
                  <input
                    name="name"
                    defaultValue={editStay?.name || ""}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-button text-[14px] outline-none focus:border-accent"
                    placeholder="숙소 이름을 입력하세요"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-text-secondary mb-1">카테고리</label>
                    <select
                      name="category"
                      defaultValue={editStay?.category || ""}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-button text-[14px] outline-none"
                      required
                    >
                      <option value="">선택</option>
                      <option value="한옥">한옥</option>
                      <option value="펜션">펜션</option>
                      <option value="호텔">호텔</option>
                      <option value="게스트하우스">게스트하우스</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-text-secondary mb-1">지역</label>
                    <select
                      name="region"
                      defaultValue={editStay?.region || ""}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-button text-[14px] outline-none"
                      required
                    >
                      <option value="">선택</option>
                      <option value="제주">제주</option>
                      <option value="강원">강원</option>
                      <option value="경상">경상</option>
                      <option value="전라">전라</option>
                      <option value="서울">서울</option>
                      <option value="경기">경기</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-text-secondary mb-1">1박 가격</label>
                    <input
                      name="price"
                      type="number"
                      defaultValue={editStay?.price || ""}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-button text-[14px] outline-none focus:border-accent"
                      placeholder="100000"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-text-secondary mb-1">최대 인원</label>
                    <input
                      name="max_guests"
                      type="number"
                      defaultValue={editStay?.max_guests || ""}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-button text-[14px] outline-none focus:border-accent"
                      placeholder="4"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-text-secondary mb-1">주소</label>
                  <input
                    name="address"
                    defaultValue={editStay?.address || ""}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-button text-[14px] outline-none focus:border-accent"
                    placeholder="상세 주소를 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-text-secondary mb-1">숙소 소개</label>
                  <textarea
                    name="description"
                    defaultValue={editStay?.description || ""}
                    rows={4}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-button text-[14px] outline-none focus:border-accent resize-none"
                    placeholder="숙소를 소개해주세요"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowStayModal(false)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-button text-[14px] font-medium text-text-secondary hover:bg-bg-off transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-primary text-white rounded-button text-[14px] font-medium hover:bg-primary/90 transition-colors"
                  >
                    {editStay ? "수정하기" : "등록하기"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <Toast />
    </>
  );
}
