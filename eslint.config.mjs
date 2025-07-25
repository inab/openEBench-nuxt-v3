import withNuxt from "./.nuxt/eslint.config.mjs";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default withNuxt({
  ...eslintPluginPrettierRecommended,
  rules: {
    ...(eslintPluginPrettierRecommended.rules || {}),
    "linebreak-style": ["error", "unix"],
  },
});
