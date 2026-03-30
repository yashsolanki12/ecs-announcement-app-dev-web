import { useAppBridge } from "@shopify/app-bridge-react";

export const useCurrentShopDomain = () => {
  const app = useAppBridge();
  return app.config.shop;
};

export function getFormattedDate(date = new Date()) {
  const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, "-");
  const formattedTime = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return `${formattedDate}, ${formattedTime}`;
}
