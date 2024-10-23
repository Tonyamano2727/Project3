/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",
  "./public/index.html"
],
  theme: {
    fontFamily:{
      main:['Popin','sans-serif']
    },
    extend: {
      width: {
        main: '1220px'
      },
      backgroundColor: {
        main: '#ee3131'
      },
      colors:{
        main: '#ee3131'
      },
      keyframes: {
        'slide-top':{
          '0%': {
            '-webkit-transform': 'translateY(40);',
                    transform: 'translateY(40);',
          },
          '100%': {
            '-webkit-transform': 'translateY(-10px);',
                    transform: 'translateY(-10px);',
          }
        }
      },
      animation: {
        'slide-top' : 'slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;'
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require("@tailwindcss/forms")({ strategy: 'class'}),
  ],
}