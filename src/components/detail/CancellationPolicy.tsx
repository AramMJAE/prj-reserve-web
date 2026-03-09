export default function CancellationPolicy() {
  return (
    <div>
      <h2 className="text-[18px] font-semibold text-primary mb-4">환불 정책</h2>
      <div className="border border-gray-200 rounded-card overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          <div className="p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#2D8F5E" strokeWidth="1.5">
                <path d="M4 9l3.5 3.5L14 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-[13px] font-semibold text-primary">체크인 7일 전</p>
            <p className="text-[12px] text-success font-medium mt-0.5">전액 환불</p>
          </div>
          <div className="p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#B8860B" strokeWidth="1.5">
                <circle cx="9" cy="9" r="7" />
                <path d="M9 5.5V9l3 1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[13px] font-semibold text-primary">체크인 3~7일 전</p>
            <p className="text-[12px] text-yellow-700 font-medium mt-0.5">50% 환불</p>
          </div>
          <div className="p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#D94040" strokeWidth="1.5">
                <path d="M5 5l8 8M13 5L5 13" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[13px] font-semibold text-primary">체크인 3일 이내</p>
            <p className="text-[12px] text-error font-medium mt-0.5">환불 불가</p>
          </div>
        </div>
      </div>
      <p className="text-[12px] text-text-secondary mt-3">
        * 천재지변 등 불가항력적 사유 발생 시 별도 협의 가능합니다.
      </p>
    </div>
  );
}
