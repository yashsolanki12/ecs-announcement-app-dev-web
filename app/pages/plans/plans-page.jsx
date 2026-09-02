import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Check from "@mui/icons-material/Check";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import ConfirmDialog from "../../ui/confirmation-dialog";
import LinearProgress from "@mui/material/LinearProgress";
import useAnnouncementData from "../../hooks/useAnnouncementData";
import StoreMetricsShimmer from "../../ui/store-metrics-shimmer";

import { syncStoreMetrics } from "../../api/store-metrics";

const PlansPage = ({ shop, submit, actionData }) => {
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [cancelPlanDialogOpen, setCancelPlanDialogOpen] = React.useState(false);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const currentStore = shop.shop.split(".").at(0);
  const planName = shop?.subscription
    ? shop.subscription.name || "Free"
    : "No Plan";

  const {
    data: announcementStoreMetricsData,
    isLoading: announcementStoreMetricsLoading,
    error: announcementStoreMetricsError,
  } = useAnnouncementData(
    ["announcement-store-metrics"],
    () => syncStoreMetrics(planName),
    null,
  );

  const isLimitExceeded = String(announcementStoreMetricsError).includes(
    "limit",
  );

  const handleViewPlan = () => {
    window.open(
      `https://admin.shopify.com/store/${currentStore}/charges/announcement-test/pricing_plans`,
      "_top",
    );
  };

  const handleChangePlan = () => {
    window.open(
      `https://admin.shopify.com/store/${currentStore}/charges/announcement-test/pricing_plans`,
      "_top",
    );
  };

  React.useEffect(() => {
    if (isLimitExceeded && shop?.subscription !== undefined) {
      setSnackbar({
        open: true,
        message: String(announcementStoreMetricsError),
        severity: "error",
      });
    }
  }, [isLimitExceeded]);

  // Show snackbar when actionData changes
  React.useEffect(() => {
    if (actionData) {
      setSnackbar({
        open: true,
        message: actionData.message || "Operation completed",
        severity: actionData.success ? "success" : "error",
      });
      // If plan was cancelled successfully, sync store metrics with empty plan
      if (actionData.success && actionData.message?.includes("cancelled")) {
        console.log("Cancelling plan, syncing metrics...");
        syncStoreMetrics("No Plan")
          // .then(() => {
          //   console.log("Metrics synced, reloading...");
          //   window.location.reload();
          // })
          .catch((err) => {
            console.error("Error syncing metrics:", err);
          });
      }
    }
  }, [actionData]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: 600, md: 800 },
        mx: "auto",
        px: { xs: 3, sm: 4 },
        py: { xs: 3, sm: 4 },
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        sx={{ mb: 2, gap: 1 }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#202223",
            fontSize: { xs: 18, sm: 20 },
          }}
        >
          Plans
        </Typography>
      </Stack>
      {announcementStoreMetricsLoading ? (
        <StoreMetricsShimmer />
      ) : (
        <>
          {" "}
          {/* Plan Usage */}
          {announcementStoreMetricsData?.success === true &&
            shop?.subscription !== undefined && (
              <Box
                sx={{
                  mb: 3,
                  p: { xs: 1.5, sm: 2 },
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ mb: 1, color: "#202223", lineHeight: 1.5 }}
                >
                  You're currently on{" "}
                  <strong>
                    "{announcementStoreMetricsData?.data.plan_name}"
                  </strong>{" "}
                  ({announcementStoreMetricsData?.data.views_count} /{" "}
                  {announcementStoreMetricsData?.data.limit === -1
                    ? "Unlimited"
                    : announcementStoreMetricsData?.data.limit}{" "}
                  monthly views). One visitor can have multiple views per
                  session.
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={
                    announcementStoreMetricsData?.data.limit === -1
                      ? 0
                      : Math.min(
                          (announcementStoreMetricsData?.data.views_count /
                            announcementStoreMetricsData?.data.limit) *
                            100,
                          100,
                        )
                  }
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#202223",
                    },
                  }}
                />
              </Box>
            )}
        </>
      )}

      {/* Subscription Section */}
      {shop.subscription ? (
        <Card
          sx={{
            borderRadius: "10px",
            width: "100%",
          }}
        >
          <CardContent>
            {/* Active Plan Banner */}
            <Box
              sx={{
                backgroundColor: "#2b835b",
                p: { xs: 1, sm: 1.5 },
                borderRadius: "6px",
                mb: { xs: 2, sm: 3 },
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Check sx={{ color: "white", fontSize: { xs: 16, sm: 20 } }} />

              <Typography
                variant="body2"
                sx={{
                  color: "white",
                  lineHeight: 1.5,
                }}
              >
                You are subscribed to{" "}
                <strong style={{ color: "black" }}>
                  "{shop.subscription.name}"
                </strong>{" "}
                plan.
              </Typography>
            </Box>

            {/* Actions */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                onClick={handleChangePlan}
                sx={{
                  backgroundColor: "#000000",
                  color: "white",
                  textTransform: "none",
                  borderRadius: "6px",
                  fontWeight: 600,
                  fontSize: "13px",
                  padding: { xs: "10px 18px", sm: "5px 10px" },
                  textDecoration: "none",
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": {
                    backgroundColor: "#303030",
                  },
                }}
              >
                Change plan
              </Button>
              {shop.subscription.name !== "Free" && (
                <Button
                  variant="outlined"
                  onClick={() => setCancelPlanDialogOpen(true)}
                  sx={{
                    backgroundColor: "#ffffff",
                    color: "black",
                    textTransform: "none",
                    borderRadius: "6px",
                    fontWeight: 600,
                    fontSize: "13px",
                    padding: { xs: "10px 18px", sm: "5px 10px" },
                    textDecoration: "none",
                    width: { xs: "100%", sm: "auto" },
                    border: "1px solid #ddd",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  Cancel plan
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ borderRadius: "10px" }}>
          <CardContent>
            <Typography
              variant="body2"
              sx={{
                color: "#6a6f6f",
                fontSize: "14px",
                mb: 2,
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            >
              Click "View Plans" and select your preferred plan.
            </Typography>

            <Button
              variant="contained"
              onClick={handleViewPlan}
              sx={{
                backgroundColor: "#202223",
                textTransform: "none",
                borderRadius: "6px",
                fontWeight: 600,
                padding: { xs: "12px 18px", sm: "5px 10px" },
                fontSize: "14px",
                width: { xs: "100%", sm: "auto" },
                "&:hover": { backgroundColor: "#303030" },
              }}
            >
              View Plans
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={cancelPlanDialogOpen}
        title="Confirm Plan Cancellation?"
        message={`This action cannot be undone. This will cancel your "${shop.subscription?.name}" plan.`}
        onClose={() => setCancelPlanDialogOpen(false)}
        onConfirm={() =>
          submit(
            {},
            { method: "POST" },
            setCancelPlanDialogOpen(false),
            handleViewPlan,
          )
        }
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.severity === "error" ? 5000 : 3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PlansPage;
