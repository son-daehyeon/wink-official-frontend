const eslintCommand = (filenames) => `eslint ${filenames.map((f) => `"${f}"`).join(' ')} --fix`;

const prettierCommand = (filenames) => `prettier --write ${filenames.join(' ')}`;

export default {
  '*.{js,jsx,ts,tsx}': [eslintCommand, prettierCommand],
};
