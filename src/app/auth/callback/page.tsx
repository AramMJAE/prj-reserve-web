"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/useStore";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { setUser, showToast } = useStore();

  useEffect(() => {
    const handleCallback = async () => {
      if (!supabase) {
        router.push("/");
        return;
      }

      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.user) {
        showToast("로그인에 실패했습니다", "error");
        router.push("/auth/login");
        return;
      }

      const user = session.user;
      setUser({
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "사용자",
        role: user.user_metadata?.role || "user",
      });
      showToast("로그인되었습니다", "success");
      router.push("/");
    };

    handleCallback();
  }, [router, setUser, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-off">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[14px] text-text-secondary">로그인 처리 중...</p>
      </div>
    </div>
  );
}
