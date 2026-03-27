import { boundary } from "@shopify/shopify-app-react-router/server";
import AnnouncementPage, { loader as announcementLoader } from "./app.announcement";

export const loader = announcementLoader;
export default function Index() {
  return <AnnouncementPage />;
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
