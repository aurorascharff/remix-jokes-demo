/**
 * This is intended to be a basic starting point for linting in your app.
 * It relies on recommended configs out of the box for simplicity, but you can
 * and should modify this configuration to best suit your team's needs.
 */

/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  // Base config
extends: ["eslint:recommended",
    "eslint-config-prettier",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier"
  ],
  ignorePatterns: ["!**/.server", "!**/.client"],
  overrides: [
    {
      files: ["**/*.ts?(x)"],
            rules: {
        "@typescript-eslint/consistent-type-imports": [
          "warn",
          {
            "prefer": "type-imports"
          }
        ],
        "arrow-body-style": ["warn", "always"],
        "autofix/no-unused-vars": [
          "warn",
          {
            "argsIgnorePattern": "^_",
            "destructuredArrayIgnorePattern": "^_",
            "ignoreRestSiblings": true
          }
        ],
        "import/order": [
          "warn",
          {
            "alphabetize": { "order": "asc" },
            "groups": ["builtin", "external", "parent", "sibling", "index", "object", "type"],
            "pathGroups": [
              {
                "group": "parent",
                "pattern": "@/**/**",
                "position": "before"
              }
            ]
          }
        ],
        "no-console": "warn",
        "no-redeclare": "warn",
        "quotes": ["warn", "single"],
        "react/display-name": "error",
        "react/jsx-key": "warn",
        "react/react-in-jsx-scope": "off",
        "react/self-closing-comp": ["error", { "component": true, "html": true }],
        "spaced-comment": "warn"
      },
    }
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["autofix", "sort-keys-fix"], 
  root: true,
  rules: {
    "sort-keys-fix/sort-keys-fix": "warn",
    },
  settings: {
    'import/resolver': {
      alias: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        map: [
          ['~', './app'],
        ],
      },
    },
  }
};
