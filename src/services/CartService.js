import api from "./api";

const CartService = {
  getUserCart: async (userId) => {
    const response = await api.get(`/carts?userId=${userId}`);
    return response;
  },

  updateUserCart: async (userId, cartItems, bookId) => {
    const response = await api.get(`/carts?userId=${userId}`);
    if (response.data[0]) {
      const cartId = response.data[0].id;
      return api.put(`/carts/${cartId}`, {
        ...response.data[0],
        items: cartItems,
      });
    } else {
      return api.post(`/carts`, {
        userId: userId,
        items: cartItems,
      });
    }
  },

  clearUserCart: async (userId) => {
    const response = await api.get(`/carts?userId=${userId}`);

    if (response.data[0].items.length > 0) {
      const cartId = response.data[0].id;
      return api.put(`/carts/${cartId}`, {
        userId,
        items: [],
      });
    }

    return Promise.resolve();
  },
};

export default CartService;
