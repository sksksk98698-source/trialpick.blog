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
const allHtmlRel = new Set(htmlFiles.map(f => path.relative(dist, f).replace(/\\/g, '/')));

let totalLinks = 0;
let emptyHrefs = [];
let hashHrefs = [];
let deadLinks = [];
let internalGraph = new Map();

const linkRegex = /<a\s+[^>]*?href=["']([^"']+)["'][^>]*?>/gi;

htmlFiles.forEach(file => {
  const rel = path.relative(dist, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');
  let match;
  
  if (!internalGraph.has(rel)) internalGraph.set(rel, new Set());

  while ((match = linkRegex.exec(content)) !== null) {
    totalLinks++;
    const href = match[1].trim();

    if (href === '') {
      emptyHrefs.push({ file: rel, link: match[0] });
    } else if (href === '#') {
      hashHrefs.push({ file: rel, link: match[0] });
    } else if (href.startsWith('/') || href.startsWith('https://trialpick.blog/')) {
      // Internal link
      let cleanPath = href.replace('https://trialpick.blog', '');
      cleanPath = cleanPath.split('#')[0].split('?')[0]; // Remove hash and query
      
      let targetHtml = '';
      if (cleanPath === '' || cleanPath === '/') {
        targetHtml = 'index.html';
      } else if (cleanPath.endsWith('/')) {
        targetHtml = cleanPath.slice(1) + 'index.html';
      } else {
        targetHtml = cleanPath.slice(1) + '.html';
      }

      if (!allHtmlRel.has(targetHtml) && !allHtmlRel.has(cleanPath.slice(1) + '/index.html') && !allHtmlRel.has(cleanPath.slice(1))) {
        deadLinks.push({ file: rel, href, targetHtml });
      } else {
        internalGraph.get(rel).add(targetHtml);
      }
    }
  }
});

console.log('--- Internal Links Audit ---');
console.log('Total <a> links scanned:', totalLinks);
console.log('Empty hrefs (href=""):', emptyHrefs.length, emptyHrefs);
console.log('Hash-only hrefs (href="#"):', hashHrefs.length, hashHrefs);
console.log('Broken internal dead links:', deadLinks.length, deadLinks);

// Calculate click depth using BFS from index.html
let depths = new Map();
let queue = [['index.html', 0]];
depths.set('index.html', 0);

while (queue.length > 0) {
  const [curr, d] = queue.shift();
  const neighbors = internalGraph.get(curr) || new Set();
  for (const n of neighbors) {
    if (!depths.has(n)) {
      depths.set(n, d + 1);
      queue.push([n, d + 1]);
    }
  }
}

let depthCounts = { 0: 0, 1: 0, 2: 0, 3: 0, '4+': 0 };
for (const [f, d] of depths.entries()) {
  if (d <= 3) {
    depthCounts[d] = (depthCounts[d] || 0) + 1;
  } else {
    depthCounts['4+']++;
  }
}

console.log('\n--- Click Depth Analysis ---');
console.log('Depth distribution from homepage:', depthCounts);
console.log('Pages reachable within 3 clicks:', Array.from(depths.values()).filter(d => d <= 3).length, '/', allHtmlRel.size);
