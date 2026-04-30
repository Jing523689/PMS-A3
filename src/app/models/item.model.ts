// Central data model definitions for the Ionic inventory application.
// Keeping these types in one file helps every page and service share the
// same field names, enum values, and API conversion rules.

// Category values mirror the allowed values from the assessment database.
// Using an enum prevents spelling mistakes when building forms or filters.
export enum Category {
  Electronics = 'Electronics',
  Furniture = 'Furniture',
  Clothing = 'Clothing',
  Tools = 'Tools',
  Miscellaneous = 'Miscellaneous'
}

// Stock status is stored as controlled text values, so the UI can safely
// display chips and select options without hard-coded strings in every page.
export enum StockStatus {
  InStock = 'In Stock',
  LowStock = 'Low Stock',
  OutOfStock = 'Out of Stock'
}

// Front-end inventory shape used by Angular pages.
// This version uses camelCase names to match TypeScript conventions.
export interface InventoryItem {
  // Optional because the server generates the primary key automatically.
  itemId?: number;
  itemName: string;
  category: Category;
  quantity: number;
  price: number;
  supplierName: string;
  stockStatus: StockStatus;
  // The server stores featured_item as 0 or 1 instead of a boolean.
  featuredItem: number;
  specialNote?: string;
}

// Raw REST API shape expected by the remote endpoint.
// This interface deliberately uses snake_case to match the database fields.
export interface InventoryApiItem {
  item_id?: number;
  item_name: string;
  category: string;
  quantity: number;
  price: number;
  supplier_name: string;
  stock_status: string;
  featured_item: number;
  special_note?: string;
}

// Filter options used by the Inventory tab segment control.
export type InventoryFilter = 'all' | 'featured' | 'low' | 'out';

// Small summary object kept for reuse if statistics are displayed later.
export interface InventoryStats {
  total: number;
  featured: number;
  lowStock: number;
  outOfStock: number;
}
