"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { supabase } from "@/lib/supabase";
import Toast from "@/components/common/Toast";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, showToast } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const mockLogin = (loginEmail: string) => {
    const isAdmin = loginEmail === "admin@staylog.kr";
    setUser({
      id: isAdmin ? "admin-01" : "user-01",
      email: loginEmail,
      name: loginEmail.split("@")[0],
      role: isAdmin ? "admin" : "user",
    });
    showToast("로그인되었습니다", "success");
    router.push("/");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("이메일과 비밀번호를 입력해주세요", "error");
      return;
    }

    setLoading(true);

    // Supabase Auth 로그인
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data.user) {
          const name = data.user.user_metadata?.name || email.split("@")[0];
          const role = data.user.user_metadata?.role || "user";
          setUser({ id: data.user.id, email: data.user.email || email, name, role });
          showToast("로그인되었습니다", "success");
          setLoading(false);
          router.push("/");
          return;
        }
        // 로그인 실패
        setLoading(false);
        showToast(
          error?.message?.includes("Invalid login credentials") || error?.message?.includes("invalid")
            ? "이메일 또는 비밀번호가 올바르지 않습니다"
            : "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요",
          "error"
        );
        return;
      } catch (err: unknown) {
        setLoading(false);
        // 네트워크 에러 (서버 자체 연결 불가)만 mock fallback
        const isNetworkError = err instanceof TypeError && err.message.includes("fetch");
        if (isNetworkError) {
          showToast("서버 연결에 실패하여 체험 모드로 로그인합니다", "info");
          mockLogin(email);
          return;
        }
        // 그 외 (400 등 인증 실패)
        showToast("이메일 또는 비밀번호가 올바르지 않습니다", "error");
        return;
      }
    }

    // Supabase 미연결 시에만 mock login
    setLoading(false);
    mockLogin(email);
  };

  /* 소셜 로그인 - 추후 연동 시 주석 해제
  const handleSocialLogin = (provider: "kakao" | "google") => {
    const name = provider === "kakao" ? "카카오 사용자" : "Google User";
    const email = provider === "kakao" ? "kakao@staylog.kr" : "google@staylog.kr";
    setUser({ id: `${provider}-${Date.now()}`, email, name, role: "user" });
    showToast(`${provider === "kakao" ? "카카오" : "Google"}로 로그인되었습니다`, "success");
    router.push("/");
  };
  */

  const handleGuestLogin = () => {
    setUser({ id: "guest-01", email: "guest@staylog.kr", name: "게스트", role: "user" });
    showToast("게스트로 로그인되었습니다", "success");
    router.push("/");
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

          {/* 소셜 로그인 - 추후 연동 시 주석 해제
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[12px] text-text-secondary">소셜 로그인</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin("kakao")}
              className="flex-1 py-3 rounded-button text-[14px] font-medium bg-[#FEE500] text-[#3C1E1E] hover:bg-[#FDD835] transition-colors flex items-center justify-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#3C1E1E">
                <path d="M12 3C6.5 3 2 6.58 2 11c0 2.83 1.87 5.32 4.68 6.73l-.96 3.57c-.07.26.22.46.44.31L10 19.12c.65.09 1.32.13 2 .13 5.5 0 10-3.58 10-8.25S17.5 3 12 3z" />
              </svg>
              카카오
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              className="flex-1 py-3 rounded-button text-[14px] font-medium border border-gray-200 text-text-primary hover:bg-bg-off transition-colors flex items-center justify-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
          </div>
          */}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[12px] text-text-secondary">또는</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGuestLogin}
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
      <Toast />
    </div>
  );
}
