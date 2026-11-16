const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [from, to] of replacements) {
    content = content.replaceAll(from, to);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

// 1. KITCHEN PAGE
function unifyKitchen() {
  const filePath = path.join(__dirname, '../app/kitchen/page.tsx');
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    '<div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">',
    '<div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col font-sans">'
  );
  content = content.replace(
    'className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-6 py-4 shadow-xl"',
    'className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-6 py-4 shadow-sm"'
  );
  content = content.replace(
    '<h1 className="text-xl font-black text-white">Live Kitchen Display (KDS)</h1>',
    '<h1 className="text-xl font-black text-slate-900">Live Kitchen Display (KDS)</h1>'
  );
  content = content.replace(
    '<strong className="text-white capitalize">{slug.replace(/-/g, " ")}</strong>',
    '<strong className="text-slate-900 capitalize">{slug.replace(/-/g, " ")}</strong>'
  );
  content = content.replace(
    'border-t border-slate-800/80',
    'border-t border-stone-200'
  );

  content = content.replaceAll('bg-slate-900 border border-slate-800', 'bg-white border border-stone-200/80 shadow-sm text-slate-900');
  content = content.replaceAll('bg-slate-900/50 border border-slate-800', 'bg-stone-50 border border-stone-200 text-slate-900');
  content = content.replaceAll('bg-slate-900', 'bg-white text-slate-900');
  content = content.replaceAll('border-slate-800', 'border-stone-200');
  content = content.replaceAll('border-slate-700', 'border-stone-200');
  content = content.replaceAll('text-slate-100', 'text-slate-900');
  content = content.replaceAll('text-slate-300', 'text-slate-700');
  content = content.replaceAll('text-slate-400', 'text-slate-500');

  // Filter button styles
  content = content.replace(
    'bg-slate-800 text-slate-400 hover:text-white',
    'bg-stone-100 text-slate-600 hover:bg-stone-200 border border-stone-200'
  );
  content = content.replace(
    'bg-slate-800 text-slate-400 hover:text-white',
    'bg-stone-100 text-slate-600 hover:bg-stone-200 border border-stone-200'
  );

  // Buttons and inputs in header
  content = content.replace(
    'className="bg-slate-800 border border-slate-700 text-xs font-bold text-white rounded-lg px-3 py-2"',
    'className="bg-stone-100 border border-stone-300 text-xs font-bold text-slate-800 rounded-xl px-3 py-2"'
  );
  content = content.replace(
    'className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 transition"',
    'className="bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-stone-200 transition"'
  );
  content = content.replaceAll(
    'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold',
    'bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm shadow-emerald-600/20'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Kitchen page unified successfully.');
}

// 2. WAITER PAGE
function unifyWaiter() {
  const filePath = path.join(__dirname, '../app/waiter/page.tsx');
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    '<div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">',
    '<div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col font-sans">'
  );
  content = content.replace(
    'className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-6 py-4 shadow-xl"',
    'className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-6 py-4 shadow-sm"'
  );
  content = content.replace(
    '<h1 className="text-xl font-black text-white">Waiter & Floor Management</h1>',
    '<h1 className="text-xl font-black text-slate-900">Waiter & Floor Management</h1>'
  );
  content = content.replace(
    '<strong className="text-white capitalize">{slug.replace(/-/g, " ")}</strong>',
    '<strong className="text-slate-900 capitalize">{slug.replace(/-/g, " ")}</strong>'
  );

  content = content.replaceAll('bg-slate-900 border border-slate-800', 'bg-white border border-stone-200/80 shadow-sm text-slate-900');
  content = content.replaceAll('bg-slate-900/60 border border-slate-800', 'bg-white border border-stone-200/80 shadow-sm text-slate-900');
  content = content.replaceAll('bg-slate-900/50 border border-slate-800', 'bg-stone-50 border border-stone-200 text-slate-900');
  content = content.replaceAll('bg-slate-900', 'bg-white text-slate-900');
  content = content.replaceAll('border-slate-800', 'border-stone-200');
  content = content.replaceAll('border-slate-700', 'border-stone-200');
  content = content.replaceAll('text-slate-100', 'text-slate-900');
  content = content.replaceAll('text-slate-200', 'text-slate-800');
  content = content.replaceAll('text-slate-300', 'text-slate-700');
  content = content.replaceAll('text-slate-400', 'text-slate-500');

  // Waiter calls banner
  content = content.replace('bg-amber-500/10 border-b border-amber-500/30 p-4', 'bg-amber-50 border-b border-amber-200 p-4');
  content = content.replace('text-sm font-bold text-white', 'text-sm font-bold text-slate-900');

  // Buttons
  content = content.replaceAll(
    'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold',
    'bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm shadow-emerald-600/20'
  );

  // Inputs in header
  content = content.replace(
    'className="bg-slate-800 border border-slate-700 text-xs font-bold text-white rounded-lg px-3 py-2"',
    'className="bg-stone-100 border border-stone-300 text-xs font-bold text-slate-800 rounded-xl px-3 py-2"'
  );
  content = content.replace(
    'className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 transition"',
    'className="bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-stone-200 transition"'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Waiter page unified successfully.');
}

// 3. SUPER ADMIN PAGE
function unifySuperAdmin() {
  const filePath = path.join(__dirname, '../app/super-admin/page.tsx');
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    '<div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">',
    '<div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col font-sans">'
  );
  content = content.replace(
    'className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-6 py-4 shadow-xl"',
    'className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-6 py-4 shadow-sm"'
  );
  content = content.replace(
    '<h1 className="text-xl font-black text-white">QRDening Super Admin</h1>',
    '<h1 className="text-xl font-black text-slate-900">QRDening Super Admin</h1>'
  );
  content = content.replace(
    '<div className="bg-indigo-950/40 border-b border-indigo-500/20 px-6 py-3">',
    '<div className="bg-indigo-50 border-b border-indigo-200 px-6 py-3">'
  );
  content = content.replace('text-xs text-indigo-200', 'text-xs text-indigo-900');

  content = content.replaceAll('bg-slate-900 border border-slate-800 rounded-2xl', 'bg-white border border-stone-200/80 rounded-3xl shadow-sm text-slate-900');
  content = content.replaceAll('bg-slate-900 border border-slate-800 rounded-xl', 'bg-white border border-stone-200/80 rounded-2xl shadow-sm text-slate-900');
  content = content.replaceAll('bg-slate-900 border border-slate-800', 'bg-white border border-stone-200/80 shadow-sm text-slate-900');
  content = content.replaceAll('bg-slate-900', 'bg-white text-slate-900');
  content = content.replaceAll('border-slate-800', 'border-stone-200');
  content = content.replaceAll('border-slate-700', 'border-stone-200');
  content = content.replaceAll('text-slate-100', 'text-slate-900');
  content = content.replaceAll('text-slate-300', 'text-slate-700');
  content = content.replaceAll('text-slate-400', 'text-slate-500');

  // Buttons & inputs
  content = content.replaceAll(
    'bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-700',
    'bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-stone-300'
  );
  content = content.replaceAll(
    'bg-indigo-600 hover:bg-indigo-500 text-white font-bold',
    'bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm shadow-emerald-600/20'
  );

  // Modal in super admin
  content = content.replaceAll('bg-slate-900 border border-slate-700 rounded-2xl', 'bg-white border border-stone-200 rounded-3xl shadow-2xl');
  content = content.replaceAll('bg-slate-800 border border-slate-700 text-white', 'bg-stone-50 border border-stone-300 text-slate-900');
  content = content.replaceAll('bg-slate-800 border border-slate-700', 'bg-stone-50 border border-stone-300 text-slate-900');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Super Admin page unified successfully.');
}

// 4. CUSTOMER MENU PAGE
function unifyCustomerMenu() {
  const filePath = path.join(__dirname, '../app/restaurant/[slug]/page.tsx');
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    '<div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-28">',
    '<div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col pb-28">'
  );
  content = content.replace(
    'className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg"',
    'className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs"'
  );
  content = content.replace(
    '<h1 className="font-bold text-white text-base leading-tight flex items-center gap-1.5">',
    '<h1 className="font-black text-slate-900 text-base leading-tight flex items-center gap-1.5">'
  );
  content = content.replace(
    '<strong className="text-white font-bold">{t.table} {tableParam}</strong>',
    '<strong className="text-slate-900 font-bold">{t.table} {tableParam}</strong>'
  );

  // Switcher & Language
  content = content.replaceAll(
    'bg-slate-800 border border-slate-700 text-xs font-bold text-emerald-400 rounded-lg',
    'bg-stone-100 border border-stone-300 text-xs font-bold text-emerald-700 rounded-xl'
  );
  content = content.replaceAll(
    'bg-slate-800 p-0.5 rounded-lg flex w-full border border-slate-700/80',
    'bg-stone-100 p-0.5 rounded-xl flex w-full border border-stone-200'
  );
  content = content.replaceAll('text-slate-400 hover:text-white', 'text-slate-600 hover:text-slate-900');
  content = content.replaceAll(
    'bg-emerald-500 text-slate-950 shadow',
    'bg-emerald-600 text-white font-bold shadow-sm'
  );
  content = content.replaceAll(
    'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
    'bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm shadow-emerald-600/20'
  );

  // Dish Cards & Lists
  content = content.replaceAll('bg-slate-900 border border-slate-800', 'bg-white border border-stone-200/80 shadow-xs text-slate-900');
  content = content.replaceAll('bg-slate-900/90 border border-slate-800', 'bg-white border border-stone-200/80 shadow-xs text-slate-900');
  content = content.replaceAll('bg-slate-900', 'bg-white text-slate-900');
  content = content.replaceAll('border-slate-800', 'border-stone-200');
  content = content.replaceAll('border-slate-700', 'border-stone-200');
  content = content.replaceAll('text-slate-100', 'text-slate-900');
  content = content.replaceAll('text-slate-200', 'text-slate-800');
  content = content.replaceAll('text-slate-300', 'text-slate-600');
  content = content.replaceAll('text-slate-400', 'text-slate-500');

  // Search input
  content = content.replaceAll('bg-slate-800 border border-slate-700 text-white', 'bg-stone-50 border border-stone-300 text-slate-900');
  content = content.replaceAll('bg-slate-800', 'bg-stone-50 text-slate-900');

  // Cart Drawer
  content = content.replaceAll('bg-slate-900 border-t border-slate-800', 'bg-white border-t border-stone-200 text-slate-900 shadow-2xl');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Customer Menu page unified successfully.');
}

// 5. ORDER TRACKING PAGE
function unifyOrderTracking() {
  const filePath = path.join(__dirname, '../app/restaurant/[slug]/order/[orderId]/page.tsx');
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    'min-h-screen bg-slate-950 text-slate-100',
    'min-h-screen bg-[#FDFBF7] text-slate-900'
  );
  content = content.replaceAll('bg-slate-900 border border-slate-800', 'bg-white border border-stone-200/80 shadow-sm text-slate-900');
  content = content.replaceAll('bg-slate-900', 'bg-white text-slate-900');
  content = content.replaceAll('border-slate-800', 'border-stone-200');
  content = content.replaceAll('border-slate-700', 'border-stone-200');
  content = content.replaceAll('text-slate-100', 'text-slate-900');
  content = content.replaceAll('text-slate-200', 'text-slate-800');
  content = content.replaceAll('text-slate-300', 'text-slate-600');
  content = content.replaceAll('text-slate-400', 'text-slate-500');
  content = content.replaceAll('bg-slate-800', 'bg-stone-100 text-slate-900');

  content = content.replaceAll(
    'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
    'bg-emerald-600 hover:bg-emerald-700 text-white font-bold'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Order Tracking page unified successfully.');
}

unifyKitchen();
unifyWaiter();
unifySuperAdmin();
unifyCustomerMenu();
unifyOrderTracking();
console.log('All platform pages unified to the same color theme!');
