/**
 * Home-page data and helper functions.
 *
 * Keep page-specific mock data, category options, and filtering logic here so
 * HomePage.jsx can focus on rendering the page.
 */

export const LAUNDRY_CATEGORIES = [
  'All',
  'Full-Service',
  'Self-Service',
  'Open Now',
];

export const MOCK_LAUNDRY_SHOPS = [
  {
    id: 1,
    name: 'Wash Your Problems',
    rating: 4.4,
    services: ['Self-Service', 'Full-Service'],
    price: 120,
    distance: 0.2,
    openUntil: '11 PM',
    image:
      'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Seoul Hanger Laundry Shop',
    rating: 4.1,
    services: ['Full-Service'],
    price: 110,
    distance: 0.5,
    openUntil: '7 PM',
    image:
      'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Superbubbles Laundry Services',
    rating: 4.4,
    services: ['Self-Service', 'Full-Service'],
    price: 150,
    distance: 1.6,
    openUntil: '9 PM',
    image:
      'https://images.unsplash.com/photo-1521656693074-0ef32e80a5d5?q=80&w=600&auto=format&fit=crop',
  },
];

/**
 * Filters laundry shops using the selected category and search query.
 *
 * @param {Array<object>} shops - Laundry shops to filter.
 * @param {string} activeCategory - The selected category chip.
 * @param {string} searchQuery - The text entered in the search field.
 * @returns {Array<object>} The laundry shops matching both filters.
 */
export function filterLaundryShops(shops, activeCategory, searchQuery) {
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  return shops.filter((shop) => {
    const matchesCategory =
      activeCategory === 'All' ||
      (activeCategory === 'Open Now' && Boolean(shop.openUntil)) ||
      shop.services.includes(activeCategory);

    const matchesSearch = shop.name
      .toLowerCase()
      .includes(normalizedSearchQuery);

    return matchesCategory && matchesSearch;
  });
}
