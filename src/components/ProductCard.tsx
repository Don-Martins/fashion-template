import React from 'react';
import { Heart, Eye, ArrowUpRight, ShoppingCart } from 'lucide-react';
import { Product, BrandConfig } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  brandConfig: BrandConfig;
  onViewDetail: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
  isWishlisted: boolean;
  onAddToCartDirect: (p: Product) => void;
}

export default function ProductCard({
  product,
  brandConfig,
  onViewDetail,
  onToggleWishlist,
  isWishlisted,
  onAddToCartDirect
}: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 4;

  return (
    <div 
      className="group relative bg-white border border-gray-100 overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-[#C5A059]/30 flex-1 shadow-sm hover:shadow-md"
      id={`prod-card-${product.id}`}
    >
      
      {/* Visual Workspace & Badges */}
      <div className="relative aspect-[3/4] bg-[#FDFCFB] overflow-hidden select-none">
        
        {/* Dual Image Hover Fade-In */}
        <div className="absolute inset-0 cursor-pointer" onClick={() => onViewDetail(product)}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center transform transition-transform duration-[600ms] group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={`${product.name} alternate angle`}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-0 transition-opacity duration-[600ms] group-hover:opacity-100 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          )}
        </div>

        {/* Wishlist Floating Button */}
        <button
          onClick={() => onToggleWishlist(product)}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 z-10 cursor-pointer ${
            isWishlisted
              ? "bg-[#C5A059] text-white"
              : "bg-white/85 text-gray-600 hover:bg-white hover:text-[#C5A059] shadow-sm"
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          id={`wishlist-btn-${product.id}`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Stock & Premium Highlight Labels */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none z-10">
          {product.isFeatured && (
            <span className="px-2.5 py-1 bg-white/95 text-[#C5A059] text-[9px] font-mono tracking-widest uppercase border border-[#C5A059]/20 font-semibold shadow-sm">
              Featured Edition
            </span>
          )}
          {isOutOfStock ? (
            <span className="px-2.5 py-1 bg-white border border-gray-100 text-gray-400 text-[9px] font-mono tracking-widest uppercase shadow-sm">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-1 bg-red-50 border border-red-100 text-red-600 text-[9px] font-mono tracking-widest uppercase animate-pulse shadow-sm font-semibold">
              Only {product.stock} Left
            </span>
          ) : null}
        </div>

        {/* Hover Quick View Overlay Controls */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-white/95 via-white/55 to-transparent opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex gap-2 z-10">
          <button
            onClick={() => onViewDetail(product)}
            className="flex-1 py-2.5 bg-[#1A1A1A] text-white text-[10px] tracking-widest uppercase font-semibold hover:bg-[#C5A059] active:bg-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer rounded-none shadow-sm"
            id={`quick-view-${product.id}`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Examine</span>
          </button>
          
          {!isOutOfStock && (
            <button
              onClick={() => onAddToCartDirect(product)}
              className="p-2.5 bg-[#C5A059] text-white hover:bg-[#b08e4d] active:bg-[#9a7b41] transition-colors flex items-center justify-center cursor-pointer rounded-none shadow-sm"
              title="Add signature piece to your Shopping Bag"
              id={`quick-add-${product.id}`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 bg-white">
        
        {/* Category */}
        <div className="text-[10px] tracking-widest text-[#C5A059] font-mono uppercase font-semibold">
          {product.category}
        </div>

        {/* Product Title */}
        <h3 
          onClick={() => onViewDetail(product)}
          className="mt-1.5 text-sm font-serif font-light text-[#1A1A1A] tracking-wide hover:text-[#C5A059] transition-colors cursor-pointer line-clamp-1"
        >
          {product.name}
        </h3>

        {/* Flexible Spacer */}
        <div className="flex-1 min-h-[8px]"></div>

        {/* Price & Rating Row */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm font-serif font-semibold text-[#1A1A1A]">
            {brandConfig.currencySymbol}{product.price.toLocaleString()}
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-1 text-[10px] text-gray-500 font-sans">
            <span className="text-[#C5A059] font-serif">★</span>
            <span className="font-mono mt-0.5 font-medium">{product.rating.toFixed(2)}</span>
            <span className="text-gray-400">({product.reviews.length})</span>
          </div>
        </div>

      </div>

    </div>
  );
}
