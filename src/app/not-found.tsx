import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-off flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-[80px] font-serif font-bold text-accent/30 mb-2">
          404
        </p>
        <h1 className="text-[24px] font-serif font-bold text-primary mb-3">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-[14px] text-text-secondary mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었습니다
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-white px-8 py-3 rounded-button text-[14px] font-medium hover:bg-primary/90 transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
