module.exports = {
  env: {
    "browser": true,
    "commonjs": true,
    "es2021": true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  settings: {
    react: {
      createClass: "createReactClass",
      pragma: "React",
      fragment: "Fragment",
      version: "detect",
      flowVersion: "0.53"
    }
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: "latest"
  },
  plugins: [
    "react",
    "@typescript-eslint"
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "indent": [ "error", 2 ],
    "eqeqeq": "error",
    "array-bracket-spacing": [ "error", "always", { "singleValue": false } ],
    "linebreak-style":  [ "error", "unix" ],
    "quotes": [ "error", "double" ],
    "semi": [ "error", "always" ],
    "semi-spacing": [ "error", { "before": false, "after": true } ],
    "semi-style": [ "error", "last" ],
    "prefer-arrow-callback": "error",
    "curly": "error",
    "object-curly-spacing": [ "error", "always" ],
    "no-multiple-empty-lines": [ "error", { "max": 1, "maxBOF": 0, "maxEOF": 1 } ],
    "camelcase": "error",
    "eol-last": [ "error", "always" ],
    "no-compare-neg-zero": "error",
    "no-const-assign": "error",
    "arrow-spacing": [ "error", { "before": true, "after": true } ],
    "arrow-body-style": [ "error", "as-needed" ],
    "comma-dangle": [ "error", "never" ],
    "comma-spacing": [ "error", { "before": false, "after": true } ],
    "comma-style": [ "error", "last" ],
    "computed-property-spacing": [ "error", "never" ],
    "func-call-spacing": [ "error", "never" ],
    "lines-around-comment": [ "error", { "afterBlockComment": true, "beforeBlockComment": false } ],
    "no-extra-parens": "error",
    "no-trailing-spaces": "error",
    "no-whitespace-before-property": "error",
    "nonblock-statement-body-position": [ "error", "beside" ],
    "rest-spread-spacing": [ "error", "never" ],
    "template-curly-spacing": "error",
    "template-tag-spacing": [ "error", "always" ],
    "spaced-comment": [ "error", "always" ],
    "func-style": [ "error", "expression" ],
    "no-extra-semi": "error",
    "no-undefined": "error",
    "no-useless-concat": "error"
  }
};
