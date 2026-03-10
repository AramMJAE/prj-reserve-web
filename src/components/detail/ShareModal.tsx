"use client";

import { useStore } from "@/store/useStore";
import type { Stay } from "@/types";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  stay: Stay;
}

export default function ShareModal({ isOpen, onClose, stay }: ShareModalProps) {
  const { showToast } = useStore();

  if (!isOpen) return null;

  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = `${stay.name} - ${stay.region} ${stay.category} | STAYLOG`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    showToast("링크가 복사되었습니다", "success");
    onClose();
  };

  const shareOptions = [
    {
      label: "링크 복사",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </svg>
      ),
      onClick: handleCopy,
      color: "bg-gray-100 text-primary hover:bg-gray-200",
    },
    {
      label: "카카오톡",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#3C1E1E">
          <path d="M12 3C6.5 3 2 6.58 2 11c0 2.83 1.87 5.32 4.68 6.73l-.96 3.57c-.07.26.22.46.44.31L10 19.12c.65.09 1.32.13 2 .13 5.5 0 10-3.58 10-8.25S17.5 3 12 3z" />
        </svg>
      ),
      onClick: () => {
        window.open(
          `https://story.kakao.com/share?url=${encodeURIComponent(url)}`,
          "_blank",
          "width=600,height=400"
        );
      },
      color: "bg-[#FEE500] text-[#3C1E1E] hover:bg-[#FDD835]",
    },
    {
      label: "X",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      onClick: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          "_blank",
          "width=600,height=400"
        );
      },
      color: "bg-black text-white hover:bg-gray-800",
    },
    {
      label: "페이스북",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      onClick: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank",
          "width=600,height=400"
        );
      },
      color: "bg-[#1877F2] text-white hover:bg-[#166FE5]",
    },
    {
      label: "이메일",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M22 4l-10 8L2 4" />
        </svg>
      ),
      onClick: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`${stay.name}\n${stay.address}\n\n${url}`)}`;
      },
      color: "bg-accent/10 text-accent hover:bg-accent/20",
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-white rounded-modal w-[90%] max-w-sm p-6 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-primary transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
          </svg>
        </button>

        <h3 className="text-[16px] font-semibold text-primary mb-1">공유하기</h3>
        <p className="text-[13px] text-text-secondary mb-5 truncate">{stay.name}</p>

        <div className="grid grid-cols-5 gap-3">
          {shareOptions.map((option) => (
            <button
              key={option.label}
              onClick={option.onClick}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${option.color}`}>
                {option.icon}
              </div>
              <span className="text-[11px] text-text-secondary group-hover:text-primary transition-colors">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
