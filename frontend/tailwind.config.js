/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vibrant: {
          primary: '#6366f1',    // Indigo 500 (Vibrant Blue/Purple)
          secondary: '#8b5cf6',  // Violet 500
          accent: '#ec4899',     // Pink 500 (Hot Pink)
          light: '#fdf4ff',      // Fuchsia 50 (Very light vibrant tint)
          dark: '#312e81',       // Indigo 900
          success: '#22c55e',    // Green 500 (Vibrant Green)
          warning: '#f97316',    // Orange 500 (Vibrant Orange)
          danger: '#ef4444',     // Red 500 (Vibrant Red)
          border: '#e9d5ff',     // Purple 200
          card: '#ffffff'
        }
      },
      backgroundImage: {
        'vibrant-gradient': 'linear-gradient(to bottom right, #fdf4ff, #fae8ff, #f3e8ff)',
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
