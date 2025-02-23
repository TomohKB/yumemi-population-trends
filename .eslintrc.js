module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': ['error', { singleQuote: true, semi: false }],
    'react/react-in-jsx-scope': 'off', // Next.js の場合は React の import 不要
    '@typescript-eslint/no-unused-vars': ['warn'],
    'no-console': 'warn', // console.log を警告
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
