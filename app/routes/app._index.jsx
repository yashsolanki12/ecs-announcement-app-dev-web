import { boundary } from "@shopify/shopify-app-react-router/server";
import AnnouncementPage from "./app.announcement";

export default function Index() {
  return <AnnouncementPage />;
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
