import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Create __filename and __dirname for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "no-const-assign": "error",
      "no-unused-expressions": "error",

      // TypeScript-specific rules
      "@typescript-eslint/explicit-member-accessibility": [
        "warn",
        { accessibility: "explicit" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-inferrable-types": "warn",
      "@typescript-eslint/no-namespace": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-empty-interface": "warn",
      "@typescript-eslint/no-use-before-define": "warn",
      "@typescript-eslint/member-ordering": [
        "warn",
        {
          default: [
            "signature",
            "public-static-field",
            "protected-static-field",
            "private-static-field",
            "public-instance-field",
            "protected-instance-field",
            "private-instance-field",
            "constructor",
            "public-method",
            "protected-method",
            "private-method",
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
