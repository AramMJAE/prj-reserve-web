"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const { setUser, showToast } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast("모든 항목을 입력해주세요", "error");
      return;
    }
    if (password !== confirmPassword) {
      showToast("비밀번호가 일치하지 않습니다", "error");
      return;
    }
    if (password.length < 6) {
      showToast("비밀번호는 6자 이상이어야 합니다", "error");
      return;
    }

    setLoading(true);

    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role: "user" } },
      });
      setLoading(false);
      if (error) {
        showToast(error.message, "error");
        return;
      }
      if (data.user) {
        setUser({ id: data.user.id, email, name, role: "user" });
        showToast("회원가입이 완료되었습니다", "success");
        router.push("/");
      }
    } else {
      setTimeout(() => {
        setUser({ id: `user-${Date.now()}`, email, name, role: "user" });
        showToast("회원가입이 완료되었습니다", "success");
        setLoading(false);
        router.push("/");
      }, 800);
    }
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
          <h2 className="text-[20px] font-semibold text-primary mb-6">회원가입</h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                이름
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className="w-full px-4 py-3 border border-gray-200 rounded-button text-[14px] outline-none focus:border-accent transition-colors"
              />
            </div>
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
                placeholder="6자 이상 입력하세요"
                className="w-full px-4 py-3 border border-gray-200 rounded-button text-[14px] outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                비밀번호 확인
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                className="w-full px-4 py-3 border border-gray-200 rounded-button text-[14px] outline-none focus:border-accent transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-button text-[15px] font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "가입 중..." : "회원가입"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-[13px] text-text-secondary">
              이미 계정이 있으신가요?{" "}
              <Link href="/auth/login" className="text-accent font-medium hover:underline">
                로그인
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
