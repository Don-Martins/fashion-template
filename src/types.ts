export interface ColorOption {
  name: string;
  value: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  sizes: string[];
  colors: ColorOption[];
  rating: number;
  reviews: Review[];
  stock: number;
  isFeatured: boolean;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface DiscountCode {
  code: string;
  percentage: number;
  description: string;
}

export interface BrandConfig {
  brandName: string;
  tagline: string;
  currencySymbol: string;
  shippingFee: number;
  freeShippingThreshold: number;
  taxRate: number;
  premiumPackagingFee: number;
  discountCodes: DiscountCode[];
}

export interface CartItem {
  id: string; // unique cart item id (product.id + size + color)
  product: Product;
  selectedSize: string;
  selectedColor: ColorOption;
  quantity: number;
}

export interface OrderCustomer {
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Order {
  id: string;
  date: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  premiumPackaging: boolean;
  shipping: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
}

export interface SalesDataPoint {
  date: string;
  sales: number;
  orders: number;
}

export interface CategoryDataPoint {
  name: string;
  value: number;
}
