import { useState } from "react";
import { ChevronLeft, Search, SlidersHorizontal, X } from "lucide-react";
import ShopCard from "../components/ShopCard";
import { shops } from "../data/shops";

export default function SearchResultsScreen() {
  const [query, setQuery] = useState("Laundry shops");
  const [sortChip, setSortChip] = useState("Distance");
  const [openNow, setOpenNow] = useState(false);

  return (
    <div className="flex min-h-dvh justify-center bg-gray-100 font-['Inter',sans-serif]">
      <div className="relative flex h-dvh w-full max-w-[390px] flex-col bg-white md:max-h-[844px] md:self-center md:overflow-hidden md:rounded-[28px] md:shadow-xl">
        <header className="shrink-0 bg-white px-4 pt-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Go back"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gray-200 bg-white text-gray-900 active:bg-gray-50"
            >
              <ChevronLeft size={22} />
            </button>

            <label className="flex h-11 flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3">
              <Search size={18} className="shrink-0 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search laundry shops"
                className="w-full bg-transparent text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
            </label>
          </div>

          <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#2EC4FF] px-4 text-[13px] font-semibold text-white active:opacity-90"
            >
              <SlidersHorizontal size={16} />
              Filter &amp; Sort
            </button>

            {sortChip && (
              <button
                type="button"
                onClick={() => setSortChip(null)}
                className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-[#A5E0FA] bg-[#E6F7FF] px-3.5 text-[13px] font-medium text-gray-800"
              >
                Sort: {sortChip}
                <X size={14} className="text-gray-600" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setOpenNow((v) => !v)}
              className={`flex h-9 shrink-0 items-center rounded-full border px-3.5 text-[13px] font-medium ${
                openNow
                  ? "border-[#2EC4FF] bg-[#2EC4FF] text-white"
                  : "border-[#A5E0FA] bg-[#E6F7FF] text-gray-800"
              }`}
            >
              Open Now
            </button>
          </div>

          <div className="mt-4 flex items-baseline justify-between pb-3">
            <h1 className="text-[15px] font-semibold text-gray-900">
              {shops.length} laundry shops found
            </h1>
            <span className="text-[12px] text-gray-400">Nearest first</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 pb-6">
          <ul className="flex flex-col gap-3">
            {shops.map((shop) => (
              <li key={shop.id}>
                <ShopCard shop={shop} />
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}
