/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/assets/src/**/*.{js,jsx}",
  ],
  important: true,
  theme: {
    extend: {
      colors: {
        border: "rgba(0, 0, 0, 0.08)",
        input: "rgba(0, 0, 0, 0.15)",
        ring: "#5E6AD2",
        background: "#ffffff",
        foreground: "#0f172a",
        primary: {
          DEFAULT: "#5E6AD2",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f1f5f9",
          foreground: "#0f172a",
        },
        muted: {
          DEFAULT: "#f8fafc",
          foreground: "#64748b",
        },
        accent: {
          DEFAULT: "#f1f5f9",
          foreground: "#0f172a",
        },
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}
