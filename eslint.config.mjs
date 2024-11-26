import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["src/types/global.d.ts", "**/dist"],
}, ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"), {
    languageOptions: {
        globals: {
            ...globals.browser,
            ...Object.fromEntries(Object.entries(globals.commonjs).map(([key]) => [key, "off"])),
        },

        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "script",
    },

    rules: {
        semi: ["error", "never"],
        quotes: ["error", "single"],
    },
}];