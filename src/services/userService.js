import api from "./api";

export const getUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

export const deleteUser = async (userId) => {
  try {
    await api.delete(`/users/${userId}`);
    alert(`Deleted user with ID: ${userId} successfully!`);
  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
  }
};
