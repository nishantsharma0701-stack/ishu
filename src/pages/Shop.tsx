import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import { Filter, Grid, List, SlidersHorizontal, Search, X } from 'lucide-react';

export const Shop: React.FC = () => {
  const { products, fetchProducts, navigateTo, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Custom Filter states
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [activeStyle, setActiveStyle] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('');
  const [activeSize, setActiveSize] = useState<string>('');
  const [activeColor, setActiveColor] = useState<string>('');
  const [sortingOption, setSortingOption] = useState<string>('newest');

  // Trigger API calls on filters update
  useEffect(() => {
    const filters: Record<string, string> = {
      sortBy: sortingOption
    };
    if (searchTerm) filters.search = searchTerm;
    if (activeCategory) filters.category = activeCategory;
    if (activeStyle) filters.style = activeStyle;
    if (activeSize) filters.size = activeSize;
    if (activeColor) filters.color = activeColor;

    if (priceRange) {
      if (priceRange === 'under-5000') {
        filters.priceMax = '5000';
      } else if (priceRange === '5000-15000') {
        filters.priceMin = '5000';
        filters.priceMax = '15000';
      } else if (priceRange === 'over-15000') {
        filters.priceMin = '15000';
      }
    }

    fetchProducts(filters);
  }, [searchTerm, activeCategory, activeStyle, priceRange, activeSize, activeColor, sortingOption]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setActiveCategory('');
    setActiveStyle('');
    setPriceRange('');
    setActiveSize('');
    setActiveColor('');
    setSortingOption('newest');
  };

  const categories = ["Suits", "Shirts", "T-shirts & Hoodies", "Pants & Cargos", "Outerwear", "Footwear", "Accessories"];
  const styles = ["Casual", "Streetwear", "Minimal", "Old Money", "Korean Fashion", "Formal", "Luxury", "Smart Casual"];
  const sizes = ["S", "M", "L", "XL", "30", "32", "34", "36", "41", "42", "43", "One Size"];
  const colors = ["Sand Cream", "Chalk White", "Midnight Navy", "Warm Sand", "Sage Green", "Obsidian Black", "Slate Grey", "Tortoise Shell"];

  return (
    <div className="bg-black py-12 text-white min-h-[85vh]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        
        {/* Page Header */}
        <div className="border-b border-neutral-900 pb-10 text-center md:text-left">
          <span className="font-mono text-xs tracking-[0.3em] text-amber-500 uppercase font-bold">The Curator's Showroom</span>
          <h1 className="mt-2 font-sans text-4xl font-extrabold tracking-tight sm:text-5xl uppercase">THE ENTIRE REPERTOIRE</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-500 font-light">
            Each garment and accessory in our collection is rigorously inspected for material composition, weaving details, and shoulder drop shapes. Complete with responsive ordering.
          </p>
        </div>

        {/* Searching & Filters Grid Control */}
        <div className="mt-10 lg:grid lg:grid-cols-4 lg:gap-8 lg:items-start">
          
          {/* 1. Left Rail Desktop Filters */}
          <div className="hidden lg:block space-y-8 bg-neutral-950/20 rounded-xl p-6 border border-neutral-900">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 font-sans text-xs font-bold tracking-widest text-white uppercase col-span-1">
                <SlidersHorizontal className="h-4 w-4 text-amber-500" />
                <span>Filters</span>
              </span>
              <button 
                onClick={clearAllFilters}
                className="font-mono text-[9px] text-neutral-500 hover:text-amber-500 uppercase tracking-wider"
              >
                Clear Ledger
              </button>
            </div>

            {/* Category selection list */}
            <div className="border-t border-neutral-900 pt-6">
              <h3 className="font-mono text-[10px] tracking-widest text-white uppercase font-bold mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveCategory('')}
                  className={`block text-xs uppercase tracking-wider transition-colors ${!activeCategory ? 'text-amber-500 font-semibold' : 'text-neutral-400 hover:text-white'}`}
                >
                  All Items
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`block text-xs uppercase tracking-wider transition-colors ${activeCategory === cat ? 'text-amber-500 font-semibold' : 'text-neutral-400 hover:text-white'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Stylistic Filter */}
            <div className="border-t border-neutral-900 pt-6">
              <h3 className="font-mono text-[10px] tracking-widest text-white uppercase font-bold mb-4">Fashion Styles</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveStyle('')}
                  className={`block text-xs uppercase tracking-wider transition-colors ${!activeStyle ? 'text-amber-500 font-semibold' : 'text-neutral-400 hover:text-white'}`}
                >
                  All Styles
                </button>
                {styles.map((st) => (
                  <button
                    key={st}
                    onClick={() => setActiveStyle(st)}
                    className={`block text-xs uppercase tracking-wider transition-colors ${activeStyle === st ? 'text-amber-500 font-semibold' : 'text-neutral-400 hover:text-white'}`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Segment filter */}
            <div className="border-t border-neutral-900 pt-6">
              <h3 className="font-mono text-[10px] tracking-widest text-white uppercase font-bold mb-4">Price Slates</h3>
              <div className="space-y-2.5 text-xs text-neutral-400">
                <label className="flex items-center space-x-2 hover:text-white transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="priceGroup"
                    checked={priceRange === ''}
                    onChange={() => setPriceRange('')}
                    className="accent-amber-500"
                  />
                  <span>Any Price</span>
                </label>
                <label className="flex items-center space-x-2 hover:text-white transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="priceGroup"
                    checked={priceRange === 'under-5000'}
                    onChange={() => setPriceRange('under-5000')}
                    className="accent-amber-500"
                  />
                  <span>Under ₹5,000</span>
                </label>
                <label className="flex items-center space-x-2 hover:text-white transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="priceGroup"
                    checked={priceRange === '5000-15000'}
                    onChange={() => setPriceRange('5000-15000')}
                    className="accent-amber-500"
                  />
                  <span>₹5,000 – ₹15,000</span>
                </label>
                <label className="flex items-center space-x-2 hover:text-white transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="priceGroup"
                    checked={priceRange === 'over-15000'}
                    onChange={() => setPriceRange('over-15000')}
                    className="accent-amber-500"
                  />
                  <span>Over ₹15,000</span>
                </label>
              </div>
            </div>

            {/* Sizing Filter */}
            <div className="border-t border-neutral-900 pt-6">
              <h3 className="font-mono text-[10px] tracking-widest text-white uppercase font-bold mb-4">Size Guides</h3>
              <div className="grid grid-cols-4 gap-1.5">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setActiveSize(activeSize === sz ? '' : sz)}
                    className={`rounded border text-center font-mono py-1.5 text-[10px] transition-colors ${activeSize === sz ? 'bg-amber-500 text-black border-amber-500 font-bold' : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white hover:border-neutral-700'}`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Circle Selection */}
            <div className="border-t border-neutral-900 pt-6">
              <h3 className="font-mono text-[10px] tracking-widest text-white uppercase font-bold mb-4">Color Palettes</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => {
                  const isSel = activeColor === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setActiveColor(isSel ? '' : c)}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-sans border transition-all ${isSel ? 'bg-amber-500 border-amber-500 text-black font-semibold' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* 2. Products grid columns */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Top Toolbar controls (Searching, Sorting, counts) */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-neutral-950 p-4 border border-neutral-900 rounded-xl">
              
              {/* Searching Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600 animate-pulse" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tailored wool, luxury suede, polo shirts..."
                  className="w-full rounded bg-neutral-900 border border-neutral-850 px-4 py-3 pl-10 text-xs text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Sorting option dropdown */}
              <div className="flex items-center space-x-3 self-end md:self-auto text-xs">
                <span className="font-mono text-[10px] tracking-wider text-neutral-500 uppercase font-semibold">Arrange By:</span>
                <select
                  value={sortingOption}
                  onChange={(e) => setSortingOption(e.target.value)}
                  className="rounded bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs font-sans text-neutral-300 focus:border-amber-500 focus:outline-none"
                >
                  <option value="newest">Sartorial Newness</option>
                  <option value="price-low-high">Value segment: Low to High</option>
                  <option value="price-high-low">Premium luxury: High to Low</option>
                  <option value="rating">Client Appraisal Ratings</option>
                </select>
              </div>

            </div>

            {/* Mobile Horizontal scroll filters teaser */}
            <div className="lg:hidden flex space-x-2 overflow-x-auto py-2 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? '' : cat)}
                  className={`rounded px-4 py-2 text-xs uppercase tracking-wider bg-neutral-950 border border-neutral-900 ${activeCategory === cat ? 'border-amber-500 text-amber-500' : 'text-neutral-400'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Loading Indicator */}
            {loading ? (
              <div className="flex py-32 flex-col items-center justify-center space-y-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-800 border-t-amber-500" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Refreshing Showroom...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-28 border border-neutral-900 rounded-xl bg-neutral-950/20 max-w-lg mx-auto p-8">
                <span className="block text-2xl font-mono text-amber-500">∅</span>
                <h3 className="mt-4 font-sans text-md font-semibold tracking-wide text-white uppercase">Ledger Query Empty</h3>
                <p className="mt-2 text-xs text-neutral-500 leading-relaxed font-light">
                  Our current curation of products does not match these coordinates. Try clearing filters or searching for another silhouette.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 rounded border border-neutral-850 px-4 py-2 font-mono text-[9px] uppercase tracking-widest text-amber-500 hover:bg-neutral-900"
                >
                  View full showroom catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
