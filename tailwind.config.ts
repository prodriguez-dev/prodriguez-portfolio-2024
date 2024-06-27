import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/slices/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sofia-sans)"],
        "sans-condensed": ["var(--font-sofia-sans-condensed)"],
        "sans-extra-condensed": ["var(--font-sofia-sans-extra-condensed)"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
