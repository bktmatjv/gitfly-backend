import apiClient from './apiClient';

/**
 * Obtiene el feed público de wishlists (paginado)
 */
export const getWishlists = async (page = 1, limit = 10) => {
  const response = await apiClient.get(`/wishlists?page=${page}&limit=${limit}`);
  return response.data;
};

/**
 * Obtiene las wishlists del usuario autenticado
 */
export const getMyWishlists = async (page = 1, limit = 10) => {
  const response = await apiClient.get(`/wishlists/me?page=${page}&limit=${limit}`);
  return response.data;
};

/**
 * Obtiene una wishlist por ID
 */
export const getWishlistById = async (id) => {
  const response = await apiClient.get(`/wishlists/${id}`);
  return response.data;
};

/**
 * Crea una nueva wishlist
 */
export const createWishlist = async (data) => {
  const response = await apiClient.post('/wishlists', data);
  return response.data;
};

export const updateWishlist = async (id, data) => {
  const response = await apiClient.put(`/wishlists/${id}`, data);
  return response.data;
};

export const deleteWishlist = async (id) => {
  const response = await apiClient.delete(`/wishlists/${id}`);
  return response.data;
};

