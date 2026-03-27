import { useCurrentShopDomain } from "../utils/helper";
import axiosInstance from "./axios-instance";

export const getShopDomain = () => {
  const app = useCurrentShopDomain();
  return app;
};

// Bulk Delete Announcement
export const bulkDeleteAnnouncement = async (ids) => {
  const shopDomain = getShopDomain();

  if (!shopDomain) {
    console.error("No shop domain found in URL parameters.");
    throw new Error("Shop domain is required.");
  }

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("No IDs provided for deletion.");
  }

  return axiosInstance
    .post(
      `announcement/bulk-delete`,
      { ids },
      {
        headers: {
          "x-shopify-shop-domain": shopDomain,
        },
      },
    )
    .then((res) => res.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("API Error in bulkAnnouncement:", errorMessage);
      throw new Error(errorMessage);
    });
};

// Bulk Toggle USP Bars (enable or disable)
export const bulkToggleAnnouncement = async (ids, enabled) => {
  const shopDomain = getShopDomain();

  if (!shopDomain) {
    console.error("No shop domain found in URL parameters.");
    throw new Error("Shop domain is required.");
  }

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("No IDs provided for toggle.");
  }

  console.log(
    `📤 Sending bulk toggle request for IDs:`,
    ids,
    "enabled:",
    enabled,
  );

  return axiosInstance
    .post(
      `announcement/bulk-toggle`,
      { ids, enabled },
      {
        headers: {
          "x-shopify-shop-domain": shopDomain,
        },
      },
    )
    .then((res) => res.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("API Error in bulkToggleAnnouncement:", errorMessage);
      throw new Error(errorMessage);
    });
};