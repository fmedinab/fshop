export const CartService = {
  getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  },

  saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.updateCartCount();
  },

  // Añadido soporte para variantes (talla y color)
  addItem(product, quantity = 1, size = null, color = null) {
    const cart = this.getCart();
    
    // Crear un ID único para el carrito basado en las variantes
    const cartItemId = `${product.id}-${size || 'none'}-${color ? color.name : 'none'}`;
    
    const existingItem = cart.find(item => item.cartItemId === cartItemId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      // Guardar la primera imagen como principal para el carrito
      const image = product.images && product.images.length > 0 ? product.images[0] : product.image;
      cart.push({ 
        ...product, 
        image, 
        cartItemId, 
        quantity, 
        selectedSize: size, 
        selectedColor: color 
      });
    }
    
    this.saveCart(cart);
    window.showToast('¡Agregado al carrito!', 'success');
  },

  removeItem(cartItemId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.cartItemId !== cartItemId);
    this.saveCart(cart);
  },

  updateQuantity(cartItemId, quantity) {
    const cart = this.getCart();
    const item = cart.find(item => item.cartItemId === cartItemId);
    if (item) {
      item.quantity = parseInt(quantity);
      if (item.quantity <= 0) this.removeItem(cartItemId);
      else this.saveCart(cart);
    }
  },

  clearCart() {
    localStorage.removeItem('cart');
    this.updateCartCount();
  },

  getTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  updateCartCount() {
    const countElement = document.getElementById('cart-count-badge');
    if (countElement) {
      const cart = this.getCart();
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      countElement.textContent = count;
      countElement.style.display = count > 0 ? 'block' : 'none';
    }
  }
};
