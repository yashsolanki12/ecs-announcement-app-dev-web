import { useCurrentShopDomain } from "../utils/helper";
import axiosInstance from "./axios-instance";

export const getShopDomain = () => {
  const app = useCurrentShopDomain();
  return app;
};

// List
export const getAllAnnouncement = async (params = {}) => {
  const shopDomain = getShopDomain();

  if (!shopDomain) {
    console.error("No shop domain found in URL parameters.");
    throw new Error("Shop domain is required.");
  }

  // Build query string from params
  const queryParams = new URLSearchParams();
  if (params.search) {
    queryParams.append("search", params.search);
  }
  if (params.sortOrder) {
    queryParams.append("sortOrder", params.sortOrder);
  }

  const queryString = queryParams.toString();
  const url = queryString ? `announcement?${queryString}` : "announcement";

  return axiosInstance
    .get(url, {
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

// Toggle enabled status
export const toggleAnnouncementEnabled = async (id) => {
  const shopDomain = getShopDomain();

  if (!shopDomain) {
    console.error("No shop domain found in URL parameters.");
    throw new Error("Shop domain is required.");
  }
  return axiosInstance
    .patch(
      `announcement/toggle/${id}`,
      {},
      {
        headers: {
          "x-shopify-shop-domain": shopDomain,
        },
      },
    )
    .then((res) => res.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("API Error in toggle announcement:", errorMessage);
      throw new Error(errorMessage);
    });
};

// Duplicate announcement
export const duplicateAnnouncement = async (id) => {
  const shopDomain = getShopDomain();

  if (!shopDomain) {
    console.error("No shop domain found in URL parameters.");
    throw new Error("Shop domain is required.");
  }
  return axiosInstance
    .post(
      `announcement/duplicate/${id}`,
      {},
      {
        headers: {
          "x-shopify-shop-domain": shopDomain,
        },
      },
    )
    .then((res) => res.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("API Error in duplicate announcement:", errorMessage);
      throw new Error(errorMessage);
    });
};
