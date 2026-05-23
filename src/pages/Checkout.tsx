import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ShoppingBag, X, Plus, Minus, Tag, Truck, CreditCard, CheckCircle2, MapPin } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { 
    cart, 
    products, 
    updateCartQuantity, 
    removeFromCart, 
    checkout, 
    navigateTo, 
    user 
  } = useApp();

  // Coupon billing states
  const [coupon, setCoupon] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string>('');

  // Shipping Address Form states
  const [fullName, setFullName] = useState<string>(user?.username || 'John Doe');
  const [phone, setPhone] = useState<string>('9876543210');
  const [addressLine1, setAddressLine1] = useState<string>('74 Savile Row, Mayfair Suite');
  const [addressLine2, setAddressLine2] = useState<string>('Apt 4B, Sector 5');
  const [city, setCity] = useState<string>('Mumbai');
  const [stateName, setStateName] = useState<string>('Maharashtra');
  const [zip, setZip] = useState<string>('400001');

  // Order status
  const [placing, setPlacing] = useState<boolean>(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  // Cart elements match
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

  const finalSubtotal = Math.max(0, subtotal - discountAmount);
  const estimatedTax = Math.floor(finalSubtotal * 0.12); // 12% GST
  const shippingFee = subtotal > 15000 ? 0 : 500; // Free above ₹15k
  const grandTotal = finalSubtotal + estimatedTax + shippingFee;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = coupon.trim().toUpperCase();
    
    if (code === 'GENTLEMEN20') {
      const disc = Math.floor(subtotal * 0.20);
      setDiscountAmount(disc);
      setAppliedCoupon('GENTLEMEN20 (20%)');
      setCoupon('');
    } else if (code === 'LUXURY10') {
      const disc = Math.floor(subtotal * 0.10);
      setDiscountAmount(disc);
      setAppliedCoupon('LUXURY10 (10%)');
      setCoupon('');
    } else {
      setCouponError('This luxurious dispatch code is invalid.');
    }
  };

  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || placing) return;

    setPlacing(true);
    const shippingAddress = {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state: stateName,
      zip
    };

    const order = await checkout(shippingAddress, appliedCoupon || undefined, discountAmount);
    setPlacing(false);
    if (order) {
      setCreatedOrder(order);
    }
  };

  if (createdOrder) {
    return (
      <div className="bg-black py-20 text-white min-h-[85vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 text-center border border-neutral-900 bg-neutral-950 p-10 rounded-xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-40 w-40 items-center justify-between rounded-full bg-amber-500/5 filter blur-2xl" />
          
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-500 mb-6 border border-green-500/20">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <span className="block font-mono text-[9px] text-amber-500 uppercase tracking-widest leading-none mb-1">Dispatch confirmed</span>
          <h1 className="font-sans text-2xl font-extrabold uppercase tracking-wide">Thank You, Gentleman</h1>
          
          <p className="mt-4 text-xs text-neutral-400 leading-relaxed font-light">
            Your tailoring order has been recorded into our archives. Our dispatch team is currently boxing your premium selections.
          </p>

          <div className="my-6 border-y border-neutral-900 py-4 font-mono text-[10px] text-neutral-500 text-left space-y-2">
            <div className="flex justify-between">
              <span>ORDER ID:</span>
              <span className="text-white font-bold">{createdOrder.id}</span>
            </div>
            <div className="flex justify-between">
              <span>REFERENCE STATUS:</span>
              <span className="text-amber-500 font-bold">{createdOrder.status}</span>
            </div>
            <div className="flex justify-between">
              <span>TOTAL AMT:</span>
              <span className="text-white">₹{createdOrder.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={() => navigateTo('dashboard')}
            className="w-full rounded bg-white hover:bg-amber-500 hover:text-black py-3.5 text-xs font-bold tracking-widest text-black uppercase transition-colors"
          >
            Track in dashboard ledger
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black py-12 text-white min-h-[85vh]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        
        {/* Header banner info */}
        <div className="border-b border-neutral-900 pb-8 text-center md:text-left mb-10">
          <span className="font-mono text-xs tracking-[0.3em] text-amber-500 uppercase font-bold">Transfer & Checkout</span>
          <h1 className="mt-2 font-sans text-3xl font-extrabold tracking-tight sm:text-4xl uppercase">SARTORIAL CHECKOUT</h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 border border-neutral-900 rounded-xl bg-neutral-950/20 max-w-md mx-auto p-8">
            <ShoppingBag className="h-8 w-8 text-neutral-800 mx-auto mb-4" />
            <span className="block font-mono text-xs text-amber-500 uppercase">Shopping basket is empty</span>
            <p className="mt-2 text-xs text-neutral-500 font-light leading-relaxed">Browse the showroom catalogs or consult our AI stylist to select premium shirts and coats.</p>
            <button
              onClick={() => navigateTo('shop')}
              className="mt-6 rounded bg-white font-mono text-[10px] tracking-widest py-3 text-black font-bold uppercase w-full hover:bg-amber-500 transition-colors"
            >
              Browse collection showroom
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* 1. Left Column: Billing Address Input and Checkout Forms */}
            <form onSubmit={handleSubmission} className="lg:col-span-8 space-y-8">
              
              {/* Shipping parameters cards */}
              <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-6 sm:p-8 space-y-6">
                <div className="flex items-center space-x-2 text-xs font-mono text-amber-305 uppercase tracking-widest border-b border-neutral-900 pb-4">
                  <MapPin className="h-4 w-4 text-amber-500" />
                  <span className="text-white">Shipping Dispatch Coordinates</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">Full Noble Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded border border-neutral-850 bg-black py-2.5 px-3.5 text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">Direct Secure Phone</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded border border-neutral-850 bg-black py-2.5 px-3.5 text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">Delivery Address Line 1</label>
                    <input
                      type="text"
                      required
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="Street address, P.O. box, company name"
                      className="w-full rounded border border-neutral-850 bg-black py-2.5 px-3.5 text-xs text-white placeholder-neutral-750 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">Delivery Address Line 2</label>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Apartment, suite, unit, building, floor"
                      className="w-full rounded border border-neutral-850 bg-black py-2.5 px-3.5 text-xs text-white placeholder-neutral-750 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">City Region</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded border border-neutral-850 bg-black py-2.5 px-3.5 text-xs text-white placeholder-neutral-750 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">State / Province</label>
                      <input
                        type="text"
                        required
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-full rounded border border-neutral-850 bg-black py-2.5 px-2.5 text-xs text-white placeholder-neutral-750 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">Postal Code (ZIP)</label>
                      <input
                        type="text"
                        required
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className="w-full rounded border border-neutral-850 bg-black py-2.5 px-2.5 text-xs text-white placeholder-neutral-750 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Simulated credit card credentials */}
                <div className="pt-6 border-t border-neutral-900 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-3 flex items-center space-x-2 text-xs font-mono text-amber-500 uppercase tracking-widest mb-1.5 pt-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-white">Simulated Checkout Gateway</span>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">Card Cryptography Number</label>
                    <input
                      type="text"
                      disabled
                      placeholder="**** **** **** 4242 (Mock Active)"
                      className="w-full rounded border border-neutral-900 bg-neutral-900/50 py-2.5 px-3 text-xs text-neutral-600 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">Expiry Code</label>
                      <input
                        type="text"
                        disabled
                        placeholder="12/29"
                        className="w-full rounded border border-neutral-900 bg-neutral-900/50 py-2.5 px-2 text-xs text-neutral-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">CVV Pin</label>
                      <input
                        type="password"
                        disabled
                        placeholder="***"
                        className="w-full rounded border border-neutral-900 bg-neutral-900/50 py-2.5 px-2 text-xs text-neutral-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Submit trigger button */}
              <button
                type="submit"
                disabled={placing}
                className="w-full rounded-md bg-white hover:bg-amber-500 hover:text-black py-4 text-xs font-extrabold tracking-widest text-black transition-colors uppercase disabled:bg-neutral-800"
              >
                {placing ? "Authorizing Transfer transaction..." : `Submit Wardrobe dispatch (Transfer ₹${grandTotal.toLocaleString('en-IN')})`}
              </button>

            </form>

            {/* 2. Right Column: Cart items specs summary and billing review */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Order Items matching summary cards */}
              <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-6 space-y-4">
                <span className="block font-mono text-[10px] text-neutral-550 uppercase tracking-widest font-bold">In Your Basket ({cart.length})</span>
                
                <div className="space-y-4 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                  {cartWithProducts.map((item, id) => (
                    <div key={id} className="flex items-center justify-between space-x-3.5 pb-3 border-b border-neutral-900 last:border-0 last:pb-0">
                      <div className="flex items-center space-x-3">
                        <img src={item.productDetail?.image} alt="" className="h-10 w-10 rounded object-cover" />
                        <div className="leading-tight text-xs">
                          <span className="block text-white truncate max-w-[120px] font-medium uppercase tracking-wide">{item.productDetail?.name}</span>
                          <span className="block text-[10px] text-neutral-500 font-mono mt-0.5 capitalize">{item.selectedSize} / {item.selectedColor}</span>
                        </div>
                      </div>

                      <div className="text-right font-mono text-xs">
                        <span className="block text-white">Qty {item.quantity}</span>
                        <span className="block text-amber-500 mt-0.5">₹{(item.productDetail?.price || 0) * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon codes appliers */}
              <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-6 space-y-3.5">
                <span className="block font-mono text-[10px] text-neutral-550 uppercase tracking-widest font-bold">Apply dispatch codes</span>
                
                <form onSubmit={handleApplyCoupon} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={coupon}
                    placeholder="GENTLEMEN20, LUXURY10"
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1 rounded border border-neutral-850 bg-black px-3.5 py-2 text-xs text-white placeholder-neutral-600 uppercase focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-850 p-2 text-xs text-amber-500 uppercase tracking-widest"
                  >
                    Apply
                  </button>
                </form>

                {couponError && <span className="block text-[10px] text-red-500 font-mono">{couponError}</span>}
                {appliedCoupon && (
                  <div className="flex items-center justify-between text-[11px] font-mono bg-green-500/10 text-green-500 rounded p-2 border border-green-500/20">
                    <span>Applied code:</span>
                    <span className="font-bold uppercase">{appliedCoupon}</span>
                  </div>
                )}
              </div>

              {/* Cost ledger receipt summary */}
              <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-6 space-y-3 font-mono text-xs text-neutral-401">
                <span className="block font-mono text-[10px] text-neutral-550 uppercase tracking-widest font-bold mb-1">Receipt ledger</span>
                
                <div className="flex justify-between">
                  <span>Cart Items Value:</span>
                  <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Campaign Discount:</span>
                    <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Couture Tax (12% GST):</span>
                  <span className="text-white">₹{estimatedTax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Priority Courier Fee:</span>
                  <span className={shippingFee === 0 ? "text-green-500" : "text-white"}>
                    {shippingFee === 0 ? "Complimentary" : `₹${shippingFee}`}
                  </span>
                </div>

                <div className="border-t border-neutral-900 pt-3.5 flex justify-between text-sm font-bold">
                  <span className="text-white">Total Cost Amount:</span>
                  <span className="text-amber-500">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
