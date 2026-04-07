import { useCurrentShopDomain } from "../utils/helper";
import axiosInstance from "./axios-instance";

export const getShopDomain = () => {
  const app = useCurrentShopDomain();
  return app;
};

// Sync store metrics
export const syncStoreMetrics = async (planName) => {
  const shopDomain = getShopDomain();

  if (!shopDomain) {
    console.error("No shop domain found in URL parameters.");
    throw new Error("Shop domain is required.");
  }
  return axiosInstance
    .post(
      "store-metrics/sync",
      { shop: shopDomain, plan_name: planName },
      {
        headers: {
          "x-shopify-shop-domain": shopDomain,
        },
      },
    )
    .then((res) => res.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("API Error in syncStoreMetrics:", errorMessage);
      throw new Error(errorMessage);
    });
};
