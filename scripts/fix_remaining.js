const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');

function updateFile(relPath, fn) {
  const fullPath = path.join(baseDir, relPath);
  if (!fs.existsSync(fullPath)) return;
  const original = fs.readFileSync(fullPath, 'utf8');
  const modified = fn(original);
  if (original !== modified) {
    fs.writeFileSync(fullPath, modified, 'utf8');
    console.log(`Updated: ${relPath}`);
  }
}

// 1. Customer Menu
updateFile('app/restaurant/[slug]/page.tsx', (c) => {
  return c.replaceAll(
    'min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-4 text-white',
    'min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col items-center justify-center p-4'
  );
});

// 2. Kitchen KDS
updateFile('app/kitchen/page.tsx', (c) => {
  return c
    .replaceAll('? "bg-slate-700 text-white"', '? "bg-emerald-600 text-white shadow"')
    .replaceAll('hover:text-white', 'hover:text-slate-900');
});

// 3. Admin Dashboard
updateFile('app/admin/dashboard/page.tsx', (c) => {
  return c
    .replaceAll('Using <strong className="text-white">{usedItemsCount}</strong> of <strong className="text-white">{allowedItemsCount}</strong>', 'Using <strong className="text-slate-900">{usedItemsCount}</strong> of <strong className="text-slate-900">{allowedItemsCount}</strong>')
    .replaceAll('px-3 py-2 text-xs text-white h-16', 'px-3 py-2 text-xs text-slate-900 h-16')
    .replaceAll('px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold', 'px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-bold')
    .replaceAll('px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 mb-2', 'px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 mb-2')
    .replaceAll('px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500', 'px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500')
    .replaceAll('px-3 py-2 text-xs text-white', 'px-3 py-2 text-xs text-slate-900')
    .replaceAll('className="bg-stone-100 text-slate-900 hover:bg-slate-700 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5"', 'className="bg-stone-100 hover:bg-stone-200 text-slate-800 border border-stone-200 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5"')
    .replaceAll('hover:text-white', 'hover:text-slate-900');
});

console.log('--- Second pass complete ---');
