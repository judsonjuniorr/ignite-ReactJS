module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  arrowParens: 'avoid',
  endOfLine: 'auto',
  overrides: [
    {
      files: '*.spec.ts',
      options: { semi: true }
    }
  ]
}
