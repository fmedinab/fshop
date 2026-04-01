export const FavoritesService = {
  getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  },

  toggleFavorite(productId) {
    let favs = this.getFavorites();
    if (favs.includes(productId)) {
      favs = favs.filter(id => id !== productId);
    } else {
      favs.push(productId);
    }
    localStorage.setItem('favorites', JSON.stringify(favs));
    return favs.includes(productId);
  },

  isFavorite(productId) {
    return this.getFavorites().includes(productId);
  }
};
