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
          primary: '#0A3161',    // American Blue
          secondary: '#475569',  // Slate 600
          accent: '#40E0D0',     // Turquoise
          light: '#f8fafc',      // Slate 50
          dark: '#0f172a',       // Slate 900
          success: '#10b981',    // Emerald 500
          warning: '#f59e0b',    // Amber 500
          danger: '#B31942',     // American Red
          border: '#e2e8f0',     // Slate 200
          card: '#ffffff'
        }
      },
      backgroundImage: {
        'formal-gradient': 'linear-gradient(to bottom right, #ffffff, #f1f5f9, #e2e8f0)',
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        gradient: "gradient 8s ease infinite",
      },
      keyframes: {
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
