import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0f172a",
        surface: "#111827",
        accent: "#38bdf8",
      },
    },
  },
  plugins: [],
} satisfies Config;
