const fs = require('fs');
const path = require('path');
const http = require('http');

const dist = path.join(__dirname, '../docs/.vitepress/dist');
const sitemapPath = path.join(dist, 'sitemap.xml');
const sitemapIndexPath = path.join(dist, 'sitemap-index.xml');

console.log('--- Sitemap Audit ---');
console.log('sitemap.xml exists:', fs.existsSync(sitemapPath));
console.log('sitemap-index.xml exists:', fs.existsSync(sitemapIndexPath));

const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
const locMatches = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

console.log('Total URLs in sitemap.xml:', locMatches.length);
const nonOfficial = locMatches.filter(u => !u.startsWith('https://trialpick.blog'));
console.log('Non-official domain URLs in sitemap:', nonOfficial.length, nonOfficial);

const duplicates = locMatches.filter((u, i) => locMatches.indexOf(u) !== i);
console.log('Duplicate URLs in sitemap:', duplicates.length, duplicates);

// Test core URLs against dev server
const corePaths = [
  '/',
  '/rankings/',
  '/rankings/trial-cheap-2026-10',
  '/reviews/',
  '/cheap/',
  '/cheap/under-10',
  '/trial/',
  '/guide/',
  '/about/'
];

async function checkUrl(urlPath) {
  return new Promise((resolve) => {
    http.get('http://localhost:5173' + urlPath, (res) => {
      resolve({ path: urlPath, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ path: urlPath, status: 'ERROR: ' + err.message });
    });
  });
}

(async () => {
  console.log('\n--- Core URLs HTTP Status Check ---');
  for (const p of corePaths) {
    const res = await checkUrl(p);
    console.log(`Path: ${p.padEnd(30)} => Status: ${res.status}`);
  }
})();
