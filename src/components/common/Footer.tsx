import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-white/80">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <span className="text-[20px] font-bold tracking-[0.15em] text-white">
              STAYLOG
            </span>
            <p className="mt-4 text-[13px] leading-relaxed text-white/60">
              국내 감성 숙소를 큐레이션하여
              <br />
              특별한 여행 경험을 선사합니다.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[13px] font-semibold text-white mb-4 tracking-wide">
              카테고리별 숙소
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/stays?category=한옥" className="text-[13px] text-white/60 hover:text-accent transition-colors">
                  한옥 스테이
                </Link>
              </li>
              <li>
                <Link href="/stays?category=펜션" className="text-[13px] text-white/60 hover:text-accent transition-colors">
                  펜션 / 독채
                </Link>
              </li>
              <li>
                <Link href="/stays?category=호텔" className="text-[13px] text-white/60 hover:text-accent transition-colors">
                  부티크 호텔 / 리조트
                </Link>
              </li>
              <li>
                <Link href="/stays?category=게스트하우스" className="text-[13px] text-white/60 hover:text-accent transition-colors">
                  게스트하우스
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-white mb-4 tracking-wide">
              지역별 숙소
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/stays?region=제주" className="text-[13px] text-white/60 hover:text-accent transition-colors">
                  제주특별자치도
                </Link>
              </li>
              <li>
                <Link href="/stays?region=강원" className="text-[13px] text-white/60 hover:text-accent transition-colors">
                  강원특별자치도
                </Link>
              </li>
              <li>
                <Link href="/stays?region=경상" className="text-[13px] text-white/60 hover:text-accent transition-colors">
                  경상도 (부산 · 경주 · 통영)
                </Link>
              </li>
              <li>
                <Link href="/stays?region=전라" className="text-[13px] text-white/60 hover:text-accent transition-colors">
                  전라도 (전주 · 여수 · 담양)
                </Link>
              </li>
              <li>
                <Link href="/stays?region=서울" className="text-[13px] text-white/60 hover:text-accent transition-colors">
                  서울특별시
                </Link>
              </li>
              <li>
                <Link href="/stays?region=경기" className="text-[13px] text-white/60 hover:text-accent transition-colors">
                  경기도
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-white mb-4 tracking-wide">
              고객 지원
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/faq" className="text-[13px] text-white/60 hover:text-accent transition-colors">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <span className="text-[13px] text-white/60">
                  문의: help@staylog.kr
                </span>
              </li>
              <li>
                <span className="text-[13px] text-white/60">
                  운영: 10:00 - 18:00
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/40">
            &copy; 2026 STAYLOG. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/terms" className="text-[12px] text-white/40 hover:text-white/60 transition-colors">
              이용약관
            </Link>
            <Link href="/privacy" className="text-[12px] text-white/40 hover:text-white/60 transition-colors">
              개인정보처리방침
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
