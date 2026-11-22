"use client";

import { useState, useMemo, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  QrCode,
  Search,
  Flame,
  Star,
  MapPin,
  Clock,
  Info,
} from "lucide-react";
import { formatCurrency } from "../../../lib/utils";

// Sample restaurant fallback database for public menu viewing
const demoRestaurants: Record<
  string,
  {
    name: string;
    tagline: string;
    city: string;
    address: string;
    phone: string;
    category: string;
    hours: string;
    logo: string;
    cover: string;
    categories: {
      name: string;
      items: {
        id: string;
        name: string;
        description: string;
        price: number;
        isVeg: boolean;
        isSpicy: boolean;
        isBestseller: boolean;
        image?: string;
      }[];
    }[];
  }
> = {
  "the-royal-plate": {
    name: "The Royal Plate",
    tagline: "Authentic Royal Dining & Mughlai Delicacies",
    city: "Hyderabad",
    address: "Plot 42, Jubilee Hills, Road No. 36",
    phone: "+91 98765 43210",
    category: "Fine Dining",
    hours: "12:00 PM – 11:30 PM",
    logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop&q=80",
    cover: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80",
    categories: [
      {
        name: "Royal Starters",
        items: [
          {
            id: "rp-1",
            name: "Crispy Corn & Water Chestnut",
            description: "Golden fried sweet corn tossed with water chestnuts, scallions, and crushed pepper.",
            price: 280,
            isVeg: true,
            isSpicy: false,
            isBestseller: true,
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80",
          },
          {
            id: "rp-2",
            name: "Galouti Kebab (Awadhi Style)",
            description: "Melt-in-mouth smoked minced lamb patties infused with 32 royal spices and rose water.",
            price: 480,
            isVeg: false,
            isSpicy: true,
            isBestseller: true,
            image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&auto=format&fit=crop&q=80",
          },
          {
            id: "rp-3",
            name: "Paneer Kurkure Tikka",
            description: "Crispy panko crusted malai cottage cheese cubes with tangy mint emulsion.",
            price: 320,
            isVeg: true,
            isSpicy: false,
            isBestseller: false,
          },
        ],
      },
      {
        name: "Tandoor & Clay Oven",
        items: [
          {
            id: "rp-4",
            name: "Bhatti Da Murgh",
            description: "Charcoal-roasted spring chicken steeped in hung curd, mustard oil, and Kashmiri chilies.",
            price: 460,
            isVeg: false,
            isSpicy: true,
            isBestseller: true,
            image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=400&auto=format&fit=crop&q=80",
          },
          {
            id: "rp-5",
            name: "Tandoori Malai Broccoli",
            description: "Broccoli florets marinated in Philadelphia cream cheese, cardamom, and roasted garlic.",
            price: 360,
            isVeg: true,
            isSpicy: false,
            isBestseller: false,
          },
        ],
      },
      {
        name: "Main Course",
        items: [
          {
            id: "rp-6",
            name: "Dal Makhani Bukhara",
            description: "Simmered overnight on slow charcoal fire, finished with hand-churned white butter and cream.",
            price: 360,
            isVeg: true,
            isSpicy: false,
            isBestseller: true,
            image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format&fit=crop&q=80",
          },
          {
            id: "rp-7",
            name: "Butter Chicken Aslam Style",
            description: "Tandoor-charred boneless chicken simmered in rich satin tomato and fenugreek gravy.",
            price: 490,
            isVeg: false,
            isSpicy: false,
            isBestseller: true,
            image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&auto=format&fit=crop&q=80",
          },
          {
            id: "rp-8",
            name: "Paneer Lababdar",
            description: "Fresh cottage cheese in an aromatic tomato-onion gravy with grated paneer and kasoori methi.",
            price: 390,
            isVeg: true,
            isSpicy: true,
            isBestseller: false,
          },
        ],
      },
      {
        name: "Biryani & Rice",
        items: [
          {
            id: "rp-9",
            name: "Hyderabadi Dum Gosht Biryani",
            description: "Aged long-grain basmati sealed under dough with tender mutton, fried onions, and pure saffron.",
            price: 540,
            isVeg: false,
            isSpicy: true,
            isBestseller: true,
            image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80",
          },
          {
            id: "rp-10",
            name: "Subz Tarkari Dum Biryani",
            description: "Seasonal garden vegetables infused with aromatic mint, cloves, and kewra water.",
            price: 380,
            isVeg: true,
            isSpicy: false,
            isBestseller: false,
          },
        ],
      },
      {
        name: "Desserts & Drinks",
        items: [
          {
            id: "rp-11",
            name: "Shahi Tukda with Saffron Rabdi",
            description: "Crispy ghee-fried brioche soaked in fragrant cardamom syrup and rich reduced milk rabdi.",
            price: 220,
            isVeg: true,
            isSpicy: false,
            isBestseller: true,
          },
          {
            id: "rp-12",
            name: "Kesariya Thandai Mocktail",
            description: "Chilled pistachio and almond milk spiced with green cardamom, fennel, and dried rose petals.",
            price: 180,
            isVeg: true,
            isSpicy: false,
            isBestseller: false,
          },
        ],
      },
    ],
  },
  "cafe-azure": {
    name: "Café Azure",
    tagline: "Artisanal Coffee & Handcrafted Bakery",
    city: "Bangalore",
    address: "100 Feet Road, Indiranagar",
    phone: "+91 98111 22334",
    category: "Café & Bakery",
    hours: "8:00 AM – 10:00 PM",
    logo: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop&q=80",
    cover: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&auto=format&fit=crop&q=80",
    categories: [
      {
        name: "Coffee & Brews",
        items: [
          {
            id: "ca-1",
            name: "Spanish Cortado",
            description: "Double shot espresso cut with equal part warm silky textured milk.",
            price: 210,
            isVeg: true,
            isSpicy: false,
            isBestseller: true,
          },
          {
            id: "ca-2",
            name: "Vietnamese Iced Coffee",
            description: "Slow-drip dark roast poured over condensed milk and crushed ice.",
            price: 240,
            isVeg: true,
            isSpicy: false,
            isBestseller: true,
          },
        ],
      },
      {
        name: "All-Day Brunch",
        items: [
          {
            id: "ca-3",
            name: "Avocado & Sourdough Toast",
            description: "Poached eggs, hass avocado smash, chili flakes on wood-fired sourdough.",
            price: 360,
            isVeg: true,
            isSpicy: false,
            isBestseller: true,
          },
        ],
      },
    ],
  },
};

function MenuContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const slug = (params?.slug as string) || "the-royal-plate";
  const table = searchParams.get("table");

  // Retrieve restaurant data (fallback to royal plate if slug not found)
  const restaurant = demoRestaurants[slug] || demoRestaurants["the-royal-plate"];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiet, setSelectedDiet] = useState<"all" | "veg" | "non-veg">("all");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Filtered categories and dishes
  const filteredCategories = useMemo(() => {
    return restaurant.categories
      .map((cat) => {
        const filteredItems = cat.items.filter((item) => {
          const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());

          const matchesDiet =
            selectedDiet === "all" ||
            (selectedDiet === "veg" && item.isVeg) ||
            (selectedDiet === "non-veg" && !item.isVeg);

          return matchesSearch && matchesDiet;
        });

        return {
          ...cat,
          items: filteredItems,
        };
      })
      .filter((cat) => {
        if (activeCategory !== "all" && cat.name !== activeCategory) {
          return false;
        }
        return cat.items.length > 0;
      });
  }, [restaurant, searchQuery, selectedDiet, activeCategory]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 selection:bg-brand-100 selection:text-brand-900">
      {/* Table Detection Floating Pill */}
      {table && (
        <div className="bg-brand-700 text-white text-xs py-2 px-4 text-center font-bold sticky top-0 z-50 shadow-md flex items-center justify-center gap-2">
          <QrCode className="w-3.5 h-3.5" />
          <span>Browsing Contactless Menu at Table {table}</span>
        </div>
      )}

      {/* Restaurant Header Cover */}
      <div className="relative bg-slate-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
          style={{ backgroundImage: `url(${restaurant.cover})` }}
        />
        <div className="relative max-w-3xl mx-auto px-4 pt-10 pb-8 sm:px-6">
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1 border-2 border-white/20 shadow-xl overflow-hidden shrink-0">
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/30 text-brand-200 text-[11px] font-bold uppercase tracking-wider mb-1.5">
                <span>{restaurant.category}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{restaurant.name}</h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">{restaurant.tagline}</p>

              <div className="mt-3 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-300">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-400" />
                  <span>{restaurant.city}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brand-400" />
                  <span>{restaurant.hours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Search and Filter Controls */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-3xl mx-auto px-4 py-3 sm:px-6 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search dishes, ingredients, or spices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 focus:bg-white text-sm rounded-xl border border-transparent focus:border-brand-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Category Horizontal Scroll Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                activeCategory === "all"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Categories
            </button>
            {restaurant.categories.map((c) => (
              <button
                key={c.name}
                onClick={() => setActiveCategory(c.name)}
                className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  activeCategory === c.name
                    ? "bg-brand-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Dietary Filter Buttons */}
          <div className="flex items-center justify-between text-xs font-semibold pt-1">
            <span className="text-slate-500 text-[11px]">Dietary preference:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedDiet("all")}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedDiet === "all"
                    ? "bg-slate-900 text-white font-bold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedDiet("veg")}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
                  selectedDiet === "veg"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-xs border border-current flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-current" />
                </div>
                <span>Veg Only</span>
              </button>
              <button
                onClick={() => setSelectedDiet("non-veg")}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
                  selectedDiet === "non-veg"
                    ? "bg-rose-600 text-white font-bold"
                    : "text-rose-700 hover:bg-rose-50"
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-xs border border-current flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-current" />
                </div>
                <span>Non-Veg</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Categories & Items List */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {filteredCategories.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
            <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 text-base">No dishes found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search terms or dietary filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDiet("all");
                setActiveCategory("all");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-brand-50 text-brand-700 text-xs font-bold hover:bg-brand-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <section key={category.name} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h2 className="text-lg font-black text-slate-950 flex items-center gap-2">
                  <span>{category.name}</span>
                  <span className="text-xs font-semibold text-slate-400">
                    ({category.items.length})
                  </span>
                </h2>
              </div>

              {/* Items in Category */}
              <div className="grid gap-3">
                {category.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex items-start justify-between gap-4"
                  >
                    <div className="flex-1 space-y-1.5">
                      {/* Dietary Badges */}
                      <div className="flex items-center gap-2">
                        {item.isVeg ? (
                          <div className="w-4 h-4 rounded-xs border-2 border-emerald-600 flex items-center justify-center" title="Vegetarian">
                            <div className="w-2 h-2 rounded-full bg-emerald-600" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-xs border-2 border-rose-600 flex items-center justify-center" title="Non-Vegetarian">
                            <div className="w-2 h-2 rounded-full bg-rose-600" />
                          </div>
                        )}

                        {item.isBestseller && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            Bestseller
                          </span>
                        )}

                        {item.isSpicy && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                            <Flame className="w-3 h-3 text-rose-600" />
                            Spicy
                          </span>
                        )}
                      </div>

                      {/* Item Name */}
                      <h3 className="font-bold text-slate-950 text-base leading-snug">
                        {item.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-500 leading-relaxed pr-2">
                        {item.description}
                      </p>

                      {/* Price */}
                      <div className="pt-1 text-base font-black text-slate-900">
                        {formatCurrency(item.price)}
                      </div>
                    </div>

                    {/* Food Photo if available */}
                    {item.image && (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-xs">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))
        )}

        {/* Footer Brand Credit */}
        <div className="pt-10 pb-6 text-center text-xs text-slate-400 space-y-1">
          <div className="flex items-center justify-center gap-1.5 font-bold text-slate-600">
            <QrCode className="w-4 h-4 text-brand-600" />
            <span>QRDine Contactless Digital Menu</span>
          </div>
          <div>No app download needed • Scanned directly at table</div>
        </div>
      </main>
    </div>
  );
}

export default function CustomerMenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm font-semibold text-slate-500">
          Loading digital menu...
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}
