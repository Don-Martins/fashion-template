import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, ShieldCheck, Mail, CheckCircle, Package, ArrowRight, User } from 'lucide-react';
import { BrandConfig, Order, OrderCustomer } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandConfig: BrandConfig;
  cartItems: any[];
  checkoutMetrics: {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    premiumPackaging: boolean;
    total: number;
    couponPercent: number;
    couponCode: string;
  } | null;
  onCompleteOrder: (customer: OrderCustomer, orderData: Omit<Order, 'id' | 'date'>) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  brandConfig,
  cartItems,
  checkoutMetrics,
  onCompleteOrder
}: CheckoutModalProps) {
  if (!isOpen || !checkoutMetrics) return null;

  // Checkout inputs
  const [customer, setCustomer] = useState<OrderCustomer>({
    name: "Hélene de Beauvoir",
    email: "helene.beauvoir@sorbonne.edu",
    address: "71 Rue de Grenelle",
    city: "Paris",
    zip: "75007"
  });

  // Credit Card inputs
  const [cardNumber, setCardNumber] = useState("4532  8190  3341  8590");
  const [cardHolder, setCardHolder] = useState("H DE BEAUVOIR");
  const [cardExpiry, setCardExpiry] = useState("09/29");
  const [cardCVV, setCardCVV] = useState("384");

  // Step state
  const [step, setStep] = useState<'checkout' | 'success'>('checkout');
  const [generatedOrder, setGeneratedOrder] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof OrderCustomer, val: string) => {
    setCustomer(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate luxury card payment delay
    setTimeout(() => {
      const orderId = `AURA-${Math.floor(10000 + Math.random() * 90000)}`;
      const orderDate = new Date().toISOString();
      const items = cartItems.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor.name
      }));

      const newOrder: Order = {
        id: orderId,
        date: orderDate,
        customer,
        items,
        subtotal: checkoutMetrics.subtotal,
        discount: checkoutMetrics.discount,
        tax: checkoutMetrics.tax,
        premiumPackaging: checkoutMetrics.premiumPackaging,
        shipping: checkoutMetrics.shipping,
        total: checkoutMetrics.total,
        status: 'Pending'
      };

      setGeneratedOrder(newOrder);
      
      // Notify Parent app to adjust stocks, add order to general lists and clear cart
      onCompleteOrder(customer, {
        customer,
        items,
        subtotal: checkoutMetrics.subtotal,
        discount: checkoutMetrics.discount,
        tax: checkoutMetrics.tax,
        premiumPackaging: checkoutMetrics.premiumPackaging,
        shipping: checkoutMetrics.shipping,
        total: checkoutMetrics.total,
        status: 'Pending'
      });

      setIsSubmitting(false);
      setStep('success');
    }, 1800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-stone-950/85 backdrop-blur-[2px] cursor-pointer"
          onClick={step === 'success' ? undefined : onClose}
        />

        {/* Modal Main container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-stone-900 border border-stone-850 text-stone-100 max-w-4xl w-full rounded-none overflow-hidden shadow-2xl z-20 max-h-[92vh] flex flex-col"
        >
          
          {step === 'checkout' && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white bg-stone-950/40 hover:bg-stone-950/80 transition-colors rounded-full z-30 cursor-pointer"
              id="close-checkout-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {step === 'checkout' ? (
            /* STEP 1: PAYMENT & BILLING DETAILS */
            <form onSubmit={handleSubmitOrder} className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-stone-800 overflow-y-auto">
              
              {/* Left Wing Form: Client & Address Details */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="font-serif text-lg text-amber-500 uppercase tracking-widest">
                    Courier & Billing Address
                  </h3>
                  <p className="text-[10px] text-stone-400 font-mono tracking-widest uppercase mt-1">
                    Premium insured transit
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider text-stone-400 uppercase">
                      Recipient Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-stone-500" />
                      <input
                        type="text"
                        value={customer.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full bg-stone-950/40 border border-stone-800 pl-10 pr-3 py-3 text-stone-100 outline-none focus:border-amber-500/50 font-serif"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider text-stone-400 uppercase">
                      Contact Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-500" />
                      <input
                        type="email"
                        value={customer.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full bg-stone-950/40 border border-stone-800 pl-10 pr-3 py-3 text-stone-100 outline-none focus:border-amber-500/50 font-mono"
                        required
                      />
                    </div>
                  </div>

                  {/* Street address */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider text-stone-400 uppercase">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={customer.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="w-full bg-stone-950/40 border border-stone-800 px-3 py-3 text-stone-100 outline-none focus:border-amber-500/50 font-serif"
                      required
                    />
                  </div>

                  {/* City and Zip */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono tracking-wider text-stone-400 uppercase">
                        City / Province
                      </label>
                      <input
                        type="text"
                        value={customer.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="w-full bg-stone-950/40 border border-stone-800 px-3 py-3 text-stone-100 outline-none focus:border-amber-500/50 font-serif"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono tracking-wider text-stone-400 uppercase">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={customer.zip}
                        onChange={(e) => handleInputChange("zip", e.target.value)}
                        className="w-full bg-stone-950/40 border border-stone-800 px-3 py-3 text-stone-100 outline-none focus:border-amber-500/50 font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Simulated Order Items Recap */}
                <div className="border-t border-stone-800 pt-5 space-y-3">
                  <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase">
                    Checkout Item Recap
                  </span>
                  <div className="max-h-[140px] overflow-y-auto space-y-2 pr-2">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1">
                        <span className="text-stone-300 font-serif truncate pr-4 max-w-[200px]">
                          {item.product.name}
                        </span>
                        <span className="text-stone-500 font-mono text-[11px] shrink-0">
                          {item.quantity}x @ {brandConfig.currencySymbol}{item.product.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Wing Form: Platinum Interactive Card Payment */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 space-y-6 bg-stone-950/30 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg text-amber-500 uppercase tracking-widest">
                    VVIP Payment Details
                  </h3>
                  <p className="text-[10px] text-stone-400 font-mono tracking-widest uppercase mt-1">
                    Bespoke high-limit card routing
                  </p>
                </div>

                {/* Golden Platinum Interactive Luxury Custom Card display */}
                <div className="aspect-[1.586/1] w-full rounded-2xl bg-gradient-to-tr from-stone-900 via-amber-950/40 to-amber-700/35 border border-amber-500/25 p-5 sm:p-6 text-stone-100 flex flex-col justify-between shadow-xl relative overflow-hidden select-none">
                  {/* Subtle watermarked grid lines for texture */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.06),transparent_60%)] pointer-events-none" />
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[8px] tracking-[0.34em] font-mono uppercase text-stone-400">Centurion Private Selection</p>
                      <h4 className="font-serif text-xl tracking-[0.1em] text-amber-500 uppercase mt-0.5 font-light">
                        {brandConfig.brandName} Platinum
                      </h4>
                    </div>
                    {/* Golden luxury credit card chip */}
                    <div className="w-10 h-8 rounded-md bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-500 border border-amber-300/30 flex flex-col justify-center gap-1 p-1">
                      <div className="h-0.5 w-full bg-stone-950/20" />
                      <div className="grid grid-cols-2 gap-1 flex-1">
                        <div className="bg-stone-950/10 rounded-sm" />
                        <div className="bg-stone-950/10 rounded-sm" />
                      </div>
                      <div className="h-0.5 w-full bg-stone-950/20" />
                    </div>
                  </div>

                  {/* Card Number display */}
                  <div className="font-mono text-base sm:text-lg tracking-[0.18em] text-stone-200 mt-4 text-center">
                    {cardNumber || "••••  ••••  ••••  ••••"}
                  </div>

                  <div className="flex items-end justify-between font-mono">
                    <div className="text-left">
                      <p className="text-[7px] text-stone-500 tracking-wider uppercase">Card Holder</p>
                      <p className="text-[10px] text-stone-300 uppercase tracking-widest mt-0.5 line-clamp-1 max-w-[170px]">
                        {cardHolder || "VALUED MEMBER"}
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <div className="text-right">
                        <p className="text-[7px] text-stone-500 tracking-wider uppercase font-mono">Good Thru</p>
                        <p className="text-[10px] text-stone-300 tracking-widest mt-0.5">
                          {cardExpiry || "12/32"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[7px] text-stone-500 tracking-wider uppercase font-mono">CVV</p>
                        <p className="text-[10px] text-stone-300 tracking-widest mt-0.5">
                          {cardCVV || "•••"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card input forms */}
                <div className="space-y-4 text-xs mt-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider text-stone-400 uppercase">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 w-4 h-4 text-stone-500" />
                      <input
                        type="text"
                        maxLength={22}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-stone-950/40 border border-stone-800 pl-10 pr-3 py-2.5 text-stone-100 outline-none focus:border-amber-500/50 font-mono tracking-widest text-center"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-mono tracking-wider text-stone-400 uppercase">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        className="w-full bg-stone-950/40 border border-stone-800 px-3 py-2.5 text-stone-100 outline-none focus:border-amber-500/50 font-mono text-center uppercase"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono tracking-wider text-stone-400 uppercase">
                        Expiry
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-stone-950/40 border border-stone-800 px-3 py-2.5 text-stone-100 outline-none focus:border-amber-500/50 font-mono text-center"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Checkout metrics display and Order Submission button */}
                <div className="mt-8 pt-5 border-t border-stone-800 space-y-4">
                  <div className="flex items-end justify-between font-mono">
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest">Total Transaction</span>
                    <span className="font-serif text-xl font-bold text-amber-500">
                      {brandConfig.currencySymbol}{checkoutMetrics.total.toLocaleString()}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-amber-500 text-stone-950 text-xs font-mono font-bold tracking-[0.2em] uppercase hover:bg-amber-400 active:bg-amber-600 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10"
                    disabled={isSubmitting}
                    id="submit-auth-order-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-stone-950" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Authenticating Funds...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-stone-950" />
                        <span>Authorize Safe Payment</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </form>
          ) : (
            /* STEP 2: PURCHASE CONGRATULATIONS & VVIP RECEIPT */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-6 overflow-y-auto"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle className="w-8 h-8 stroke-1 animate-bounce" />
              </div>

              <div>
                <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500 font-mono font-medium block mb-2">
                  Heritage Purchase Confirmed
                </span>
                <h2 className="text-3xl font-serif font-light text-stone-100 uppercase tracking-wider" id="checkout-success-title">
                  Thank You, {customer.name}
                </h2>
                <p className="text-xs text-stone-400 font-sans tracking-wide mt-2.5 max-w-lg mx-auto font-light leading-relaxed">
                  Your funds have been securely authenticated. A bespoke selection has been registered under invoice <span className="font-mono text-amber-500">{generatedOrder?.id}</span> and allocated for premium packing.
                </p>
              </div>

              {/* Invoice slip representation */}
              <div className="w-full max-w-md p-6 bg-stone-950/50 border border-stone-850/80 text-left text-xs font-mono select-text relative space-y-4">
                <div className="absolute top-0 inset-x-0 h-1 bg-amber-500" />
                
                <div className="flex justify-between border-b border-stone-850 pb-2">
                  <span className="text-[9px] text-stone-500 uppercase tracking-widest">Aura Fine Register</span>
                  <span className="text-stone-300">{generatedOrder?.id}</span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <p className="text-[9px] text-stone-500 uppercase tracking-widest mb-1 font-bold">Delivery Address</p>
                  <p className="text-stone-200 font-serif">{customer.name}</p>
                  <p className="text-stone-400 font-serif">{customer.address}, {customer.zip}</p>
                  <p className="text-stone-400 font-serif">{customer.city}, EU</p>
                  <p className="text-stone-400 font-mono">{customer.email}</p>
                </div>

                <div className="space-y-2 border-t border-stone-850 pt-3">
                  <p className="text-[9px] text-stone-500 uppercase tracking-widest mb-1 font-bold">Acquisitions</p>
                  {generatedOrder?.items.map((it: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-stone-400 font-serif max-w-[240px] truncate">{it.name} ({it.selectedSize})</span>
                      <span className="text-stone-200">{it.quantity}x €{it.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 text-[11px] border-t border-stone-850 pt-3 text-stone-400">
                  <div className="flex justify-between">
                    <span>Valued Subtotal</span>
                    <span className="text-stone-300">€{generatedOrder?.subtotal.toLocaleString()}</span>
                  </div>
                  {generatedOrder?.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Premium Promotion</span>
                      <span>-€{generatedOrder?.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Courier Delivery (Fully Insured)</span>
                    <span className="text-stone-300">{generatedOrder?.shipping === 0 ? "Complimentary" : `€${generatedOrder?.shipping}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VVIP Gold Foil Custom Packaging</span>
                    <span className="text-stone-300">{generatedOrder?.premiumPackaging ? "Enabled" : "Disabled"}</span>
                  </div>
                  <div className="flex justify-between border-t border-stone-900/60 pt-2 text-stone-100 font-bold">
                    <span className="uppercase text-amber-500 font-serif">Total Deducted</span>
                    <span>€{generatedOrder?.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Call to actions to close success */}
              <button
                onClick={onClose}
                className="px-8 py-3.5 bg-stone-100 text-stone-950 text-xs tracking-[0.2em] font-mono font-bold uppercase hover:bg-white transition-colors cursor-pointer flex items-center gap-2 group shadow-xl"
                id="close-success-btn"
              >
                <span>Complete & Re-enter Boutique</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-1.5 text-[9px] tracking-widest text-stone-500 font-mono uppercase">
                <Package className="w-3.5 h-3.5 text-amber-500/50" />
                <span>Shipping tracking number was sent to your email</span>
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
