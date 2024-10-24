import { defineVitestConfig } from "@nuxt/test-utils/config";
import vue from "@vitejs/plugin-vue";
const mockAuthModule = process.env.VITEST ? ['test/mocks/setup'] : [];


export default defineVitestConfig({
  plugins: [],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: mockAuthModule, // Carga el módulo de setup si estamos en modo de prueba
    coverage: {
      reporter: ["text", "json", "html"],
      provider: "istanbul",
    },
    reporters: ["verbose"],
    include: ["**/*.spec.ts", "**/*.test.ts"],
    exclude: ["node_modules/**", "**/migrations/**", "**/coverage/**"],
  },
});
