/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      md: "1250px",
      sm:"705px",
    }, fontFamily: {
      sans: ['Arial', 'sans-serif'],
      serif: ['Arial', 'sans-serif'],
    },
    extend: {
      colors: {
        ft: "#004846",
        "ft-light":"#009188",
        title: "#4f575e",
      },
      width: {
        'deflaut':'1250px',
        'table': '1225px',
        'link':'250px',
        'url':'360px',
        'linkRes':'230px',
        'linkEdit':'50px',
        'date':"150px",
        'comAns':"175px",
        'categories':"380px",
      },
      height:{
        'tableCommunication':"420px",
      }
    },
  },
  plugins: [require("flowbite/plugin"),require('@tailwindcss/line-clamp')],
  
};