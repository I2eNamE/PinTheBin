/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      'f4f4f4': '#f4f4f4',
      'ebebeb': '#ebebeb',
      '717171': '#717171',
      'ffffff': '#ffffff',
      '505050': '#505050',
      'FF0000': '#FF0000',
      'bdbdbd': '#BDBDBD',
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        'NotoSansThai': ['Noto Sans Thai', 'sans-serif']
      },
    },
  },
  plugins: [],
}
