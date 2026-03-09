import Link from "next/link";

const categories = [
  {
    name: "한옥",
    description: "전통 한옥의 멋과 현대적 편안함",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 16l12-10 12 10" />
        <path d="M6 14v12h20V14" />
        <path d="M12 26V20h8v6" />
      </svg>
    ),
  },
  {
    name: "펜션",
    description: "자연 속 프라이빗 독채 숙소",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 28h26" />
        <path d="M5 28V12l11-8 11 8v16" />
        <rect x="12" y="18" width="8" height="10" />
      </svg>
    ),
  },
  {
    name: "호텔",
    description: "부티크 호텔 · 리조트",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="6" width="24" height="22" rx="1" />
        <path d="M4 12h24M4 18h24M4 24h24" />
        <path d="M12 6v22M20 6v22" />
      </svg>
    ),
  },
  {
    name: "게스트하우스",
    description: "여행자들과 함께하는 가성비 숙소",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="16" cy="10" r="4" />
        <circle cx="8" cy="14" r="3" />
        <circle cx="24" cy="14" r="3" />
        <path d="M4 28c0-5 4-9 12-9s12 4 12 9" />
      </svg>
    ),
  },
];

export default function CategoryNav() {
  return (
    <section className="py-section bg-bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-accent text-[13px] tracking-[0.2em] uppercase mb-3 font-inter">
            Categories
          </p>
          <h2 className="text-title-md font-serif font-bold text-primary">
            카테고리별 스테이
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/stays?category=${encodeURIComponent(cat.name)}`}
              className="group"
            >
              <div className="bg-bg-off border border-gray-100 rounded-card p-8 text-center hover:border-accent/30 hover:shadow-md transition-all duration-300">
                <div className="text-text-secondary group-hover:text-accent transition-colors duration-300 flex justify-center mb-5">
                  {cat.icon}
                </div>
                <h3 className="text-[16px] font-semibold text-primary mb-2">
                  {cat.name}
                </h3>
                <p className="text-[13px] text-text-secondary">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
