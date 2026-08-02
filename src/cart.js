// Zepto AI Cross-Category Assistant - Stateful Cart Model

export class ZeptoCart {
  constructor() {
    this.items = []; // Array of { item: CatalogItem, quantity: number }
    this.listeners = []; // Event listeners for updates
  }

  // Subscribe to changes (for UI re-renders and AI evaluations)
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(callback => callback(this.getSummary()));
  }

  addItem(catalogItem, qty = 1) {
    const existing = this.items.find(entry => entry.item.id === catalogItem.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      this.items.push({ item: catalogItem, quantity: qty });
    }
    this.notify();
  }

  removeItem(itemId) {
    this.items = this.items.filter(entry => entry.item.id !== itemId);
    this.notify();
  }

  updateQuantity(itemId, qty) {
    const entry = this.items.find(entry => entry.item.id === itemId);
    if (entry) {
      entry.quantity = qty;
      if (entry.quantity <= 0) {
        this.removeItem(itemId);
      } else {
        this.notify();
      }
    }
  }

  clear() {
    this.items = [];
    this.notify();
  }

  getSummary() {
    let itemsCount = 0;
    let subtotal = 0;
    const categories = new Set();
    const itemIds = new Set();

    this.items.forEach(entry => {
      itemsCount += entry.quantity;
      subtotal += entry.item.price * entry.quantity;
      categories.add(entry.item.category);
      itemIds.add(entry.item.id);
    });

    // Zepto standard checkout fee parameters
    const deliveryFee = subtotal > 199 || subtotal === 0 ? 0 : 25;
    const handlingFee = subtotal === 0 ? 0 : 5; // e.g., packing / convenience charge
    const surgeFee = 0; // Can be simulated dynamically

    const total = subtotal + deliveryFee + handlingFee + surgeFee;

    return {
      items: [...this.items], // Clone items
      subtotal,
      deliveryFee,
      handlingFee,
      surgeFee,
      total,
      itemsCount,
      categories: Array.from(categories),
      itemIds: Array.from(itemIds)
    };
  }
}
