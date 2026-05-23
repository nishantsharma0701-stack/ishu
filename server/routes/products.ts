import express from 'express';
import { dbInstance } from '../db.ts';
import { authMiddleware, requireAuth, requireAdmin, AuthenticatedRequest } from '../middleware.ts';

const router = express.Router();

// Get Products (with Search & Advanced Filtering)
router.get('/', (req, res) => {
  let products = dbInstance.getProducts();

  const { category, style, priceMin, priceMax, search, color, size, sortBy } = req.query;

  // Search filter
  if (search) {
    const q = (search as string).toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q)
    );
  }

  // Category filter
  if (category) {
    products = products.filter(p => p.category === category);
  }

  // Style filter
  if (style) {
    products = products.filter(p => p.style === style);
  }

  // Color filter
  if (color) {
    products = products.filter(p => p.colors.some(c => c.toLowerCase() === (color as string).toLowerCase()));
  }

  // Size filter
  if (size) {
    products = products.filter(p => p.sizes.includes(size as string));
  }

  // Price Range filter
  if (priceMin) {
    products = products.filter(p => p.price >= Number(priceMin));
  }
  if (priceMax) {
    products = products.filter(p => p.price <= Number(priceMax));
  }

  // Sort By
  if (sortBy) {
    switch(sortBy as string) {
      case 'price-low-high':
        products = [...products].sort((a,b) => a.price - b.price);
        break;
      case 'price-high-low':
        products = [...products].sort((a,b) => b.price - a.price);
        break;
      case 'rating':
        products = [...products].sort((a,b) => b.rating - a.rating);
        break;
      case 'newest':
        products = [...products].sort((a,b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
    }
  }

  res.json({ products });
});

// Get Single Product
router.get('/:id', (req, res) => {
  const product = dbInstance.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  
  // Also get similar products
  const allProducts = dbInstance.getProducts();
  const similar = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.style === product.style))
    .slice(0, 4);

  res.json({ product, similar });
});

// Add Review: POST /api/products/:id/reviews
router.post('/:id/reviews', authMiddleware, requireAuth, (req: AuthenticatedRequest, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  if (!rating || !comment) {
    return res.status(400).json({ message: "Rating and comment are required" });
  }

  const user = dbInstance.getUserById(req.userId!);
  if (!user) return res.status(404).json({ message: "User not found" });

  const review = dbInstance.addProductReview(
    productId,
    req.userId!,
    user.username,
    Number(rating),
    comment
  );

  if (!review) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(201).json({ review });
});

// Admin Route: Add Product
router.post('/', authMiddleware, requireAdmin, (req, res) => {
  const { name, brand, category, price, image, description, stock, colors, sizes, style, material, details } = req.body;
  if (!name || !brand || !category || !price || !image || !description) {
    return res.status(400).json({ message: "Missing required product fields" });
  }

  const p = dbInstance.createProduct({
    name,
    brand,
    category,
    price: Number(price),
    image,
    description,
    stock: Number(stock || 10),
    colors: colors || ["Black"],
    sizes: sizes || ["M"],
    style: style || "Casual",
    material: material || "Cotton",
    details: details || []
  });

  res.status(201).json({ product: p });
});

// Admin Route: Update Product
router.put('/:id', authMiddleware, requireAdmin, (req, res) => {
  const updated = dbInstance.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ message: "Product not found to update" });
  }
  res.json({ product: updated });
});

// Admin Route: Delete Product
router.delete('/:id', authMiddleware, requireAdmin, (req, res) => {
  const success = dbInstance.deleteProduct(req.params.id);
  if (!success) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json({ message: "Product deleted successfully" });
});

export default router;
