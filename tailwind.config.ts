import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A1A1A",
        secondary: "#F5F0EB",
        accent: "#C8A882",
        "accent-dark": "#B8956E",
        "text-primary": "#333333",
        "text-secondary": "#999999",
        "bg-white": "#FFFFFF",
        "bg-off": "#FAFAF8",
        error: "#D94040",
        success: "#2D8F5E",
      },
      fontFamily: {
        sans: ["var(--font-pretendard)", "Pretendard", "system-ui", "sans-serif"],
        serif: ["var(--font-noto-serif-kr)", "Noto Serif KR", "serif"],
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      fontSize: {
        body: ["14px", { lineHeight: "1.6" }],
        sub: ["16px", { lineHeight: "1.5" }],
        "title-sm": ["24px", { lineHeight: "1.3" }],
        "title-md": ["32px", { lineHeight: "1.2" }],
        "title-lg": ["40px", { lineHeight: "1.1" }],
      },
      borderRadius: {
        card: "8px",
        button: "4px",
        modal: "12px",
      },
      spacing: {
        section: "100px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
