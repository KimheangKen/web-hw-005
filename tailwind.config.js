/** @type {import('tailwindcss').Config} */
module.exports = {

  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily:{
      'inconsolata' : 'Inconsolata, monospace;',
      'sans' : 'Open Sans, sans-serif;'
    },
    extend: {

      width: {
        'w-x': '100px',
        'w-x2': '300px',
        'w-wc': '100%'
      },
      height: {
        'h-x': '100vh',
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      }
    },

  },


  plugins: [
    require('flowbite/plugin'),
    require("daisyui"),
    require('@tailwindcss/line-clamp'),
  ],

  // daisyUI config (optional)
  daisyui: {
    styled: true,
    themes: false,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    themes: [
      {
        mytheme: {

          "primary": "#570DF8",

          "secondary": "#F000B8",

          "accent": "#37CDBE",

          "neutral": "#3D4451",

          "base-100": "#FFFFFF",

          "info": "#3ABFF8",

          "success": "#36D399",

          "warning": "#FBBD23",

          "error": "#F87272",
          
        },
      },
    ],
  },

}
