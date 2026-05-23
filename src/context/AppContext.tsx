import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Product, CartItem, Order, OutfitRecommendation } from '../types.ts';

interface AppContextType {
  user: User | null;
  token: string | null;
  products: Product[];
  cart: CartItem[];
  wishlistIds: string[];
  wishlist: Product[];
  orders: Order[];
  recommendations: OutfitRecommendation[];
  loading: boolean;
  activeTab: string;
  selectedProductId: string | null;
  selectedRecommendation: OutfitRecommendation | null;
  cartOpen: boolean;
  chatbotOpen: boolean;
  recentProductIds: string[];
  
  // Navigation
  navigateTo: (tab: string, productId?: string | null) => void;
  setCartOpen: (open: boolean) => void;
  setChatbotOpen: (open: boolean) => void;

  // Authentication
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  googleLogin: (email: string, name?: string, avatar?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;

  // Catalog
  fetchProducts: (filters?: Record<string, string>) => Promise<void>;
  addProductReview: (productId: string, rating: number, comment: string) => Promise<any>;

  // Cart
  addToCart: (productId: string, quantity: number, color: string, size: string) => void;
  removeFromCart: (productId: string, color: string, size: string) => void;
  updateCartQuantity: (productId: string, color: string, size: string, quantity: number) => void;
  clearCart: () => void;

  // Wishlist
  toggleWishlist: (productId: string) => Promise<void>;

  // Orders
  checkout: (shippingAddress: any, couponCode?: string, discountAmount?: number) => Promise<Order | null>;
  fetchOrderHistory: () => Promise<void>;

  // AI
  getRecommendation: (preferences: any) => Promise<OutfitRecommendation | null>;
  fetchSavedRecommendations: () => Promise<void>;
  deleteSavedRecommendation: (id: string) => Promise<boolean>;
  sendChatMessage: (message: string, history: any[]) => Promise<string>;
  
  // Accessories & Admin
  addRecentProduct: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('gf_token'));
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [recommendations, setRecommendations] = useState<OutfitRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<OutfitRecommendation | null>(null);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [chatbotOpen, setChatbotOpen] = useState<boolean>(false);
  const [recentProductIds, setRecentProductIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('gf_recent');
    return saved ? JSON.parse(saved) : [];
  });

  // Base API helper with authorization header injection
  const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };
    
    const response = await fetch(endpoint, { ...options, headers });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `API error: ${response.status}`);
    }
    return response.json();
  };

  // Initial load operations
  useEffect(() => {
    const initApp = async () => {
      setLoading(true);
      try {
        // Fetch products catalog
        const prodData = await apiFetch('/api/products');
        setProducts(prodData.products || []);

        if (token) {
          // Fetch current authentic user status
          try {
            const meData = await apiFetch('/api/auth/me');
            setUser(meData.user);
            
            // Sync Cart
            const cData = await apiFetch('/api/orders/cart');
            setCart(cData.cart || []);

            // Sync Wishlist
            const wData = await apiFetch('/api/orders/wishlist');
            setWishlist(wData.wishlist || []);
            setWishlistIds(wData.productIds || []);

            // Orders
            const oData = await apiFetch('/api/orders/history');
            setOrders(oData.orders || []);

            // AI saved outfits
            const rData = await apiFetch('/api/ai/saved');
            setRecommendations(rData.recommendations || []);
          } catch (meErr) {
            console.warn("Invalid/Expired user token. Clearing session.");
            logout();
          }
        }
      } catch (e) {
        console.error("Failed to initialize app dynamic states:", e);
      } finally {
        setLoading(false);
      }
    };
    initApp();
  }, [token]);

  const navigateTo = (tab: string, productId: string | null = null) => {
    setActiveTab(tab);
    setSelectedProductId(productId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (productId) {
      addRecentProduct(productId);
    }
  };

  const addRecentProduct = (id: string) => {
    setRecentProductIds(prev => {
      const filtered = prev.filter(x => x !== id);
      const updated = [id, ...filtered].slice(0, 5); // Limit to top 5 recent products
      localStorage.setItem('gf_recent', JSON.stringify(updated));
      return updated;
    });
  };

  // Local state update helper for persistence matching
  const saveCartOnServer = async (updatedCart: CartItem[]) => {
    if (token) {
      try {
        await apiFetch('/api/orders/cart', {
          method: 'POST',
          body: JSON.stringify({ items: updatedCart })
        });
      } catch (err) {
        console.error("Failed to sync cart to backend:", err);
      }
    }
  };

  // 1. ADD to cart
  const addToCart = (productId: string, quantity: number, color: string, size: string) => {
    setCart(prev => {
      const itemIdx = prev.findIndex(item => 
        item.productId === productId && 
        item.selectedColor === color && 
        item.selectedSize === size
      );

      let newCart;
      if (itemIdx > -1) {
        newCart = [...prev];
        newCart[itemIdx].quantity += quantity;
      } else {
        newCart = [...prev, { productId, quantity, selectedColor: color, selectedSize: size }];
      }

      saveCartOnServer(newCart);
      return newCart;
    });
    setCartOpen(true);
  };

  // 2. Remove From Cart
  const removeFromCart = (productId: string, color: string, size: string) => {
    setCart(prev => {
      const newCart = prev.filter(item => 
        !(item.productId === productId && item.selectedColor === color && item.selectedSize === size)
      );
      saveCartOnServer(newCart);
      return newCart;
    });
  };

  // 3. Update Quantity
  const updateCartQuantity = (productId: string, color: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }
    setCart(prev => {
      const newCart = prev.map(item => 
        (item.productId === productId && item.selectedColor === color && item.selectedSize === size) 
          ? { ...item, quantity } 
          : item
      );
      saveCartOnServer(newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    saveCartOnServer([]);
  };

  // Wishlist toggle
  const toggleWishlist = async (productId: string) => {
    if (!token) {
      // Prompt user login
      navigateTo('auth');
      return;
    }
    try {
      const res = await apiFetch('/api/orders/wishlist/toggle', {
        method: 'POST',
        body: JSON.stringify({ productId })
      });
      setWishlist(res.wishlist || []);
      setWishlistIds(res.productIds || []);
    } catch (e) {
      console.error("Error toggling item wishlist:", e);
    }
  };

  // Auth Operations
  const login = async (email: string, password: string) => {
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      setToken(res.token);
      localStorage.setItem('gf_token', res.token);
      setUser(res.user);
      navigateTo('home');
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password })
      });
      setToken(res.token);
      localStorage.setItem('gf_token', res.token);
      setUser(res.user);
      navigateTo('home');
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const googleLogin = async (email: string, name?: string, avatar?: string) => {
    try {
      const res = await apiFetch('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify({ email, name, avatar })
      });
      setToken(res.token);
      localStorage.setItem('gf_token', res.token);
      setUser(res.user);
      navigateTo('home');
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCart([]);
    setWishlist([]);
    setWishlistIds([]);
    setOrders([]);
    setRecommendations([]);
    localStorage.removeItem('gf_token');
    navigateTo('home');
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!token) return false;
    try {
      const res = await apiFetch('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      setUser(res.user);
      return true;
    } catch (e) {
      console.error("Error updating user profile preference:", e);
      return false;
    }
  };

  // Catalog Filters
  const fetchProducts = async (filters?: Record<string, string>) => {
    setLoading(true);
    try {
      let query = '';
      if (filters) {
        query = '?' + new URLSearchParams(filters).toString();
      }
      const data = await apiFetch(`/api/products${query}`);
      setProducts(data.products || []);
    } catch (e) {
      console.error("Error fetching products:", e);
    } finally {
      setLoading(false);
    }
  };

  // Products Review
  const addProductReview = async (productId: string, rating: number, comment: string) => {
    if (!token) {
      navigateTo('auth');
      return;
    }
    try {
      const res = await apiFetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment })
      });
      // Refresh products selection
      await fetchProducts();
      return res.review;
    } catch (err) {
      console.error("Failed adding review:", err);
      throw err;
    }
  };

  // Orders creation
  const checkout = async (shippingAddress: any, couponCode?: string, discountAmount?: number) => {
    if (!token) return null;
    try {
      // Format items
      const orderItems = cart.map(item => {
        const prod = products.find(p => p.id === item.productId);
        return {
          productId: item.productId,
          name: prod?.name || "Premium Item",
          image: prod?.image || "",
          quantity: item.quantity,
          price: prod?.price || 0,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize
        };
      });

      const subtotal = cart.reduce((total, item) => {
        const prod = products.find(p => p.id === item.productId);
        return total + ((prod?.price || 0) * item.quantity);
      }, 0);

      const discount = discountAmount || 0;
      const computedTax = Math.floor((subtotal - discount) * 0.12); // 12% GST
      const shippingCost = subtotal > 15000 ? 0 : 500; // Free above ₹15k
      const grandTotal = subtotal + computedTax + shippingCost - discount;

      const res = await apiFetch('/api/orders/checkout', {
        method: 'POST',
        body: JSON.stringify({
          items: orderItems,
          subtotal,
          tax: computedTax,
          shipping: shippingCost,
          total: grandTotal,
          couponCode,
          discountAmount: discount,
          shippingAddress
        })
      });

      // Reload Orders
      await fetchOrderHistory();
      setCart([]);
      return res.order;
    } catch (err) {
      console.error("Failed to place checkout order:", err);
      return null;
    }
  };

  const fetchOrderHistory = async () => {
    if (!token) return;
    try {
      const data = await apiFetch('/api/orders/history');
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Failed loading order log history:", err);
    }
  };

  // Stylist Recommendation API Call
  const getRecommendation = async (preferences: any) => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/ai/recommend', {
        method: 'POST',
        body: JSON.stringify(preferences)
      });
      
      const rec = res.recommendation;
      setSelectedRecommendation(rec);
      
      // Update saved recs history listed
      if (token) {
        await fetchSavedRecommendations();
      }
      return rec;
    } catch (err) {
      console.error("AI Stylist error call:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedRecommendations = async () => {
    if (!token) return;
    try {
      const data = await apiFetch('/api/ai/saved');
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error("Failed loading saved stylist outfits:", err);
    }
  };

  const deleteSavedRecommendation = async (id: string) => {
    if (!token) return false;
    try {
      await apiFetch(`/api/ai/saved/${id}`, { method: 'DELETE' });
      setRecommendations(prev => prev.filter(r => r.id !== id));
      if (selectedRecommendation?.id === id) {
        setSelectedRecommendation(null);
      }
      return true;
    } catch (err) {
      console.error("Failed removing saved outfit:", err);
      return false;
    }
  };

  const sendChatMessage = async (message: string, history: any[]) => {
    try {
      const res = await apiFetch('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, chatHistory: history })
      });
      return res.text;
    } catch (err: any) {
      return "Pardon my pause. My stylist connection is temporarily full. Please try again soon.";
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      token,
      products,
      cart,
      wishlistIds,
      wishlist,
      orders,
      recommendations,
      loading,
      activeTab,
      selectedProductId,
      selectedRecommendation,
      cartOpen,
      chatbotOpen,
      recentProductIds,
      navigateTo,
      setCartOpen,
      setChatbotOpen,
      login,
      register,
      googleLogin,
      logout,
      updateProfile,
      fetchProducts,
      addProductReview,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      checkout,
      fetchOrderHistory,
      getRecommendation,
      fetchSavedRecommendations,
      deleteSavedRecommendation,
      sendChatMessage,
      addRecentProduct
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
