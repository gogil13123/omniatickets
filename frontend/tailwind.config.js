/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                orbitron: ['Orbitron', 'sans-serif'],
            },
            colors: {
                'deep-dark': '#000000',
                'deep-purple': '#020005',
                'royal-purple': '#050010',
                'vibrant-purple': '#6b2fb5',
                'accent-purple': '#9d4edd',
                'light-purple': '#c77dff',
                'gold': '#ffd700',
            },
            backgroundImage: {
                'main-dark': 'radial-gradient(circle at top center, #050010 0%, #000000 100%)',
                'purple-gradient': 'linear-gradient(135deg, #020005 0%, #050010 100%)',
                'button-gradient': 'linear-gradient(90deg, #6b2fb5 0%, #9d4edd 100%)',
                'glow-gradient': 'radial-gradient(circle, rgba(157, 78, 221, 0.15) 0%, transparent 70%)',
            },
            boxShadow: {
                'premium': '0 0 30px rgba(157, 78, 221, 0.4)',
                'inner-glow': 'inset 0 0 20px rgba(157, 78, 221, 0.2)',
            }
        },
    },
    plugins: [],
}
