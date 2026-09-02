import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { authenticate } from "../shopify.server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export const loader = async ({ request }) => {
  const {
    session,
    billing,
    redirect: shopifyRedirect,
  } = await authenticate.admin(request);
  const { hasActivePayment } = await billing.check();

  const appHandle = "ecs-inventory-manager";
  const shop = session.shop;
  const storeHandle = shop.replace(".myshopify.com", "");

  if (!hasActivePayment) {
    const billingUrl = `https://admin.shopify.com/store/${storeHandle}/charges/${appHandle}/pricing_plans`;

    // This tells the browser to perform a full document-level redirect
    throw shopifyRedirect(billingUrl, { target: "_top" });
  }

  // eslint-disable-next-line no-undef
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData();

  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
            refetchOnWindowFocus: false,
            // Disable queries during SSR
            enabled: typeof window !== "undefined",
          },
        },
      }),
    [],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider embedded apiKey={apiKey}>
        <s-app-nav>
          <s-link href="/app/plans">Plans</s-link>
        </s-app-nav>
        <Outlet />
      </AppProvider>
    </QueryClientProvider>
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
