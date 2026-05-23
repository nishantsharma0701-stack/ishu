import express from 'express';
import { dbInstance } from '../db.ts';
import { authMiddleware, requireAuth, requireAdmin, AuthenticatedRequest } from '../middleware.ts';

const router = express.Router();

// 1. GET Cart
router.get('/cart', authMiddleware, requireAuth, (req: AuthenticatedRequest, res) => {
  const cartItems = dbInstance.getCart(req.userId!);
  res.json({ cart: cartItems });
});

// 2. POST Cart Update
router.post('/cart', authMiddleware, requireAuth, (req: AuthenticatedRequest, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ message: "Items must be an array" });
  }
  const updated = dbInstance.updateCart(req.userId!, items);
  res.json({ cart: updated });
});

// 3. GET Wishlist
router.get('/wishlist', authMiddleware, requireAuth, (req: AuthenticatedRequest, res) => {
  const productIds = dbInstance.getWishlist(req.userId!);
  const allProducts = dbInstance.getProducts();
  const wishlistedProducts = allProducts.filter(p => productIds.includes(p.id));
  res.json({ wishlist: wishlistedProducts, productIds });
});

// 4. POST Toggle Wishlist
router.post('/wishlist/toggle', authMiddleware, requireAuth, (req: AuthenticatedRequest, res) => {
  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ message: "productId is required" });
  }
  const updatedIds = dbInstance.toggleWishlist(req.userId!, productId);
  const allProducts = dbInstance.getProducts();
  const wishlistedProducts = allProducts.filter(p => updatedIds.includes(p.id));
  res.json({ wishlist: wishlistedProducts, productIds: updatedIds });
});

// 5. POST Create Order
router.post('/checkout', authMiddleware, requireAuth, (req: AuthenticatedRequest, res) => {
  const { items, subtotal, tax, shipping, total, shippingAddress, couponCode, discountAmount } = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order must contain at least one item" });
  }
  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine1) {
    return res.status(400).json({ message: "Complete shipping address is required" });
  }

  const order = dbInstance.createOrder({
    userId: req.userId!,
    items,
    subtotal: Number(subtotal),
    tax: Number(tax),
    shipping: Number(shipping),
    total: Number(total),
    couponCode,
    discountAmount: Number(discountAmount || 0),
    shippingAddress
  });

  res.status(201).json({ order });
});

// 6. GET Orders (Client Order History)
router.get('/history', authMiddleware, requireAuth, (req: AuthenticatedRequest, res) => {
  const orders = dbInstance.getOrdersByUser(req.userId!);
  res.json({ orders: orders.reverse() }); // Newest first
});

// 7. Admin Route: GET All Orders with Analytics
router.get('/admin/all', authMiddleware, requireAdmin, (req, res) => {
  const orders = dbInstance.getOrders();
  const products = dbInstance.getProducts();
  
  // Calculate basic revenue stats
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter(o => o.status === 'Processing').length;
  const shippedCount = orders.filter(o => o.status === 'Shipped').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;

  // Inventory stats
  const lowStockProducts = products.filter(p => p.stock <= 5);

  res.json({
    orders: [...orders].reverse(),
    analytics: {
      totalRevenue,
      salesCount: orders.filter(o => o.status !== 'Cancelled').length,
      pendingCount,
      shippedCount,
      deliveredCount,
      cancelledCount,
      lowStockCount: lowStockProducts.length
    }
  });
});

// 8. Admin Route: PUT Order Status Update
router.put('/admin/status/:id', authMiddleware, requireAdmin, (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  const updated = dbInstance.updateOrderStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.json({ order: updated });
});

export default router;
