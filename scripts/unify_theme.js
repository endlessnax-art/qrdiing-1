const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');

function updateFile(relPath, fn) {
  const fullPath = path.join(baseDir, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error('File not found:', fullPath);
    return;
  }
  const original = fs.readFileSync(fullPath, 'utf8');
  const modified = fn(original);
  if (original !== modified) {
    fs.writeFileSync(fullPath, modified, 'utf8');
    console.log(`Updated: ${relPath}`);
  } else {
    console.log(`No changes made to: ${relPath}`);
  }
}

// 1. Customer Menu: app/restaurant/[slug]/page.tsx
updateFile('app/restaurant/[slug]/page.tsx', (content) => {
  return content
    .replaceAll('bg-slate-950/95 backdrop-blur-md border-b border-stone-200/80', 'bg-[#FDFBF7]/95 backdrop-blur-md border-b border-stone-200')
    .replaceAll('text-xs text-white placeholder-slate-500', 'text-xs text-slate-900 placeholder-slate-400')
    .replaceAll('<h3 className="font-bold text-white text-sm">No items found</h3>', '<h3 className="font-bold text-slate-900 text-sm">No items found</h3>')
    .replaceAll('<h3 className="font-bold text-white text-sm sm:text-base leading-snug">', '<h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">')
    .replaceAll('<span className="text-sm sm:text-base font-extrabold text-white">', '<span className="text-sm sm:text-base font-extrabold text-slate-900">')
    .replaceAll('item.isAvailable\n                          ? "bg-white text-slate-900 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950"', 'item.isAvailable\n                          ? "bg-white border border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white shadow-xs"')
    .replaceAll('<p className="text-lg font-black text-white">', '<p className="text-lg font-black text-slate-900">')
    .replaceAll('<h3 className="font-bold text-white text-base">{t.orderSummary}</h3>', '<h3 className="font-bold text-slate-900 text-base">{t.orderSummary}</h3>')
    .replaceAll('<h4 className="font-bold text-white text-sm">{item.name}</h4>', '<h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>')
    .replaceAll('<span className="text-xs font-bold text-white w-4 text-center">', '<span className="text-xs font-bold text-slate-900 w-4 text-center">')
    .replaceAll('text-xs text-white focus:outline-none focus:border-emerald-500 uppercase font-semibold', 'text-xs text-slate-900 focus:outline-none focus:border-emerald-500 uppercase font-semibold')
    .replaceAll('text-xs text-white focus:outline-none focus:border-emerald-500', 'text-xs text-slate-900 focus:outline-none focus:border-emerald-500')
    .replaceAll('flex justify-between text-white font-extrabold text-sm pt-2 border-t border-stone-200', 'flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-stone-200')
    .replaceAll('<h3 className="font-bold text-white text-base">{getItemName(customizingItem)}</h3>', '<h3 className="font-bold text-slate-900 text-base">{getItemName(customizingItem)}</h3>')
    .replaceAll('<h3 className="text-lg font-black text-white mt-2">Daily Lucky Treat</h3>', '<h3 className="text-lg font-black text-slate-900 mt-2">Daily Lucky Treat</h3>')
    .replaceAll('min-h-screen bg-slate-950 flex items-center justify-center text-white', 'min-h-screen bg-[#FDFBF7] flex items-center justify-center text-slate-900')
    .replaceAll('hover:text-white', 'hover:text-slate-900');
});

// 2. Kitchen KDS: app/kitchen/page.tsx
updateFile('app/kitchen/page.tsx', (content) => {
  return content
    .replaceAll('className="bg-slate-800 border border-stone-200 text-xs font-bold text-white rounded-lg px-3 py-2"', 'className="bg-stone-100 border border-stone-300 text-xs font-bold text-slate-800 rounded-lg px-3 py-2"')
    .replaceAll('className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg border border-stone-200 transition"', 'className="bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg border border-stone-300 transition"')
    .replaceAll(': "bg-slate-800 text-slate-500 hover:text-white"', ': "bg-stone-100 text-slate-600 hover:text-slate-900 border border-stone-200"')
    .replaceAll('filter === "all"\n                  ? "bg-slate-700 text-white"\n                  : "bg-slate-800 text-slate-500 hover:text-white"', 'filter === "all"\n                  ? "bg-emerald-600 text-white shadow"\n                  : "bg-stone-100 text-slate-600 hover:text-slate-900 border border-stone-200"')
    .replaceAll('<h3 className="text-lg font-bold text-white">All orders cleared!</h3>', '<h3 className="text-lg font-bold text-slate-900">All orders cleared!</h3>')
    .replaceAll(': "bg-slate-800/60 border-stone-200"', ': "bg-stone-50 border-stone-200"')
    .replaceAll('<span className="font-black text-white text-base">', '<span className="font-black text-slate-900 text-base">')
    .replaceAll(': "bg-slate-800 text-slate-700"', ': "bg-stone-100 text-slate-700"')
    .replaceAll('<span className="font-bold text-white text-sm">', '<span className="font-bold text-slate-900 text-sm">')
    .replaceAll('<div className="p-3 bg-slate-950/70 border-t border-stone-200 space-y-2">', '<div className="p-3 bg-stone-50 border-t border-stone-200 space-y-2">')
    .replaceAll('Status: <strong className="uppercase text-white">', 'Status: <strong className="uppercase text-slate-900">')
    .replaceAll('bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border border-stone-200 transition', 'bg-stone-100 hover:bg-stone-200 text-slate-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border border-stone-300 transition')
    .replaceAll('bg-slate-800 hover:bg-rose-500/20 text-rose-400 px-3 py-2.5 rounded-xl text-xs font-bold border border-stone-200', 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 px-3 py-2.5 rounded-xl text-xs font-bold')
    .replaceAll('<h3 className="text-base font-bold text-white">', '<h3 className="text-base font-bold text-slate-900">')
    .replaceAll('className="mt-4 w-full bg-slate-800 border border-stone-200 rounded-lg p-2.5 text-xs text-white"', 'className="mt-4 w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-slate-900"')
    .replaceAll('bg-slate-800 hover:bg-slate-700 text-slate-700 py-2.5 rounded-xl text-xs font-semibold', 'bg-stone-100 hover:bg-stone-200 text-slate-800 border border-stone-200 py-2.5 rounded-xl text-xs font-semibold')
    .replaceAll('min-h-screen bg-slate-950 flex items-center justify-center text-white', 'min-h-screen bg-[#FDFBF7] flex items-center justify-center text-slate-900');
});

// 3. Waiter Floor: app/waiter/page.tsx
updateFile('app/waiter/page.tsx', (content) => {
  return content
    .replaceAll('className="bg-slate-800 border border-stone-200 text-xs font-bold text-white rounded-lg px-3 py-2"', 'className="bg-stone-100 border border-stone-300 text-xs font-bold text-slate-800 rounded-lg px-3 py-2"')
    .replaceAll('className="bg-slate-800 hover:bg-slate-700 text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg border border-stone-200 transition"', 'className="bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg border border-stone-300 transition"')
    .replaceAll('<h2 className="text-lg font-black text-white">Floor Table Overview</h2>', '<h2 className="text-lg font-black text-slate-900">Floor Table Overview</h2>')
    .replaceAll('<span className="text-2xl font-black text-white">', '<span className="text-2xl font-black text-slate-900">')
    .replaceAll('<p className="font-bold text-white">{activeOrder.orderNumber}</p>', '<p className="font-bold text-slate-900">{activeOrder.orderNumber}</p>')
    .replaceAll('<h3 className="text-xl font-black text-white">', '<h3 className="text-xl font-black text-slate-900">')
    .replaceAll('className="bg-slate-800 hover:bg-slate-700 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-200 flex items-center gap-1"', 'className="bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-300 flex items-center gap-1"')
    .replaceAll(': "bg-slate-800 text-slate-700 border-stone-200 hover:text-white"', ': "bg-stone-100 text-slate-700 border-stone-200 hover:bg-stone-200"')
    .replaceAll('className="bg-slate-800/80 p-3.5 rounded-xl border border-stone-200 text-xs"', 'className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs"')
    .replaceAll('<span className="font-bold text-white text-sm">{ord.orderNumber}</span>', '<span className="font-bold text-slate-900 text-sm">{ord.orderNumber}</span>')
    .replaceAll('min-h-screen bg-slate-950 flex items-center justify-center text-white', 'min-h-screen bg-[#FDFBF7] flex items-center justify-center text-slate-900')
    .replaceAll('hover:text-white', 'hover:text-slate-900');
});

// 4. Super Admin: app/super-admin/page.tsx
updateFile('app/super-admin/page.tsx', (content) => {
  return content
    .replaceAll('min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white', 'min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 text-slate-900')
    .replaceAll('className="bg-slate-800 hover:bg-slate-700 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-lg border border-stone-200 transition"', 'className="bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-semibold px-3.5 py-2 rounded-lg border border-stone-300 transition"')
    .replaceAll('<p className="text-3xl font-black text-white mt-2">', '<p className="text-3xl font-black text-slate-900 mt-2">')
    .replaceAll('<h2 className="text-lg font-black text-white">Registered Restaurant Accounts</h2>', '<h2 className="text-lg font-black text-slate-900">Registered Restaurant Accounts</h2>')
    .replaceAll('bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold border-b border-stone-200', 'bg-stone-50 text-slate-600 uppercase text-[10px] font-bold border-b border-stone-200')
    .replaceAll('divide-slate-800/80', 'divide-stone-200')
    .replaceAll('hover:bg-slate-800/40', 'hover:bg-stone-50')
    .replaceAll('<td className="p-3.5 font-bold text-white">', '<td className="p-3.5 font-bold text-slate-900">')
    .replaceAll('bg-slate-800 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded', 'bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded')
    .replaceAll('<td className="p-3.5 text-white font-semibold">', '<td className="p-3.5 text-slate-800 font-semibold">')
    .replaceAll('className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 border border-stone-200"', 'className="bg-stone-100 hover:bg-stone-200 text-slate-800 px-2.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 border border-stone-300"')
    .replaceAll('<h2 className="text-lg font-black text-white">Subscription Tier & Pricing Control</h2>', '<h2 className="text-lg font-black text-slate-900">Subscription Tier & Pricing Control</h2>')
    .replaceAll('className="bg-slate-800/80 border border-stone-200 rounded-xl p-5 flex flex-col justify-between"', 'className="bg-stone-50 border border-stone-200 rounded-xl p-5 flex flex-col justify-between"')
    .replaceAll('<span className="font-bold text-white text-sm">{plan.name}</span>', '<span className="font-bold text-slate-900 text-sm">{plan.name}</span>')
    .replaceAll('<strong className="text-white">{plan.menuItemLimit}</strong>', '<strong className="text-slate-900">{plan.menuItemLimit}</strong>')
    .replaceAll('<strong className="text-white">{plan.tableLimit}</strong>', '<strong className="text-slate-900">{plan.tableLimit}</strong>')
    .replaceAll('<strong className="text-white">{plan.staffLimit}</strong>', '<strong className="text-slate-900">{plan.staffLimit}</strong>')
    .replaceAll('className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-1.5 rounded-lg text-xs"', 'className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-lg text-xs shadow-sm"')
    .replaceAll('<h2 className="text-lg font-black text-white">Platform Security & Audit Logs</h2>', '<h2 className="text-lg font-black text-slate-900">Platform Security & Audit Logs</h2>')
    .replaceAll('className="bg-slate-800/60 p-3 rounded-xl border border-stone-200/60 text-xs flex flex-wrap items-center justify-between gap-2"', 'className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs flex flex-wrap items-center justify-between gap-2"')
    .replaceAll('<span className="text-white font-semibold">{log.details}</span>', '<span className="text-slate-900 font-semibold">{log.details}</span>')
    .replaceAll('<h3 className="text-base font-bold text-white">', '<h3 className="text-base font-bold text-slate-900">')
    .replaceAll('<h3 className="text-base font-black text-white">Onboard New Restaurant Tenant</h3>', '<h3 className="text-base font-black text-slate-900">Onboard New Restaurant Tenant</h3>')
    .replaceAll('className="w-full bg-slate-800 border border-stone-200 rounded-lg px-3 py-2 text-xs text-white', 'className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-slate-900')
    .replaceAll('className="w-full bg-slate-800 border border-stone-200 rounded-lg p-2.5 text-xs text-white', 'className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-slate-900')
    .replaceAll('bg-slate-800 hover:bg-slate-700 text-slate-700 py-2 rounded-xl text-xs font-semibold', 'bg-stone-100 hover:bg-stone-200 text-slate-800 border border-stone-200 py-2 rounded-xl text-xs font-semibold')
    .replaceAll('bg-slate-800 hover:bg-slate-700 text-slate-700 py-2.5 rounded-xl text-xs font-semibold', 'bg-stone-100 hover:bg-stone-200 text-slate-800 border border-stone-200 py-2.5 rounded-xl text-xs font-semibold')
    .replaceAll('hover:text-white', 'hover:text-slate-900');
});

// 5. Order Tracking: app/restaurant/[slug]/order/[orderId]/page.tsx
updateFile('app/restaurant/[slug]/order/[orderId]/page.tsx', (content) => {
  return content
    .replaceAll('min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white', 'min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 text-slate-900')
    .replaceAll('<h1 className="text-2xl font-black text-white">{order.orderNumber}</h1>', '<h1 className="text-2xl font-black text-slate-900">{order.orderNumber}</h1>')
    .replaceAll('<span className="text-sm font-bold text-white">', '<span className="text-sm font-bold text-slate-900">')
    .replaceAll('bg-gradient-to-r from-slate-900 to-emerald-950/40 border border-emerald-500/20 rounded-2xl p-5', 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 border border-emerald-200 rounded-2xl p-5')
    .replaceAll('<h3 className="font-bold text-white text-xs flex items-center gap-1.5">', '<h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">')
    .replaceAll('stamp <= 4\n                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"\n                    : "bg-stone-100 text-slate-900/60 border-stone-200/80 text-slate-500 border-dashed"', 'stamp <= 4\n                    ? "bg-emerald-600 text-white font-black"\n                    : "bg-white text-slate-400 border-stone-300 border-dashed"')
    .replaceAll('<h3 className="font-bold text-white text-sm mb-4">Items Ordered</h3>', '<h3 className="font-bold text-slate-900 text-sm mb-4">Items Ordered</h3>')
    .replaceAll('<h4 className="font-bold text-white text-sm">{item.quantity}x {item.name}</h4>', '<h4 className="font-bold text-slate-900 text-sm">{item.quantity}x {item.name}</h4>')
    .replaceAll('<span className="font-bold text-white text-sm">\n                  {formatCurrency(item.totalPrice)}', '<span className="font-bold text-slate-900 text-sm">\n                  {formatCurrency(item.totalPrice)}')
    .replaceAll('flex justify-between text-white font-extrabold text-sm pt-2 border-t border-stone-200', 'flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-stone-200')
    .replaceAll('<h3 className="font-bold text-white text-sm">Rate Your Dining Experience</h3>', '<h3 className="font-bold text-slate-900 text-sm">Rate Your Dining Experience</h3>')
    .replaceAll('<h4 className="font-bold text-white text-sm">Thank You for Your Review!</h4>', '<h4 className="font-bold text-slate-900 text-sm">Thank You for Your Review!</h4>')
    .replaceAll(': "bg-stone-100 text-slate-900 border-stone-200 text-slate-500 hover:text-white"', ': "bg-stone-50 border-stone-200 text-slate-700 hover:border-emerald-500"')
    .replaceAll('className="w-full bg-stone-100 text-slate-900 border border-stone-200 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"', 'className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 resize-none"')
    .replaceAll('<h3 className="text-base font-black text-white">Cancel Order {order.orderNumber}?</h3>', '<h3 className="text-base font-black text-slate-900">Cancel Order {order.orderNumber}?</h3>')
    .replaceAll('className="w-full bg-stone-100 text-slate-900 border border-stone-200 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"', 'className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-500"')
    .replaceAll('className="flex-1 bg-stone-100 text-slate-900 hover:bg-slate-700 text-slate-600 py-2.5 rounded-xl text-xs font-semibold"', 'className="flex-1 bg-stone-100 hover:bg-stone-200 text-slate-800 border border-stone-200 py-2.5 rounded-xl text-xs font-semibold"')
    .replaceAll('inline-block bg-white text-slate-900 text-white font-black text-xs px-2.5 py-0.5 rounded uppercase tracking-wider mb-2', 'inline-block bg-slate-900 text-white font-black text-xs px-2.5 py-0.5 rounded uppercase tracking-wider mb-2')
    .replaceAll('className="flex-1 bg-white text-slate-900 hover:bg-stone-100 text-slate-900 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"', 'className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm"')
    .replaceAll('<h3 className="text-lg font-black text-white mt-1">Instant Restaurant Payment</h3>', '<h3 className="text-lg font-black text-slate-900 mt-1">Instant Restaurant Payment</h3>')
    .replaceAll('Amount to Pay: <strong className="text-white">{formatCurrency(order.totalAmount)}</strong>', 'Amount to Pay: <strong className="text-slate-900">{formatCurrency(order.totalAmount)}</strong>')
    .replaceAll('className="w-full bg-stone-100 text-slate-900 hover:bg-slate-700 text-slate-600 font-semibold py-2 rounded-xl text-xs transition"', 'className="w-full bg-stone-100 hover:bg-stone-200 text-slate-800 border border-stone-200 font-semibold py-2 rounded-xl text-xs transition"')
    .replaceAll('hover:text-white', 'hover:text-slate-900');
});

// 6. Admin Dashboard: app/admin/dashboard/page.tsx
updateFile('app/admin/dashboard/page.tsx', (content) => {
  return content
    .replaceAll(': "text-slate-500 hover:text-white hover:bg-stone-100 text-slate-900/60"', ': "text-slate-600 hover:text-emerald-700 hover:bg-stone-100 font-medium"')
    .replaceAll('<span className="text-white font-medium">{ord.customerName}</span>', '<span className="text-slate-900 font-medium">{ord.customerName}</span>')
    .replaceAll('Using <strong className="text-white">{usedItemsCount}</strong> of <strong className="text-white">{allowedLimit}</strong>', 'Using <strong className="text-slate-900">{usedItemsCount}</strong> of <strong className="text-slate-900">{allowedLimit}</strong>')
    .replaceAll('Business report for <strong className="text-white">{dailySales.date}</strong>', 'Business report for <strong className="text-slate-900">{dailySales.date}</strong>')
    .replaceAll('Times Used: <strong className="text-white">{coupon.usageCount}</strong>', 'Times Used: <strong className="text-slate-900">{coupon.usageCount}</strong>')
    .replaceAll('? "bg-stone-100 text-slate-900 border-emerald-500/40 text-white"', '? "bg-emerald-600 text-white shadow-sm font-bold"');
});

console.log('--- Theme Unification Complete ---');
