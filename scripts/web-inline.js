// Regenerates web/js/components/*.js from web/components/*.html.
// The generated files inject each section via classic <script> tags,
// which browsers allow on file:// (unlike fetch). Edit the .html sources,
// then run: npm run web:inline
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'web');
const srcDir = path.join(root, 'components');
const outDir = path.join(root, 'js', 'components');

fs.mkdirSync(outDir, { recursive: true });

const names = fs.readdirSync(srcDir)
  .filter((f) => f.endsWith('.html'))
  .map((f) => path.basename(f, '.html'))
  .sort();

for (const name of names) {
  const html = fs.readFileSync(path.join(srcDir, name + '.html'), 'utf8').trim();
  if (html.includes('</script')) {
    throw new Error(`${name}.html contains a </script> tag, which cannot be inlined.`);
  }
  const escaped = html
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
  const js =
    `// GENERATED from components/${name}.html — do not edit directly.\n` +
    `// Edit the HTML source, then run: npm run web:inline\n` +
    `document.querySelector('[data-component="${name}"]').innerHTML = \`${escaped}\`;\n`;
  fs.writeFileSync(path.join(outDir, name + '.js'), js, 'utf8');
  console.log(`inlined components/${name}.html -> js/components/${name}.js`);
}
