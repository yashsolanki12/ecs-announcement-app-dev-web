import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import TabletIcon from "@mui/icons-material/Tablet";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router";

import LivePreview from "../../components/LivePreview";
import StepContent from "../../components/StepContent";
import StepDesign from "../../components/StepDesign";
import StepPlacement from "../../components/StepPlacement";
import {
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  duplicateAnnouncement,
} from "../../api/announcement";

import { getCurrentShopSession } from "../../api/current-shop-session";
import useAnnouncementData from "../../hooks/useAnnouncementData";

const steps = ["Content", "Design", "Placement"];

const AnnouncementForm = ({ id, heading }) => {
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);
  const [viewMode, setViewMode] = React.useState("desktop");
  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = React.useState({
    announcement_name: "Quick Announcement Bar",
    type: "simple",
    title: "Free shipping over $ 100🎁",
    subheading: "Subheading",
    icon: "",
    iconColor: "#000000",
    startTime: new Date().toISOString().slice(0, 16),
    hasEndDate: false,
    endDate: "",
    position: "top",
    backgroundType: "gradient",
    backgroundColor: "#fce1d0",
    gradientColors: ["#fce1d0", "#ffadd6"],
    backgroundImage: "",
    fontFamily: "inherit",
    titleSize: 14,
    titleColor: "#000000",
    subheadingSize: 12,
    subheadingColor: "#000000",
    page_display: ["all", "home", "products", "catalog", "contact"],
    templateId: "custom",
    enabled: false,
    marqueeDirection: "right",
    marqueeSpeed: 20,
    ctaType: "none",
    ctaText: "Shop now!",
    ctaLink: "",
    arrowIconColor: "#3c9eff",
    buttonFontSize: 14,
    buttonTextColor: "#ffffff",
    buttonBackgroundColor: "#16180a",
    buttonBorderStyle: "solid",
    buttonBorderColor: "#9dfc1f",
    announcements: [
      {
        title: "Free shipping over $ 100🎁",
        subheading: "",
        ctaType: "none",
        ctaLink: "",
        ctaText: "Shop now!",
        icon: "",
        iconColor: "#000000",
      },
    ],
  });

  // Current shop API
  const {
    data: announcementSessionData,
    isLoading: announcementSessionLoading,
  } = useAnnouncementData(
    ["announcement-session"],
    getCurrentShopSession,
    null,
  );

  const fetchData = async () => {
    try {
      const response = await getAnnouncementById(id);
      if (response.success && response.data) {
        setFormData(response.data);
      }
    } catch (error) {
      console.error("Error fetching announcement:", error);
      setSnackbar({
        open: true,
        message: "Error fetching announcement data",
        severity: "error",
      });
    }
  };

  const handleNavigateBack = () => {
    navigate("/app", { replace: true });
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSave = async () => {
    setLoading(true);
    const createPayload = {
      ...formData,
      shopify_session_id: announcementSessionData?.data?._id || null,
    };
    try {
      let response;
      if (isEditMode) {
        response = await updateAnnouncement({ id, data: formData });
      } else {
        response = await createAnnouncement(createPayload);
      }
      setSnackbar({
        open: true,
        message: isEditMode ? response.message : response.message,
        severity: "success",
      });
      setTimeout(() => navigate("/app/announcement"), 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Something went wrong",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;
    try {
      const response = await deleteAnnouncement(id);
      if (response) {
        setSnackbar({
          open: true,
          message: response.message,
          severity: "success",
        });
        navigate("/app");
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Delete failed", severity: "error" });
    }
  };

  const handleDuplicate = async () => {
    try {
      const response = await duplicateAnnouncement(id);
      if (response) {
        setSnackbar({
          open: true,
          message: response.message,
          severity: "success",
        });
        navigate("/app");
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Duplicate failed",
        severity: "error",
      });
    }
  };

  const handlePublishToggle = async () => {
    try {
      setFormData((prev) => ({ ...prev, enabled: !prev.enabled }));
      // If saving to server immediately:
      if (isEditMode) {
        const response = await updateAnnouncement({
          id,
          data: { ...formData, enabled: !formData.enabled },
        });
        if (response) {
          setSnackbar({
            open: true,
            message: response.message,
            severity: "success",
          });
          navigate("/app");
        }
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update status",
        severity: "error",
      });
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <StepContent
            formData={formData}
            setFormData={setFormData}
            setSnackbar={setSnackbar}
          />
        );
      case 1:
        return (
          <StepDesign
            formData={formData}
            setFormData={setFormData}
            setSnackbar={setSnackbar}
          />
        );
      case 2:
        return (
          <StepPlacement
            formData={formData}
            setFormData={setFormData}
            setSnackbar={setSnackbar}
          />
        );
      default:
        return null;
    }
  };

  React.useEffect(() => {
    if (isEditMode) {
      fetchData();
    }
  }, [id, isEditMode]);

  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={handleNavigateBack} size="small">
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {formData.name ||
              (isEditMode ? "Edit Announcement" : "Create Announcement")}
          </Typography>
          <Box
            sx={{
              bgcolor: formData.enabled ? "#e3f2fd" : "#f1f1f1",
              color: formData.enabled ? "#1976d2" : "#757575",
              px: 1,
              py: 0.2,
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            {formData.enabled ? "Published" : "Not Publish"}
          </Box>
        </Box>
        <Stack direction="row" spacing={1}>
          {isEditMode && (
            <>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
                size="small"
                sx={{ textTransform: "none" }}
              >
                Delete
              </Button>
              <Button
                variant="outlined"
                onClick={handleDuplicate}
                size="small"
                sx={{ textTransform: "none" }}
              >
                Duplicate
              </Button>
              <Button
                variant="outlined"
                onClick={handlePublishToggle}
                size="small"
                sx={{ textTransform: "none" }}
              >
                {formData.enabled ? "Unpublish" : "Publish"}
              </Button>
            </>
          )}
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            size="small"
            sx={{
              bgcolor: "#202223",
              color: "white",
              textTransform: "none",
              padding: "6px 23px",
            }}
          >
            {isEditMode ? "Save" : "Create"}
          </Button>
          <Button
            variant="outlined"
            onClick={handleNavigateBack}
            size="small"
            sx={{ textTransform: "none", padding: "6px 23px" }}
          >
            Cancel
          </Button>
        </Stack>
      </Box>

      {/* Sticky Header Area (Nav + Preview) */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          bgcolor: "#f6f6f7", // Match the app background color
          pt: 1,
          mb: 2,
          p: 3,
        }}
      >
        {/* Custom Navigation Bar */}
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #dfe3e8",
            borderRadius: "12px",
            p: "8px 16px",
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "white",
          }}
        >
          {/* Left Side: Steps */}
          <Stack direction="row" alignItems="center" spacing={1}>
            {steps.map((label, index) => (
              <React.Fragment key={label}>
                <Box
                  onClick={() => setActiveStep(index)}
                  sx={{
                    px: 2,
                    py: 0.8,
                    borderRadius: "8px",
                    cursor: "pointer",
                    bgcolor: activeStep === index ? "#e3e3e3" : "transparent",
                    color: activeStep === index ? "#202223" : "#6d7175",
                    fontWeight: activeStep === index ? 600 : 500,
                    fontSize: "14px",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: activeStep === index ? "#d8d8d8" : "#f1f1f1",
                    },
                  }}
                >
                  {label}
                </Box>
                {index < steps.length - 1 && (
                  <Typography
                    sx={{ color: "#6d7175", fontSize: "14px", mx: 0.5 }}
                  >
                    &gt;
                  </Typography>
                )}
              </React.Fragment>
            ))}
          </Stack>

          {/* Right Side: View Toggles */}
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ bgcolor: "#f1f1f1", p: 0.5, borderRadius: "8px" }}
          >
            <Tooltip title="Desktop view" arrow>
              <IconButton
                size="small"
                onClick={() => setViewMode("desktop")}
                sx={{
                  borderRadius: "6px",
                  bgcolor: viewMode === "desktop" ? "white" : "transparent",
                  boxShadow:
                    viewMode === "desktop"
                      ? "0 1px 3px rgba(0,0,0,0.12)"
                      : "none",
                  color: viewMode === "desktop" ? "#202223" : "#6d7175",
                  "&:hover": {
                    bgcolor:
                      viewMode === "desktop" ? "white" : "rgba(0,0,0,0.04)",
                  },
                }}
              >
                <DesktopWindowsIcon sx={{ fontSize: "20px" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Tablet view" arrow>
              <IconButton
                size="small"
                onClick={() => setViewMode("tablet")}
                sx={{
                  borderRadius: "6px",
                  bgcolor: viewMode === "tablet" ? "white" : "transparent",
                  boxShadow:
                    viewMode === "tablet"
                      ? "0 1px 3px rgba(0,0,0,0.12)"
                      : "none",
                  color: viewMode === "tablet" ? "#202223" : "#6d7175",
                  "&:hover": {
                    bgcolor:
                      viewMode === "tablet" ? "white" : "rgba(0,0,0,0.04)",
                  },
                }}
              >
                <TabletIcon sx={{ fontSize: "20px" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Mobile view" arrow>
              <IconButton
                size="small"
                onClick={() => setViewMode("mobile")}
                sx={{
                  borderRadius: "6px",
                  bgcolor: viewMode === "mobile" ? "white" : "transparent",
                  boxShadow:
                    viewMode === "mobile"
                      ? "0 1px 3px rgba(0,0,0,0.12)"
                      : "none",
                  color: viewMode === "mobile" ? "#202223" : "#6d7175",
                  "&:hover": {
                    bgcolor:
                      viewMode === "mobile" ? "white" : "rgba(0,0,0,0.04)",
                  },
                }}
              >
                <PhoneIphoneIcon sx={{ fontSize: "20px" }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Paper>

        {/* Live Preview */}
        <LivePreview formData={formData} viewMode={viewMode} />
      </Box>

      {/* Step Components */}
      <Box sx={{ mb: 4 }}>{renderStepContent(activeStep)}</Box>

      {/* Footer Navigation */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
          sx={{ borderRadius: "6px", textTransform: "none" }}
        >
          Pre Step
        </Button>
        <Button
          variant="contained"
          disabled={activeStep === steps.length - 1}
          onClick={handleNext}
          sx={{
            bgcolor: "#202223",
            color: "white",
            borderRadius: "6px",
            textTransform: "none",
          }}
        >
          Next Step
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AnnouncementForm;
