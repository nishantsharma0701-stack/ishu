import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { authMiddleware } from './server/middleware.ts';

// Route Imports
import authRouter from './server/routes/auth.ts';
import productsRouter from './server/routes/products.ts';
import ordersRouter from './server/routes/orders.ts';
import aiRouter from './server/routes/ai.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logged info
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Global Auth Middleware
  app.use(authMiddleware as any);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Blog posts and celebrity outfits static endpoints to fulfill premium requirements
  app.get('/api/blog', (req, res) => {
    const blogs = [
      {
        id: "b1",
        title: "The Art of Loungewear Tailoring",
        excerpt: "Why the classic knit polo is replacing traditional dress shirts in the modern gentleman's wardrobe.",
        category: "Styling Guide",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400",
        readTime: "4 min read",
        createdAt: "2026-05-10T09:00:00Z"
      },
      {
        id: "b2",
        title: "The Double-Breasted Renaissance",
        excerpt: "How to style high-end tailoring for casual evening date nights without looking overly formal.",
        category: "Tailoring",
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=400",
        readTime: "6 min read",
        createdAt: "2026-05-15T11:30:00Z"
      },
      {
        id: "b3",
        title: "Minimalism vs. Loud Streetwear",
        excerpt: "Deconstructing the structural shift in modern silhouette choices, boxy fits, and quiet color matching.",
        category: "Trends",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400",
        readTime: "5 min read",
        createdAt: "2026-05-20T14:00:00Z"
      }
    ];
    res.json({ blogs });
  });

  app.get('/api/celebrity-looks', (req, res) => {
    const looks = [
      {
        id: "cl1",
        celebrityName: "Jacob Elordi",
        lookName: "The Riviera Casual",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
        description: "Jacob's relaxed polo with pleated trousers combination. Soft earthy tones, unbuttoned collar, and calfskin trainers.",
        matchingProductIds: ["p1", "p2", "p5"]
      },
      {
        id: "cl2",
        celebrityName: "Timothée Chalamet",
        lookName: "The Parisian Minimalist",
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=400",
        description: "Timothée's iconic airport street fit: fine merino knit beneath sheepskin suede jacket, matched with aviators.",
        matchingProductIds: ["p3", "p4", "p6"]
      },
      {
        id: "cl3",
        celebrityName: "Park Seo-joon",
        lookName: "The Gangnam Slouch",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=400",
        description: "Seo-joon's drop-shoulder boxy tweed CARDIGAN jacket silhouette with wide tapered utility pants.",
        matchingProductIds: ["p8", "p9", "p5"]
      }
    ];
    res.json({ looks });
  });

  // Mount API Routers
  app.use('/api/auth', authRouter);
  app.use('/api/products', productsRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/ai', aiRouter);

  // Vite middleware for dev mode OR static serving for production mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated successfully.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Static files serve configured for production.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
