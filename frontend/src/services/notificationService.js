import apiClient from './apiClient';

export const getUserNotifications = async () => {
  const response = await apiClient.get('/notifications');
  return response.data.data || [];
};

export const markAsRead = async (id) => {
  const response = await apiClient.patch(`/notifications/${id}/read`);
  return response.data;
};
