import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { User, Product, Order, OutfitRecommendation, Review } from '../src/types.ts';

const DB_FILE = path.join(process.cwd(), 'db_store.json');

interface DbSchema {
  users: User[];
  userPasswords: Record<string, string>; // userId -> hashedPassword
  products: Product[];
  orders: Order[];
  recommendations: OutfitRecommendation[];
  wishlists: Record<string, string[]>; // userId -> productIds[]
  carts: Record<string, { productId: string; quantity: number; selectedColor: string; selectedSize: string; }[]>; // userId -> cartItems
}

// Initial seed products for The Gentlemen Fashion
const SEED_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: " Savile Row Silk-Blend Knit Polo",
    brand: "The Gentlemen",
    category: "Shirts",
    price: 6500,
    image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600"
    ],
    description: "An elegant, textured knit polo crafted from a fine silk and organic cotton blend. Designed with a clean retro flat-knitted open collar and tailored ribbing.",
    stock: 24,
    colors: ["Sand Cream", "Midnight Navy", "Olive Green"],
    sizes: ["S", "M", "L", "XL"],
    style: "Old Money",
    material: "55% Silk, 45% Organic Cotton",
    details: ["Open resort collar", "Tailored ribbed hem and cuffs", "Superbly breathable material", "Dry clean custom recommendation"],
    rating: 4.8,
    reviews: [
      { id: "r1", userId: "user1", username: "Julian Vance", rating: 5, comment: "Undoubtedly the most elegant shirt in my wardrobe. The silk drape is absolute luxury.", createdAt: "2026-05-15T12:00:00Z" }
    ],
    isBestSeller: true
  },
  {
    id: "p2",
    name: "The Mayfair Tailored Pleated Trousers",
    brand: "The Gentlemen",
    category: "Pants & Cargos",
    price: 7800,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600"
    ],
    description: "Double-pleated dress trousers designed with a high-rise waist, side buckle adjusters, and a subtle tapered leg with structured cuffs.",
    stock: 20,
    colors: ["Warm Sand", "Slate Grey", "Espresso Brown"],
    sizes: ["30", "32", "34", "36"],
    style: "Old Money",
    material: "100% Light Mercerized Wool",
    details: ["Elegant double front pleats", "Side-adjustable waist buckles", "Structured 4cm cuffs", "Authentic Horn buttons"],
    rating: 4.9,
    reviews: [
      { id: "r2", userId: "user2", username: "Charles Sterling", rating: 5, comment: "Flawless craftsmanship. The side-adjusters completely remove the need for a belt.", createdAt: "2026-05-18T10:30:00Z" }
    ],
    isBestSeller: true
  },
  {
    id: "p3",
    name: "Atelier Suede Flight Bomber Jacket",
    brand: "The Gentlemen Atelier",
    category: "Outerwear",
    price: 38000,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600"
    ],
    description: "A showstopping jacket meticulously tailored from ultra-soft Italian lambskin suede. Features a custom ribbed collar, luxury interior satin lining, and two-way gunmetal zippers.",
    stock: 8,
    colors: ["Rich Chocolate", "Whiskey Tan", "Obsidian Black"],
    sizes: ["M", "L", "XL"],
    style: "Luxury",
    material: "100% Genuine Italian Lambskin Suede",
    details: ["Buttery soft finish", "Heavyweight custom gunmetal zippers", "Twin insulated welt pockets", "Premium satin lining"],
    rating: 5.0,
    reviews: [
      { id: "r3", userId: "user3", username: "Garrison Thorne", rating: 5, comment: "An heirloom piece. The suede feels incredibly rich, and the lining is incredibly warm.", createdAt: "2026-05-20T14:15:00Z" }
    ],
    isNewArrival: true
  },
  {
    id: "p4",
    name: "Verona Acetate D-Frame Sunglasses",
    brand: "The Gentlemen",
    category: "Accessories",
    price: 6500,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600",
    description: "Heavyweight bio-acetate frames styled with custom polished gold-tone cores and double rivet accents. Features polarized custom bottle-green lenses.",
    stock: 50,
    colors: ["Tortoise Shell", "Smokey Grey", "Gloss Black"],
    sizes: ["One Size"],
    style: "Luxury",
    material: "Premium Bio-Acetate & Metal Core",
    details: ["100% UVA/UVB Eye Safe (UV400)", "Five-barrel metal hinges", "High contrast polarized lenses", "Includes custom leather carry pouch"],
    rating: 4.7,
    reviews: [],
    isBestSeller: true
  },
  {
    id: "p5",
    name: "Aether Minimalist Calfskin Sneaker",
    brand: "Aether Footwear",
    category: "Footwear",
    price: 12000,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600",
    description: "A masterclass in modern footwear. Pure full-grain calfskin leather, hand-stitched to reinforced Margom rubber soles. Unbranded, clean silhouette.",
    stock: 15,
    colors: ["Chalk White", "Onyx Black", "Off-White Suede"],
    sizes: ["41", "42", "43", "44"],
    style: "Minimal",
    material: "100% Full-Grain Calfskin Leather",
    details: ["Full leather interior lining", "Reinforced Margom rubber cupsoles", "Cotton-waxed premium lacing", "Handcrafted in Italy"],
    rating: 4.9,
    reviews: [],
    isNewArrival: true
  },
  {
    id: "p6",
    name: "The Arch Merino Wool Crewneck",
    brand: "The Gentlemen",
    category: "T-shirts & Hoodies",
    price: 9200,
    image: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&q=80&w=600",
    description: "Tailored crewneck knit crafted from extra-fine 19.5-micron Australian Merino wool. Offers beautiful temperature regulation with a silky finish.",
    stock: 18,
    colors: ["Charcoal Black", "Navy", "Silver Birch"],
    sizes: ["S", "M", "L", "XL"],
    style: "Minimal",
    material: "100% Australian Merino Wool",
    details: ["Silky, itch-free fine knit", "Fully-fashioned knit details at shoulders", "Ribbed collar and tailored hems", "Natural thermo-regulating properties"],
    rating: 4.6,
    reviews: []
  },
  {
    id: "p7",
    name: "Vanguard Heavyweight Utility Hoodie",
    brand: "Vanguard",
    category: "T-shirts & Hoodies",
    price: 8500,
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600",
    description: "A solid, boxy 480GSM loopback cotton hoodie with double-layer hoods, drop shoulders, and flatlock stitch detailing. Screen-free minimal streetwear classic.",
    stock: 32,
    colors: ["Sage Green", "Shadow Charcoal", "Dusk Bone"],
    sizes: ["S", "M", "L", "XL"],
    style: "Streetwear",
    material: "100% Heavyweight loopback Cotton (480GSM)",
    details: ["Luxurious 480GSM structural weight", "Kangaroo pocket with bar-tack details", "No drawstring aesthetic collar", "Preshrunk organic cotton fibers"],
    rating: 4.8,
    reviews: [],
    isNewArrival: true
  },
  {
    id: "p8",
    name: "Cyber Cargo Tactical Pants",
    brand: "Vanguard",
    category: "Pants & Cargos",
    price: 6800,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600",
    description: "Engineered from cotton-nylon ripstop, these cargo utility pants are shaped with articulation templates, adjustable cuff ties, and water-repellent coatings.",
    stock: 25,
    colors: ["Technical Khaki", "Obsidian Black", "Olive Drab"],
    sizes: ["30", "32", "34", "36"],
    style: "Streetwear",
    material: "70% Carbon Cotton, 30% Ripstop Nylon",
    details: ["Water repellent dry finish", "6-pocket modular cargo configuration", "Articulated knees for 3D layout movement", "Drawstring adjustable cuffs"],
    rating: 4.7,
    reviews: []
  },
  {
    id: "p9",
    name: "Seoul Boxy Bouclé Tweed Jacket cardigan",
    brand: "Seoul Atelier",
    category: "Outerwear",
    price: 14500,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600",
    description: "Boxy, semi-cropped jacket knit with textured tweed fabric. Inspired by Korean high-fashion street layouts. Offers a clean, gender-neutral structured slouch.",
    stock: 12,
    colors: ["Oatmeal Fleck", "Midnight Noir", "Bone Tweed"],
    sizes: ["M", "L", "XL"],
    style: "Korean Fashion",
    material: "Wool-Bouclé Blend",
    details: ["Luxurious textured bouclé", "Custom antique-pewter buttons", "Double patch front pockets", "Elegant drop-shoulder design"],
    rating: 4.9,
    reviews: [],
    isNewArrival: true
  },
  {
    id: "p10",
    name: "Milano Double Wool Tuxedo Jacket",
    brand: "The Gentlemen Tailor",
    category: "Suits",
    price: 24000,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600",
    description: "Exquisite double-breasted tuxedo dinner jacket shaped from soft Italian premium wool. Features contrasting silk satin peak lapels and buttons.",
    stock: 6,
    colors: ["Classic Tuxedo Black", "Royal Ivory", "Deep Bordeaux Blue"],
    sizes: ["38R", "40R", "42R", "44R"],
    style: "Formal",
    material: "100% Super 120s Italian Virgin Wool",
    details: ["Silk satin peak lapels", "Satin covered double-breasted buttons", "Fully-canvased construction", "Tailored premium chest pocket drape"],
    rating: 5.0,
    reviews: [],
    isNewArrival: true
  },
  {
    id: "p11",
    name: "Aero Chronograph Silver Sunburst Watch",
    brand: "Aero Timepieces",
    category: "Accessories",
    price: 19500,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600",
    description: "Minimalist chronograph watch featuring a 40mm steel case, a silver sunburst dial plate, and custom vintage-styled mesh link layout.",
    stock: 14,
    colors: ["Stainless Steel", "Brushed Gold", "Noir Matte Leather"],
    sizes: ["One Size"],
    style: "Luxury",
    material: "316L Surgical Stainless Steel & Sapphire Glass",
    details: ["Premium Miyota quartz movement", "5ATM water resistance rating", "Hardened anti-reflective sapphire window", "Deployant deployment buckle clasp"],
    rating: 4.8,
    reviews: [],
    isBestSeller: true
  },
  {
    id: "p12",
    name: "Astoria Modern Taper Chino",
    brand: "The Gentlemen",
    category: "Pants & Cargos",
    price: 4800,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600",
    description: "Superbly tailored comfort chinos that bridge the gap between office wear and weekend layouts. Light satin pre-washed cotton with high stretch.",
    stock: 40,
    colors: ["Chalk Sand", "Classic Navy", "Dark Spruce"],
    sizes: ["30", "32", "34", "36"],
    style: "Smart Casual",
    material: "97% Premium Pima Cotton, 3% Lycra Elastane",
    details: ["Slim tapered comfort leg", "Hidden zipped secondary secure pocket", "Lining trimmed waist details", "Comfort stretch active fiber"],
    rating: 4.5,
    reviews: []
  }
];

class Database {
  private data: DbSchema = {
    users: [],
    userPasswords: {},
    products: [],
    orders: [],
    recommendations: [],
    wishlists: {},
    carts: {}
  };

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        this.data = {
          users: parsed.users || [],
          userPasswords: parsed.userPasswords || {},
          products: parsed.products || [],
          orders: parsed.orders || [],
          recommendations: parsed.recommendations || [],
          wishlists: parsed.wishlists || {},
          carts: parsed.carts || {}
        };
        // Seed products if empty
        if (this.data.products.length === 0) {
          this.data.products = SEED_PRODUCTS;
          this.saveData();
        }
      } else {
        // Seed initial DB state
        this.data = {
          users: [],
          userPasswords: {},
          products: SEED_PRODUCTS,
          orders: [],
          recommendations: [],
          wishlists: {},
          carts: {}
        };
        this.saveData();
      }
    } catch (e) {
      console.error("Error loading mock database file:", e);
    }
  }

  private saveData() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error("Error saving mock database file:", e);
    }
  }

  // Auth Operations
  getUsers() { return this.data.users; }
  getUserById(id: string) { return this.data.users.find(u => u.id === id); }
  getUserByEmail(email: string) { return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase()); }
  
  createUser(user: Omit<User, 'id'>, passwordHash: string): User {
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      isAdmin: user.email === "sharmaanjana2352@gmail.com" ? true : false // Auto-make original admin if match
    };
    this.data.users.push(newUser);
    this.data.userPasswords[newUser.id] = passwordHash;
    this.data.carts[newUser.id] = [];
    this.data.wishlists[newUser.id] = [];
    this.saveData();
    return newUser;
  }

  updateUserProfile(userId: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex(u => u.id === userId);
    if (idx === -1) return null;
    const existingUser = this.data.users[idx];
    
    // Prevent self-assigned roles (block modifying isAdmin fields from standard updates)
    const secureUpdates = { ...updates };
    delete secureUpdates.isAdmin;
    delete secureUpdates.id;

    const updatedUser = { ...existingUser, ...secureUpdates };
    this.data.users[idx] = updatedUser;
    this.saveData();
    return updatedUser;
  }

  getPasswordHash(userId: string): string | undefined {
    return this.data.userPasswords[userId];
  }

  // Product Operations
  getProducts() { return this.data.products; }
  getProductById(id: string) { return this.data.products.find(p => p.id === id); }
  
  createProduct(product: Omit<Product, 'id' | 'rating' | 'reviews'>): Product {
    const newProduct: Product = {
      ...product,
      id: "p_" + Date.now().toString(36),
      rating: 5.0,
      reviews: []
    };
    this.data.products.push(newProduct);
    this.saveData();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    const existing = this.data.products[idx];
    const updated = { ...existing, ...updates, id }; // retain ID
    this.data.products[idx] = updated;
    this.saveData();
    return updated;
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length < initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  addProductReview(productId: string, userId: string, username: string, rating: number, comment: string): Review | null {
    const product = this.getProductById(productId);
    if (!product) return null;
    
    const newReview: Review = {
      id: crypto.randomUUID(),
      userId,
      username,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };
    
    product.reviews.push(newReview);
    // Recalculate average rating
    const total = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = Number((total / product.reviews.length).toFixed(1));
    
    this.saveData();
    return newReview;
  }

  // Cart Operations
  getCart(userId: string) {
    return this.data.carts[userId] || [];
  }

  updateCart(userId: string, items: { productId: string; quantity: number; selectedColor: string; selectedSize: string; }[]) {
    this.data.carts[userId] = items;
    this.saveData();
    return items;
  }

  // Wishlist Operations
  getWishlist(userId: string) {
    return this.data.wishlists[userId] || [];
  }

  toggleWishlist(userId: string, productId: string) {
    let wishlist = this.data.wishlists[userId] || [];
    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter(id => id !== productId);
    } else {
      wishlist.push(productId);
    }
    this.data.wishlists[userId] = wishlist;
    this.saveData();
    return wishlist;
  }

  // Order Operations
  getOrders() { return this.data.orders; }
  getOrdersByUser(userId: string) { return this.data.orders.filter(o => o.userId === userId); }
  getOrderById(id: string) { return this.data.orders.find(o => o.id === id); }
  
  createOrder(order: Omit<Order, 'id' | 'status' | 'createdAt'>): Order {
    const newOrder: Order = {
      ...order,
      id: "ord_" + Math.random().toString(36).substring(2, 9).toUpperCase(),
      status: "Processing",
      createdAt: new Date().toISOString()
    };
    this.data.orders.push(newOrder);
    
    // Wipe client cart on success
    this.data.carts[order.userId] = [];
    
    // Deduct stock from products
    order.items.forEach(item => {
      const prod = this.getProductById(item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    });

    this.saveData();
    return newOrder;
  }

  updateOrderStatus(id: string, status: "Processing" | "Shipped" | "Delivered" | "Cancelled"): Order | null {
    const order = this.getOrderById(id);
    if (!order) return null;
    order.status = status;
    this.saveData();
    return order;
  }

  // AI Outfits Operations
  addRecommendation(rec: Omit<OutfitRecommendation, 'id' | 'createdAt'>): OutfitRecommendation {
    const newRec: OutfitRecommendation = {
      ...rec,
      id: "rec_" + crypto.randomUUID().substring(0, 8),
      createdAt: new Date().toISOString()
    };
    this.data.recommendations.push(newRec);
    this.saveData();
    return newRec;
  }

  getRecommendationsByUser(userId: string) {
    return this.data.recommendations.filter(r => r.userId === userId);
  }

  deleteSavedRecommendation(id: string, userId: string): boolean {
    const initialLen = this.data.recommendations.length;
    this.data.recommendations = this.data.recommendations.filter(r => !(r.id === id && r.userId === userId));
    if (this.data.recommendations.length < initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }
}

export const dbInstance = new Database();
