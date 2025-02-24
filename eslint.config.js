import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'dist',
      'node_modules', // 依存パッケージを無視
      'build', // ビルドフォルダを無視
      '.eslintrc.js', // eslint の設定ファイル自身を無視
      '**/*.min.js', // minify された JS ファイルを無視
      '.next', // Next.js のキャッシュフォルダ（Next.jsを使う場合）
      'coverage', // テストカバレッジフォルダ（Jestなどを使う場合）
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
)
