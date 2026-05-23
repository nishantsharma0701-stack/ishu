import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ShoppingBag, User as UserIcon, LogOut, Shield, Heart, HelpCircle, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, cart, wishlistIds, logout, activeTab, navigateTo, setCartOpen, setChatbotOpen } = useApp();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
        
        {/* Brand Logo */}
        <button 
          onClick={() => navigateTo('home')} 
          className="flex items-center space-x-2 text-left focus:outline-none"
        >
          <div className="flex h-10 w-10 items-center justify-between rounded-md bg-gradient-to-tr from-amber-600 to-amber-400 p-2.5 shadow-lg shadow-amber-500/10">
            <span className="font-mono text-xl font-bold leading-none text-black">G</span>
          </div>
          <div>
            <span className="block font-mono text-xs tracking-[0.3em] text-amber-500 uppercase leading-none">The</span>
            <span className="block font-sans text-lg font-semibold tracking-wider text-white uppercase mt-0.5">Gentlemen</span>
          </div>
        </button>

        {/* Global Navigation links */}
        <nav className="hidden md:flex items-center space-x-10">
          <button 
            onClick={() => navigateTo('home')} 
            className={`font-sans text-sm tracking-wider uppercase transition-colors ${activeTab === 'home' ? 'text-amber-500 font-medium' : 'text-neutral-400 hover:text-white'}`}
          >
            Home
          </button>
          <button 
            onClick={() => navigateTo('shop')} 
            className={`font-sans text-sm tracking-wider uppercase transition-colors ${activeTab === 'shop' ? 'text-amber-500 font-medium' : 'text-neutral-400 hover:text-white'}`}
          >
            The Collection
          </button>
          <button 
            onClick={() => navigateTo('stylist')} 
            className={`flex items-center space-x-1.5 font-sans text-sm tracking-wider uppercase transition-colors px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/5 ${activeTab === 'stylist' ? 'text-amber-500 border-amber-500 bg-amber-500/10' : 'text-neutral-300 hover:text-white hover:bg-amber-500/10 hover:border-amber-500/50'}`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
            <span>AI Stylist</span>
          </button>
        </nav>

        {/* Interactive icons layout */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          
          {/* AI Stylist Chat Trigger */}
          <button 
            onClick={() => setChatbotOpen(true)}
            className="group relative rounded-full p-2.5 text-neutral-400 transition-all hover:text-white hover:bg-neutral-900"
            title="Style companion bot"
          >
            <HelpCircle className="h-5 w-5" />
          </button>

          {/* Wishlist Trigger */}
          <button 
            onClick={() => navigateTo('dashboard')}
            className="group relative rounded-full p-2.5 text-neutral-400 transition-all hover:text-white hover:bg-neutral-900"
            title="Wishlist and saves"
          >
            <Heart className="h-5 w-5" />
            {wishlistIds.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-amber-500" />
            )}
          </button>

          {/* Cart Trigger */}
          <button 
            onClick={() => setCartOpen(true)} 
            className="group relative rounded-full p-2.5 text-neutral-400 transition-all hover:text-white hover:bg-neutral-900"
            title="Shopping basket"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalCartItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 font-mono text-[10px] font-bold text-black shadow-md">
                {totalCartItems}
              </span>
            )}
          </button>

          <div className="h-4 w-[1px] bg-neutral-800" />

          {/* User Signin / Settings */}
          {user ? (
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigateTo('dashboard')}
                className="flex items-center space-x-2 text-left focus:outline-none"
              >
                <img 
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} 
                  alt={user.username} 
                  className="h-8 w-8 rounded-full border border-neutral-700 object-cover"
                />
                <span className="hidden lg:inline text-xs font-sans tracking-wide text-neutral-300 hover:text-white transition-colors truncate max-w-[100px]">
                  {user.username}
                </span>
              </button>
              
              {user.isAdmin && (
                <button 
                  onClick={() => navigateTo('admin')}
                  className="rounded-full p-2 text-neutral-400 hover:text-amber-500 transition-colors"
                  title="Admin Dashboard"
                >
                  <Shield className="h-4 w-4" />
                </button>
              )}

              <button 
                onClick={logout}
                className="rounded-full p-2 text-neutral-400 hover:text-red-500 transition-colors"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigateTo('auth')}
              className="group flex items-center space-x-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold tracking-wider text-black transition-all hover:bg-neutral-100 uppercase"
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
