// tailwind.config.js

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'), // Include Daisy UI plugin
    
  ],
  daisyui: {
    themes: ['light'], // Set Daisy UI to use only the light theme
  },
};
