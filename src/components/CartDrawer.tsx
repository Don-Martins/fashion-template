import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ArrowRight, ShieldCheck, Tag, Gift, Percent } from 'lucide-react';
import { CartItem, BrandConfig } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  brandConfig: BrandConfig;
  onUpdateQty: (cartItemId: string, qty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: (metrics: {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    premiumPackaging: boolean;
    total: number;
    couponPercent: number;
    couponCode: string;
  }) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  brandConfig,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout
}: CartDrawerProps) {
  const [couponInput, setCouponInput] = useState("");
  const [activeCoupon, setActiveCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [premiumPackaging, setPremiumPackaging] = useState(true);

  // Subtotal Calculation
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Discount calculation
  const couponPercent = activeCoupon ? activeCoupon.percent : 0;
  const discount = Math.round(subtotal * (couponPercent / 100));

  const amountAfterDiscount = subtotal - discount;

  // Shipping calculation
  const isFreeShipping = amountAfterDiscount >= brandConfig.freeShippingThreshold || amountAfterDiscount === 0;
  const shipping = isFreeShipping ? 0 : brandConfig.shippingFee;

  // Premium packaging calculation
  const packagingFee = premiumPackaging && amountAfterDiscount > 0 ? brandConfig.premiumPackagingFee : 0;

  // Luxury Tax calculation (percentage on the net price)
  const tax = Math.round(amountAfterDiscount * brandConfig.taxRate);

  // Grand Total
  const total = amountAfterDiscount + tax + shipping + packagingFee;

  // Coupon activation handler
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    
    const matched = brandConfig.discountCodes.find(
      (c) => c.code.toLowerCase() === couponInput.trim().toLowerCase()
    );

    if (matched) {
      setActiveCoupon({ code: matched.code, percent: matched.percentage });
      setCouponError("");
    } else {
      setCouponError("Invalid invitation or promotion code.");
    }
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          
          {/* Backdrop screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-950/85 backdrop-blur-[2px] cursor-pointer"
            onClick={onClose}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex">
            {/* Slide in drawer panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35 }}
              className="w-screen max-w-md bg-stone-900 border-l border-stone-800 text-stone-100 shadow-2xl flex flex-col h-full"
            >
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-stone-850 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="font-serif text-lg text-amber-500 uppercase tracking-widest">
                    Your Shopping Bag
                  </span>
                  <span className="bg-stone-950/60 text-stone-400 font-mono text-[10px] px-2.5 py-0.5 border border-stone-800 rounded-full">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-stone-400 hover:text-white transition-colors cursor-pointer"
                  id="close-cart-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Cart Listing Workspace */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-5 pb-16">
                    <div className="w-16 h-16 rounded-full bg-stone-950/60 border border-stone-850 flex items-center justify-center text-stone-500">
                      <Gift className="w-6 h-6 stroke-1" />
                    </div>
                    <div>
                      <p className="font-serif text-stone-300 font-light text-base tracking-wide uppercase">Your Bag is Empty</p>
                      <p className="text-stone-500 text-xs mt-1.5 font-light leading-relaxed">
                        Indulge in our exquisite new season selections and fill your world with bespoke couture.
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 border border-stone-750 text-stone-300 hover:text-amber-500 hover:border-amber-500/50 text-[10px] tracking-widest uppercase font-mono transition-colors cursor-pointer"
                    >
                      Browse Selections
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="group flex gap-4 p-3 bg-stone-950/40 border border-stone-850 hover:border-stone-800 transition-colors"
                    >
                      {/* Item Image */}
                      <div className="w-16 h-20 bg-stone-950 overflow-hidden relative shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs font-serif font-light text-stone-200 line-clamp-1 pr-2">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="text-stone-500 hover:text-red-400 transition-colors cursor-pointer p-0.5"
                              title="Discard choice"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-2 text-[10px] font-mono mt-1 text-stone-400">
                            {item.selectedSize && (
                              <span>Size: <span className="text-stone-300">{item.selectedSize}</span></span>
                            )}
                            {item.selectedSize && <span className="text-stone-650">|</span>}
                            <span>Color: <span className="text-amber-500/80 font-mono italic">{item.selectedColor.name}</span></span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-900/30">
                          {/* Qty increment */}
                          <div className="flex items-center border border-stone-800/80 bg-stone-950/20">
                            <button
                              onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                              className="px-2 py-0.5 text-stone-500 hover:text-white transition-colors text-[10px]"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="px-2.5 text-[10px] font-mono">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                              className="px-2 py-0.5 text-stone-500 hover:text-white transition-colors text-[10px]"
                              disabled={item.quantity >= item.product.stock}
                            >
                              +
                            </button>
                          </div>

                          <div className="text-xs font-mono font-medium text-amber-500">
                            {brandConfig.currencySymbol}{(item.product.price * item.quantity).toLocaleString()}
                          </div>
                        </div>

                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Bottom Checkout Calculations Panel */}
              {cartItems.length > 0 && (
                <div className="p-6 bg-stone-950/65 border-t border-stone-850 space-y-4">
                  
                  {/* Coupon activation input form */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-3 w-3.5 h-3.5 text-stone-500" />
                      <input
                        type="text"
                        placeholder="Invitation Code (e.g. WELCOME10)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="bg-stone-900/80 border border-stone-800 text-xs text-stone-200 pl-9 pr-3 py-2.5 w-full outline-none focus:border-amber-500/50 font-mono uppercase"
                        disabled={!!activeCoupon}
                      />
                    </div>
                    {activeCoupon ? (
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="px-3.5 bg-red-950/40 border border-red-500/30 text-red-400 text-[10px] tracking-widest uppercase font-mono hover:bg-red-950/60 transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="px-4 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] tracking-widest uppercase font-mono hover:bg-amber-500/20 active:bg-amber-500/10 transition-all cursor-pointer"
                      >
                        Apply
                      </button>
                    )}
                  </form>

                  {/* Coupon feedback states */}
                  {couponError && (
                    <p className="text-[10px] text-red-400 font-mono italic px-1">
                      {couponError}
                    </p>
                  )}
                  {activeCoupon && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase rounded-sm">
                      <Percent className="w-3 h-3" />
                      <span>{activeCoupon.code} Applied: {activeCoupon.percent}% OFF!</span>
                    </div>
                  )}

                  {/* Luxury Premium Packaging Checkbox */}
                  <label className="flex items-center gap-2.5 p-3 bg-stone-900/60 border border-stone-800/80 hover:border-stone-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={premiumPackaging}
                      onChange={(e) => setPremiumPackaging(e.target.checked)}
                      className="accent-amber-500 w-3.5 h-3.5 bg-stone-950 border-stone-800 focus:ring-0 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs font-serif font-light text-stone-200">
                        <span>Complimentary VVIP Packaging</span>
                        {premiumPackaging && (
                          <span className="font-mono text-amber-500">
                            +{brandConfig.currencySymbol}{brandConfig.premiumPackagingFee}
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] text-stone-500 font-mono mt-0.5 leading-relaxed uppercase">
                        Heavyweight gold-foil textured trunks, protective velvet bags, and brand invitation cards.
                      </p>
                    </div>
                  </label>

                  {/* Receipt breakdown */}
                  <div className="space-y-2 text-xs font-mono border-t border-stone-900/60 pt-3">
                    <div className="flex justify-between text-stone-400">
                      <span>Bag Subtotal</span>
                      <span className="text-stone-200">
                        {brandConfig.currencySymbol}{subtotal.toLocaleString()}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Invitation Premium Discount</span>
                        <span>-{brandConfig.currencySymbol}{discount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-stone-400">
                      <span>Lux VAT / Tax ({brandConfig.taxRate * 100}%)</span>
                      <span className="text-stone-200">
                        {brandConfig.currencySymbol}{tax.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between text-stone-400">
                      <span>Insured Courier Delivery</span>
                      {shipping === 0 ? (
                        <span className="text-emerald-400 uppercase tracking-widest text-[9px] font-bold">Free</span>
                      ) : (
                        <span className="text-stone-200">
                          {brandConfig.currencySymbol}{shipping.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {shipping > 0 && (
                      <div className="text-[9px] text-stone-500 font-mono text-right italic">
                        Spend {brandConfig.currencySymbol}{brandConfig.freeShippingThreshold - amountAfterDiscount} more for complimentary delivery.
                      </div>
                    )}

                    {/* Total */}
                    <div className="flex justify-between items-end border-t border-stone-850 pt-3 mt-1.5">
                      <span className="font-serif text-sm tracking-wider uppercase text-amber-500">Grand Total</span>
                      <span className="font-serif text-lg font-bold text-stone-100">
                        {brandConfig.currencySymbol}{total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Proceed trigger */}
                  <button
                    onClick={() => onProceedToCheckout({
                      subtotal,
                      discount,
                      shipping,
                      tax,
                      premiumPackaging,
                      total,
                      couponPercent,
                      couponCode: activeCoupon ? activeCoupon.code : ""
                    })}
                    className="w-full py-4 bg-amber-500 text-stone-950 font-bold text-xs tracking-[0.25em] uppercase hover:bg-amber-400 active:bg-amber-600 transition-colors flex items-center justify-center gap-2 group cursor-pointer shadow-lg shadow-amber-500/10"
                    id="checkout-btn"
                  >
                    <span>Proceed To Secure Checkout</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Guarantees */}
                  <div className="flex items-center justify-center gap-1.5 text-[9px] tracking-widest uppercase text-stone-500 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500/50" />
                    <span>256-Bit SSL Decrypted Handshake Secured</span>
                  </div>

                </div>
              )}

            </motion.div>
          </div>

        </div>
      )}
    </AnimatePresence>
  );
}
