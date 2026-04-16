import React from "react";
import { authenticate } from "../shopify.server";
import { useLoaderData, useSubmit, useActionData } from "react-router";
const PlansPageView = React.lazy(() => import("../pages/plans/plans-page"));

export const loader = async ({ request }) => {
  const { admin, session, billing } = await authenticate.admin(request);
  const { appSubscriptions } = await billing.check();
  try {
    // Fetch main theme using raw fetch
    const themesResponse = await fetch(
      `https://${session.shop}/admin/api/2026-04/themes.json?role=main`,
      {
        headers: {
          "X-Shopify-Access-Token": session.accessToken,
          "Content-Type": "application/json",
        },
      },
    );

    if (!themesResponse.ok) {
      const errorText = await themesResponse.text();
      return {
        appEmbedEnabled: false,
        session: session,
        error: "Theme fetch failed",
        status: themesResponse.status,
        details: errorText,
        subscription: appSubscriptions?.[0] || {name: "Free"},
        sessionDebug: {
          shop: session?.shop,
          scopes: session?.scope,
          configuredScopes: process.env.SCOPES,
          hasToken: !!session?.accessToken,
          tokenStart: session?.accessToken
            ? session.accessToken.substring(0, 10) + "..."
            : null,
        },
      };
    }

    const themesData = await themesResponse.json();

    if (!themesData.themes || themesData.themes.length === 0) {
      return {
        appEmbedEnabled: false,
        session: session,
        subscription: appSubscriptions?.[0] || { name: "Free" },
        error: "No main theme found in response",
        response: themesData,
      };
    }

    const mainTheme = themesData.themes[0];

    // Fetch settings_data.json
    const assetsResponse = await fetch(
      `https://${session.shop}/admin/api/2026-04/themes/${mainTheme.id}/assets.json?asset[key]=config/settings_data.json`,
      {
        headers: {
          "X-Shopify-Access-Token": session.accessToken,
          "Content-Type": "application/json",
        },
      },
    );

    const assetData = await assetsResponse.json();
    const asset = assetData.asset;

    if (!asset || !asset.value) {
      return {
        appEmbedEnabled: false,
        session: session,
        subscription: appSubscriptions?.[0] || { name: "Free" },
        error: "No settings_data.json found",
      };
    }

    const settings = JSON.parse(asset.value);

    // Logic Simulation
    const simulation = {
      foundBlocks: [],
      finalDecision: false,
      logs: [],
    };

    if (settings.current && settings.current.blocks) {
      const rawBlocks = settings.current.blocks;
      simulation.logs.push(
        `Total blocks in settings: ${Object.keys(rawBlocks).length}`,
      );

      const uspBarBlocks = Object.keys(rawBlocks)
        .filter((key) => {
          const block = rawBlocks[key];
          const isMatch = block.type && block.type.includes("usp_bar");
          if (isMatch)
            simulation.logs.push(
              `Found matching block: ${key} (${block.type})`,
            );
          return isMatch;
        })
        .map((key) => ({ ...rawBlocks[key], id: key }));

      simulation.foundBlocks = uspBarBlocks;

      if (uspBarBlocks.length > 0) {
        const isAnyEnabled = uspBarBlocks.some((block) => {
          const isAppEmbedOn = !block.disabled;
          const isInnerSettingOn = block.settings.enabled !== false;
          simulation.logs.push(
            `Block ${block.id}: AppEmbedOn=${isAppEmbedOn}, InnerSettingOn=${isInnerSettingOn}`,
          );
          return isAppEmbedOn && isInnerSettingOn;
        });
        simulation.finalDecision = isAnyEnabled;
      } else {
        simulation.logs.push("No blocks matching 'usp_bar' found.");
      }
    }

    return {
      appEmbedEnabled: simulation.finalDecision,
      session: session,
      shop: session?.shop,
      settings: settings,
      raw: asset.value,
      simulation,
      subscription: appSubscriptions?.[0] || { name: "Free" },
    };
  } catch (error) {
    return {
      appEmbedEnabled: false,
      session: session,
      subscription: appSubscriptions?.[0] || { name: "Free" },
      error: error.message,
      stack: error.stack,
      sessionDebug: {
        shop: session?.shop,
        scopes: session?.scope,
        hasToken: !!session?.accessToken,
        tokenStart: session?.accessToken
          ? session.accessToken.substring(0, 10) + "..."
          : null,
      },
    };
  }
};

export async function action({ request }) {
  const { billing } = await authenticate.admin(request);
  const { appSubscriptions } = await billing.check();
  try {
    if (appSubscriptions && appSubscriptions.length > 0) {
      const subscriptionId = appSubscriptions[0].id;
      await billing.cancel({
        subscriptionId,
      });
      return {
        success: true,
        message: "Plan successfully cancelled.",
      };
    }
    return {
      success: false,
      message: "No active subscription found.",
    };
  } catch (error) {
    console.error("Action error:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}

export default function PlansPage() {
  const data = useLoaderData();
  const submit = useSubmit();
  const actionData = useActionData();
  return (
    <React.Suspense fallback={""}>
      <PlansPageView shop={data} submit={submit} actionData={actionData} />
    </React.Suspense>
  );
}
