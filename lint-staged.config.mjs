const path = require('path')
 
const eslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`

const prettierCommand = (filenames) =>
  `prettier --write ${filenames.join(' ')}`

module.exports = {
  '*.{js,jsx,ts,tsx}': [eslintCommand, prettierCommand],
}