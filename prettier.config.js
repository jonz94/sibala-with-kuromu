/** @type {import('prettier').Config} */
const config = {
  printWidth: 120,
  semi: false,
  singleQuote: true,

  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-packagejson'],

  overrides: [
    {
      files: ['tsconfig.json', '.vscode/**.json'],
      options: {
        parser: 'jsonc',
      },
    },
  ],
}

export default config
