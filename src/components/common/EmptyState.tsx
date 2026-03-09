import Link from "next/link";

type EmptyStateType = "reservation" | "wishlist" | "review" | "search" | "stay";

const illustrations: Record<EmptyStateType, React.ReactNode> = {
  reservation: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-gray-300">
      <rect x="16" y="20" width="48" height="44" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M16 32h48" stroke="currentColor" strokeWidth="2" />
      <path d="M28 16v8M52 16v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="28" y="40" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="44" y="40" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="28" y="52" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  wishlist: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-gray-300">
      <path
        d="M40 64s-20-13-20-28a12 12 0 0122.4-6A12 12 0 0160 36c0 15-20 28-20 28z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M34 38l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  review: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-gray-300">
      <rect x="14" y="16" width="52" height="40" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M14 48l12 12V48" stroke="currentColor" strokeWidth="2" />
      <path d="M28 30h24M28 38h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="56" cy="22" r="8" fill="white" stroke="currentColor" strokeWidth="2" />
      <path d="M56 18l1.5 3 3.3.5-2.4 2.3.6 3.4-3-1.6-3 1.6.6-3.4-2.4-2.3 3.3-.5L56 18z" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  search: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-gray-300">
      <circle cx="34" cy="34" r="18" stroke="currentColor" strokeWidth="2" />
      <path d="M48 48l14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M28 30h12M28 38h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  stay: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-gray-300">
      <path d="M10 56l30-28 30 28" stroke="currentColor" strokeWidth="2" />
      <rect x="18" y="40" width="44" height="24" stroke="currentColor" strokeWidth="2" />
      <rect x="32" y="48" width="16" height="16" stroke="currentColor" strokeWidth="2" />
      <path d="M40 48v16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
};

const messages: Record<EmptyStateType, { title: string; description: string }> = {
  reservation: { title: "예약 내역이 없습니다", description: "멋진 숙소에서의 여행을 계획해보세요" },
  wishlist: { title: "찜한 숙소가 없습니다", description: "마음에 드는 숙소를 찜해보세요" },
  review: { title: "작성한 리뷰가 없습니다", description: "이용한 숙소의 리뷰를 남겨보세요" },
  search: { title: "조건에 맞는 숙소가 없습니다", description: "필터 조건을 변경해 보세요" },
  stay: { title: "숙소를 찾을 수 없습니다", description: "다른 숙소를 둘러보세요" },
};

interface EmptyStateProps {
  type: EmptyStateType;
  linkHref?: string;
  linkText?: string;
}

export default function EmptyState({ type, linkHref, linkText }: EmptyStateProps) {
  const msg = messages[type];
  return (
    <div className="text-center py-16">
      <div className="flex justify-center mb-4">{illustrations[type]}</div>
      <p className="text-[16px] font-medium text-primary mb-1">{msg.title}</p>
      <p className="text-[13px] text-text-secondary">{msg.description}</p>
      {linkHref && linkText && (
        <Link
          href={linkHref}
          className="inline-block mt-5 text-[14px] text-accent font-medium hover:underline"
        >
          {linkText} &rarr;
        </Link>
      )}
    </div>
  );
}
