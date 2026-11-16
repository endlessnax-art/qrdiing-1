const fs = require('fs');
const path = require('path');

function unifyAdminDashboard() {
  const filePath = path.join(__dirname, '../app/admin/dashboard/page.tsx');
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Loading screen
  content = content.replace(
    'bg-slate-950 flex flex-col items-center justify-center p-4 text-white',
    'bg-[#FDFBF7] flex flex-col items-center justify-center p-4 text-slate-900'
  );

  // 2. Main container
  content = content.replace(
    '<div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">',
    '<div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col font-sans">'
  );

  // 3. Header
  content = content.replace(
    'className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3.5 shadow-xl"',
    'className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 py-3.5 shadow-sm"'
  );
  content = content.replace(
    'className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"',
    'className="md:hidden p-2 rounded-xl bg-stone-100 text-slate-700 hover:text-slate-900 border border-stone-200"'
  );
  content = content.replace(
    '<h1 className="text-base sm:text-lg font-black text-white truncate max-w-[140px] sm:max-w-none">{restaurant.name}</h1>',
    '<h1 className="text-base sm:text-lg font-black text-slate-900 truncate max-w-[140px] sm:max-w-none">{restaurant.name}</h1>'
  );
  content = content.replace(
    '<span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded uppercase hidden sm:inline">',
    '<span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded uppercase hidden sm:inline">'
  );

  // 4. Restaurant Switcher Combobox
  const oldSwitcherRegex = /<select\s+value=\{slug\}[\s\S]*?<\/select>/;
  const newSwitcher = `<select
              value={slug}
              onChange={(e) => (window.location.href = \`/admin/dashboard?slug=\${e.target.value}\`)}
              className="bg-stone-100 border border-stone-300 text-xs font-bold text-slate-800 rounded-lg px-2 sm:px-3 py-2 max-w-[150px] sm:max-w-none focus:outline-none focus:border-emerald-600"
            >
              {allRestaurants && allRestaurants.length > 0 ? (
                allRestaurants.map((r) => (
                  <option key={r.slug} value={r.slug}>
                    {r.name}
                  </option>
                ))
              ) : (
                <>
                  <option value="arabian-delight">Arabian Delight</option>
                  <option value="royal-biryani">Royal Biryani House</option>
                  <option value="food-corner">Food Corner & Café</option>
                  {slug && <option value={slug}>{restaurant.name || slug}</option>}
                </>
              )}
            </select>`;
  content = content.replace(oldSwitcherRegex, newSwitcher);

  // 5. Header buttons
  content = content.replace(
    'className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-2.5 sm:px-3 py-2 rounded-lg transition flex items-center gap-1 shadow whitespace-nowrap"',
    'className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-2.5 sm:px-3 py-2 rounded-lg transition flex items-center gap-1 shadow-sm shadow-emerald-600/20 whitespace-nowrap"'
  );
  content = content.replace(
    'className="bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold px-2.5 sm:px-3 py-2 rounded-lg border border-slate-700 transition hidden sm:inline"',
    'className="bg-stone-100 hover:bg-stone-200 text-indigo-700 text-xs font-bold px-2.5 sm:px-3 py-2 rounded-lg border border-stone-200 transition hidden sm:inline"'
  );

  // 6. Mobile drawer
  content = content.replace(
    'className="md:hidden mt-3 pt-3 border-t border-slate-800 space-y-1"',
    'className="md:hidden mt-3 pt-3 border-t border-stone-200 space-y-1"'
  );
  content = content.replace(
    'activeTab === tab.id\n                      ? "bg-emerald-500 text-slate-950 font-black"\n                      : "text-slate-300 hover:bg-slate-800"',
    'activeTab === tab.id\n                      ? "bg-emerald-600 text-white font-black shadow-sm"\n                      : "text-slate-700 hover:bg-stone-100"'
  );

  // 7. Sidebar
  content = content.replace(
    '<aside className="w-64 bg-slate-900/60 border-r border-slate-800/80 p-4 hidden md:flex flex-col justify-between shrink-0">',
    '<aside className="w-64 bg-white border-r border-stone-200/80 p-4 hidden md:flex flex-col justify-between shrink-0 shadow-xs">'
  );

  // Replace active tab classes in sidebar
  content = content.replaceAll(
    'activeTab === "overview"\n                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"\n                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"',
    'activeTab === "overview"\n                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"\n                  : "text-slate-600 hover:text-slate-900 hover:bg-stone-100"'
  );
  content = content.replaceAll(
    'activeTab === "orders"\n                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"\n                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"',
    'activeTab === "orders"\n                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"\n                  : "text-slate-600 hover:text-slate-900 hover:bg-stone-100"'
  );
  content = content.replaceAll(
    'activeTab === "menu"\n                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"\n                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"',
    'activeTab === "menu"\n                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"\n                  : "text-slate-600 hover:text-slate-900 hover:bg-stone-100"'
  );
  content = content.replaceAll(
    'activeTab === "tables"\n                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"\n                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"',
    'activeTab === "tables"\n                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"\n                  : "text-slate-600 hover:text-slate-900 hover:bg-stone-100"'
  );
  content = content.replaceAll(
    'activeTab === "reviews"\n                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"\n                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"',
    'activeTab === "reviews"\n                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"\n                  : "text-slate-600 hover:text-slate-900 hover:bg-stone-100"'
  );
  content = content.replaceAll(
    'activeTab === "daily_sales"\n                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"\n                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"',
    'activeTab === "daily_sales"\n                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"\n                  : "text-slate-600 hover:text-slate-900 hover:bg-stone-100"'
  );
  content = content.replaceAll(
    'activeTab === "monthly_sales"\n                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"\n                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"',
    'activeTab === "monthly_sales"\n                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"\n                  : "text-slate-600 hover:text-slate-900 hover:bg-stone-100"'
  );
  content = content.replaceAll(
    'activeTab === "coupons"\n                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"\n                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"',
    'activeTab === "coupons"\n                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"\n                  : "text-slate-600 hover:text-slate-900 hover:bg-stone-100"'
  );
  content = content.replaceAll(
    'activeTab === "inventory"\n                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"\n                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"',
    'activeTab === "inventory"\n                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"\n                  : "text-slate-600 hover:text-slate-900 hover:bg-stone-100"'
  );
  content = content.replaceAll(
    'activeTab === "subscription"\n                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"\n                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"',
    'activeTab === "subscription"\n                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"\n                  : "text-slate-600 hover:text-slate-900 hover:bg-stone-100"'
  );

  // Freemium item limit box in sidebar
  content = content.replace(
    '<div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 text-xs">',
    '<div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-xs">'
  );
  content = content.replace('<span className="font-bold text-white">Menu Slots</span>', '<span className="font-bold text-slate-900">Menu Slots</span>');
  content = content.replace('<div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2">', '<div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mb-2">');
  content = content.replace('<span className="text-emerald-400 font-bold">{usedItemsCount}/{allowedItemsCount}</span>', '<span className="text-emerald-700 font-bold">{usedItemsCount}/{allowedItemsCount}</span>');
  content = content.replace('text-[10px] text-amber-400 hover:underline font-bold', 'text-[10px] text-emerald-700 hover:underline font-bold');

  // Main area headings and cards
  content = content.replaceAll('<h2 className="text-2xl font-black text-white">', '<h2 className="text-2xl font-black text-slate-900">');
  content = content.replaceAll('bg-slate-900 border border-slate-800 rounded-2xl', 'bg-white border border-stone-200/80 rounded-3xl shadow-sm');
  content = content.replaceAll('bg-slate-900 border border-slate-800 rounded-xl', 'bg-white border border-stone-200/80 rounded-2xl shadow-sm');
  content = content.replaceAll('bg-slate-900/90 border border-slate-800', 'bg-white border border-stone-200/80 shadow-sm');
  content = content.replaceAll('bg-slate-900/80 border border-slate-800', 'bg-white border border-stone-200/80 shadow-sm');
  content = content.replaceAll('bg-slate-900 border border-slate-800', 'bg-white border border-stone-200/80 shadow-sm');

  // Metric cards text
  content = content.replaceAll('text-2xl font-black text-white mt-2', 'text-2xl font-black text-slate-900 mt-2');
  content = content.replaceAll('text-xl font-bold text-white', 'text-xl font-bold text-slate-900');
  content = content.replaceAll('font-bold text-white', 'font-bold text-slate-900');
  content = content.replaceAll('font-black text-white', 'font-black text-slate-900');
  content = content.replaceAll('text-xs text-slate-400', 'text-xs text-slate-500');
  content = content.replaceAll('text-[11px] text-slate-400', 'text-[11px] text-slate-500');
  content = content.replaceAll('text-slate-300', 'text-slate-700');
  content = content.replaceAll('text-slate-400', 'text-slate-500');

  // Buttons in content
  content = content.replaceAll(
    'bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700',
    'bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-stone-200'
  );
  content = content.replaceAll(
    'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold',
    'bg-emerald-600 hover:bg-emerald-700 text-white font-bold'
  );
  content = content.replaceAll(
    'bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold',
    'bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold'
  );
  content = content.replaceAll('bg-emerald-500 text-slate-950', 'bg-emerald-600 text-white');

  // Input fields
  content = content.replaceAll(
    'bg-slate-800 border border-slate-700 rounded-lg',
    'bg-stone-50 border border-stone-300 rounded-xl text-slate-900'
  );
  content = content.replaceAll(
    'bg-slate-800 border border-slate-700 rounded-xl',
    'bg-stone-50 border border-stone-300 rounded-xl text-slate-900'
  );
  content = content.replaceAll('bg-slate-800 border border-slate-700', 'bg-stone-50 border border-stone-300 text-slate-900');
  content = content.replaceAll('bg-slate-800/80 border border-slate-700', 'bg-stone-50 border border-stone-200 text-slate-900');
  content = content.replaceAll('bg-slate-800', 'bg-stone-100 text-slate-900');
  content = content.replaceAll('border-slate-800', 'border-stone-200');
  content = content.replaceAll('border-slate-700', 'border-stone-200');

  // Modal backgrounds
  content = content.replaceAll('bg-slate-900 border border-slate-700 rounded-2xl', 'bg-white border border-stone-200 rounded-3xl shadow-2xl');
  content = content.replaceAll('bg-slate-900 border border-slate-700', 'bg-white border border-stone-200 shadow-2xl');

  // Table styling
  content = content.replaceAll('bg-slate-900/50', 'bg-stone-50');
  content = content.replaceAll('hover:bg-slate-800/50', 'hover:bg-stone-50/80');

  // Add empty state for menu items if 0 items
  const menuTableAnchor = '{menuItems.length === 0 ? (';
  if (!content.includes(menuTableAnchor)) {
    const targetBlock = `<div className="overflow-x-auto">\n                <table className="w-full text-left text-xs">`;
    const replacementBlock = `{menuItems.length === 0 ? (
                <div className="p-12 text-center bg-stone-50/50 rounded-2xl border-2 border-dashed border-stone-200 my-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                    <UtensilsCrossed className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">No dishes in your menu yet</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Start creating your digital food menu by adding your first dish or signature special.
                  </p>
                  <button
                    onClick={() => setIsAddItemOpen(true)}
                    className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <Plus className="w-4 h-4" /> Add Your First Dish
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">`;
    content = content.replace(targetBlock, replacementBlock);
    // Also close the conditional after table
    const targetEndTable = `</table>\n              </div>\n            </div>\n          )}`;
    const replacementEndTable = `</table>\n              </div>\n              )}\n            </div>\n          )}`;
    content = content.replace(targetEndTable, replacementEndTable);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Admin Dashboard theme unified successfully.');
}

unifyAdminDashboard();
