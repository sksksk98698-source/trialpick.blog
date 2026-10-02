const fs = require('fs');
const path = require('path');

const reviewsDir = path.join(__dirname, '../docs/reviews');
const files = fs.readdirSync(reviewsDir).filter(f => f.endsWith('.md') && f !== 'index.md');

console.log('--- Content Quality & Similarity Audit ---');
console.log('Total brand review markdown files:', files.length);

const reviewsData = files.map(file => {
  const content = fs.readFileSync(path.join(reviewsDir, file), 'utf8');
  const headings = [...content.matchAll(/^#{1,4}\s+(.+)$/gm)].map(m => m[1].trim());
  const words = content.replace(/```[\s\S]*?```/g, '').replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 1);
  return {
    file,
    headings,
    headingSet: new Set(headings),
    wordsSet: new Set(words)
  };
});

function jaccard(setA, setB) {
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

let highHeadingSimPairs = [];
let highWordSimPairs = [];

for (let i = 0; i < reviewsData.length; i++) {
  for (let j = i + 1; j < reviewsData.length; j++) {
    const a = reviewsData[i];
    const b = reviewsData[j];

    const hSim = jaccard(a.headingSet, b.headingSet);
    const wSim = jaccard(a.wordsSet, b.wordsSet);

    if (hSim >= 0.70) {
      highHeadingSimPairs.push({ pair: `${a.file} <-> ${b.file}`, hSim: (hSim * 100).toFixed(1) + '%' });
    }
    if (wSim >= 0.70) {
      highWordSimPairs.push({ pair: `${a.file} <-> ${b.file}`, wSim: (wSim * 100).toFixed(1) + '%' });
    }
  }
}

console.log('Heading similarity >= 70% pairs count:', highHeadingSimPairs.length, highHeadingSimPairs);
console.log('Content vocabulary similarity >= 70% pairs count:', highWordSimPairs.length, highWordSimPairs);
