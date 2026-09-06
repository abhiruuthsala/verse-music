/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0d0b14',
          2: '#161222',
          3: '#1d1830'
        },
        accent: {
          DEFAULT: '#e8a33d',
          soft: 'rgba(232,163,61,0.22)'
        },
        cream: {
          DEFAULT: '#f5efe6',
          dim: '#a9a2b8'
        },
        line: 'rgba(245,239,230,0.10)'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif']
      },
      borderRadius: {
        xl2: '14px'
      }
    }
  },
  plugins: []
};
