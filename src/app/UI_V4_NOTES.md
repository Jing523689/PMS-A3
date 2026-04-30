# UI/UX v4 update

- Removed the visible **Status and visibility** section from the Add Item form.
- The Add Item form now derives stock status from quantity automatically, reducing user effort while still sending the required `stock_status` value to the API.
- Kept Ionic form elements (`ion-input`, `ion-select`, `ion-toggle`, `ion-textarea`, `ion-button`, `ion-chip`) and redesigned them as a mobile-first card workflow.
- Improved field labels, helper text, value emphasis, focus states, sticky safe-area actions, and featured item cards.
- Updated price validation to support decimal values with up to two decimal places.
