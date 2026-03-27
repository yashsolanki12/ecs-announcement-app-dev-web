import { useCurrentShopDomain } from "../utils/helper";
import axiosInstance from "./axios-instance";

export const getShopDomain = () => {
  const app = useCurrentShopDomain();
  return app;
};

// List
export const getAllAnnouncement = async () => {
  const shopDomain = getShopDomain();

  if (!shopDomain) {
    console.error("No shop domain found in URL parameters.");
    throw new Error("Shop domain is required.");
  }
  return axiosInstance
    .get("announcement", {
      headers: {
        "x-shopify-shop-domain": shopDomain,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("API Error in get all announcement:", errorMessage);
      throw new Error(errorMessage);
    });
};

// Detail
export const getAnnouncementById = async (id) => {
  const shopDomain = getShopDomain();

  if (!shopDomain) {
    console.error("No shop domain found in URL parameters.");
    throw new Error("Shop domain is required.");
  }
  return axiosInstance
    .get(`announcement/${id}`, {
      headers: {
        "x-shopify-shop-domain": shopDomain,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("API Error in get announcement by id:", errorMessage);
      throw new Error(errorMessage);
    });
};

// Delete
export const deleteAnnouncement = async (id) => {
  const shopDomain = getShopDomain();

  if (!shopDomain) {
    console.error("No shop domain found un URL parameters.");
    throw new Error("Shop domain is required");
  }
  return axiosInstance
    .delete(`announcement/${id}`, {
      headers: {
        "x-shopify-shop-domain": shopDomain,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("API Error while delete announcement:", errorMessage);
      throw new Error(errorMessage);
    });
};

// Create
export const createAnnouncement = async (data) => {
  const shopDomain = getShopDomain();

  if (!shopDomain) {
    console.error("No shop domain found in URL parameters.");
    throw new Error("Shop domain is required.");
  }
  return axiosInstance
    .post("announcement/add", data, {
      headers: {
        "x-shopify-shop-domain": shopDomain,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error("API Error in create announcement:", error);
      throw error;
    });
};

// Update API
export const updateAnnouncement = async ({ id, data }) => {
  const shopDomain = getShopDomain();

  if (!shopDomain) {
    console.error("No shop domain found in URL parameters.");
    throw new Error("Shop domain is required.");
  }
  return axiosInstance
    .put(`announcement/${id}`, data, {
      headers: {
        "x-shopify-shop-domain": shopDomain,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error("API Error in update announcement:", error);
      throw error;
    });
};
