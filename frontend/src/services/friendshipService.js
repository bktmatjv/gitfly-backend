import apiClient from './apiClient';

export const requestFriendship = async (receptor_id) => {
  const response = await apiClient.post('/friendships/request', { receptor_id });
  return response.data;
};

export const respondFriendship = async (friendshipId, estado_vinculo) => {
  const response = await apiClient.put(`/friendships/${friendshipId}/respond`, { estado_vinculo });
  return response.data;
};

export const getFriends = async (userId) => {
  const response = await apiClient.get(`/friendships/user/${userId}`);
  return response.data;
};
