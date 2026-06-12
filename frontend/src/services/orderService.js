import api from "./api";

export const orderService = {
  getCartItems: async () => {
    const response = await api.get("/orders/api/order-items/");
    return response.data;
  },

  addToCart: async (productId, quantity = 1) => {
    const response = await api.post("/orders/api/order-items/", {
      product_id: productId,
      quantity: quantity,
    });
    return response.data;
  },

  updateQuantity: async (orderItemId, newQuantity) => {
    const response = await api.patch(`/orders/api/order-items/${orderItemId}/`, {
      quantity: newQuantity,
    });
    return response.data;
  },

  removeCartItem: async (orderItemId) => {
    const response = await api.delete(`/orders/api/order-items/${orderItemId}/`);
    return response.data;
  },

  checkoutOrder: async () => {
    const response = await api.post("/orders/api/orders/checkout/", {});
    return response.data;
  },

  cancelOrder: async () => {
    const response = await api.delete("/orders/api/orders/cancel/");
    return response.data;
  },

  getOrders: async (page, limit) => {
  const response = await api.get(`/orders/api/orders/?page=${page}&page_size=${limit}`);
  return response.data;
  },
};