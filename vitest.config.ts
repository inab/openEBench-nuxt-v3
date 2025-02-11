import { defineVitestConfig } from "@nuxt/test-utils/config";
const mockAuthModule = process.env.VITEST ? ["test/mocks/setup"] : [];

export default defineVitestConfig({
  plugins: [],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: mockAuthModule,
    coverage: {
      reporter: ["text", "json", "html"],
      provider: "istanbul",
    },
    reporters: ["verbose"],
    include: ["tests/unit/**/*.spec.ts"],
    exclude: [
      "node_modules/**",
      "**/migrations/**",
      "**/coverage/**",
      "tests/e2e/**",
    ],
  },
});
