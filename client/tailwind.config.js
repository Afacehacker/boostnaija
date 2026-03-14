/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: "#F8FAFC",
          dark: "#0F1115",
        },
        primary: {
          DEFAULT: "#3A7AFE", // DailyInfluencing Blue
          dark: "#2563EB",
          light: "#60A5FA",
        },
        accent: {
          DEFAULT: "#00F2FE",
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
        },
        card: {
          light: "#FFFFFF",
          dark: "#1A1D23",
        },
        border: {
          light: "#E2E8F0",
          dark: "#2D323A",
        }
      },
      fontFamily: {
        sans: ['Inter', 'Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'space-stars': "url('https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=2072&auto=format&fit=crop')",
      }
    },
  },
  plugins: [],
}
