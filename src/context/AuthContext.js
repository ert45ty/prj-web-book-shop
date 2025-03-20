import { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userId = localStorage.getItem("userId");
          if (userId) {
            const response = await api.get(`/users/${userId}`);
            setUser(response.data);
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error("Authentication error:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/users?username=${username}`);
      if (response.data.length === 0) {
        throw new Error("User not found");
      }
      const user = response.data[0];
      if (user.password !== password) {
        throw new Error("Invalid password");
      }

      localStorage.setItem("token", "fake-jwt-token");
      localStorage.setItem("userId", user.id);

      setUser({ ...user, password: undefined });
      setIsAuthenticated(true);
      return user;
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const checkEmail = await api.get(`/users?email=${userData.email}`);
      if (checkEmail.data.length > 0) {
        throw new Error("Email already exists");
      }

      const response = await api.post(`/users`, {
        ...userData,
      });

      return response.data;
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
