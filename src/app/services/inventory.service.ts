import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  Category,
  InventoryApiItem,
  InventoryItem,
  InventoryStats,
  StockStatus
} from '../models/item.model';

/**
 * InventoryService responsibilities:
 * - Isolate every REST API request from page components.
 * - Translate snake_case API data into camelCase UI models.
 * - Normalise inconsistent server values before they reach templates.
 * - Provide reusable helpers for errors, featured flags, and statistics.
 */

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  // Shared REST endpoint required by the assessment brief.
  // All pages call this service instead of using HttpClient directly.
  private readonly baseUrl = 'https://prog2005.it.scu.edu.au/ArtGalley';

  constructor(private http: HttpClient) {}

  /**
   * Loads every inventory item from the server.
   * The response is normalised immediately so pages only work with clean
   * camelCase InventoryItem objects, even when the API returns mixed names.
   */
  getAllItems(): Observable<InventoryItem[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      // Protect the UI against null responses by falling back to an empty list.
      map((items) => (items || []).map((item) => this.fromApi(item))),
      // Some shared assessment endpoints may contain duplicated names.
      // De-duplication keeps the mobile list stable and easier to scan.
      map((items) => this.deduplicateItems(items))
    );
  }

  /**
   * Retrieves one item by name.
   * The caller still verifies the returned item name to enforce exact search.
   */
  getItemByName(name: string): Observable<InventoryItem> {
    return this.http.get<any>(`${this.baseUrl}/${encodeURIComponent(name.trim())}`).pipe(
      // The API can return either an object or a one-element array.
      map((response) => Array.isArray(response) ? response[0] : response),
      map((item) => this.fromApi(item))
    );
  }

  /**
   * Creates a new inventory record.
   * Forms submit InventoryItem, while the server expects snake_case fields.
   */
  addItem(item: InventoryItem): Observable<string> {
    return this.http.post(
      this.baseUrl,
      this.toApi(item),
      { responseType: 'text' }
    );
  }

  /**
   * Updates the record identified by the original item name.
   * This allows users to rename the item while still targeting the old record.
   */
  updateItem(originalName: string, item: InventoryItem): Observable<string> {
    return this.http.put(
      `${this.baseUrl}/${encodeURIComponent(originalName.trim())}`,
      this.toApi(item),
      { responseType: 'text' }
    );
  }

  /**
   * Deletes an inventory record by name.
   * Page-level code handles the special Laptop rule before calling this method.
   */
  deleteItem(name: string): Observable<string> {
    return this.http.delete(
      `${this.baseUrl}/${encodeURIComponent(name.trim())}`,
      { responseType: 'text' }
    );
  }

  /**
   * Builds the featured showcase by reusing the main list request.
   * Reuse avoids a second API format and keeps item mapping consistent.
   */
  getFeaturedItems(): Observable<InventoryItem[]> {
    return this.getAllItems().pipe(
      map((items) => items.filter((item) => this.isFeatured(item)))
    );
  }

  /**
   * Returns summary counts for optional dashboards or future UI sections.
   * The current version does not show the old statistics cards, but this method
   * is still useful for extension and demonstrates service-level calculation.
   */
  calculateStats(items: InventoryItem[]): InventoryStats {
    return {
      // Total number of records currently available to the client.
      total: items.length,
      // Featured count uses the same numeric-flag helper as the card templates.
      featured: items.filter((item) => this.isFeatured(item)).length,
      // Low-stock count supports possible future dashboard UI.
      lowStock: items.filter((item) => item.stockStatus === StockStatus.LowStock).length,
      // Out-of-stock count highlights urgent inventory gaps.
      outOfStock: items.filter((item) => item.stockStatus === StockStatus.OutOfStock).length
    };
  }

  /**
   * Converts technical HTTP errors into messages that are suitable for users.
   * This improves UX by avoiding raw Angular "Http failure response" text.
   */
  toUserMessage(error: any, fallback: string): string {
    // Some server errors are plain text, for example duplicate-name messages.
    if (typeof error?.error === 'string' && error.error.trim()) {
      return error.error;
    }

    // Other endpoints wrap the message inside an error object.
    if (error?.error?.error) {
      return error.error.error;
    }

    // Use non-HTTP generic messages only when they are understandable.
    if (error?.message && !String(error.message).includes('Http failure response')) {
      return error.message;
    }

    return fallback;
  }

  /**
   * The API stores featured state as a numeric flag.
   * This helper keeps the 0/1 conversion out of every page template.
   */
  isFeatured(item: InventoryItem): boolean {
    return Number(item.featuredItem) === 1;
  }

  /**
   * Converts any API item shape into the application's clean InventoryItem.
   * Multiple possible property names are supported because student/shared APIs
   * sometimes return item_id, itemId, ItemID, or similar variants.
   */
  private fromApi(item: any): InventoryItem {
    return {
      // Accept common ID aliases returned by different API implementations.
      itemId: this.toNumber(
        item?.itemId ?? item?.item_id ?? item?.ItemID ?? item?.id
      ),
      // Item name is required by the UI, so missing values become an empty string.
      itemName: String(
        item?.itemName ?? item?.item_name ?? item?.ItemName ?? item?.name ?? item?.Name ?? ''
      ).trim(),
      // Category is normalised into the Category enum for safe ion-select values.
      category: this.normalizeCategory(item?.category ?? item?.Category),
      // Quantity is always converted to a number for cards and validation.
      quantity: this.toNumber(item?.quantity ?? item?.Quantity ?? item?.qty),
      // Price is kept numeric so display and form controls behave predictably.
      price: this.toNumber(item?.price ?? item?.Price),
      // Supplier aliases are consolidated into one camelCase property.
      supplierName: String(
        item?.supplierName ?? item?.supplier_name ?? item?.SupplierName ?? item?.supplier ?? ''
      ).trim(),
      // Stock status text is converted to a controlled enum.
      stockStatus: this.normalizeStockStatus(
        item?.stockStatus ?? item?.stock_status ?? item?.StockStatus ?? item?.status
      ),
      // Featured flag remains numeric because the API expects 0 or 1.
      featuredItem: this.toNumber(
        item?.featuredItem ?? item?.featured_item ?? item?.FeaturedItem ?? item?.featured ?? 0
      ),
      // Optional notes are trimmed so empty notes do not create messy card spacing.
      specialNote: String(
        item?.specialNote ?? item?.special_note ?? item?.SpecialNote ?? item?.note ?? ''
      ).trim()
    };
  }

  /**
   * Converts the UI model back into the exact field names required by the API.
   * Trimming text here ensures every write request sends clean values.
   */
  private toApi(item: InventoryItem): InventoryApiItem {
    return {
      // Preserve item_id on update; add requests can omit it because the server generates it.
      item_id: item.itemId,
      // Send snake_case names to match the database schema.
      item_name: item.itemName.trim(),
      // Enum display text is accepted directly by the API.
      category: item.category,
      // Explicit conversion prevents string numbers from being submitted.
      quantity: Number(item.quantity),
      // Price is converted immediately before the write request.
      price: Number(item.price),
      // Trimmed supplier names improve data consistency.
      supplier_name: item.supplierName.trim(),
      // Stock status uses the exact text values from StockStatus enum.
      stock_status: item.stockStatus,
      // Booleans from toggles are already converted into numeric flags by pages.
      featured_item: Number(item.featuredItem),
      // Always send a string for optional notes to avoid null handling issues.
      special_note: item.specialNote?.trim() || ''
    };
  }

  /**
   * Normalises category text into a safe enum value.
   * Unknown values fall back to Miscellaneous instead of breaking the UI.
   */
  private normalizeCategory(value: any): Category {
    const normalized = String(value ?? '').trim().toLowerCase();

    switch (normalized) {
      case 'electronics':
        return Category.Electronics;
      case 'furniture':
        return Category.Furniture;
      case 'clothing':
        return Category.Clothing;
      case 'tools':
        return Category.Tools;
      default:
        return Category.Miscellaneous;
    }
  }

  /**
   * Normalises different stock-status spellings into the enum used by the UI.
   */
  private normalizeStockStatus(value: any): StockStatus {
    const normalized = String(value ?? '').trim().toLowerCase();

    switch (normalized) {
      case 'low stock':
      case 'lowstock':
        return StockStatus.LowStock;
      case 'out of stock':
      case 'outofstock':
        return StockStatus.OutOfStock;
      default:
        return StockStatus.InStock;
    }
  }

  /**
   * Keeps the first record for each item name.
   * This helps avoid confusing duplicate cards in the mobile inventory view.
   */
  private deduplicateItems(items: InventoryItem[]): InventoryItem[] {
    const uniqueMap = new Map<string, InventoryItem>();

    for (const item of items) {
      const key = item.itemName.trim().toLowerCase();
      if (key && !uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    }

    return Array.from(uniqueMap.values());
  }

  /**
   * Converts numeric-like values safely.
   * Invalid numbers become 0 so templates and calculations remain stable.
   */
  private toNumber(value: unknown): number {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  }
}
