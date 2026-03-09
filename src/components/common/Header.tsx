"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useStore((s) => s.user);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 홈에서는 스크롤 전 투명, 그 외 페이지에서는 항상 흰 배경
  const showWhiteBg = scrolled || !isHome;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        showWhiteBg
          ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <span
              className={cn(
                "text-[22px] font-bold tracking-[0.15em] transition-colors duration-300",
                showWhiteBg ? "text-primary" : "text-white"
              )}
            >
              STAYLOG
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/stays"
              className={cn(
                "text-[15px] font-medium transition-colors duration-300 hover:text-accent",
                showWhiteBg ? "text-text-primary" : "text-white/90"
              )}
            >
              숙소 둘러보기
            </Link>
            {user ? (
              <>
                <Link
                  href="/mypage"
                  className={cn(
                    "text-[15px] font-medium transition-colors duration-300 hover:text-accent",
                    showWhiteBg ? "text-text-primary" : "text-white/90"
                  )}
                >
                  마이페이지
                </Link>
                <div
                  className={cn(
                    "w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm font-medium"
                  )}
                >
                  {user.name[0]}
                </div>
              </>
            ) : (
              <Link
                href="/auth/login"
                className={cn(
                  "text-[15px] font-medium px-5 py-2 rounded-button transition-all duration-300",
                  showWhiteBg
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                )}
              >
                로그인
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "md:hidden p-2 transition-colors",
              showWhiteBg ? "text-primary" : "text-white"
            )}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-6 py-4 space-y-3">
            <Link
              href="/stays"
              className="block text-[15px] font-medium text-text-primary py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              숙소 둘러보기
            </Link>
            {user ? (
              <Link
                href="/mypage"
                className="block text-[15px] font-medium text-text-primary py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                마이페이지
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="block text-[15px] font-medium text-accent py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
