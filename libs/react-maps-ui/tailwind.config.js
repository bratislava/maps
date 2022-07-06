// eslint-disable-next-line no-undef
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],

  theme: {
    screens: {
      xs: "360px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1300px",
    },
    fontSize: {
      xs: ["10px", "14px"],
      sm: ["12px", "16px"],
      DEFAULT: ["16px", "20px"],
      md: ["20px", "24px"],
      lg: ["24px", "28px"],
      xl: ["32px", "40px"],
      xxl: ["42px", "54px"],
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#237c36",
          soft: "#c4efce",
        },
        background: {
          DEFAULT: "#ffffff",
        },
        foreground: {
          DEFAULT: "#ffffff",
        },
        gray: {
          DEFAULT: "#333333",
        },
        black: {
          DEFAULT: "black",
        },
      },
      boxShadow: {
        lg: "0 0 20px 0 rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};
