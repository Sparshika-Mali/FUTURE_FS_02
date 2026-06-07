/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        formal: {
          primary: '#2563eb',    // Blue 600
          secondary: '#475569',  // Slate 600
          accent: '#3b82f6',     // Blue 500
          light: '#f8fafc',      // Slate 50
          dark: '#0f172a',       // Slate 900
          success: '#10b981',    // Emerald 500
          warning: '#f59e0b',    // Amber 500
          border: '#e2e8f0',     // Slate 200
          card: '#ffffff'
        }
      },
      backgroundImage: {
        'formal-gradient': 'linear-gradient(to bottom right, #f8fafc, #e2e8f0, #cbd5e1)',
      },
      animation: {
        blob: "blob 7s infinite",
        float: "float 6s ease-in-out infinite",
        gradient: "gradient 8s ease infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        }
      }
    },
  },
  plugins: [],
}
