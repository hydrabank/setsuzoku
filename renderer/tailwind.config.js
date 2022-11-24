/** @type {import('tailwindcss').Config} \*/
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './renderer/pages/**/*.{js,ts,jsx,tsx}',
    './renderer/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
        animation: {
            blob: "blob 7s infinite",
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
                    transform: "tranlate(0px, 0px) scale(1)",
                },
            },
        },
    },
    fontFamily: {
        "Inter": ["var(--font-inter)", "Inter"],
    }
  },
  plugins: [
    require('tw-elements/dist/plugin')
  ]
};
