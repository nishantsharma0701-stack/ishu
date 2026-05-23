import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Shield, Plus, TrendingUp, AlertTriangle, Package, DollarSign, Activity } from 'lucide-react';

export const Admin: React.FC = () => {
  const { user, token, navigateTo, products, fetchProducts } = useApp();
  
  // Admin Data states
  const [adminOrders, setAdminOrders] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({
    totalRevenue: 0,
    salesCount: 0,
    pendingCount: 0,
    shippedCount: 0,
    deliveredCount: 0,
    cancelledCount: 0,
    lowStockCount: 0
  });
  const [loadingAdminData, setLoadingAdminData] = useState<boolean>(true);

  // Form Adding states
  const [newProductName, setNewProductName] = useState<string>('');
  const [newProductBrand, setNewProductBrand] = useState<string>('The Gentlemen Private');
  const [newProductCategory, setNewProductCategory] = useState<string>('Shirts');
  const [newProductPrice, setNewProductPrice] = useState<string>('4500');
  const [newProductImage, setNewProductImage] = useState<string>('https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400');
  const [newProductDescription, setNewProductDescription] = useState<string>('A fine luxury weave engineered for optimal shoulder drops.');
  const [newProductStock, setNewProductStock] = useState<string>('12');
  const [newProductStyle, setNewProductStyle] = useState<string>('Old Money');

  const [formSuccess, setFormSuccess] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  const loadAdminMetrics = async () => {
    if (!token) return;
    setLoadingAdminData(true);
    try {
      const response = await fetch('/api/orders/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAdminOrders(data.orders || []);
        if (data.analytics) {
          setAnalytics(data.analytics);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAdminData(false);
    }
  };

  useEffect(() => {
    if (user && user.isAdmin) {
      loadAdminMetrics();
    }
  }, [user]);

  if (!user || !user.isAdmin) {
    return (
      <div className="bg-black py-20 text-white min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center border border-neutral-900 bg-neutral-950 p-10 rounded-xl">
          <Shield className="h-8 w-8 text-neutral-800 mx-auto mb-4 animate-pulse" />
          <span className="block font-mono text-xs text-red-500 uppercase">Privileged Session Denied</span>
          <p className="mt-2 text-xs text-neutral-500 font-light leading-relaxed">
            You do not possess Admin tokens. Authentic admin rights are restricted only to specific developer credentials like sharmaanjana2352@gmail.com.
          </p>
          <button
            onClick={() => navigateTo('home')}
            className="mt-6 rounded border border-neutral-850 py-3 font-mono text-[10px] tracking-widest text-amber-550 uppercase w-full hover:bg-neutral-900 transition-colors"
          >
            Return to showroom
          </button>
        </div>
      </div>
    );
  }

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/admin/status/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        loadAdminMetrics(); // reload log matrices
      }
    } catch (err) {
      console.error("Failed status updates:", err);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!newProductName || !newProductPrice || !newProductImage) {
      setFormError("Product name, price, and picture catalog coordinates are required.");
      return;
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newProductName,
          brand: newProductBrand,
          category: newProductCategory,
          price: Number(newProductPrice),
          image: newProductImage,
          description: newProductDescription,
          stock: Number(newProductStock),
          style: newProductStyle,
          colors: ["Sand Cream", "Midnight Navy", "Black"],
          sizes: ["M", "L", "XL"]
        })
      });

      if (response.ok) {
        setFormSuccess(true);
        setNewProductName('');
        fetchProducts(); // sync products catalog
        loadAdminMetrics(); // refresh analytics
      } else {
        const data = await response.json();
        setFormError(data.message || "Failed adding product.");
      }
    } catch (err) {
      setFormError("Service exception.");
    }
  };

  const lowStockCollection = products.filter(p => p.stock <= 5);

  return (
    <div className="bg-black py-12 text-white min-h-[85vh]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        
        {/* Page Header */}
        <div className="border-b border-neutral-900 pb-8 text-center md:text-left mb-10 flex items-center justify-between">
          <div>
            <span className="font-mono text-xs tracking-[0.3em] text-amber-500 uppercase font-bold">Admin Curation Console</span>
            <h1 className="mt-2 font-sans text-3xl font-extrabold tracking-tight sm:text-4xl uppercase">ATELIER COMMAND</h1>
          </div>
          <span className="font-mono text-[9px] text-green-500 uppercase px-3 py-1 bg-green-500/10 rounded border border-green-500/20 font-bold">Privileged Active</span>
        </div>

        {/* 1. ANALYTICS GRID CARDS */}
        {loadingAdminData ? (
          <div className="text-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border border-neutral-800 border-t-amber-500 mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-5 font-mono">
              <span className="text-neutral-500 text-[8px] uppercase tracking-widest font-bold block mb-1">Gross Billing Volume</span>
              <span className="text-xl font-bold font-sans text-amber-500">₹{analytics.totalRevenue.toLocaleString('en-IN')}</span>
              <DollarSign className="h-4 w-4 text-neutral-800 mt-2 block" />
            </div>
            <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-5 font-mono">
              <span className="text-neutral-500 text-[8px] uppercase tracking-widest font-bold block mb-1">Orders Counted</span>
              <span className="text-xl font-bold font-sans text-white">{analytics.salesCount}</span>
              <Package className="h-4 w-4 text-neutral-800 mt-2 block" />
            </div>
            <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-5 font-mono">
              <span className="text-neutral-500 text-[8px] uppercase tracking-widest font-bold block mb-1">Processing Dispatches</span>
              <span className="text-xl font-bold font-sans text-amber-500">{analytics.pendingCount}</span>
              <Activity className="h-4 w-4 text-neutral-800 mt-2 block" />
            </div>
            <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-5 font-mono">
              <span className="text-neutral-500 text-[8px] uppercase tracking-widest font-bold block mb-1">Stock Reminders</span>
              <span className={`text-xl font-bold font-sans ${lowStockCollection.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {lowStockCollection.length} Low
              </span>
              <AlertTriangle className="h-4 w-4 text-neutral-800 mt-2 block" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* 2. ORDER LISTING TIMELINE (Left side Span-7) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-semibold pb-2 border-b border-neutral-950">Active dispatches lifecycle ({adminOrders.length})</h3>
            
            {loadingAdminData ? (
              <div className="text-center py-10 text-neutral-605">Loading dispatches logs...</div>
            ) : adminOrders.length === 0 ? (
              <div className="text-center py-12 bg-neutral-950/20 rounded border border-neutral-900 text-neutral-600 font-mono text-xs">No customer orders active in state database.</div>
            ) : (
              <div className="space-y-4">
                {adminOrders.map((order) => (
                  <div key={order.id} className="rounded-xl border border-neutral-900 bg-neutral-950 p-5 space-y-4 text-xs font-mono">
                    <div className="flex justify-between items-center text-[10px] font-semibold text-neutral-500">
                      <div>
                        <span>ORDER ID: </span>
                        <span className="text-white font-bold uppercase">{order.id}</span>
                      </div>
                      <span className="text-white">₹{order.total.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="text-[11px] font-sans text-neutral-400 space-y-1 py-1.5 border-y border-neutral-905">
                      {order.items.map((item: any, id: number) => (
                        <div key={id} className="flex justify-between text-[11px]">
                          <span className="uppercase text-white truncate max-w-[160px] font-medium">{item.name} ({item.selectedSize})</span>
                          <span className="font-mono text-neutral-500">Qty {item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Controls dropdown to update dispatch status on-the-fly */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="leading-tight">
                        <span className="block text-[8px] text-neutral-605 uppercase font-medium">Customer:</span>
                        <span className="block text-[11px] font-sans text-white font-medium mt-0.5">{order.shippingAddress.fullName}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] text-neutral-500">Lifecycle:</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="rounded bg-neutral-900 border border-neutral-800 text-[10px] text-amber-500 py-1.5 px-2 focus:outline-none focus:border-amber-500"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. ADD NEW PRODUCT FORM (Right side Span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-semibold pb-2 border-b border-neutral-950">Add new showroom item</h3>
            
            <form onSubmit={handleAddProduct} className="rounded-xl border border-neutral-900 bg-neutral-950 p-6 space-y-4">
              
              <div>
                <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">Design name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broadcloth Silk Blazer"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full rounded border border-neutral-850 bg-black py-2.5 px-3.5 text-xs text-white placeholder-neutral-750 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">Brand authority</label>
                  <input
                    type="text"
                    required
                    value={newProductBrand}
                    onChange={(e) => setNewProductBrand(e.target.value)}
                    className="w-full rounded border border-neutral-850 bg-black py-2.5 px-3 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">Retail Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full rounded border border-neutral-850 bg-black py-2.5 px-3 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">Store Category</label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    className="w-full rounded border border-neutral-850 bg-black p-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Suits">Suits</option>
                    <option value="Shirts">Shirts</option>
                    <option value="T-shirts & Hoodies">T-shirts & Hoodies</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Pants & Cargos">Pants & Cargos</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">Fashion style</label>
                  <select
                    value={newProductStyle}
                    onChange={(e) => setNewProductStyle(e.target.value)}
                    className="w-full rounded border border-neutral-850 bg-black p-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Old Money">Old Money</option>
                    <option value="Minimal">Minimal</option>
                    <option value="Streetwear">Streetwear</option>
                    <option value="Casual">Casual</option>
                    <option value="Formal">Formal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">Starting Stock</label>
                  <input
                    type="number"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(e.target.value)}
                    className="w-full rounded border border-neutral-850 bg-black py-2.5 px-3 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">Composition weave</label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Merino wool"
                    value={newProductDescription}
                    onChange={(e) => setNewProductDescription(e.target.value)}
                    className="w-full rounded border border-neutral-850 bg-black py-2.5 px-3 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">Image URL catalog coordinate</label>
                <input
                  type="text"
                  required
                  value={newProductImage}
                  onChange={(e) => setNewProductImage(e.target.value)}
                  className="w-full rounded border border-neutral-850 bg-black py-2.5 px-3.5 text-xs text-white"
                />
              </div>

              {formSuccess && (
                <div className="text-xs text-green-500 bg-green-500/10 p-3 rounded">
                  New silhouette logged into database showroom.
                </div>
              )}

              {formError && (
                <div className="text-xs text-red-500 bg-red-400/10 p-3 rounded font-mono">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded bg-white hover:bg-amber-500 hover:text-black py-3 text-xs font-bold tracking-widest text-black uppercase transition-colors"
              >
                Assemble and Log product
              </button>

            </form>

            {/* Critical Low Stock Alerter panel */}
            {lowStockCollection.length > 0 && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-mono text-red-500 uppercase tracking-widest">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Low Inventory Alerts</span>
                </div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {lowStockCollection.map(p => (
                    <div key={p.id} className="flex justify-between text-xs text-neutral-400">
                      <span className="truncate max-w-[150px] font-sans">{p.name}</span>
                      <span className="font-mono text-red-500 font-bold">{p.stock} units remaining</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
