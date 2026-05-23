import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Heart, Clipboard, Trash2, ArrowUpRight, Sparkles, User, Package, Calendar } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { 
    user, 
    orders, 
    wishlist, 
    recommendations, 
    deleteSavedRecommendation, 
    navigateTo, 
    fetchOrderHistory, 
    fetchSavedRecommendations, 
    token 
  } = useApp();

  // Load user data on startup
  useEffect(() => {
    if (token) {
      fetchOrderHistory();
      fetchSavedRecommendations();
    }
  }, [token]);

  if (!user) {
    return (
      <div className="bg-black py-20 text-white min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center border border-neutral-900 bg-neutral-950 p-10 rounded-xl">
          <User className="h-8 w-8 text-neutral-800 mx-auto mb-4 animate-bounce" />
          <span className="block font-mono text-xs text-amber-500 uppercase">Registered Session Required</span>
          <p className="mt-2 text-xs text-neutral-500 font-light leading-relaxed">
            Please log in or sign up to view your private tailoring profile, track shipping dispatches, and consult your custom saved AI looks.
          </p>
          <button
            onClick={() => navigateTo('auth')}
            className="mt-6 rounded bg-white py-3 font-mono text-[10px] tracking-widest text-black font-semibold uppercase w-full hover:bg-amber-500 transition-colors"
          >
            Access Gateway Sign in
          </button>
        </div>
      </div>
    );
  }

  const handleInspectLook = (rec: any) => {
    // Inject selected rec into state and navigate to panel
    navigateTo('stylist');
  };

  return (
    <div className="bg-black py-12 text-white min-h-[85vh]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        
        {/* User profile banner header view */}
        <div className="rounded-xl border border-neutral-900 bg-gradient-to-tr from-neutral-950 via-neutral-950/40 to-neutral-950 p-6 sm:p-10 mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 overflow-hidden rounded-full border border-neutral-800 bg-neutral-900">
              <img src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} alt="" className="h-full w-full object-cover" />
            </div>
            <div>
              <span className="block font-sans text-xl font-extrabold uppercase tracking-wide text-white">{user.username}</span>
              <span className="block font-mono text-[9px] text-amber-500 leading-none mt-1">{user.email}</span>
              <span className="block text-[10px] text-neutral-500 mt-1 font-light italic">Member since May 2026</span>
            </div>
          </div>
          
          <div className="flex space-x-4 text-center">
            <div className="border border-neutral-900 bg-black/40 rounded-lg px-4 py-2">
              <span className="block text-xl font-bold font-mono text-white">{orders.length}</span>
              <span className="block text-[8px] font-mono text-neutral-500 uppercase tracking-widest">Orders</span>
            </div>
            <div className="border border-neutral-900 bg-black/40 rounded-lg px-4 py-2">
              <span className="block text-xl font-bold font-mono text-white">{recommendations.length}</span>
              <span className="block text-[8px] font-mono text-neutral-500 uppercase tracking-widest">Saved Looks</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* COLUMN 1 & 2: Orders ledger logging timeline (Left side span-2) */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-amber-500 uppercase tracking-widest border-b border-neutral-950 pb-3 mb-6">
                <Package className="h-4 w-4" />
                <h2 className="text-white font-sans text-md font-bold tracking-wider uppercase">Your Tailoring Orders Ledger</h2>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 border border-neutral-900 rounded-xl bg-neutral-950/40 p-6">
                  <span className="block text-xl font-mono text-amber-500 mb-2">∅</span>
                  <span className="block text-xs font-mono text-neutral-500 uppercase font-semibold">Orders timeline is empty</span>
                  <p className="text-[11px] text-neutral-600 mt-1 font-light">Place your first luxury checkout order to track dispatches.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => {
                    const dateStr = new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                    return (
                      <div key={order.id} className="rounded-xl border border-neutral-900 bg-neutral-950 p-6 space-y-4">
                        
                        {/* Order info metrics */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-905 pb-3 font-mono text-[10px] text-neutral-500 font-semibold">
                          <div>
                            <span>ORDER NO: </span>
                            <span className="text-white uppercase font-bold">{order.id}</span>
                          </div>
                          <div>
                            <span>DRAFTED: </span>
                            <span className="text-neutral-401">{dateStr}</span>
                          </div>
                          <div>
                            <span>STATUS: </span>
                            <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                              order.status === 'Processing' ? 'bg-amber-500/10 text-amber-500' :
                              order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-500' :
                              order.status === 'Cancelled' ? 'bg-red-500/10 text-red-500' :
                              'bg-green-500/10 text-green-500' // Delivered
                            }`}>{order.status}</span>
                          </div>
                        </div>

                        {/* Items in order listed */}
                        <div className="grid grid-cols-1 gap-4 py-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between space-x-4">
                              <div className="flex items-center space-x-3 text-xs">
                                <img src={item.image} alt="" className="h-9 w-9 rounded object-cover" />
                                <div>
                                  <span className="font-sans font-bold text-white uppercase tracking-wide">{item.name}</span>
                                  <span className="block text-[10px] text-neutral-500 font-mono mt-0.5 capitalize">{item.selectedSize} Fit / {item.selectedColor}</span>
                                </div>
                              </div>
                              <span className="font-mono text-xs text-neutral-400">Qty {item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {/* Address specs details summaries */}
                        <div className="border-t border-neutral-905 pt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="text-[10px] text-neutral-500 font-sans leading-relaxed max-w-sm">
                            <span className="block text-neutral-600 font-mono text-[8px] uppercase tracking-widest mb-0.5">Shipping Destination</span>
                            <span>{order.shippingAddress.fullName} – {order.shippingAddress.addressLine1}, {order.shippingAddress.city} ({order.shippingAddress.zip})</span>
                          </div>

                          <div className="font-mono text-xs text-right text-amber-500">
                            <span className="text-neutral-600 block text-[9px] uppercase tracking-widest mb-0.5">Total Transfer</span>
                            <span className="font-bold">₹{order.total.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 3: Saved Looks / Recommendations list & Wishlists (Right side sidebar) */}
          <div className="space-y-8 col-span-1">
            
            {/* SAVED AI LOOKS CONTAINER */}
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-amber-550 uppercase tracking-widest border-b border-neutral-950 pb-3 mb-4">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <h3 className="text-white font-sans text-sm font-bold tracking-wider uppercase">Saved AI Looks</h3>
              </div>

              {recommendations.length === 0 ? (
                <div className="text-center py-10 border border-neutral-900 rounded-xl bg-neutral-950/40 p-4">
                  <span className="block text-xs font-mono text-neutral-600 uppercase">Lookbook archiving is empty</span>
                  <p className="text-[10px] text-neutral-600 mt-1 font-light leading-relaxed">Let Gemini curate tailored fits for your body height and weights inside Stylist.</p>
                  <button
                    onClick={() => navigateTo('stylist')}
                    className="mt-4 inline-flex items-center space-x-1.5 py-1.5 px-3 border border-neutral-850 rounded text-[9px] font-mono text-amber-500 uppercase hover:text-white"
                  >
                    <span>Consult stylist quiz</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="rounded-lg border border-neutral-905 bg-neutral-950 p-4 relative group flex flex-col justify-between hover:border-amber-500/20 transition-all duration-300">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-[8px] text-amber-500 uppercase tracking-widest bg-amber-500/5 border border-amber-500/10 rounded px-2 py-0.5 font-bold">{rec.styleCategory}</span>
                          <button
                            onClick={() => deleteSavedRecommendation(rec.id)}
                            className="text-neutral-600 hover:text-red-500 transition-colors p-1"
                            title="Remove lookbook reference"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider line-clamp-1">{rec.outfitName}</h4>
                        <p className="text-[10px] text-neutral-500 font-light mt-1.5 line-clamp-2 leading-relaxed italic">{rec.detailedStylingExplanation}</p>
                      </div>

                      <button
                        onClick={() => handleInspectLook(rec)}
                        className="mt-4 flex w-full items-center justify-center space-x-1 border border-neutral-900 bg-neutral-950 rounded py-2 text-[9px] font-mono tracking-widest text-amber-500 font-bold uppercase hover:bg-amber-500 hover:text-black transition-colors"
                      >
                        <span>Inspect Look specs</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* WISHLIST SUMMARY DISPLAY */}
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-amber-550 uppercase tracking-widest border-b border-neutral-950 pb-3 mb-4">
                <Heart className="h-4 w-4 text-amber-500 fill-amber-500" />
                <h3 className="text-white font-sans text-sm font-bold tracking-wider uppercase">Wishlist ledger</h3>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-10 border border-neutral-900 rounded-xl bg-neutral-950/40 p-4">
                  <span className="block text-xs font-mono text-neutral-600 uppercase">Wishlist is empty</span>
                  <p className="text-[10px] text-neutral-600 mt-1 font-light leading-relaxed">Save coats, trousers and Chelsea boots directly from the shop grid cards.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {wishlist.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => navigateTo('shop', item.id)}
                      className="flex items-center justify-between space-x-3.5 bg-neutral-955 p-2 rounded-lg border border-neutral-905 cursor-pointer hover:border-neutral-800 transition-colors"
                    >
                      <div className="flex items-center space-x-2.5">
                        <img src={item.image} alt="" className="h-8 w-8 rounded object-cover" />
                        <div className="leading-tight text-[11px]">
                          <span className="block text-white truncate max-w-[120px] font-medium uppercase tracking-wide">{item.name}</span>
                          <span className="block text-amber-500 font-mono text-[10px] mt-0.5">₹{item.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <ArrowUpRight className="h-3.5 w-3.5 text-neutral-600" />
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
