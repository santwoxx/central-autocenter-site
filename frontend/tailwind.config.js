// Config do build estatico do Tailwind (o site nao usa mais o CDN).
// Apos mudar classes no index.html / app.js / chatbot.js, regere o CSS com:
//   npx tailwindcss@3.4.17 -c tailwind.config.js -i tailwind-input.css -o tailwind.css --minify
// (rodar dentro da pasta frontend/)
module.exports = {
  content: ['./index.html', './app.js', './chatbot.js'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#48ba07',
          dark: '#121212',
          gray: '#F4F4F5',
        },
        // Acentos do site (emerald-*, amber-*) remapeados para a paleta da marca.
        emerald: {
          50: '#f3fbea',
          100: '#e2f7cf',
          200: '#c5efa2',
          300: '#9ee36a',
          400: '#75d235',
          500: '#48ba07',
          600: '#3a9906',
          700: '#2e7607',
          800: '#285d0b',
          900: '#234f0d',
          950: '#0f2b04',
        },
        amber: {
          50: '#fdf7ed',
          100: '#fbedd9',
          200: '#f7d9ae',
          300: '#f1c27c',
          400: '#eba53f',
          500: '#e58903',
          600: '#bc7002',
          700: '#9c5d02',
          800: '#7c4a02',
          900: '#603a01',
          950: '#402601',
        },
      },
      fontFamily: {
        serif: ["'Instrument Serif'", 'serif'],
        sans: ['Inter', 'sans-serif'],
        anton: ["'Anton'", 'sans-serif'],
      },
    },
  },
};
