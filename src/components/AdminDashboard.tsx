import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Euro, 
  Settings, 
  Layers, 
  Package, 
  Users, 
  Plus, 
  Trash2, 
  ChevronRight, 
  RefreshCw, 
  Play, 
  Sliders,
  DollarSign
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';
import { Product, BrandConfig, Order, SalesDataPoint, CategoryDataPoint, DiscountCode } from '../types';

interface AdminDashboardProps {
  brandConfig: BrandConfig;
  setBrandConfig: (config: BrandConfig) => void;
  products: Product[];
  setProducts: (prods: Product[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  salesTrends: SalesDataPoint[];
  setSalesTrends: (trends: SalesDataPoint[]) => void;
  categoryData: CategoryDataPoint[];
  setCategoryData: (data: CategoryDataPoint[]) => void;
  onSimulateOrder: () => void;
}

export default function AdminDashboard({
  brandConfig,
  setBrandConfig,
  products,
  setProducts,
  orders,
  setOrders,
  salesTrends,
  setSalesTrends,
  categoryData,
  setCategoryData,
  onSimulateOrder
}: AdminDashboardProps) {

  // Active section state inside Admin Console
  const [adminTab, setAdminTab] = useState<'analytics' | 'products' | 'orders' | 'config'>('analytics');

  // Config editor state
  const [editBrandName, setEditBrandName] = useState(brandConfig.brandName);
  const [editTagline, setEditTagline] = useState(brandConfig.tagline);
  const [editShipping, setEditShipping] = useState(brandConfig.shippingFee);
  const [editThreshold, setEditThreshold] = useState(brandConfig.freeShippingThreshold);
  const [editTax, setEditTax] = useState(brandConfig.taxRate * 100);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponPct, setNewCouponPct] = useState(15);
  const [configSuccess, setConfigSuccess] = useState(false);

  // Product editing local actions
  const handleStockAdjust = (productId: string, amount: number) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        return { ...p, stock: Math.max(0, p.stock + amount) };
      }
      return p;
    });
    setProducts(updated);
  };

  const handlePriceAdjust = (productId: string, newPrice: number) => {
    if (newPrice < 1) return;
    const updated = products.map((p) => {
      if (p.id === productId) {
        return { ...p, price: newPrice };
      }
      return p;
    });
    setProducts(updated);
  };

  // KPI Calculations
  const totalSalesVal = Math.round(orders.reduce((acc, o) => acc + o.total, 0));
  const totalOrdersVal = orders.length;
  const avgOrderValue = totalOrdersVal > 0 ? Math.round(totalSalesVal / totalOrdersVal) : 0;
  const lowStockCount = products.filter(p => p.stock <= 4).length;

  // Saved general configs
  const handleSaveBrandConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setBrandConfig({
      ...brandConfig,
      brandName: editBrandName,
      tagline: editTagline,
      shippingFee: Number(editShipping),
      freeShippingThreshold: Number(editThreshold),
      taxRate: Number(editTax) / 100
    });
    setConfigSuccess(true);
    setTimeout(() => setConfigSuccess(false), 2500);
  };

  // Add Invitation Promo Coupon Code
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    
    const updatedCoupons = [
      ...brandConfig.discountCodes,
      {
        code: newCouponCode.substring(0, 15).toUpperCase().trim(),
        percentage: Number(newCouponPct),
        description: `${newCouponPct}% Off - Dynamic Custom Administration Code`
      }
    ];

    setBrandConfig({
      ...brandConfig,
      discountCodes: updatedCoupons
    });

    setNewCouponCode("");
    setNewCouponPct(15);
  };

  // Delete Coupon
  const handleDeleteCoupon = (codeToDelete: string) => {
    const filtered = brandConfig.discountCodes.filter(c => c.code !== codeToDelete);
    setBrandConfig({
      ...brandConfig,
      discountCodes: filtered
    });
  };

  const COLORS = ['#D97706', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

  return (
    <div className="bg-stone-900 min-h-screen text-stone-100 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-stone-800">
      
      {/* Sidebar Control Deck */}
      <div className="w-full md:w-64 p-6 flex flex-col justify-between shrink-0 bg-stone-950/40">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Sliders className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif text-sm tracking-[0.25em] uppercase text-stone-100">
              Control Deck
            </h3>
          </div>

          <nav className="space-y-1.5 font-mono text-xs uppercase tracking-widest">
            <button
              onClick={() => setAdminTab('analytics')}
              className={`w-full flex items-center justify-between px-4 py-3 border transition-colors cursor-pointer ${
                adminTab === 'analytics'
                  ? "bg-amber-500/10 border-amber-500 text-amber-500 font-medium"
                  : "bg-transparent border-stone-850 hover:bg-stone-900/60 text-stone-400 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Analytics & Yield</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setAdminTab('products')}
              className={`w-full flex items-center justify-between px-4 py-3 border transition-colors cursor-pointer ${
                adminTab === 'products'
                  ? "bg-amber-500/10 border-amber-500 text-amber-500 font-medium"
                  : "bg-transparent border-stone-850 hover:bg-stone-900/60 text-stone-400 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>Inventory Master</span>
              </span>
              <div className="flex items-center gap-1.5">
                {lowStockCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                )}
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>

            <button
              onClick={() => setAdminTab('orders')}
              className={`w-full flex items-center justify-between px-4 py-3 border transition-colors cursor-pointer ${
                adminTab === 'orders'
                  ? "bg-amber-500/10 border-amber-500 text-amber-500 font-medium"
                  : "bg-transparent border-stone-850 hover:bg-stone-900/60 text-stone-400 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Recent Orders</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setAdminTab('config')}
              className={`w-full flex items-center justify-between px-4 py-3 border transition-colors cursor-pointer ${
                adminTab === 'config'
                  ? "bg-amber-500/10 border-amber-500 text-amber-500 font-medium"
                  : "bg-transparent border-stone-850 hover:bg-stone-900/60 text-stone-400 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Store Constants</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </nav>
        </div>

        {/* Dashboard Tools: Quick Order Simulator */}
        <div className="mt-8 border-t border-stone-800/80 pt-6 space-y-4">
          <div className="p-3 bg-stone-950/60 border border-stone-850 text-center">
            <span className="text-[9px] font-mono tracking-widest uppercase text-stone-500 font-bold block mb-1">
              Order Feed Simulator
            </span>
            <p className="text-[10px] text-stone-400 font-serif leading-relaxed mt-1">
              Trigger a random guest purchase to watch analytics compile dynamically.
            </p>
            <button
              onClick={onSimulateOrder}
              className="mt-3.5 w-full py-2 bg-amber-500 text-stone-950 text-[10px] tracking-wider uppercase font-mono font-bold hover:bg-amber-400 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Simulate Order</span>
            </button>
          </div>
        </div>

      </div>

      {/* Main Workspace Frame */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
        
        {/* Workspace Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
          <div>
            <h2 className="text-2xl font-serif font-light text-stone-100 uppercase tracking-wider">
              {adminTab === 'analytics' && "Atelier General Yield Analytics"}
              {adminTab === 'products' && "Heritage Storehouse Inventory"}
              {adminTab === 'orders' && "Order General Registry"}
              {adminTab === 'config' && "Establishment Constants Panel"}
            </h2>
            <p className="text-[10px] text-stone-400 font-mono tracking-widest uppercase mt-1">
              {brandConfig.brandName} • Operational Console Mode
            </p>
          </div>

          <div className="text-[10px] font-mono tracking-wider hover:text-amber-500 transition-all text-stone-500 text-left sm:text-right">
            <span>Date Center: 2026-06-15</span>
          </div>
        </div>

        {/* SECTION 1: KPIS AND CHARTS (ANALYTICS TAB) */}
        {adminTab === 'analytics' && (
          <div className="space-y-8 mt-8">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Total Sales */}
              <div className="bg-stone-950/40 border border-stone-850 p-5 rounded-none relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] tracking-widest font-mono text-stone-500 uppercase">Gross Sales Revenue</span>
                  <Euro className="w-4 h-4 text-amber-500" />
                </div>
                <h4 className="mt-3 text-2xl font-serif text-stone-100 font-semibold" id="kpi-sales">
                  {brandConfig.currencySymbol}{totalSalesVal.toLocaleString()}
                </h4>
                <p className="text-[9px] text-stone-500 font-mono mt-1 uppercase tracking-wide">Combined historical & checkout</p>
              </div>

              {/* Card 2: Total Orders */}
              <div className="bg-stone-950/40 border border-stone-850 p-5 rounded-none relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] tracking-widest font-mono text-stone-500 uppercase">Total Orders Logged</span>
                  <ShoppingBag className="w-4 h-4 text-amber-500" />
                </div>
                <h4 className="mt-3 text-2xl font-serif text-stone-100 font-semibold" id="kpi-orders">
                  {totalOrdersVal}
                </h4>
                <p className="text-[9px] text-stone-500 font-mono mt-1 uppercase tracking-next">Includes customer checkout</p>
              </div>

              {/* Card 3: Avg Order Worth */}
              <div className="bg-stone-950/40 border border-stone-850 p-5 rounded-none relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] tracking-widest font-mono text-stone-500 uppercase">Average Order Yield</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="mt-3 text-2xl font-serif text-stone-100 font-semibold" id="kpi-aov">
                  {brandConfig.currencySymbol}{avgOrderValue.toLocaleString()}
                </h4>
                <p className="text-[9px] text-stone-500 font-mono mt-1 uppercase tracking-wide">Aov per client cart checkout</p>
              </div>

              {/* Card 4: Inventory Alerts */}
              <div className="bg-stone-950/40 border border-stone-850 p-5 rounded-none relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] tracking-widest font-mono text-stone-500 uppercase">Warehouse Restocks Warning</span>
                  <Package className="w-4 h-4 text-red-400" />
                </div>
                <h4 className={`mt-3 text-2xl font-serif font-semibold ${lowStockCount > 0 ? "text-amber-500" : "text-emerald-400"}`} id="kpi-lowstock">
                  {lowStockCount} {lowStockCount === 1 ? "Item" : "Items"}
                </h4>
                <p className="text-[9px] text-stone-500 font-mono mt-1 uppercase tracking-wide">Stock level ≤ 4 alert banner</p>
              </div>

            </div>

            {/* Charts Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Chart 1: Revenue Area curves */}
              <div className="lg:col-span-2 bg-stone-950/30 border border-stone-850 p-5">
                <span className="text-[10px] tracking-widest font-mono text-amber-500 uppercase block mb-4">
                  Financial Sales Performance & Volume over Days
                </span>
                
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" />
                      <XAxis dataKey="date" stroke="#888888" fontSize={10} tickLine={false} />
                      <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1C1917', borderColor: '#292524', color: '#FAFAFA', fontSize: 11 }}
                        formatter={(value) => [`€${value}`, 'Revenue']}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#D97706" strokeWidth={1.5} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Category distribution Pie charts */}
              <div className="bg-stone-950/30 border border-stone-850 p-5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] tracking-widest font-mono text-amber-500 uppercase block mb-4">
                    Product Categories Sales Share
                  </span>
                  
                  <div className="h-[180px] w-full flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1C1917', borderColor: '#292524', color: '#FAFAFA', fontSize: 11 }}
                          formatter={(value) => [`€${value}`, 'Gross Value']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Categories labels summary */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-[9px] font-mono text-center">
                  {categoryData.map((d, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <span className="w-2.5 h-2.5 rounded-full block" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span className="text-stone-300 mt-1 uppercase line-clamp-1">{d.name}</span>
                      <span className="text-stone-500 mt-0.5">€{d.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Quick action simulation stats log */}
            <div className="bg-amber-500/5 border border-amber-500/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-serif font-light text-amber-500 uppercase tracking-widest">
                  Live Testing Dashboard Playground
                </h4>
                <p className="text-xs text-stone-400 font-sans tracking-wide font-light max-w-xl">
                  Try completing purchases in the storefront button to observe the real-time response. You can also trigger the order simulator to create instant high-value mock sales.
                </p>
              </div>
              <button
                onClick={onSimulateOrder}
                className="px-6 py-3 bg-amber-500 text-stone-950 font-mono text-[10px] font-bold tracking-widest uppercase hover:bg-amber-400 active:bg-amber-600 transition-colors cursor-pointer shrink-0"
              >
                Assemble Simulator Order
              </button>
            </div>

          </div>
        )}

        {/* SECTION 2: PRODUCT CATALOG ADJUSTMENTS (PRODUCTS TAB) */}
        {adminTab === 'products' && (
          <div className="space-y-6 mt-8">
            <span className="text-[10px] tracking-widest font-mono text-amber-500 uppercase block mb-2">
              Catalog Pricing & Warehouse Stocks Adjusters
            </span>

            <div className="overflow-x-auto border border-stone-850">
              <table className="w-full text-left font-sans text-xs divide-y divide-stone-850">
                <thead className="bg-stone-950/60 text-stone-400 font-mono text-[9px] tracking-widest uppercase">
                  <tr>
                    <th className="p-4">SKU / Piece Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4 text-center">Interactive Price</th>
                    <th className="p-4 text-center">Interactive Warehouse Stock</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-850 bg-stone-900/40 text-stone-300">
                  {products.map((p) => {
                    const isAlert = p.stock <= 4;
                    const isOut = p.stock <= 0;
                    return (
                      <tr key={p.id} className="hover:bg-stone-950/20 transition-colors">
                        {/* Title and details */}
                        <td className="p-4 max-w-xs">
                          <div className="flex gap-3">
                            <img
                              src={p.images[0]}
                              alt=""
                              className="w-10 h-12 object-cover bg-stone-950 shrink-0 border border-stone-800"
                            />
                            <div className="min-w-0">
                              <h4 className="font-serif font-light text-stone-100 truncate">{p.name}</h4>
                              <p className="text-[10px] font-mono text-stone-500 mt-1 uppercase tracking-wide">{p.sku}</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-4 font-mono text-[11px] text-amber-500/70">
                          {p.category}
                        </td>

                        {/* Price adjusters */}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5 font-mono">
                            <span>€</span>
                            <input
                              type="number"
                              value={p.price}
                              onChange={(e) => handlePriceAdjust(p.id, Number(e.target.value))}
                              className="w-20 bg-stone-950 border border-stone-800 text-stone-100 px-2 py-1 text-center focus:border-amber-500/50 outline-none"
                            />
                          </div>
                        </td>

                        {/* Stock adjusters */}
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2.5">
                            <button
                              onClick={() => handleStockAdjust(p.id, -1)}
                              className="w-6 h-6 border border-stone-800 flex items-center justify-center hover:bg-stone-950 hover:text-white transition-colors cursor-pointer text-stone-500"
                              disabled={p.stock <= 0}
                            >
                              -
                            </button>
                            <span className="font-mono text-stone-100 w-8 text-center font-bold">
                              {p.stock}
                            </span>
                            <button
                              onClick={() => handleStockAdjust(p.id, 1)}
                              className="w-6 h-6 border border-stone-800 flex items-center justify-center hover:bg-stone-950 hover:text-white transition-colors cursor-pointer text-stone-500"
                            >
                              +
                            </button>
                            <button
                              onClick={() => handleStockAdjust(p.id, 10)}
                              className="px-2 py-1 border border-stone-800 hover:border-stone-700 font-mono text-[9px] hover:text-amber-500 transition-all cursor-pointer text-stone-500"
                              title="Restock 10 items"
                            >
                              +10 Restock
                            </button>
                          </div>
                        </td>

                        {/* Status label */}
                        <td className="p-4 text-right">
                          {isOut ? (
                            <span className="px-2 py-0.5 bg-stone-950 border border-red-950 text-red-500/80 font-mono text-[9px] uppercase tracking-wide">
                              Sold Out
                            </span>
                          ) : isAlert ? (
                            <span className="px-2 py-0.5 bg-red-950/40 border border-red-550/20 text-amber-500 font-mono text-[9px] uppercase tracking-wide animate-pulse">
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-950/25 border border-emerald-900/30 text-emerald-400 font-mono text-[9px] uppercase tracking-wide">
                              Good Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 3: RECENT ONLINE TRANSACTIONS (ORDERS TAB) */}
        {adminTab === 'orders' && (
          <div className="space-y-6 mt-8">
            <span className="text-[10px] tracking-widest font-mono text-amber-500 uppercase block mb-2">
              Combined Transaction Register Logs
            </span>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-xs text-stone-500 italic font-mono text-center py-10">No customer transactions logged.</p>
              ) : (
                orders.map((o) => (
                  <div key={o.id} className="p-5 bg-stone-950/30 border border-stone-850 space-y-3 font-mono text-xs">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-900 pb-3">
                      <div className="space-y-0.5">
                        <span className="text-amber-500 font-bold">{o.id}</span>
                        <span className="text-stone-500 text-[10px] block">
                          Registered: {new Date(o.date).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-stone-400 uppercase">
                          Payment: <span className="text-emerald-400 font-sans">Authorized ✓</span>
                        </span>
                        <span className="bg-amber-500/10 text-amber-500 border border-amber-500/35 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-bold">
                          {o.status}
                        </span>
                      </div>
                    </div>

                    {/* Customer */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="space-y-1">
                        <span className="text-[9px] text-stone-500 uppercase tracking-widest font-bold">Client Consigned</span>
                        <p className="text-stone-200 font-serif text-sm">{o.customer.name}</p>
                        <p className="text-stone-400 text-[11px]">{o.customer.email}</p>
                      </div>

                      <div className="space-y-1 sm:text-right">
                        <span className="text-[9px] text-stone-500 uppercase tracking-widest font-bold">Courier Destination</span>
                        <p className="text-stone-300 text-[11px]">{o.customer.address}</p>
                        <p className="text-stone-400 text-[11px]">{o.customer.zip} {o.customer.city}</p>
                      </div>
                    </div>

                    {/* Items Purchased details */}
                    <div className="bg-stone-950/50 p-3 border border-stone-900 space-y-2">
                      <span className="text-[9px] text-stone-500 uppercase tracking-widest font-bold block mb-1">Acquired Items</span>
                      {o.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block" />
                            <span className="text-stone-300 font-serif leading-relaxed">{it.name}</span>
                            <span className="text-[10px] text-stone-500 font-mono">({it.selectedSize} / {it.selectedColor})</span>
                          </div>
                          <span className="text-stone-400 font-mono text-[11px] shrink-0">
                            {it.quantity}x @ €{it.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Cost ledger receipt */}
                    <div className="flex flex-wrap justify-between items-end gap-2 text-[10px] text-stone-400 pt-1">
                      <div className="flex flex-wrap gap-x-4">
                        <span>Subtotal: <span className="text-stone-200">€{o.subtotal.toLocaleString()}</span></span>
                        {o.discount > 0 && (
                          <span className="text-emerald-400">Coupon Discount: -€{o.discount.toLocaleString()}</span>
                        )}
                        <span>Luxury VAT: <span className="text-stone-200">€{o.tax.toLocaleString()}</span></span>
                        <span>Courier Transit: <span className="text-stone-200">{o.shipping === 0 ? "Complimentary" : `€${o.shipping}`}</span></span>
                        <span>Gold Box: <span className="text-stone-200">{o.premiumPackaging ? "Yes (+€15)" : "No"}</span></span>
                      </div>
                      
                      <div className="text-right sm:text-right border-t border-stone-800 sm:border-transparent pt-2 w-full sm:w-auto">
                        <span className="text-[9px] uppercase tracking-widest text-stone-500 font-bold block">Grand Deducted Total</span>
                        <span className="font-serif text-sm font-bold text-amber-500">
                          {brandConfig.currencySymbol}{o.total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SECTION 4: STORE CONSTANTS ADJUSTMENTS (CONFIG TAB) */}
        {adminTab === 'config' && (
          <div className="space-y-8 mt-8">
            <span className="text-[10px] tracking-widest font-mono text-amber-500 uppercase block mb-2">
              Establishment Constants Configuration Editor
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Form 1: General Constants fields */}
              <form onSubmit={handleSaveBrandConfig} className="space-y-5 bg-stone-950/20 p-6 border border-stone-850">
                <h4 className="font-serif text-sm text-stone-200 uppercase tracking-widest">
                  Atelier General Identity
                </h4>

                <div className="space-y-4 text-xs font-mono">
                  {/* Brand Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-stone-500 uppercase">Brand Name (Header & Layout logo)</label>
                    <input
                      type="text"
                      className="w-full bg-stone-950 border border-stone-800 p-2.5 text-stone-100 outline-none focus:border-amber-500/50 uppercase"
                      value={editBrandName}
                      onChange={(e) => setEditBrandName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Tagline */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-stone-500 uppercase">Aesthetic Slogan Tagline (Main Hero display)</label>
                    <input
                      type="text"
                      className="w-full bg-stone-950 border border-stone-800 p-2.5 text-stone-100 outline-none focus:border-amber-500/50 font-serif"
                      value={editTagline}
                      onChange={(e) => setEditTagline(e.target.value)}
                      required
                    />
                  </div>

                  {/* Shipping Base */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-stone-500 uppercase">Base Shipping Fee (€)</label>
                      <input
                        type="number"
                        className="w-full bg-stone-950 border border-stone-800 p-2.5 text-stone-100 outline-none focus:border-amber-500/50 text-center"
                        value={editShipping}
                        onChange={(e) => setEditShipping(Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-stone-500 uppercase">Free Transits Threshold (€)</label>
                      <input
                        type="number"
                        className="w-full bg-stone-950 border border-stone-800 p-2.5 text-stone-100 outline-none focus:border-amber-500/50 text-center"
                        value={editThreshold}
                        onChange={(e) => setEditThreshold(Number(e.target.value))}
                        required
                      />
                    </div>
                  </div>

                  {/* VAT Tax */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-stone-500 uppercase">VAT Luxury Tax rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full bg-stone-950 border border-stone-800 p-2.5 text-stone-100 outline-none focus:border-amber-500/50 text-center"
                      value={editTax}
                      onChange={(e) => setEditTax(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 text-stone-950 text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  Save Constant Parameters
                </button>

                {configSuccess && (
                  <p className="text-[10px] text-emerald-400 font-mono text-center">
                    All store variables updated and cached in persistent memory.
                  </p>
                )}
              </form>

              {/* Form 2: VIP Invitation Promotional Coupon management */}
              <div className="space-y-5 bg-stone-950/20 p-6 border border-stone-850 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-sm text-stone-200 uppercase tracking-widest mb-4">
                    VIP Invitation Coupons Registry
                  </h4>

                  {/* List coupons */}
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                    {brandConfig.discountCodes.map((c) => (
                      <div key={c.code} className="flex items-center justify-between p-2.5 bg-stone-950/60 border border-stone-900 font-mono text-xs">
                        <div>
                          <p className="text-amber-500 font-bold">{c.code} <span className="text-stone-400 text-[10px] font-light">({c.percentage}% off)</span></p>
                          <p className="text-[9px] text-stone-500 uppercase mt-0.5 max-w-[200px] truncate">{c.description}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteCoupon(c.code)}
                          className="text-stone-500 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                          title="Evict invitation coupon code"
                          id={`delete-coupon-${c.code}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add coupon form */}
                <form onSubmit={handleAddCoupon} className="space-y-3 pt-4 border-t border-stone-900">
                  <span className="text-[9px] text-stone-500 uppercase tracking-widest font-mono">Create new invite code</span>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <input
                      type="text"
                      placeholder="CODE (e.g. LUXE50)"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                      className="bg-stone-950 border border-stone-800 p-2 text-stone-100 outline-none focus:border-amber-500/50 text-center uppercase"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Discount %"
                      min={1}
                      max={95}
                      value={newCouponPct}
                      onChange={(e) => setNewCouponPct(Number(e.target.value))}
                      className="bg-stone-950 border border-stone-800 p-2 text-stone-100 outline-none focus:border-amber-500/50 text-center"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-stone-100 text-stone-950 text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-white transition-colors cursor-pointer"
                  >
                    Register Invite Code
                  </button>
                </form>

              </div>

            </div>
          </div>
        )}

      </main>

    </div>
  );
}
