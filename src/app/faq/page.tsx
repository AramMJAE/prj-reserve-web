"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Toast from "@/components/common/Toast";
import ScrollToTop from "@/components/common/ScrollToTop";
import { cn } from "@/lib/utils";

const faqData = [
  {
    category: "예약/결제",
    items: [
      { q: "예약은 어떻게 하나요?", a: "원하시는 숙소를 선택한 후 날짜와 인원을 설정하고 '예약하기' 버튼을 누르시면 됩니다. 로그인이 필요하며, 결제 완료 후 예약이 확정됩니다." },
      { q: "결제 수단은 어떤 것을 지원하나요?", a: "신용카드, 체크카드, 카카오페이, 네이버페이, 토스페이, 무통장입금을 지원합니다." },
      { q: "예약 확인은 어디서 하나요?", a: "마이페이지 > 예약 내역에서 현재 예약 상태를 확인하실 수 있습니다. 예약 확정 시 이메일과 문자로도 안내해 드립니다." },
      { q: "예약 날짜를 변경할 수 있나요?", a: "체크인 7일 전까지 마이페이지에서 날짜 변경이 가능합니다. 변경 시 요금 차액이 발생할 수 있습니다." },
    ],
  },
  {
    category: "숙소",
    items: [
      { q: "체크인/체크아웃 시간은 어떻게 되나요?", a: "일반적으로 체크인은 15:00 이후, 체크아웃은 11:00 이전입니다. 숙소마다 다를 수 있으니 상세 페이지에서 확인해 주세요." },
      { q: "반려동물 동반이 가능한가요?", a: "숙소마다 정책이 다릅니다. 숙소 상세 페이지의 '숙소 이용 규칙'에서 반려동물 동반 가능 여부를 확인해 주세요." },
      { q: "숙소에 주차가 가능한가요?", a: "편의시설에 '주차'가 표시된 숙소는 무료 주차가 가능합니다. 주차 공간이 제한적일 수 있으니 사전에 호스트에게 문의해 주세요." },
    ],
  },
  {
    category: "취소/환불",
    items: [
      { q: "예약 취소는 어떻게 하나요?", a: "마이페이지 > 예약 내역에서 해당 예약의 '취소' 버튼을 눌러 취소하실 수 있습니다." },
      { q: "환불 정책은 어떻게 되나요?", a: "체크인 7일 전: 전액 환불 / 체크인 3~7일 전: 50% 환불 / 체크인 3일 이내: 환불 불가. 천재지변 등 불가항력적 사유 시 별도 협의 가능합니다." },
      { q: "환불은 언제 처리되나요?", a: "취소 승인 후 영업일 기준 3~5일 이내 결제 수단으로 환불됩니다. 카드사에 따라 추가 시간이 소요될 수 있습니다." },
    ],
  },
  {
    category: "계정",
    items: [
      { q: "회원가입은 어떻게 하나요?", a: "우측 상단의 '회원가입' 버튼을 클릭하여 이메일, 비밀번호, 이름을 입력하시면 가입이 완료됩니다." },
      { q: "비밀번호를 잊어버렸어요.", a: "로그인 페이지에서 '비밀번호 찾기'를 클릭한 후 가입 시 사용한 이메일을 입력하시면 비밀번호 재설정 링크를 보내드립니다." },
      { q: "회원 탈퇴는 어떻게 하나요?", a: "마이페이지 > 설정 > 회원 탈퇴에서 진행하실 수 있습니다. 탈퇴 시 모든 데이터가 삭제되며 복구가 불가능합니다." },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 px-1 text-left group"
      >
        <span className="text-[15px] font-medium text-primary pr-4 group-hover:text-accent transition-colors">{q}</span>
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
          className={cn("shrink-0 text-gray-400 transition-transform duration-300", open && "rotate-180")}
        >
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className={cn(
        "grid transition-all duration-300 ease-out",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}>
        <div className="overflow-hidden">
          <p className="text-[14px] text-text-secondary leading-relaxed pb-4 px-1">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(faqData[0].category);

  return (
    <>
      <Header />
      <main className="pt-[72px] min-h-screen bg-bg-white">
        {/* Hero */}
        <div className="bg-primary py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-accent text-[13px] tracking-[0.2em] uppercase mb-3 font-inter">
              FAQ
            </p>
            <h1 className="text-[28px] sm:text-[36px] font-serif font-bold text-white mb-3">
              자주 묻는 질문
            </h1>
            <p className="text-white/60 text-[15px]">
              STAYLOG 이용에 대한 궁금한 점을 확인하세요
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex gap-2 py-6 overflow-x-auto border-b border-gray-100">
            {faqData.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={cn(
                  "px-4 py-2 rounded-button text-[14px] font-medium whitespace-nowrap transition-all",
                  activeCategory === cat.category
                    ? "bg-primary text-white"
                    : "bg-bg-off text-text-secondary hover:bg-gray-200"
                )}
              >
                {cat.category}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="py-6">
            {faqData
              .filter((cat) => cat.category === activeCategory)
              .map((cat) => (
                <div key={cat.category}>
                  {cat.items.map((item, i) => (
                    <FAQItem key={i} q={item.q} a={item.a} />
                  ))}
                </div>
              ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-bg-off py-16 mt-8">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-[20px] font-semibold text-primary mb-2">
              원하시는 답변을 찾지 못하셨나요?
            </h2>
            <p className="text-[14px] text-text-secondary mb-8">
              고객센터로 문의해 주시면 빠르게 도움을 드리겠습니다
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-white rounded-card p-5 border border-gray-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8A882" strokeWidth="1.5" className="mx-auto mb-3">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 4L12 13 2 4" />
                </svg>
                <p className="text-[13px] text-text-secondary mb-1">이메일 문의</p>
                <p className="text-[15px] font-semibold text-primary">help@staylog.kr</p>
              </div>
              <div className="bg-white rounded-card p-5 border border-gray-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8A882" strokeWidth="1.5" className="mx-auto mb-3">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.81.36 1.6.68 2.34a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.74-1.24a2 2 0 012.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0122 16.92z" />
                </svg>
                <p className="text-[13px] text-text-secondary mb-1">전화 문의</p>
                <p className="text-[15px] font-semibold text-primary">1588-0000</p>
              </div>
            </div>
            <p className="text-[12px] text-text-secondary mt-4">운영시간: 평일 09:00 - 18:00 (주말/공휴일 휴무)</p>
          </div>
        </div>
      </main>
      <Footer />
      <Toast />
      <ScrollToTop />
    </>
  );
}
