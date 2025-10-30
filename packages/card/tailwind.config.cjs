/**** Tailwind config for the Card package ****/
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false, // avoid resetting consumer app styles
  },
  plugins: [],
};
