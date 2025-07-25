module.exports = {
  customSyntax: 'postcss-html',
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
    'stylelint-config-prettier',
  ],
  rules: {
    'selector-class-pattern': null,
    'color-function-notation': null,
    'declaration-block-no-duplicate-properties': [
      true,
      {
        ignore: ['consecutive-duplicates'],
      },
    ],
  },
};
