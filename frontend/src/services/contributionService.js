import apiClient from './apiClient';

export const createContribution = async (data) => {
  const response = await apiClient.post('/contributions', data);
  return response.data;
};

export const getContributionsByWishlist = async (wishlistId) => {
  const response = await apiClient.get(`/contributions/wishlist/${wishlistId}`);
  return response.data.data || [];
};
