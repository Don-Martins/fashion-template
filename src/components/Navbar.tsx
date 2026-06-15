import React from 'react';
import { ShoppingBag, Heart, ShieldAlert, Store, Settings } from 'lucide-react';
import { BrandConfig } from '../types';

interface NavbarProps {
  brandConfig: BrandConfig;
  cartCount: number;
  wishlistCount: number;
  isAdminView: boolean;
  setIsAdminView: (isAdmin: boolean) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  currentCollection: string;
  setCurrentCollection: (category: string) => void;
}

export default function Navbar({
  brandConfig,
  cartCount,
  wishlistCount,
  isAdminView,
  setIsAdminView,
  onOpenCart,
  onOpenWishlist,
  currentCollection,
  setCurrentCollection
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#FDFCFB]/85 text-[#1A1A1A] backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Identity */}
          <div className="flex-1 flex items-center justify-start gap-4">
            <button 
              onClick={() => {
                setIsAdminView(false);
                setCurrentCollection("all");
              }}
              className="text-left cursor-pointer group"
              id="brand-logo-btn"
            >
              <h1 className="font-serif text-3xl tracking-[0.25em] text-[#C5A059] group-hover:opacity-80 transition-opacity uppercase">
                {brandConfig.brandName}
              </h1>
              <p className="hidden sm:block text-[9px] tracking-[0.3em] uppercase text-gray-400 font-sans mt-0.5 font-light">
                Haute Couture
              </p>
            </button>
          </div>

          {/* Center Navigation Links (Only shown when not in admin view) */}
          {!isAdminView && (
            <nav className="hidden md:flex space-x-8 text-xs tracking-[0.2em] uppercase font-light">
              <button
                onClick={() => setCurrentCollection("all")}
                className={`pb-1 border-b transition-all duration-300 ${
                  currentCollection === "all"
                    ? "border-[#C5A059] text-[#C5A059] font-medium"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
                id="nav-tab-all"
              >
                All Collections
              </button>
              <button
                onClick={() => setCurrentCollection("Ready-To-Wear")}
                className={`pb-1 border-b transition-all duration-150 ${
                  currentCollection === "Ready-To-Wear"
                    ? "border-[#C5A059] text-[#C5A059] font-medium"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
                id="nav-tab-rtw"
              >
                Ready-To-Wear
              </button>
              <button
                onClick={() => setCurrentCollection("Leather Goods")}
                className={`pb-1 border-b transition-all duration-150 ${
                  currentCollection === "Leather Goods"
                    ? "border-[#C5A059] text-[#C5A059] font-medium"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
                id="nav-tab-leather"
              >
                Leather Goods
              </button>
              <button
                onClick={() => setCurrentCollection("Accessories")}
                className={`pb-1 border-b transition-all duration-150 ${
                  currentCollection === "Accessories"
                    ? "border-[#C5A059] text-[#C5A059] font-medium"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
                id="nav-tab-access"
              >
                Accessories
              </button>
            </nav>
          )}

          {/* Right Controls Area: Interactive Badges and Mode Toggle */}
          <div className="flex-1 flex items-center justify-end gap-3 sm:gap-6">
            
            {/* View Switching Control */}
            <button
              onClick={() => setIsAdminView(!isAdminView)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-none text-[11px] tracking-widest uppercase border transition-all duration-300 cursor-pointer ${
                isAdminView
                  ? "bg-[#C5A059]/10 border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/20"
                  : "bg-white border-gray-200 text-gray-600 hover:text-black hover:border-black"
              }`}
              id="admin-toggle-btn"
              title={isAdminView ? "Return to retail boutique" : "Open manager analytics dashboard"}
            >
              {isAdminView ? (
                <>
                  <Store className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Boutique</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="hidden sm:inline">Dashboard</span>
                </>
              )}
            </button>

            {/* Shopping Controls (Only relevant for Client Boutique) */}
            {!isAdminView && (
              <div className="flex items-center gap-4">
                {/* Wishlist Button */}
                <button
                  onClick={onOpenWishlist}
                  className="relative p-2 text-gray-600 hover:text-[#C5A059] transition-colors cursor-pointer"
                  id="navbar-wishlist"
                  title="View Wishlist"
                >
                  <Heart className="w-5 h-5 font-light" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C5A059] text-white font-sans text-[9px] font-semibold rounded-full flex items-center justify-center animate-pulse">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* Cart Drawer Trigger */}
                <button
                  onClick={onOpenCart}
                  className="relative p-2 text-gray-600 hover:text-[#C5A059] transition-colors cursor-pointer"
                  id="navbar-cart"
                  title="Open Bag"
                >
                  <ShoppingBag className="w-5 h-5 font-light" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C5A059] text-white font-sans text-[9px] font-semibold rounded-full flex items-center justify-center scale-95">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            )}
            
            {isAdminView && (
              <div className="flex items-center gap-2 text-xs text-[#C5A059] font-mono tracking-widest hidden md:flex items-center">
                <Settings className="w-3.5 h-3.5 animate-spin-slow text-[#C5A059]" />
                <span>ADMIN ACTIVE</span>
              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}
