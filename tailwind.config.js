/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@massalabs/react-ui-kit/src/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("@massalabs/react-ui-kit/presets/massa-station-preset")],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};
