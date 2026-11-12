import { useState } from 'react';
import { MapPin, Bell, Search, SlidersHorizontal } from 'lucide-react';
import LaundryCard from '../../components/LaundryCard';
import {
  LAUNDRY_CATEGORIES,
  MOCK_LAUNDRY_SHOPS,
  filterLaundryShops,
} from './HomePage.js';
import './HomePage.css';

export default function HomePage() {
  const [activeChip, setActiveChip] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShops = filterLaundryShops(
    MOCK_LAUNDRY_SHOPS,
    activeChip,
    searchQuery,
  );

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
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full text-xs text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
          />
          <button className="text-sky-500 hover:text-sky-600">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Category Chips Navigation */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
          {LAUNDRY_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveChip(category)}
              className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                activeChip === category
                  ? 'bg-sky-400 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {category}
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
              <p className="text-xs font-semibold text-slate-500">
                No laundry shops found
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Try searching for a different term or category
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
