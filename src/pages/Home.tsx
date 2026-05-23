import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import { Sparkles, ArrowRight, Star, ShoppingBag, ArrowUpRight, Award, MessageSquare } from 'lucide-react';

export const Home: React.FC = () => {
  const { products, navigateTo } = useApp();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [celebrityLooks, setCelebrityLooks] = useState<any[]>([]);

  // Seed default backup products inside frontend if fetch fails
  const newArrivals = products.filter(p => p.isNewArrival || p.id === 'p3' || p.id === 'p5' || p.id === 'p9').slice(0, 4);
  const bestSellers = products.filter(p => p.isBestSeller || p.id === 'p1' || p.id === 'p2' || p.id === 'p11').slice(0, 4);

  useEffect(() => {
    // Load accessory items
    fetch('/api/blog').then(r => r.json()).then(d => setBlogs(d.blogs || []))
      .catch(() => {});
    fetch('/api/celebrity-looks').then(r => r.json()).then(d => setCelebrityLooks(d.looks || []))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-black text-white">
      
      {/* 1. LUXURY ANIMATED HERO SECTION */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-neutral-900/60 via-black to-black">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=1600" 
            alt="Cinematic background" 
            className="h-full w-full object-cover filter brightness-50 contrast-115 grayscale-[20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center sm:px-8">
          <div className="mb-4 inline-flex items-center space-x-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-amber-300">
              Sartorial AI Personal Stylist Live
            </span>
          </div>

          <h1 className="font-sans text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
            <span className="block text-neutral-300 font-light italic text-2xl sm:text-3xl tracking-[0.2em] uppercase mb-2">The Absolute Essence Of</span>
            THE MODERN GENTLEMAN
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-md leading-relaxed text-neutral-400 font-sans font-light">
            Deconstruct tradition. Immerse yourself in an ultra-premium menswear retail experience integrated with a state-of-the-art AI Stylist configured to engineer your flawless silhouette.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={() => navigateTo('shop')}
              className="group flex w-full sm:w-auto items-center justify-center space-x-2 rounded-md bg-white px-8 py-4 text-xs font-bold tracking-widest text-black transition-all hover:bg-amber-500 uppercase shadow-lg shadow-white/5 hover:shadow-amber-500/15"
            >
              <span>Explore Collection</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigateTo('stylist')}
              className="flex w-full sm:w-auto items-center justify-center space-x-2.5 rounded-md border border-amber-500 bg-amber-500/10 px-8 py-4 text-xs font-bold tracking-widest text-amber-500 transition-all hover:bg-amber-500 hover:text-black uppercase shadow-lg shadow-amber-500/5"
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>Consult AI Stylist</span>
            </button>
          </div>
        </div>

        {/* Scroll down decorative indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center space-y-2 opacity-50">
            <span className="font-mono text-[8px] tracking-[0.3em] text-neutral-500 uppercase">Scroll To Expand</span>
            <div className="h-10 w-[1px] bg-gradient-to-b from-amber-500 to-transparent" />
          </div>
        </div>
      </section>

      {/* 2. CINEMATIC INTRO GALLERY */}
      <section className="mx-auto -mt-16 max-w-7xl px-6 sm:px-8 relative z-20">
        <div className="rounded-xl border border-neutral-900 bg-neutral-950/75 p-6 backdrop-blur-lg sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-900">
            <div className="pt-6 md:pt-0">
              <span className="block text-3xl font-bold font-mono text-amber-500">100%</span>
              <span className="block font-mono text-[9px] tracking-widest text-neutral-500 uppercase mt-2 font-semibold">Genuine Italian Sourced</span>
            </div>
            <div className="pt-6 md:pt-0">
              <span className="block text-3xl font-bold font-mono text-amber-500">Instant</span>
              <span className="block font-mono text-[9px] tracking-widest text-neutral-500 uppercase mt-2 font-semibold">Gemini Stylist Mapping</span>
            </div>
            <div className="pt-6 md:pt-0">
              <span className="block text-3xl font-bold font-mono text-amber-500">Premium</span>
              <span className="block font-mono text-[9px] tracking-widest text-neutral-500 uppercase mt-2 font-semibold">Custom Made Tailoring</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NEW ARRIVALS */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="font-mono text-xs tracking-[0.25em] text-amber-500 uppercase font-semibold">Curated Season Drop</span>
            <h2 className="mt-1 font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl">New Wardrobe Additions</h2>
          </div>
          <button 
            onClick={() => navigateTo('shop')}
            className="flex items-center space-x-1 text-sm font-mono text-neutral-400 hover:text-white transition-colors mt-4 md:mt-0 uppercase tracking-widest"
          >
            <span>See entire ledger</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 4. MIDWAY LUXURY BANNER */}
      <section className="relative px-6 py-28 sm:px-8 overflow-hidden bg-neutral-950 border-y border-neutral-900">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 hidden lg:block">
          <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=700" alt="" className="h-full w-full object-cover filter grayscale" />
        </div>
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="max-w-2xl">
            <div className="rounded border border-amber-500/20 bg-amber-500/5 px-2.5 py-1 text-[10px] font-mono tracking-widest text-amber-500 uppercase inline-block mb-4 font-semibold">
              The AI Sartorial Breakthrough
            </div>
            <h3 className="font-sans text-3xl font-extrabold sm:text-5xl leading-tight">
              An AI Personal Shopper In Your Pocket
            </h3>
            <p className="mt-4 text-sm text-neutral-400 leading-relaxed font-light">
              Skip endless catalog crawls. Our proprietary stylist agent reads your height, weight ratios, favorite tones, and event occasions to mathematically build full outfits matching color wheels and sartorial proportions.
            </p>
            <div className="mt-8">
              <button
                onClick={() => navigateTo('stylist')}
                className="rounded-md bg-amber-500 px-6 py-3.5 text-xs font-bold tracking-widest text-black hover:bg-white uppercase transition-colors"
              >
                Synthesize Outfit Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BEST SELLERS */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="font-mono text-xs tracking-[0.25em] text-amber-500 uppercase font-semibold">Acclaimed Sartorial Picks</span>
            <h2 className="mt-1 font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl">The Best Sellers</h2>
          </div>
          <button 
            onClick={() => navigateTo('shop')}
            className="flex items-center space-x-1 text-sm font-mono text-neutral-400 hover:text-white transition-colors mt-4 md:mt-0 uppercase tracking-widest"
          >
            <span>Browse entire depot</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 6. CELEBRITY INSPIRED LOOKS */}
      {celebrityLooks.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
          <div className="mb-12">
            <span className="font-mono text-xs tracking-[0.25em] text-amber-500 uppercase font-semibold">A-List Icon Dressing</span>
            <h2 className="mt-1 font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl">Celebrity Inspired Looks</h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {celebrityLooks.map((look) => (
              <div 
                key={look.id}
                className="group relative overflow-hidden rounded-xl border border-neutral-900 bg-neutral-950 p-6 flex flex-col hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="aspect-[4/5] overflow-hidden rounded bg-neutral-900 relative">
                  <img src={look.image} alt={look.celebrityName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102" />
                  <div className="absolute top-4 left-4 rounded bg-black/80 border border-neutral-800 px-2.5 py-1 font-mono text-[9px] text-amber-500 uppercase">
                    Inspired Look
                  </div>
                </div>

                <div className="mt-6 flex-1 flex flex-col">
                  <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">{look.celebrityName}</span>
                  <h3 className="font-sans text-md font-semibold text-white mt-1 group-hover:text-amber-500 transition-colors uppercase tracking-wider">{look.lookName}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-light mt-2 mb-4">{look.description}</p>
                  
                  <button
                    onClick={() => {
                      navigateTo('shop'); // leads user to catalog with matching look selections
                    }}
                    className="mt-auto inline-flex items-center space-x-1 text-xs font-mono text-amber-500 hover:text-white transition-colors uppercase tracking-widest font-semibold"
                  >
                    <span>Inspect Outfit bundle</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. HIGH-CRAFT DESIGNER TESTIMONIAL GLASS CARD */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8">
        <div className="rounded-xl border border-neutral-900 bg-gradient-to-tr from-neutral-950 via-neutral-950/40 to-neutral-950 p-8 sm:p-14 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 flex h-64 w-64 items-center justify-between rounded-full bg-amber-500/5 filter blur-3xl" />
          
          <div className="max-w-3xl relative z-10">
            <span className="font-mono text-[10px] tracking-widest text-amber-500 uppercase font-semibold">Gentlemanly Valuations</span>
            <blockquote className="mt-6 text-xl text-neutral-300 font-sans font-light leading-relaxed italic">
              "The Gentlemen Fashion represents a generational shift in how we procure premium garments. The combination of quiet-luxury textures and a highly skilled AI Stylist that actually recommends items supporting my broader physical stature is nothing short of incredible."
            </blockquote>
            <div className="mt-8 flex items-center space-x-3.5">
              <div className="h-10 w-10 overflow-hidden rounded-full border border-neutral-700 bg-neutral-900">
                <img src="https://api.dicebear.com/7.x/initials/svg?seed=Maximilian&backgroundColor=1a1a1a" alt="" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white uppercase tracking-wider">Sir Alistair Montgomery</span>
                <span className="block text-[10px] font-mono text-neutral-500 mt-0.5">Savile Row Club Affiliate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FASHION BLOG PREVIEW */}
      {blogs.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
          <div className="border-t border-neutral-950 pt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:max-w-xs">
              <span className="font-mono text-xs tracking-[0.2em] text-amber-500 uppercase font-semibold">Sartorial Literature</span>
              <h2 className="mt-1 font-sans text-3xl font-extrabold tracking-tight">The Gentlemen Edition Blog</h2>
              <p className="mt-3 text-xs text-neutral-500 leading-relaxed font-light">
                Our in-house design boards compile historical analyses, color science, and seasonal updates directly for the style-conscious gentleman.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div key={blog.id} className="group cursor-pointer">
                  <div className="aspect-[16/10] overflow-hidden rounded bg-neutral-900">
                    <img src={blog.image} alt="" className="h-full w-full object-cover filter brightness-90 group-hover:scale-103 transition-transform duration-300" />
                  </div>
                  <div className="mt-4">
                    <span className="font-mono text-[9px] tracking-wider text-amber-500 uppercase font-semibold">{blog.category}</span>
                    <h3 className="font-sans text-xs font-semibold text-white group-hover:text-amber-400 mt-1 mb-2 line-clamp-2 leading-snug uppercase tracking-wide">{blog.title}</h3>
                    <span className="font-mono text-[9px] text-neutral-500">{blog.readTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. REAL-LOOK INSTAGRAM GALLERY */}
      <section className="border-t border-neutral-900 mt-20 bg-neutral-950/30">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="font-mono text-[9px] tracking-[0.25em] text-neutral-500 uppercase font-semibold">#THEGENTLEMENWAY</span>
              <h2 className="text-lg font-bold tracking-wider uppercase text-white">Instagram Fashion Gallery</h2>
            </div>
            <span className="text-xs font-mono text-neutral-600 uppercase mt-2 md:mt-0 tracking-widest">Selected globally</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {[
              "https://images.unsplash.com/photo-1596755094514-f87e34085b2c",
              "https://images.unsplash.com/photo-1542272604-787c3835535d",
              "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99",
              "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c",
              "https://images.unsplash.com/photo-1638247025967-b4e38f787b76",
              "https://images.unsplash.com/photo-1594938298603-c8148c4dae35"
            ].map((src, i) => (
              <div key={i} className="aspect-square rounded overflow-hidden relative group bg-neutral-900">
                <img src={`${src}?auto=format&fit=crop&q=80&w=300`} alt="" className="h-full w-full object-cover filter brightness-85 transition-opacity duration-300 group-hover:opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="font-mono text-[10px] tracking-wider text-white select-none">VIEW LOOK</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
