// client/tailwind.config.js
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#1a365d',
          secondary: '#2c5282',
          accent: '#3182ce',
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
    ],
  }