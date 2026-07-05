import apiClient from './apiClient';

export const addComment = async (data) => {
  const response = await apiClient.post('/interactions/comment', data);
  return response.data;
};

export const addReaction = async (data) => {
  const response = await apiClient.post('/interactions/react', data);
  return response.data;
};

export const getInteractionsByWishlist = async (wishlistId) => {
  const response = await apiClient.get(`/interactions/wishlist/${wishlistId}`);
  return response.data;
};
