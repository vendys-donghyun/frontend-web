import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

// 전 앱/패키지가 공유하는 기본 ESLint 규칙 (flat config)
export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
);
