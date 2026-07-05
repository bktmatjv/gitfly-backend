import apiClient from './apiClient';

export const getUsers = async (searchParams) => {
  const query = new URLSearchParams(searchParams).toString();
  const response = await apiClient.get(`/users?${query}`);
  return response.data;
};

export const getUserById = async (id) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};
