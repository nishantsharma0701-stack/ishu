/**
 * Shared Type Definitions for The Gentlemen Fashion
 */

export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin?: boolean;
  avatar?: string;
  bodyType?: string;
  skinTone?: string;
  heightRange?: string;
  weightRange?: string;
  fashionStyle?: string;
  favoriteColors?: string[];
  clothingFit?: string;
}

export interface Review {
  id: string;
  userId: string;
  username: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: "Suits" | "Shirts" | "T-shirts & Hoodies" | "Pants & Cargos" | "Outerwear" | "Footwear" | "Accessories";
  price: number;
  image: string;
  images?: string[];
  description: string;
  stock: number;
  colors: string[];
  sizes: string[];
  style: string; // Casual, Streetwear, Minimal, Old Money, Korean, Formal, Luxury, Smart Casual
  material: string;
  details: string[];
  rating: number;
  reviews: Review[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface Cart {
  items: CartItem[];
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  selectedColor: string;
  selectedSize: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  couponCode?: string;
  discountAmount?: number;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
}

export interface StylistPreferences {
  skinTone: string;
  bodyType: string;
  heightRange: string;
  weightRange: string;
  fashionStyle: string;
  occasion: string;
  budget: string;
  favoriteColors: string[];
  clothingFit: string;
}

export interface OutfitRecommendation {
  id: string;
  userId?: string;
  preferences: StylistPreferences;
  outfitName: string;
  styleCategory: string;
  detailedStylingExplanation: string;
  whyThisOutfitSuitsUser: string;
  recommendedColors: string[];
  bestFitType: string;
  fashionTips: string[];
  matchingAccessories: string[];
  occasionSuitability: string;
  seasonalRecommendation: string;
  matchingProductIds: string[]; // actual products in catalog
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  readTime: string;
  createdAt: string;
}

export interface CelebrityLook {
  id: string;
  celebrityName: string;
  lookName: string;
  image: string;
  description: string;
  matchingProductIds: string[];
}
