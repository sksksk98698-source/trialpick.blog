const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '../docs/.vitepress/dist');

function getAllHtml(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(getAllHtml(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  });
  return results;
}

const htmlFiles = getAllHtml(dist);
console.log('Total HTML files:', htmlFiles.length);

let canonicalPass = 0;
let canonicalFails = [];
let noindexCount = 0;
let noindexFiles = [];

htmlFiles.forEach(file => {
  const rel = path.relative(dist, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');

  // Check noindex
  if (/noindex/i.test(content)) {
    noindexCount++;
    noindexFiles.push(rel);
  }

  // Check canonical
  const match = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  if (!match) {
    // Check alternative attribute order
    const match2 = content.match(/<link\s+href=["']([^"']+)["']\s+rel=["']canonical["']/i);
    if (match2) {
      if (match2[1].startsWith('https://trialpick.blog')) {
        canonicalPass++;
      } else {
        canonicalFails.push({ file: rel, url: match2[1] });
      }
    } else {
      canonicalFails.push({ file: rel, reason: 'missing' });
    }
  } else {
    if (match[1].startsWith('https://trialpick.blog')) {
      canonicalPass++;
    } else {
      canonicalFails.push({ file: rel, url: match[1] });
    }
  }
});

console.log('Canonical pass:', canonicalPass);
console.log('Canonical fails:', canonicalFails);
console.log('Noindex count:', noindexCount, noindexFiles);
