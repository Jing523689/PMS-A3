import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { InventoryFilter, InventoryItem, StockStatus } from '../../models/item.model';
import { InventoryService } from '../../services/inventory.service';

/**
 * ListPage responsibilities:
 * - Load and display inventory records as mobile-friendly cards.
 * - Support explicit exact search instead of live partial filtering.
 * - Apply segment filters without hiding the user's search intent.
 * - Navigate selected cards into the Manage workflow.
 */

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false
})
export class ListPage {
  // Full dataset loaded from the server.
  items: InventoryItem[] = [];

  // Cards currently displayed after filtering or exact search.
  visibleItems: InventoryItem[] = [];

  // Reserved for future selection patterns; kept for consistent reset logic.
  selectedItem: InventoryItem | null = null;

  // The text currently typed by the user. It does not filter until Search Item is tapped.
  searchTerm = '';

  // Stores the last submitted search name so the UI can describe the active result.
  activeSearchName = '';

  // Exact-match result returned by the API.
  searchResultItem: InventoryItem | null = null;

  // Segment value used to filter all items or the current search result.
  filter: InventoryFilter = 'all';

  // Loading state controls the progress bar and button disabling.
  loading = false;

  // These flags distinguish between initial empty list and failed exact search states.
  searchAttempted = false;
  searchNotFound = false;

  readonly helpMessage =
    'Browse inventory records, filter by stock status, or search by entering the full item name and tapping Search Item. Pull down to refresh the latest server data.';

  constructor(
    private inventoryService: InventoryService,
    private toastController: ToastController,
    private router: Router
  ) {}

  /**
   * Refreshes the inventory whenever the tab becomes visible.
   * This makes updates from the Manage tab visible without a browser reload.
   */
  ionViewWillEnter(): void {
    this.loadItems();
  }

  /**
   * Loads all records and then renders the visible card list.
   */
  loadItems(showSpinner = true): void {
    this.loading = showSpinner;

    this.inventoryService.getAllItems().subscribe({
      next: (data) => {
        // Alphabetical sorting improves scanning on small mobile screens.
        this.items = data.sort((a, b) => a.itemName.localeCompare(b.itemName));
        // Re-render after every load so active filters stay respected.
        this.renderVisibleItems();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.presentToast(this.inventoryService.toUserMessage(err, 'Failed to load inventory items.'));
      }
    });
  }

  /**
   * Handles Ionic pull-to-refresh.
   * The refresher is completed in both success and error cases to prevent
   * the spinner from staying on screen.
   */
  handleRefresh(event: any): void {
    this.inventoryService.getAllItems().subscribe({
      next: (data) => {
        this.items = data.sort((a, b) => a.itemName.localeCompare(b.itemName));
        // Complete the refresher after the data has been applied to the view.
        this.renderVisibleItems();
        event.target.complete();
      },
      error: (err) => {
        event.target.complete();
        this.presentToast(this.inventoryService.toUserMessage(err, 'Failed to refresh inventory items.'));
      }
    });
  }

  /**
   * Re-applies the active segment filter without changing the search text.
   */
  applyFilters(): void {
    this.renderVisibleItems();
  }

  /**
   * Performs exact item-name search only after the user taps Search Item.
   * Typing alone does not alter results, which avoids surprising UI changes.
   */
  searchExactItem(): void {
    const name = this.searchTerm.trim();

    if (!name) {
      this.presentToast('Please enter an item name to search.');
      return;
    }

    // Loading begins only after explicit user intent from the Search Item button.
    this.loading = true;
    this.selectedItem = null;
    this.searchAttempted = true;
    this.activeSearchName = name;
    this.searchResultItem = null;
    this.searchNotFound = false;

    this.inventoryService.getItemByName(name).subscribe({
      next: (data) => {
        this.loading = false;

        // Enforce exact matching because the API may still return similar names.
        if (this.normalizeName(data.itemName) !== this.normalizeName(name)) {
          this.searchResultItem = null;
          this.visibleItems = [];
          this.searchNotFound = true;
          this.presentToast('Item not found.');
          return;
        }

        // Store the exact result and let renderVisibleItems apply any active segment filter.
        this.searchResultItem = data;
        this.renderVisibleItems();
        this.presentToast(this.visibleItems.length === 0 ? 'No matching item in the selected filter.' : 'Item found.');
      },
      error: (err) => {
        this.selectedItem = null;
        this.searchResultItem = null;
        this.visibleItems = [];
        this.searchNotFound = true;
        this.loading = false;
        this.presentToast(this.inventoryService.toUserMessage(err, 'Item not found.'));
      }
    });
  }

  /**
   * Clears search and filter state to return to the complete inventory list.
   */
  resetView(): void {
    this.searchTerm = '';
    this.activeSearchName = '';
    // Reset also clears segment state to remove hidden filtering surprises.
    this.filter = 'all';
    this.selectedItem = null;
    this.searchResultItem = null;
    this.searchAttempted = false;
    this.searchNotFound = false;
    this.renderVisibleItems();
  }

  /**
   * Opens the Manage tab and passes the selected item name for automatic loading.
   */
  manageItem(item: InventoryItem): void {
    this.router.navigate(['/tabs/edit'], {
      queryParams: { name: item.itemName }
    });
  }

  /**
   * Builds the visible card array based on either search result or full list.
   */
  private renderVisibleItems(): void {
    if (this.searchAttempted) {
      // When a search is active, filters apply only to the exact result.
      const matchedItems = this.searchResultItem ? [this.searchResultItem] : [];
      this.visibleItems = matchedItems.filter((item) => this.matchesCurrentFilter(item));
      this.searchNotFound = !this.searchResultItem;
      return;
    }

    this.visibleItems = this.items.filter((item) => this.matchesCurrentFilter(item));
    this.searchNotFound = false;
  }

  /**
   * Returns true when an item should appear for the selected segment.
   */
  private matchesCurrentFilter(item: InventoryItem): boolean {
    return this.filter === 'all' ||
      // Featured depends on API numeric flag, so delegate conversion to the service.
      (this.filter === 'featured' && this.inventoryService.isFeatured(item)) ||
      (this.filter === 'low' && item.stockStatus === StockStatus.LowStock) ||
      (this.filter === 'out' && item.stockStatus === StockStatus.OutOfStock);
  }

  /**
   * Normalises item names for exact comparison while ignoring casing and spaces.
   */
  private normalizeName(value: string | undefined | null): string {
    return String(value || '').trim().toLowerCase();
  }

  /**
   * Maps stock status to the correct visual chip class.
   */
  statusClass(item: InventoryItem): string {
    if (item.stockStatus === StockStatus.LowStock) {
      return 'status-low';
    }

    if (item.stockStatus === StockStatus.OutOfStock) {
      return 'status-out';
    }

    return 'status-in';
  }

  /**
   * Keeps card rendering efficient when the list refreshes.
   */
  trackByItemName(index: number, item: InventoryItem): string {
    return item.itemName || String(index);
  }

  /**
   * Shows short mobile feedback messages at the bottom of the screen.
   */
  async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2200,
      position: 'bottom'
    });

    await toast.present();
  }
}
