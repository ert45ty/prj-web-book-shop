import api from "./api";

const WishlistService = {
  getUserWishlist: async (userId) => {
    return api.get(`/wishlists?userId=${userId}`);
  },

  updateUserWishlist: async (userId, wishlistItems) => {
    const response = await api.get(`/wishlists?userId=${userId}`);

    if (response.data[0]) {
      const wishlistId = response.data[0].id;
      return api.put(`/wishlists/${wishlistId}`, {
        ...response.data[0],
        items: wishlistItems,
      });
    } else {
      return api.post(`/wishlists`, {
        userId,
        items: [{ wishlistItems }],
      });
    }
  },

  clearUserWishlist: async (userId) => {
    const response = await api.get(`/wishlists?userId=${userId}`);

    if (response.data[0].items.length > 0) {
      const wishlistId = response.data[0].id;
      return api.put(`/wishlists/${wishlistId}`, {
        ...response.data[0],
        items: [],
      });
    }

    return Promise.resolve();
  },
};

export default WishlistService;
