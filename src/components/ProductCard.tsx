import React from 'react';
import { Product } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';
import { Heart, Star, Sparkles, ShoppingCart } from 'lucide-react';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { toggleWishlist, wishlistIds, navigateTo } = useApp();

  const isWishlisted = wishlistIds.includes(product.id);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-900 bg-neutral-950/40 backdrop-blur-md transition-all hover:border-neutral-800 hover:shadow-xl hover:shadow-amber-500/5">
      
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Backdrop Dark Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Floating Styling Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-1.5 pointer-events-none">
          {product.isNewArrival && (
            <span className="inline-flex items-center rounded bg-amber-500 px-2 py-0.5 text-[9px] font-bold font-mono text-black uppercase tracking-wide">
              New Drop
            </span>
          )}
          {product.isBestSeller && (
            <span className="inline-flex items-center rounded bg-zinc-900/90 border border-amber-500/20 px-2 py-0.5 text-[9px] font-bold font-mono text-amber-500 uppercase tracking-wide">
              Selected Seller
            </span>
          )}
          <span className="inline-flex items-center rounded bg-black/80 px-2 py-0.5 text-[9px] font-mono text-neutral-400 capitalize">
            {product.style}
          </span>
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-4 right-4 z-10 rounded-full p-2.5 backdrop-blur-md transition-colors ${
            isWishlisted 
              ? 'bg-amber-500 text-black border border-amber-500' 
              : 'bg-black/50 text-neutral-300 border border-neutral-800/80 hover:bg-neutral-900/80 hover:text-white'
          }`}
          title="Add to lookbook"
        >
          <Heart className="h-4 w-4" fill={isWishlisted ? "black" : "none"} />
        </button>

        {/* Quick Action Button overlay */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={() => navigateTo('shop', product.id)}
            className="flex w-full items-center justify-center space-x-2 rounded bg-white py-3 text-xs font-semibold tracking-wider text-black transition-colors hover:bg-amber-500"
          >
            <span>Sartorial Details</span>
          </button>
        </div>
      </div>

      {/* Product Specs Detail info */}
      <div className="flex flex-1 flex-col p-5">
        <button 
          onClick={() => navigateTo('shop', product.id)}
          className="text-left font-mono text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white mb-1 transition-colors"
        >
          {product.brand}
        </button>
        
        <button
          onClick={() => navigateTo('shop', product.id)}
          className="text-left font-sans text-sm font-medium text-white hover:text-amber-500 transition-colors line-clamp-1 mb-2"
        >
          {product.name}
        </button>

        <div className="mt-auto flex items-center justify-between pt-1">
          {/* Price display with elegant INR typography */}
          <span className="font-mono text-sm font-semibold tracking-wider text-amber-500">
            ₹{product.price.toLocaleString('en-IN')}
          </span>

          {/* Star rating preview */}
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span className="font-mono text-xs text-neutral-400">{product.rating}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
