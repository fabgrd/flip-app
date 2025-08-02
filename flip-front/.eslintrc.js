module.exports = {
    root: true,
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react-hooks/recommended",
      "prettier"
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "react", "react-hooks"],
    env: {
      browser: true,
      es6: true,
      node: true,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn"],
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
  };
  