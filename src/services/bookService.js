import api from "./api";

export const getBooks = async (params = {}) => {
  try {
    const response = await api.get("/books", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

export const getBookById = async (id) => {
  try {
    const response = await api.get(`/books/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching book with id ${id}:`, error);
    throw error;
  }
};

export const getBooksByCategory = async (category) => {
  try {
    const response = await api.get("/books", {
      params: { category },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching books by category ${category}:`, error);
    throw error;
  }
};

export const searchBooks = async (query) => {
  try {
    const response = await api.get("/books", {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error(`Error searching books with query ${query}:`, error);
    throw error;
  }
};

export const addBook = async (book) => {
  try {
    const response = await api.post("/books", book);
    return { success: true, data: response.data };
  } catch (err) {
    console.error("Error adding product:", err);
    return {
      success: false,
      error: "Cannot add new book. Please try again.",
    };
  }
};

export const updateBook = async (id, bookData) => {
  try {
    const response = await api.put(`/books/${id}`, bookData);
    return { data: response.data, success: true };
  } catch (error) {
    console.error(`Error updating book with ID ${id}:`, error);
    return {
      success: false,
      error: "Cannot update book. Please try again.",
    };
  }
};

export const deleteBook = async (id) => {
  try {
    await api.delete(`/books/${id}`);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting book with ID ${id}:`, error);
    return {
      success: false,
      error: "Cannot delete book. Please try again.",
    };
  }
};
