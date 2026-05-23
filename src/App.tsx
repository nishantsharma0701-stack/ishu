import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { ChatbotDrawer } from './components/ChatbotDrawer.tsx';

// Page imports
import { Home } from './pages/Home.tsx';
import { Shop } from './pages/Shop.tsx';
import { ProductDetail } from './pages/ProductDetail.tsx';
import { Stylist } from './pages/Stylist.tsx';
import { Checkout } from './pages/Checkout.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { Admin } from './pages/Admin.tsx';
import { Auth } from './pages/Auth.tsx';

import { Sparkles, MessageSquare } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, selectedProductId, setChatbotOpen } = useApp();

  // Unified dynamic router switcher
  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'shop':
        if (selectedProductId) {
          return <ProductDetail />;
        }
        return <Shop />;
      case 'stylist':
        return <Stylist />;
      case 'checkout':
        return <Checkout />;
      case 'dashboard':
        return <Dashboard />;
      case 'admin':
        return <Admin />;
      case 'auth':
        return <Auth />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-black font-sans text-neutral-200 selection:bg-amber-500 selection:text-black">
      
      {/* 1. Global Navigation header */}
      <Navbar />

      {/* 2. Page viewport transition wrapper */}
      <main className="flex-1">
        {renderActivePage()}
      </main>

      {/* 3. Global high-fashion footer */}
      <Footer />

      {/* 4. Sliding basket utility drawer */}
      <CartDrawer />

      {/* 5. Personal stylist chatbot drawer */}
      <ChatbotDrawer />

      {/* Floating absolute bottom chatbot toggle bubble with amber sparks theme */}
      <button
        onClick={() => setChatbotOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-black shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all outline-none border border-amber-300"
        title="Consult companion"
      >
        <span className="relative flex h-5 w-5">
          <Sparkles className="h-5 w-5 text-black hover:animate-spin" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-205"></span>
          </span>
        </span>
      </button>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
