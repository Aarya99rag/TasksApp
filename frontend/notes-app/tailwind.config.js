/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Colors used in the project
      colors:{
        primary: "#2B85FF",
        secondary: "#EF863E",
      },
      backgroundImage: {
        'custom-gradient': 'radial-gradient(circle, rgba(3,1,139,1) 33%, rgba(0,0,0,1) 69%)',
      },
      keyframes: {
        gradientShift: {
          '0%': {
            background: 'radial-gradient(circle, rgba(3,1,139,1) 33%, rgba(0,0,0,1) 69%)',
          },
          '50%': {
            background: 'radial-gradient(circle, rgba(3,1,139,1) 60%, rgba(0,0,0,1) 100%)',
          },
          '100%': {
            background : 'radial-gradient(circle, rgba(3,1,139,1) 0%, rgba(0,0,0,1) 69%, rgba(1,0,66,1) 77%)',
          },
        },
      },
      animation: {
        'gradient-shift': 'gradientShift 5s ease-in-out infinite',
      },
    },
  },
}


 