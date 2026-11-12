import { useState } from 'react';
import { MapPin, Bell, Search, SlidersHorizontal } from 'lucide-react';
import LaundryCard from '../components/LaundryCard';

const CATEGORIES = ['All', 'Full-Service', 'Self-Service', 'Open Now'];

const MOCK_SHOPS = [
  {
    id: 1,
    name: 'Wash Your Problems',
    rating: 4.4,
    services: ['Self-Service', 'Full-Service'],
    price: 120,
    distance: 0.2,
    openUntil: '11 PM',
    image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Seoul Hanger Laundry Shop',
    rating: 4.1,
    services: ['Full-Service'],
    price: 110,
    distance: 0.5,
    openUntil: '7 PM',
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Superbubbles Laundry Services',
    rating: 4.4,
    services: ['Self-Service', 'Full-Service'],
    price: 150,
    distance: 1.6,
    openUntil: '9 PM',
    image: 'https://images.unsplash.com/photo-1521656693074-0ef32e80a5d5?q=80&w=600&auto=format&fit=crop',
  },
];

export default function Home() {
  const [activeChip, setActiveChip] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShops = MOCK_SHOPS.filter((shop) => {
    const matchesChip =
      activeChip === 'All' ||
      (activeChip === 'Open Now' && shop.openUntil) ||
      shop.services.includes(activeChip);

    const matchesSearch = shop.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesChip && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-neutral-600 text-slate-800 font-sans">
      {/* Scrollable Container matching Figma background */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        
        {/* Top Location Bar */}
        <div className="bg-white rounded-xl px-3.5 py-2.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-slate-800" />
            <span className="font-bold text-sm text-slate-900">Naga City</span>
          </div>
          <div className="relative">
            <Bell className="w-5 h-5 text-slate-800 cursor-pointer" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
          </div>
        </div>

        {/* Search Bar & Filter Icon */}
        <div className="bg-white rounded-full px-4 py-2.5 flex items-center gap-2 shadow-sm border border-slate-100">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search laundry shops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
          />
          <button className="text-sky-500 hover:text-sky-600">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Category Chips Navigation */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORIES.map((chip) => (
            <button
              key={chip}
              onClick={() => setActiveChip(chip)}
              className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                activeChip === chip
                  ? 'bg-sky-400 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Section Heading */}
        <h2 className="text-sm font-bold text-slate-900 tracking-tight pt-1">
          Laundry Shops in Naga City
        </h2>

        {/* Shop List */}
        <div className="space-y-4 pb-4">
        {filteredShops.length > 0 ? (
            filteredShops.map((shop) => (
            <LaundryCard key={shop.id} shop={shop} />
            ))
        ) : (
            <div className="text-center py-8 bg-white/50 rounded-2xl border border-dashed border-slate-300">
            <p className="text-xs font-semibold text-slate-500">No laundry shops found</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Try searching for a different term or category</p>
            </div>
        )}
        </div>
      </div>
    </div>
  );
}