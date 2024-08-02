import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        primaryOeb: {
          50: "#e6eef5",
          100: "#c6d8e9",
          150: "#b0d9ff",
          200: "#98b8d7",
          300: "#6a98c4",
          400: "#3d79b3",
          500: "#0b579f",
          600: "#094987",
          700: "#084177",
          800: "#052b4f",
          900: "#021527",
          950: "#01080f",
        },
        secondaryOeb: {
          50: "#fdf1e8",
          100: "#fcdec7",
          200: "#f9bd90",
          300: "#f69c58",
          400: "#f58f42",
          500: "#f47c21",
          600: "#cf691c",
          700: "#b75d18",
          800: "#7a3e10",
          900: "#3d1f08",
          950: "#180c03",
        },
      },
    },
  },
};
