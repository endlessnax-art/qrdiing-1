const fs = require('fs');
const path = require('path');

const files = [
  'app/restaurant/[slug]/page.tsx',
  'app/kitchen/page.tsx',
  'app/waiter/page.tsx',
  'app/super-admin/page.tsx',
  'app/restaurant/[slug]/order/[orderId]/page.tsx',
  'app/admin/dashboard/page.tsx'
];

let totalHits = 0;
for (const file of files) {
  const fullPath = path.resolve(__dirname, '..', file);
  if (!fs.existsSync(fullPath)) continue;
  const lines = fs.readFileSync(fullPath, 'utf8').split('\n');
  const hits = [];
  lines.forEach((line, idx) => {
    // Check for text-white that is NOT on an emerald/blue/indigo/rose/black/dark background
    if (line.includes('text-white') &&
        !line.includes('bg-emerald') &&
        !line.includes('bg-indigo') &&
        !line.includes('bg-blue') &&
        !line.includes('bg-rose') &&
        !line.includes('bg-red') &&
        !line.includes('bg-black') &&
        !line.includes('bg-slate-900') &&
        !line.includes('bg-slate-950') &&
        !line.includes('bg-stone-900') &&
        !line.includes('bg-amber-500') &&
        !line.includes('animate-pulse') &&
        !line.includes('brightness-75')) {
      hits.push(`${idx + 1}: ${line.trim()}`);
    }
  });
  console.log(`=== ${file} (${hits.length} remaining potential hits) ===`);
  hits.forEach(h => console.log('  ' + h));
  totalHits += hits.length;
}
console.log(`\nTotal potential hits: ${totalHits}`);
