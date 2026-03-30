/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0B1F3A',
        gold: '#F4C542',
        ivory: '#F6F7F9',
      },
      fontFamily: {
        heading: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 40px rgba(11, 31, 58, 0.14)',
        card: '0 14px 30px rgba(11, 31, 58, 0.12)',
      },
      borderRadius: {
        card: '1.25rem',
        '4xl': '2rem',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(120deg, rgba(11, 31, 58, 0.94) 0%, rgba(11, 31, 58, 0.62) 48%, rgba(11, 31, 58, 0.85) 100%)',
        'cta-glow':
          'radial-gradient(circle at 20% 10%, rgba(244, 197, 66, 0.25) 0%, rgba(244, 197, 66, 0) 60%)',
      },
    },
  },
  plugins: [],
}
