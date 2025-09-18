module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-native/all",
    "prettier"
  ],
  plugins: ["react", "react-native", "prettier"],
  env: {
    "react-native/react-native": true,
    node: true
  },
  rules: {
    "prettier/prettier": ["error", { "singleQuote": true }],
    // tes règles perso ici
  },
  settings: {
    react: {
      version: "detect"
    }
  }
}
