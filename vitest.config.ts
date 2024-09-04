import { defineVitestConfig } from "@nuxt/test-utils/config";
import vue from "@vitejs/plugin-vue";

export default defineVitestConfig({
  plugins: [],
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      reporter: ["text", "json", "html"],
      provider: "istanbul",
    },
    reporters: ["verbose"],
    include: ["**/*.spec.ts", "**/*.test.ts"],
    exclude: ["node_modules/**", "**/migrations/**", "**/coverage/**"],
  },
});
