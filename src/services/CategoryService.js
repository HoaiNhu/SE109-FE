import axios from "axios";

const createCategory = async (data) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/api/category/create-category",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Token: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const CategoryService = {
  createCategory,
};

export default CategoryService;
