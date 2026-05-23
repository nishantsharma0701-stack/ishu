import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="border-t border-neutral-900 bg-black text-neutral-400">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:py-24">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* Brand block */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-between rounded-md bg-gradient-to-tr from-amber-600 to-amber-400 p-2 shadow-lg">
                <span className="font-mono text-lg font-bold leading-none text-black">G</span>
              </div>
              <span className="font-sans text-md font-semibold tracking-wider text-white uppercase">The Gentlemen Fashion</span>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-neutral-500">
              An exquisite curation of modern tailoring and luxury streetwear. Empowered by Gemini AI, delivering highly personalized wardrobe style recommendations to gentlemen worldwide.
            </p>
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-500/80 uppercase tracking-widest">
              <Sparkles className="h-3 w-3" />
              <span>AI Styling Enabled Applet</span>
            </div>
          </div>

          {/* Quick Links Grid */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-mono text-xs tracking-widest text-white uppercase">The Brand</h3>
                <ul className="mt-6 space-y-4 text-sm">
                  <li>
                    <button onClick={() => navigateTo('home')} className="hover:text-amber-500 transition-colors">Our Story</button>
                  </li>
                  <li>
                    <button onClick={() => navigateTo('shop')} className="hover:text-amber-500 transition-colors">The Collection</button>
                  </li>
                  <li>
                    <button onClick={() => navigateTo('stylist')} className="flex items-center space-x-1 hover:text-amber-500 transition-colors text-amber-500/90 font-medium">
                      <span>AI Personal Stylist</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-mono text-xs tracking-widest text-white uppercase">Gentlemen Support</h3>
                <ul className="mt-6 space-y-4 text-sm">
                  <li><span className="text-neutral-500">Delivery & Returns</span></li>
                  <li><span className="text-neutral-500">Sizing Consult</span></li>
                  <li><span className="text-neutral-500">Privé Corporate</span></li>
                </ul>
              </div>
            </div>

            {/* Newsletter section */}
            <div className="space-y-4">
              <h3 className="font-mono text-xs tracking-widest text-white uppercase">The Dispatch Newsletter</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Receive invitations to private seasonal drops, runway collections, and personalized style reviews.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex max-w-sm flex-col space-y-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="rounded-md border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-md bg-neutral-900 border border-neutral-800 tracking-wider font-semibold py-2.5 text-[10px] uppercase text-amber-500 transition-colors hover:bg-amber-500 hover:text-black hover:border-amber-500"
                >
                  Join The Inner Circle
                </button>
              </form>
            </div>

          </div>
        </div>

        <div className="mt-16 border-t border-neutral-900 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-600 font-mono">
          <p>© 2026 The Gentlemen Fashion. All sartorial rights reserved.</p>
          <p className="mt-2 md:mt-0 uppercase tracking-widest text-neutral-700">Design by Google AI Studio</p>
        </div>
      </div>
    </footer>
  );
};
