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
import { syncStoreMetrics } from "../../api/store-metrics";
import useAnnouncementData from "../../hooks/useAnnouncementData";

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
  const planName = shop?.subscription?.name || "Free";

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
      `https://admin.shopify.com/store/${currentStore}/charges/ecs-announcement-app-dev/pricing_plans`,
      "_top",
    );
  };

  const handleChangePlan = () => {
    window.open(
      `https://admin.shopify.com/store/${currentStore}/charges/ecs-announcement-app-dev/pricing_plans`,
      "_top",
    );
  };

  React.useEffect(() => {
    if (isLimitExceeded) {
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
    }
  }, [actionData]);

  return (
    <Box
      sx={{
        maxWidth: { xs: "100%", sm: 600, md: 800 },
        mx: "auto",
        width: "100%",
        px: { xs: 2, sm: 3 },
      }}
    >
      <Box>
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
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "100%" },
          mx: "auto",
        }}
      >
        {/* View Limit Progress */}
        {true == announcementStoreMetricsData?.success &&
          shop?.subscription !== undefined && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                backgroundColor: "#fff",
              }}
            >
              <Typography variant="body2" sx={{ mb: 1, color: "#202223" }}>
                You're currently on{" "}
                <strong>
                  "{announcementStoreMetricsData?.data.plan_name}"
                </strong>{" "}
                ({announcementStoreMetricsData?.data.views_count} /{" "}
                {announcementStoreMetricsData?.data.limit === -1
                  ? "Unlimited"
                  : announcementStoreMetricsData?.data.limit}{" "}
                monthly views). One visitor can have multiple views per session.
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
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "100%" },
          mx: "auto",
        }}
      >
        {shop.subscription ? (
          <>
            <Card
              sx={{
                borderRadius: "10px",
                width: "100%",
                maxWidth: { xs: "100%" },
                mx: "auto",
              }}
            >
              <CardContent>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: "11px", sm: "14px" },
                    backgroundColor: "#2b835b",
                    p: { xs: 0.75, sm: 1 },
                    color: "white",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                    wordBreak: "break-word",
                    lineHeight: 1.4,
                  }}
                  fontWeight={600}
                  mb={{ xs: 2, sm: 3.5 }}
                >
                  <Check
                    sx={{
                      color: "white",
                      fontSize: { xs: 14, sm: 20 },
                      flexShrink: 0,
                    }}
                  />
                  <Box component="span" sx={{ display: "inline-block" }}>
                    <Typography variant="body2">
                      You are subscribed to the{" "}
                      <strong style={{ color: "#202223" }}>
                        "{shop.subscription.name}"
                      </strong>{" "}
                      plan.
                    </Typography>
                  </Box>
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: { xs: "column", sm: "row" },
                    width: "100%",
                  }}
                >
                  <Button
                    variant="contained"
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
                    onClick={handleChangePlan}
                  >
                    Change plan
                  </Button>
                  <Button
                    variant="contained"
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
                    onClick={() => setCancelPlanDialogOpen(true)}
                  >
                    Cancel plan
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card sx={{ borderRadius: "10px" }}>
              <CardContent>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6a6f6f",
                    fontSize: "14px",
                    mb: "10px",
                    fontWeight: 500,
                  }}
                >
                  Click 'View Plans' and select your preferred plan.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#202223",
                    color: "white",
                    textTransform: "none",
                    borderRadius: "6px",
                    fontWeight: 600,
                    padding: { xs: "12px 18px", sm: "5px 10px" },
                    textDecoration: "none",
                    // width: "100%",
                    maxWidth: 500,
                    // mx: "auto",
                    display: "block",
                    "&:hover": {
                      backgroundColor: "#303030",
                    },
                  }}
                  onClick={handleViewPlan}
                >
                  View Plans
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Delete Cancel Plan Confirmation */}
        <ConfirmDialog
          open={cancelPlanDialogOpen}
          title="Confirm Plan Cancellation?"
          message={`This action cannot be undone. This will cancel your "${shop.subscription?.name}" plan.`}
          onClose={() => setCancelPlanDialogOpen(false)}
          onConfirm={() =>
            submit({}, { method: "POST" }, setCancelPlanDialogOpen(false))
          }
        />

        {/* Snackbar for notifications */}
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
    </Box>
  );
};

export default PlansPage;
