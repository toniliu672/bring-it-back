import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        background: 'hsl(var(--background) / <alpha-value>)',
      },
      textColor: {
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

export default config;