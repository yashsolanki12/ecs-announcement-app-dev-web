import { useAppBridge } from "@shopify/app-bridge-react";

export const useCurrentShopDomain = () => {
  const app = useAppBridge();
  return app.config.shop;
};
