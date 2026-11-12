
import { useState } from "react";
import {
  ChevronLeft,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import ShopCard from "../../components/ShopCard";
import { shops } from "../../data/shops";
import "./SearchPage.css";

export default function SearchPage() {
  const [query, setQuery] = useState("Laundry shops");
  const [sortChip, setSortChip] = useState("Distance");
  const [openNow, setOpenNow] = useState(false);

  const filteredShops = shops
    .filter((shop) =>
      shop.name.toLowerCase().includes(query.toLowerCase()) ||
      "laundry shops".includes(query.toLowerCase())
    )
    .filter((shop) => !openNow || shop.openNow)
    .sort((a, b) =>
      sortChip === "Distance"
        ? a.distanceKm - b.distanceKm
        : b.rating - a.rating
    );

  return (
    <div className="search-screen">
      <div className="search-container">

        <header className="search-header">
          <div className="search-top-row">
            <button className="back-button" aria-label="Go back">
              <ChevronLeft size={22} />
            </button>

            <div className="search-input-wrapper">
              <Search size={17} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Laundry shops"
              />
            </div>
          </div>

          <div className="filter-row">
            <button className="filter-button">
              <SlidersHorizontal size={14} />
              Filter & Sort
            </button>

            <button
              className="sort-button"
              onClick={() =>
                setSortChip(
                  sortChip === "Distance" ? "Rating" : "Distance"
                )
              }
            >
              Sort: {sortChip}
              <X size={13} />
            </button>

            <button
              className={`open-button ${openNow ? "active" : ""}`}
              onClick={() => setOpenNow(!openNow)}
            >
              Open Now
            </button>
          </div>

          <div className="results-heading">
            <h2>{filteredShops.length} laundry shops found</h2>
            <span>Nearest first</span>
          </div>
        </header>

        <main className="shop-list">
          {filteredShops.map((shop) => (
            <ShopCard key={shop.id || shop.name} shop={shop} />
          ))}

          {filteredShops.length === 0 && (
            <p className="no-results">No laundry shops found.</p>
          )}
        </main>

      </div>
    </div>
  );
}
