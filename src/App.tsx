import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AdminDashboard from './components/AdminDashboard';
import { 
  INITIAL_BRAND_CONFIG, 
  INITIAL_COLLECTIONS, 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_SALES_TRENDS, 
  INITIAL_CATEGORY_DATA 
} from './constants';
import { Product, BrandConfig, CartItem, Order, OrderCustomer, SalesDataPoint, CategoryDataPoint, ColorOption } from './types';
import { PackageOpen, Sparkles, X, Heart, ShieldAlert } from 'lucide-react';

export default function App() {

  // Load Persisted Storage Core Data or fallback to structural presets
  const [brandConfig, setBrandConfig] = useState<BrandConfig>(() => {
    const saved = localStorage.getItem('aura_brand_config');
    return saved ? JSON.parse(saved) : INITIAL_BRAND_CONFIG;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('aura_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('aura_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [salesTrends, setSalesTrends] = useState<SalesDataPoint[]>(() => {
    const saved = localStorage.getItem('aura_sales_trends');
    return saved ? JSON.parse(saved) : INITIAL_SALES_TRENDS;
  });

  const [categoryData, setCategoryData] = useState<CategoryDataPoint[]>(() => {
    const saved = localStorage.getItem('aura_category_data');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORY_DATA;
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('aura_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('aura_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Synced local Storage Side-Effects
  useEffect(() => {
    localStorage.setItem('aura_brand_config', JSON.stringify(brandConfig));
  }, [brandConfig]);

  useEffect(() => {
    localStorage.setItem('aura_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('aura_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('aura_sales_trends', JSON.stringify(salesTrends));
  }, [salesTrends]);

  useEffect(() => {
    localStorage.setItem('aura_category_data', JSON.stringify(categoryData));
  }, [categoryData]);

  useEffect(() => {
    localStorage.setItem('aura_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // General Interface Toggles
  const [isAdminView, setIsAdminView] = useState(false);
  const [currentCollection, setCurrentCollection] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutMetrics, setCheckoutMetrics] = useState<any | null>(null);

  // Live Toast feedback notification indicators
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Add Product to Cart Item
  const handleAddToCart = (product: Product, size: string, color: ColorOption, qty: number) => {
    const cartItemId = `${product.id}-${size}-${color.name}`;
    
    // Check if limits exceeded
    if (qty > product.stock) {
      triggerToast(`Sorry, we only have ${product.stock} items of this piece in our collection.`);
      return;
    }

    const existingIndex = cartItems.findIndex(item => item.id === cartItemId);

    if (existingIndex > -1) {
      const updated = [...cartItems];
      const newQty = updated[existingIndex].quantity + qty;
      if (newQty > product.stock) {
        triggerToast(`You already have ${updated[existingIndex].quantity} of this piece in your bag. Cannot exceed stock of ${product.stock}.`);
        return;
      }
      updated[existingIndex].quantity = newQty;
      setCartItems(updated);
    } else {
      setCartItems(prev => [...prev, {
        id: cartItemId,
        product,
        selectedSize: size,
        selectedColor: color,
        quantity: qty
      }]);
    }

    triggerToast(`Added ${qty}x ${product.name} to your custom Shopping Bag.`);
  };

  // Quick Add from grid (uses default size and color for instant action)
  const handleQuickAddDirect = (product: Product) => {
    const defaultSize = product.sizes[0] || "Standard Fit";
    const defaultColor = product.colors[0] || { name: "Default", value: "#000000" };
    handleAddToCart(product, defaultSize, defaultColor, 1);
  };

  const handleUpdateCartQty = (cartItemId: string, qty: number) => {
    const item = cartItems.find(i => i.id === cartItemId);
    if (!item) return;
    
    if (qty > item.product.stock) {
      triggerToast(`Exceeds storehouse capacity. ONLY ${item.product.stock} pieces exist.`);
      return;
    }

    setCartItems(prev =>
      prev.map(i => i.id === cartItemId ? { ...i, quantity: qty } : i)
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems(prev => prev.filter(i => i.id !== cartItemId));
    triggerToast("Piece removed from shopping bag.");
  };

  // Toggle client wishlist collection
  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some(item => item.id === product.id);
    if (exists) {
      setWishlist(prev => prev.filter(item => item.id !== product.id));
      triggerToast(`${product.name} removed from your wishlist.`);
    } else {
      setWishlist(prev => [...prev, product]);
      triggerToast(`${product.name} saved to your custom premium wishlist.`);
    }
  };

  // Add client product review statement
  const handleAddReview = (productId: string, rating: number, comment: string, author: string) => {
    const updatedProducts = products.map((p) => {
      if (p.id === productId) {
        const newReview = {
          id: `rev-${p.id}-${Date.now()}`,
          userName: author,
          rating,
          comment,
          date: new Date().toISOString().split('T')[0]
        };

        const nextReviews = [newReview, ...p.reviews];
        const nextRating = parseFloat(
          (nextReviews.reduce((sum, r) => sum + r.rating, 0) / nextReviews.length).toFixed(2)
        );

        return {
          ...p,
          reviews: nextReviews,
          rating: nextRating
        };
      }
      return p;
    });

    setProducts(updatedProducts);
  };

  // Proceeds values to the checkout panel
  const handleProceedToCheckout = (metrics: any) => {
    setCheckoutMetrics(metrics);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Complete customer order checkout
  const handleCompleteOrder = (customer: OrderCustomer, orderDetails: Omit<Order, 'id' | 'date'>) => {
    const orderId = `AURA-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderDate = new Date().toISOString();
    
    const finalOrder: Order = {
      ...orderDetails,
      id: orderId,
      date: orderDate
    };

    // 1. Deduct stock levels in products state
    const nextProducts = products.map((p) => {
      const orderItem = orderDetails.items.find((item) => item.id === p.id);
      if (orderItem) {
        return {
          ...p,
          stock: Math.max(0, p.stock - orderItem.quantity)
        };
      }
      return p;
    });
    setProducts(nextProducts);

    // 2. Append order log
    const nextOrders = [finalOrder, ...orders];
    setOrders(nextOrders);

    // 3. Update financial salesTrends area chart
    const today = "June 15";
    const trends = [...salesTrends];
    const todayIndex = trends.findIndex(t => t.date === today);
    if (todayIndex > -1) {
      trends[todayIndex].sales = parseFloat((trends[todayIndex].sales + finalOrder.total).toFixed(2));
      trends[todayIndex].orders += 1;
    } else {
      trends.push({ date: today, sales: finalOrder.total, orders: 1 });
    }
    setSalesTrends(trends);

    // 4. Update product category sales weight chart
    const categs = [...categoryData];
    orderDetails.items.forEach(it => {
      // Find category of item
      const itemProduct = products.find(p => p.id === it.id);
      if (itemProduct) {
        const catIdx = categs.findIndex(c => c.name === itemProduct.category);
        if (catIdx > -1) {
          categs[catIdx].value += Math.round(it.price * it.quantity);
        }
      }
    });
    setCategoryData(categs);

    // 5. Expel current shopping items
    setCartItems([]);
  };

  // VVIP GUEST ORDER SIMULATOR ACTION
  const handleSimulateGuestOrder = () => {
    // List of premium client names
    const names = [
      { name: "Contessa Allegra de Medici", email: "allegra.medici@firenze-heritage.it", address: "Piazza della Signoria 8", city: "Florence", zip: "50122" },
      { name: "Baroness Claudine de Rothschild", email: "claudine@rothschildestate.ch", address: "Rue des Granges 14", city: "Geneva", zip: "1204" },
      { name: "Lady Arabella Churchill-Spencer", email: "arabella.ch@oxford-vibe.co.uk", address: "Blenheim Lodge Palace", city: "Woodstock", zip: "OX20 1PP" },
      { name: "Sébastien de Rive Gauche", email: "sebastien@rivegauche-atelier.fr", address: "84 Rue de l'Université", city: "Paris", zip: "75007" },
      { name: "Katherina von Österreich", email: "katherina.oe@vienna-imperial.at", address: "Am Hof Palace Square 3", city: "Vienna", zip: "1010" }
    ];

    // Select random client credentials
    const chosenClient = names[Math.floor(Math.random() * names.length)];

    // Find available in stock items
    const available = products.filter(p => p.stock > 0);
    if (available.length === 0) {
      triggerToast("Storehouse is completely cleared! Adjust stock levels inside Inventory first.");
      return;
    }

    // Purchase 1 random luxurious piece
    const chosenProduct = available[Math.floor(Math.random() * available.length)];
    const chosenSize = chosenProduct.sizes[0] || "Standard Fit";
    const chosenColor = chosenProduct.colors[0] || { name: "Default", value: "#000000" };
    const quantity = 1;

    // Subtotal calculations
    const subtotal = chosenProduct.price * quantity;
    const isVipdiscount = Math.random() > 0.4;
    const appliedCode = isVipdiscount ? brandConfig.discountCodes[0] : null;
    const discount = appliedCode ? Math.round(subtotal * (appliedCode.percentage / 100)) : 0;
    
    const net = subtotal - discount;
    const tax = Math.round(net * brandConfig.taxRate);
    const premiumPackaging = Math.random() > 0.3;
    const packageFee = premiumPackaging ? brandConfig.premiumPackagingFee : 0;
    const shipping = net >= brandConfig.freeShippingThreshold ? 0 : brandConfig.shippingFee;
    const grandTotal = net + tax + packageFee + shipping;

    // Assemble simulated transaction payload
    const orderId = `AURA-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderDate = new Date().toISOString();

    const simulatedOrder: Order = {
      id: orderId,
      date: orderDate,
      customer: chosenClient,
      items: [{
        id: chosenProduct.id,
        name: chosenProduct.name,
        price: chosenProduct.price,
        quantity,
        selectedSize: chosenSize,
        selectedColor: chosenColor.name
      }],
      subtotal,
      discount,
      tax,
      premiumPackaging,
      shipping,
      total: grandTotal,
      status: 'Pending'
    };

    // Commit to state database
    // 1. Deduct stock levels in products state
    const nextProducts = products.map((p) => {
      if (p.id === chosenProduct.id) {
        return {
          ...p,
          stock: Math.max(0, p.stock - 1)
        };
      }
      return p;
    });
    setProducts(nextProducts);

    // 2. Add to orders
    setOrders(prev => [simulatedOrder, ...prev]);

    // 3. Add to Area graph Trends
    const trends = [...salesTrends];
    const today = "June 15";
    const todayIdx = trends.findIndex(t => t.date === today);
    if (todayIdx > -1) {
      trends[todayIdx].sales = parseFloat((trends[todayIdx].sales + grandTotal).toFixed(2));
      trends[todayIdx].orders += 1;
    } else {
      trends.push({ date: today, sales: grandTotal, orders: 1 });
    }
    setSalesTrends(trends);

    // 4. Update Pie Categories Share Weights
    const categs = [...categoryData];
    const catIdx = categs.findIndex(c => c.name === chosenProduct.category);
    if (catIdx > -1) {
      categs[catIdx].value += subtotal;
    }
    setCategoryData(categs);

    triggerToast(`Simulation: ${chosenClient.name} purchased ${chosenProduct.name} for ${brandConfig.currencySymbol}${grandTotal.toLocaleString()}!`);
  };

  // Filter storefront list
  const filteredProducts = products.filter((p) => {
    if (currentCollection === "all") return true;
    return p.category.toLowerCase() === currentCollection.toLowerCase();
  });

  return (
    <div className="bg-[#FDFCFB] min-h-screen text-[#1A1A1A] selection:bg-[#C5A059]/10 selection:text-[#1A1A1A] flex flex-col font-sans">
      
      {/* 1. Navigations Area */}
      <Navbar
        brandConfig={brandConfig}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        wishlistCount={wishlist.length}
        isAdminView={isAdminView}
        setIsAdminView={setIsAdminView}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        currentCollection={currentCollection}
        setCurrentCollection={setCurrentCollection}
      />

      {/* 2. Main content switch */}
      <div className="flex-1">
        {isAdminView ? (
          /* TAB MODE 2: THE DETAILED ADMIN PERFORMANCE DASHBOARD */
          <AdminDashboard
            brandConfig={brandConfig}
            setBrandConfig={setBrandConfig}
            products={products}
            setProducts={setProducts}
            orders={orders}
            setOrders={setOrders}
            salesTrends={salesTrends}
            setSalesTrends={setSalesTrends}
            categoryData={categoryData}
            setCategoryData={setCategoryData}
            onSimulateOrder={handleSimulateGuestOrder}
          />
        ) : (
          /* TAB MODE 1: CLIENT LUXURY RETAIL STOREFRONT */
          <div className="space-y-16 pb-20 bg-[#FDFCFB]">
            
            {/* Majestic Hero Cover */}
            <Hero 
              brandConfig={brandConfig} 
              onExploreClick={() => {
                const target = document.getElementById("boutique-showcase-grid");
                target?.scrollIntoView({ behavior: 'smooth' });
              }} 
            />

            {/* Main retail showcase area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16" id="boutique-showcase-grid">
              
              {/* Seasonal Curations Headings */}
              <div className="text-center max-w-xl mx-auto">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A059] font-mono font-semibold block mb-2.5">
                  Private Curations Showcase
                </span>
                <h3 className="text-3xl font-serif text-[#1A1A1A] tracking-wide uppercase font-light leading-snug">
                  {currentCollection === 'all' ? "The Entire House Catalog" : `${currentCollection} Selection`}
                </h3>
                <div className="w-12 h-px bg-[#C5A059]/55 mx-auto mt-4" />
                <p className="text-gray-500 text-xs mt-3.5 leading-relaxed font-sans font-light">
                  Browse our meticulously crafted ready-to-wear pieces, high durable hand-stitched leather trunks, and fine Riviera accessories.
                </p>
              </div>

              {/* Collections Navigation Banner (Only shown in 'all' view) */}
              {currentCollection === "all" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {INITIAL_COLLECTIONS.map((c) => (
                    <div 
                      key={c.id}
                      onClick={() => {
                        setCurrentCollection(c.name);
                        const labelMap: Record<string, string> = {
                          "Ready-To-Wear": "nav-tab-rtw",
                          "Leather Goods": "nav-tab-leather",
                          "Accessories": "nav-tab-access"
                        };
                        const elemId = labelMap[c.name];
                        if (elemId) {
                          document.getElementById(elemId)?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                      }}
                      className="group relative h-64 border border-gray-100 overflow-hidden cursor-pointer bg-white transition-all duration-300"
                    >
                      <img
                        src={c.image}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover object-center opacity-70 group-hover:opacity-85 scale-100 group-hover:scale-102 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/30 to-transparent" />
                      
                      <div className="absolute bottom-6 inset-x-6 space-y-1">
                        <span className="text-[9px] tracking-widest text-[#C5A059] font-mono uppercase font-semibold">Private Label</span>
                        <h4 className="text-lg font-serif text-[#1A1A1A] font-light select-none tracking-wide">{c.name}</h4>
                        <p className="text-[10px] text-gray-500 font-light line-clamp-1">{c.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Products Catalog Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 border border-gray-100 rounded-none p-8">
                  <PackageOpen className="w-12 h-12 text-gray-400 mx-auto stroke-1" />
                  <p className="text-gray-500 italic font-mono text-xs mt-3">All pieces are currently sold out in this collection.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                  {filteredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      brandConfig={brandConfig}
                      onViewDetail={(item) => {
                        setSelectedProduct(item);
                        setIsProductModalOpen(true);
                      }}
                      onToggleWishlist={handleToggleWishlist}
                      isWishlisted={wishlist.some(it => it.id === p.id)}
                      onAddToCartDirect={handleQuickAddDirect}
                    />
                  ))}
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {/* 3. Product Examine Dialog Overlay */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
        brandConfig={brandConfig}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedProduct ? wishlist.some(it => it.id === selectedProduct.id) : false}
        onAddReview={handleAddReview}
      />

      {/* 4. Right Side Cart Drawer Overlay */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        brandConfig={brandConfig}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* 5. Secure Payment Modal Terminal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setCheckoutMetrics(null);
        }}
        brandConfig={brandConfig}
        cartItems={cartItems}
        checkoutMetrics={checkoutMetrics}
        onCompleteOrder={handleCompleteOrder}
      />

      {/* 6. Wishlist sidebar dialog */}
      <AnimatePresence>
        {isWishlistOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            
            <div 
              className="absolute inset-0 bg-stone-950/85 backdrop-blur-[2px] cursor-pointer"
              onClick={() => setIsWishlistOpen(false)}
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.35 }}
                className="w-screen max-w-md bg-stone-900 border-l border-stone-800 text-stone-100 shadow-2xl flex flex-col h-full"
              >
                {/* Header */}
                <div className="p-6 border-b border-stone-850 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4.5 h-4.5 text-amber-500 fill-current" />
                    <span className="font-serif text-lg text-amber-500 uppercase tracking-widest block pt-0.5">
                      Your Saved Pieces
                    </span>
                  </div>
                  <button
                    onClick={() => setIsWishlistOpen(false)}
                    className="p-2 text-stone-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Wishlist item listings */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {wishlist.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                      <Heart className="w-10 h-10 text-stone-700 stroke-1" />
                      <p className="font-serif text-stone-300 font-light text-sm uppercase">No Bookmarks Saved</p>
                      <p className="text-stone-500 text-xs font-light max-w-xs leading-relaxed">
                        Examine pieces in our curated catalog and tap the heart icon to save items for future review.
                      </p>
                    </div>
                  ) : (
                    wishlist.map((p) => {
                      const isOut = p.stock <= 0;
                      return (
                        <div key={p.id} className="flex gap-4 p-3 bg-stone-950/30 border border-stone-850">
                          <div className="w-14 h-16 bg-stone-950 overflow-hidden relative shrink-0 cursor-pointer" onClick={() => {
                            setSelectedProduct(p);
                            setIsProductModalOpen(true);
                            setIsWishlistOpen(false);
                          }}>
                            <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                          </div>

                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div>
                              <div className="flex justify-between items-start">
                                <h4 
                                  onClick={() => {
                                    setSelectedProduct(p);
                                    setIsProductModalOpen(true);
                                    setIsWishlistOpen(false);
                                  }}
                                  className="text-xs font-serif font-light text-stone-200 truncate cursor-pointer hover:text-amber-500"
                                >
                                  {p.name}
                                </h4>
                                <button
                                  onClick={() => handleToggleWishlist(p)}
                                  className="text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
                                  title="Unsave"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-[9px] font-mono text-amber-500/70 mt-0.5 uppercase tracking-wider">{p.category}</p>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs font-serif text-stone-300">
                                {brandConfig.currencySymbol}{p.price.toLocaleString()}
                              </span>
                              
                              {!isOut ? (
                                <button
                                  onClick={() => {
                                    handleQuickAddDirect(p);
                                    setIsWishlistOpen(false);
                                  }}
                                  className="px-3 py-1 bg-amber-500 text-stone-950 text-[9px] font-semibold font-mono uppercase tracking-wider hover:bg-amber-400 transition-colors cursor-pointer"
                                >
                                  Move To Bag
                                </button>
                              ) : (
                                <span className="text-[9px] font-mono text-stone-600 uppercase tracking-widest text-[9px]">Sold Out</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              </motion.div>
            </div>

          </div>
        )}
      </AnimatePresence>

      {/* 7. Compliant Floating Micro Feedback Toast Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-stone-900 border-l-4 border-amber-500 text-stone-100 p-4 shadow-2xl flex items-center justify-between gap-3 font-mono text-xs animate-slide-up select-none">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-amber-400 shrink-0" />
            <p className="leading-relaxed font-light">{toastMessage}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-stone-500 hover:text-white shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom informational bar */}
      <footer className="bg-stone-950 border-t border-stone-900 py-10 text-center text-xs text-stone-500 font-mono tracking-wider">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <p className="uppercase text-[9px] tracking-[0.3em] text-amber-500/80">
            {brandConfig.brandName} Haute Couture & Co. • Madrid • Paris • Rome • London
          </p>
          <p className="font-sans font-light text-stone-600 text-[10px] max-w-md mx-auto leading-relaxed">
            All materials are responsibly and ethically sourced. Traditional hand loom finishes and double-face cashmere tailoring.
          </p>
          <div className="flex items-center justify-center gap-1 text-[10px] text-stone-700 font-mono">
            <span>Powered by</span>
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Luxury Client Playground VM</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
