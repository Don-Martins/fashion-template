import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Star, ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Product, BrandConfig, ColorOption } from '../types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  brandConfig: BrandConfig;
  onAddToCart: (p: Product, size: string, color: ColorOption, qty: number) => void;
  onToggleWishlist: (p: Product) => void;
  isWishlisted: boolean;
  onAddReview: (productId: string, rating: number, comment: string, author: string) => void;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
  brandConfig,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onAddReview
}: ProductModalProps) {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  // Submit Review state
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const isOutOfStock = product.stock <= 0;

  // Sync image when open product changes
  React.useEffect(() => {
    if (product) {
      setActiveImage(product.images[0]);
      setSelectedSize(product.sizes[0] || "");
      setSelectedColor(product.colors[0] || null);
      setQuantity(1);
      setActiveTab('details');
      setNewComment('');
      setNewAuthor('');
      setReviewSuccess(false);
    }
  }, [product]);

  const handleQtyChange = (val: number) => {
    if (val < 1) return;
    if (val > product.stock) return;
    setQuantity(val);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;
    onAddReview(product.id, newRating, newComment, newAuthor);
    setNewAuthor('');
    setNewComment('');
    setNewRating(5);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-stone-900 border border-stone-800 text-stone-100 max-w-5xl w-full rounded-none overflow-hidden shadow-2xl z-20 flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
          >
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white bg-stone-950/40 hover:bg-stone-950/80 transition-all rounded-full z-30 cursor-pointer"
              id="close-prod-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Media Workspace */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between border-r border-stone-800 bg-stone-950/40 overflow-y-auto">
              <div>
                {/* Active Image Spotlight */}
                <div className="aspect-[4/5] bg-stone-950 overflow-hidden relative">
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-all duration-[400ms]"
                    referrerPolicy="no-referrer"
                    id="modal-active-img"
                  />
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="text-xs uppercase tracking-[0.3em] bg-stone-900 border border-stone-800 text-stone-300 font-mono px-4 py-2 scale-110">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnails Angle Selection */}
                {product.images.length > 1 && (
                  <div className="flex gap-3 mt-4">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(img)}
                        className={`w-16 h-20 bg-stone-950 opacity-70 hover:opacity-100 transition-all relative border overflow-hidden ${
                          activeImage === img ? "border-amber-500 opacity-100 scale-95" : "border-stone-850"
                        }`}
                        id={`modal-thumb-btn-${idx}`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} thumbnail angle ${idx + 1}`}
                          className="w-full h-full object-cover object-center"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Artisan Authenticity Assurances */}
              <div className="hidden md:grid grid-cols-3 gap-3 mt-10 border-t border-stone-800/60 pt-6 text-[10px] text-stone-400 font-mono leading-relaxed">
                <div className="flex flex-col items-center text-center">
                  <ShieldCheck className="w-4 h-4 text-amber-500/80 mb-1.5" />
                  <span>Certified Genuine</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Truck className="w-4 h-4 text-amber-500/80 mb-1.5" />
                  <span>Secure Insured Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <RefreshCw className="w-4 h-4 text-amber-500/80 mb-1.5" />
                  <span>Complimentary Returns</span>
                </div>
              </div>
            </div>

            {/* Right Column: Information & Interactions */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                
                {/* Category & Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] tracking-[0.2em] text-amber-500 font-mono uppercase">
                    {product.category}
                  </span>
                  <span className="text-[10px] tracking-widest text-stone-500 font-mono font-light">
                    SKU: {product.sku}
                  </span>
                </div>

                {/* Main Title */}
                <h2 className="mt-3 text-2xl md:text-3xl font-serif font-light tracking-wide text-stone-100 uppercase sm:leading-snug leading-tight" id="modal-product-title">
                  {product.name}
                </h2>

                {/* Price, Stars */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-800">
                  <span className="text-xl font-serif font-medium text-stone-100">
                    {brandConfig.currencySymbol}{product.price.toLocaleString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(product.rating) ? "fill-amber-500 text-amber-500" : "text-stone-700"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-mono text-stone-400">
                      {product.rating.toFixed(2)} ({product.reviews.length} legacy reviews)
                    </span>
                  </div>
                </div>

                {/* Navigation Tabs (Details vs Reviews) */}
                <div className="flex border-b border-stone-800 mt-6 font-mono text-[10px] tracking-widest uppercase">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`py-3 px-4 border-b-2 font-medium transition-colors cursor-pointer ${
                      activeTab === 'details'
                        ? "border-amber-500 text-amber-500"
                        : "border-transparent text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    Atelier Details
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`py-3 px-4 border-b-2 font-medium transition-colors cursor-pointer ${
                      activeTab === 'reviews'
                        ? "border-amber-500 text-amber-500"
                        : "border-transparent text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    Reviews ({product.reviews.length})
                  </button>
                </div>

                {/* Tab Target: Details config */}
                {activeTab === 'details' ? (
                  <div className="mt-6 space-y-6">
                    {/* Description text */}
                    <p className="text-xs text-stone-300 font-sans tracking-wide leading-relaxed font-light">
                      {product.description}
                    </p>

                    {/* Interactive Sizing Choices */}
                    {!isOutOfStock && product.sizes.length > 0 && product.sizes[0] !== "One Size" && (
                      <div>
                        <div className="text-[10px] tracking-widest text-stone-400 font-mono uppercase mb-2.5">
                          Select Size
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {product.sizes.map((sz) => (
                            <button
                              key={sz}
                              onClick={() => setSelectedSize(sz)}
                              className={`px-4 py-2 border text-[11px] font-mono transition-all duration-150 cursor-pointer ${
                                selectedSize === sz
                                  ? "border-amber-500 bg-amber-500/10 text-amber-500 font-semibold"
                                  : "border-stone-800 hover:border-stone-600 text-stone-300 hover:text-stone-100"
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interactive Colors Choices */}
                    {!isOutOfStock && product.colors.length > 0 && selectedColor && (
                      <div>
                        <div className="text-[10px] tracking-widest text-stone-400 font-mono uppercase mb-2.5">
                          Artisan Color: <span className="text-amber-500 lowercase font-light font-mono italic">{selectedColor.name}</span>
                        </div>
                        <div className="flex gap-3">
                          {product.colors.map((col) => (
                            <button
                              key={col.name}
                              onClick={() => setSelectedColor(col)}
                              className={`w-7 h-7 rounded-full border-2 p-0.5 transition-transform duration-150 cursor-pointer ${
                                selectedColor.name === col.name
                                  ? "border-amber-500 scale-105"
                                  : "border-transparent hover:scale-105"
                              }`}
                              title={col.name}
                            >
                              <span
                                className="block w-full h-full rounded-full border border-stone-900/40"
                                style={{ backgroundColor: col.value }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Tab Target: Reviews submission & Feed */
                  <div className="mt-6 space-y-6">
                    
                    {/* Submit Review Interface Form */}
                    <form onSubmit={handleReviewSubmit} className="p-4 bg-stone-950/40 border border-stone-850 space-y-3">
                      <div className="text-[10px] tracking-widest text-amber-500 font-mono uppercase">
                        Review this Piece
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={newAuthor}
                          onChange={(e) => setNewAuthor(e.target.value)}
                          className="bg-stone-900 border border-stone-800 text-xs text-stone-100 p-2.5 outline-none focus:border-amber-500/50"
                          required
                        />
                        <div className="flex items-center justify-between bg-stone-900 border border-stone-800 px-3 py-1">
                          <span className="text-[10px] text-stone-400 font-mono uppercase">Assigned Rating</span>
                          <select
                            value={newRating}
                            onChange={(e) => setNewRating(Number(e.target.value))}
                            className="bg-transparent text-amber-500 border-none outline-none font-mono text-xs cursor-pointer"
                          >
                            <option value="5">★★★★★ (5)</option>
                            <option value="4">★★★★☆ (4)</option>
                            <option value="3">★★★☆☆ (3)</option>
                            <option value="2">★★☆☆☆ (2)</option>
                            <option value="1">★☆☆☆☆ (1)</option>
                          </select>
                        </div>
                      </div>

                      <textarea
                        placeholder="Share your thoughts on the fabrics, cut, and fit..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="bg-stone-900 border border-stone-800 text-xs text-stone-100 p-2.5 w-full h-16 outline-none focus:border-amber-500/50 resize-none"
                        required
                      />

                      <button
                        type="submit"
                        className="w-full py-2 bg-amber-500 text-stone-950 text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-amber-400 transition-colors cursor-pointer"
                      >
                        Publish Review Summary
                      </button>

                      {reviewSuccess && (
                        <p className="text-[10px] text-emerald-400 font-mono text-center animate-fade-in">
                          Thank you. Your review has been saved in persistent memory.
                        </p>
                      )}
                    </form>

                    {/* Review list */}
                    <div className="space-y-4 max-h-[160px] overflow-y-auto pr-2">
                      {product.reviews.length === 0 ? (
                        <p className="text-xs text-stone-500 italic text-center font-mono py-4">No consumer reviews registered yet.</p>
                      ) : (
                        product.reviews.map((rev) => (
                          <div key={rev.id} className="pb-3 border-b border-stone-800/50 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-serif font-light text-stone-200">{rev.userName}</span>
                              <span className="text-[10px] text-stone-500 font-mono">{rev.date}</span>
                            </div>
                            <div className="flex text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-[10px]">
                                  {i < rev.rating ? "★" : "☆"}
                                </span>
                              ))}
                            </div>
                            <p className="text-stone-400 text-[11px] font-sans font-light italic leading-relaxed">
                              "{rev.comment}"
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Purchase Activations Drawer */}
              {!isOutOfStock && activeTab === 'details' && (
                <div className="mt-8 pt-6 border-t border-stone-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-widest text-stone-400 font-mono uppercase">Quantity</span>
                    <div className="flex items-center border border-stone-800 bg-stone-950/40">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(quantity - 1)}
                        className="px-3 py-1 text-stone-400 hover:text-stone-100 transition-colors text-xs font-mono cursor-pointer"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 text-xs font-mono text-stone-100">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(quantity + 1)}
                        className="px-3 py-1 text-stone-400 hover:text-stone-100 transition-colors text-xs font-mono cursor-pointer"
                        disabled={quantity >= product.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    {/* Add to Bag */}
                    <button
                      onClick={() => {
                        if (selectedColor) {
                          onAddToCart(product, selectedSize, selectedColor, quantity);
                          onClose();
                        }
                      }}
                      className="flex-1 py-4 bg-amber-500 text-stone-950 font-semibold text-xs tracking-widest uppercase hover:bg-amber-400 active:bg-amber-600 transition-colors flex items-center justify-center gap-2 group cursor-pointer"
                      id="modal-add-to-bag-btn"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Reserve & Add to Bag</span>
                    </button>

                    {/* Wishlist Toggle Button inside modal */}
                    <button
                      onClick={() => onToggleWishlist(product)}
                      className={`p-4 border transition-colors cursor-pointer ${
                        isWishlisted
                          ? "bg-amber-500/10 border-amber-500 text-amber-500"
                          : "border-stone-800 text-stone-400 hover:border-stone-600 hover:text-stone-100"
                      }`}
                      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                    </button>
                  </div>
                </div>
              )}

              {isOutOfStock && activeTab === 'details' && (
                <div className="mt-8 pt-6 border-t border-stone-800">
                  <button
                    disabled
                    className="w-full py-4 border border-stone-800 bg-stone-950 text-stone-600 text-xs tracking-widest uppercase font-mono font-medium rounded-none text-center"
                  >
                    Exquisite Piece Sold Out
                  </button>
                </div>
              )}

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
