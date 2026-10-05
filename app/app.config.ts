export default defineAppConfig({
  ui: {
    colors: {
      primary: "primaryOeb",
      secondary: "secondaryOeb",
    },
    button: {
      slots: {
        base: "rounded-md font-sans",
      },
    },
    table: {
      slots: {
        thead: "border-b border-gray-200 dark:border-gray-700",
        tbody: "divide-y divide-gray-200 dark:divide-gray-700",
      },
    },
  },
});
