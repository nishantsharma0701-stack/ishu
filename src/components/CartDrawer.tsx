import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { cartOpen, setCartOpen, cart, products, updateCartQuantity, removeFromCart, navigateTo } = useApp();

  if (!cartOpen) return null;

  const cartWithProducts = cart.map(item => {
    const prod = products.find(p => p.id === item.productId);
    return {
      ...item,
      productDetail: prod
    };
  }).filter(x => x.productDetail !== undefined);

  const subtotal = cartWithProducts.reduce((sum, item) => {
    return sum + ((item.productDetail?.price || 0) * item.quantity);
  }, 0);

  const handleCheckoutClick = () => {
    setCartOpen(false);
    navigateTo('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Light Backdrop filter overlay */}
      <div 
        onClick={() => setCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
      />

      <div className="absolute inset-y-0 right-0 max-w-full pl-10 flex">
        <div className="w-screen max-w-md bg-neutral-950 border-l border-neutral-900 flex flex-col shadow-2xl animate-slide-in">
          
          {/* Header section */}
          <div className="h-20 flex items-center justify-between border-b border-neutral-900 bg-black px-6">
            <div className="flex items-center space-x-2.5">
              <ShoppingCart className="h-4.5 w-4.5 text-amber-500" />
              <span className="font-sans text-sm font-semibold tracking-wide text-white uppercase col-span-1">Shopping Basket Ledger</span>
            </div>
            <button 
              onClick={() => setCartOpen(false)}
              className="rounded-full p-2 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 scrollbar-thin scrollbar-thumb-neutral-900">
            {cartWithProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                <ShoppingCart className="h-8 w-8 text-neutral-800 animate-pulse" />
                <span className="block font-mono text-[10px] uppercase text-neutral-500 tracking-widest font-semibold">Basket ledger is vacant</span>
                <p className="text-xs text-neutral-600 max-w-xs font-light leading-relaxed">Let our AI personalized styling recommendations bundle your flawless bespoke collection items.</p>
                <button
                  onClick={() => {
                    setCartOpen(false);
                    navigateTo('shop');
                  }}
                  className="rounded border border-neutral-850 px-4 py-2 text-[9px] font-mono tracking-widest text-amber-500 hover:border-amber-500 uppercase transition-colors"
                >
                  Inspect Collection
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartWithProducts.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex bg-neutral-950 p-4 border border-neutral-900 rounded-lg space-x-4 items-start"
                  >
                    <img 
                      src={item.productDetail?.image} 
                      alt="" 
                      className="h-14 w-14 rounded object-cover border border-neutral-900" 
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <span className="font-sans text-xs font-bold text-white uppercase tracking-wide truncate max-w-[150px]">{item.productDetail?.name}</span>
                        <span className="font-mono text-xs text-amber-500">₹{((item.productDetail?.price || 0) * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                      
                      <span className="block font-mono text-[9px] text-neutral-500 uppercase tracking-widest capitalize mt-1">Size {item.selectedSize} / {item.selectedColor}</span>
                      
                      {/* Active counter controls row */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-1 border border-neutral-900 rounded bg-black">
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.selectedColor, item.selectedSize, item.quantity - 1)}
                            className="p-1 text-neutral-500 hover:text-white transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-mono text-xs px-2.5 text-neutral-300">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.selectedColor, item.selectedSize, item.quantity + 1)}
                            className="p-1 text-neutral-500 hover:text-white transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.productId, item.selectedColor, item.selectedSize)}
                          className="text-neutral-600 hover:text-red-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer action checkout ledger cost breakdown summaries */}
          {cartWithProducts.length > 0 && (
            <div className="border-t border-neutral-900 bg-black min-h-[220px] p-6 space-y-4">
              <div className="space-y-2.5 font-mono text-xs border-b border-neutral-900 pb-4">
                <div className="flex justify-between text-neutral-550">
                  <span>Gross Value:</span>
                  <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-neutral-550">
                  <span>Couture Dispatch:</span>
                  <span className={subtotal > 15000 ? "text-green-500" : "text-white"}>
                    {subtotal > 15000 ? "Complimentary" : "₹500"}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-neutral-905">
                  <span className="text-white font-sans uppercase">Aesthetic Subtotal:</span>
                  <span className="text-amber-500">₹{(subtotal + (subtotal > 15000 ? 0 : 500)).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="group w-full rounded bg-white hover:bg-amber-500 hover:text-black py-4 text-xs font-bold tracking-widest text-black transition-colors uppercase flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
