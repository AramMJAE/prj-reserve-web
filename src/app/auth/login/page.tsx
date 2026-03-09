"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, showToast } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("이메일과 비밀번호를 입력해주세요", "error");
      return;
    }

    setLoading(true);
    // Mock login
    setTimeout(() => {
      setUser({ id: "user-01", email, name: email.split("@")[0] });
      showToast("로그인되었습니다", "success");
      setLoading(false);
      router.push("/");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-bg-off flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-10">
          <Link href="/" className="text-[24px] font-bold tracking-[0.15em] text-primary">
            STAYLOG
          </Link>
          <p className="text-[14px] text-text-secondary mt-2">
            감성 숙소 예약 플랫폼
          </p>
        </div>

        <div className="bg-white rounded-modal p-8 shadow-sm border border-gray-100">
          <h2 className="text-[20px] font-semibold text-primary mb-6">로그인</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@staylog.kr"
                className="w-full px-4 py-3 border border-gray-200 rounded-button text-[14px] outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-3 border border-gray-200 rounded-button text-[14px] outline-none focus:border-accent transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-button text-[15px] font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[12px] text-text-secondary">또는</span>
            </div>
          </div>

          <button
            onClick={() => {
              setUser({ id: "guest-01", email: "guest@staylog.kr", name: "게스트" });
              showToast("게스트로 로그인되었습니다", "success");
              router.push("/");
            }}
            className="w-full py-3 rounded-button text-[15px] font-medium border border-gray-200 text-text-primary hover:bg-bg-off transition-colors flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="6" r="3" />
              <path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
            </svg>
            게스트로 둘러보기
          </button>

          <div className="mt-5 text-center">
            <span className="text-[13px] text-text-secondary">
              계정이 없으신가요?{" "}
              <Link href="/auth/signup" className="text-accent font-medium hover:underline">
                회원가입
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
