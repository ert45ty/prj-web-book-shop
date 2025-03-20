import api from "./api";

export const register = async (userData) => {
  try {
    const response = await api.post("/users", userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.get("/users", {
      params: {
        username: credentials.username,
      },
    });

    const user = response.data[0];
    if (!user) {
      throw new Error("User not found");
    }

    if (user.password !== credentials.password) {
      throw new Error("Invalid password");
    }

    const token = `token-${Date.now()}`;

    return {
      user: { ...user, password: undefined },
      token,
    };
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const userId = localStorage.getItem("userId");
    if (!userId) return null;

    const response = await api.get(`/users/${userId}`);
    return { ...response.data, password: undefined };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
};
