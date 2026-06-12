import api from "./api"; 

export const productService = {
  getAllProducts: async (page, limit, search = "") => {
    const response = await api.get(`/products/api/?page=${page}&page_size=${limit}&search=${search}`);
    return response.data;
  },
  
  createProduct: async (productPayload) => {
  const response = await api.post("/products/api/", productPayload);
  return response.data;
  },

  updateProduct: async (id, productPayload) => {
    const response = await api.put(`/products/api/${id}/`, productPayload);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/api/${id}/`);
    return response.data;
  },
};