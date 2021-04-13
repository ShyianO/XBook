module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:@angular-eslint/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "no-debugger": "error",
  },
  overrides: [
    {
      files: ["*.component.html"],
      extends: ["plugin:@angular-eslint/template/recommended"],
    },
  ],
};
