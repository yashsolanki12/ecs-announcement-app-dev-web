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
  getAllAnnouncement,
  // deleteAnnouncement,
  // duplicateAnnouncement,
} from "../../api/announcement";

import { getCurrentShopSession } from "../../api/current-shop-session";
import useAnnouncementData from "../../hooks/useAnnouncementData";
import useAnnouncementSubmit from "../../hooks/useAnnouncementSubmit";
import CircularProgress from "@mui/material/CircularProgress";
import Loader from "../../ui/loader";
import {
  convertToLocalDateTime,
  convertToUTC,
  getCurrentDateTime,
} from "../../utils/helper";

const steps = ["Content", "Design", "Placement"];

const AnnouncementForm = ({ id, heading }) => {
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);
  const [viewMode, setViewMode] = React.useState("desktop");
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Search and sort state - default is "desc" (oldest first)
  const [searchQuery, _setSearchQuery] = React.useState("");
  const [sortOrder, _setSortOrder] = React.useState("desc");

  // Build query params for API
  const getQueryParams = () => {
    const params = {};
    if (searchQuery) {
      params.search = searchQuery;
    }
    if (sortOrder) {
      params.sortOrder = sortOrder;
    }
    return params;
  };

  const [formData, setFormData] = React.useState({
    announcement_name: "Quick Announcement Bar",
    announcement_type: "simple",
    title: "🎁Free shipping over $ 100🎁",
    subheading: "Limited time offer",
    icon: "",
    icon_color: "#e14749",
    start_datetime: getCurrentDateTime(),
    has_end_date: false,
    sticky_bar: false,
    end_datetime: getCurrentDateTime(),
    position: "top",
    background_type: "gradient",
    background_color: "#b69784",
    gradient_colors: ["#fce1d0", "#ffadd6"],
    background_image: "",
    title_size: 14,
    title_color: "#64a7e2",
    subheading_size: 12,
    subheading_color: "#bb7ece",
    page_display: ["all", "home", "products", "catalog", "contact"],
    template_id: "custom",
    enabled: false,
    marquee_direction: "right",
    marquee_speed: 20,
    cta_type: "none",
    cta_text: "Shop now!",
    cta_link: "",
    arrow_icon_color: "#3c9eff",
    button_font_size: 14,
    button_text_color: "#c48282",
    button_background_color: "#aeb963",
    button_border_style: "solid",
    button_border_color: "#9dfc1f",
    announcements: [
      {
        title: "Free shipping over $ 100🎁",
        subheading: "",
        cta_type: "none",
        cta_link: "",
        cta_text: "Shop now!",
        icon: "",
        icon_color: "#e14749",
      },
    ],
  });

  // Create mutation
  const createMutation = useAnnouncementSubmit(
    (data) => createAnnouncement(data),
    setSnackbar,
    {
      invalidateKeys: [["announcement-bar"]],
      onSuccess: () => {
        navigate("/app");
      },
    },
  );

  // Update mutation
  const updateMutation = useAnnouncementSubmit(
    (data) => updateAnnouncement({ id, data }),
    setSnackbar,
    {
      invalidateKeys: [["announcement"]],
      onSuccess: () => {
        navigate("/app");
      },
    },
  );

  // Current shop API
  const {
    data: announcementSessionData,
    isLoading: announcementSessionLoading,
  } = useAnnouncementData(
    ["announcement-session"],
    getCurrentShopSession,
    null,
  );

  // Detail - only fetch in edit mode
  const { data: announcementDetail, isLoading: announcementDetailLoading } =
    isEditMode
      ? useAnnouncementData(
          ["announcement-detail"],
          () => getAnnouncementById(id),
          null,
        )
      : { data: null, isLoading: false };

  // List API with search and sort params
  // const { data: announcementListData, isLoading: announcementListLoading } =
  //   useAnnouncementData(
  //     ["announcement", searchQuery, sortOrder],
  //     () => getAllAnnouncement(getQueryParams()),
  //     null,
  //   );

  const fetchData = () => {
    try {
      const response = announcementDetail;
      if (response?.success && response.data) {
        const data = response.data;

        // If announcement_type is multiple, we need to convert flat data to announcements array
        if (data.announcement_type === "multiple") {
          const announcements = [];

          // Use existing announcements from backend or create from title/subheading
          if (data.announcements && data.announcements.length > 0) {
            // Backend already has announcements array
            announcements.push(...data.announcements);
          } else {
            // Create announcement from flat fields
            announcements.push({
              title: data.title || "",
              subheading: data.subheading || "",
              cta_type: data.cta_type || "none",
              cta_link: data.cta_link || "",
              cta_text: data.cta_text || "Shop now!",
              icon: data.icon || "",
              icon_color: data.icon_color || "#e14749",
            });
          }

          setFormData({
            ...data,
            sticky_bar: data.sticky_bar === true,
            announcements,
            start_datetime: convertToLocalDateTime(data.start_datetime),
            end_datetime: convertToLocalDateTime(data.end_datetime),
          });
        } else {
          // For simple type, keep the flat structure
          setFormData({
            ...data,
            announcements: [
              {
                title: data.title || "",
                subheading: data.subheading || "",
                cta_type: data.cta_type || "none",
                cta_link: data.cta_link || "",
                cta_text: data.cta_text || "Shop now!",
                icon: data.icon || "",
                icon_color: data.icon_color || "#e14749",
              },
            ],
            start_datetime: convertToLocalDateTime(data.start_datetime),
            end_datetime: convertToLocalDateTime(data.end_datetime),
          });
        }
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
    const preparePayload = (data) => ({
      ...data,
      start_datetime: convertToUTC(data.start_datetime),
      end_datetime: data.has_end_date ? convertToUTC(data.end_datetime) : "",
    });

    const createPayload = {
      ...preparePayload(formData),
      shopify_session_id: announcementSessionData?.data?._id || null,
    };
    try {
      if (isEditMode) {
        updateMutation.mutate(preparePayload(formData), {
          onError: handleApiError,
        });
      } else {
        createMutation.mutate(createPayload, {
          onError: handleApiError,
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Something went wrong",
        severity: "error",
      });
    }
  };

  // const handleDelete = async () => {
  //   if (!window.confirm("Are you sure you want to delete this announcement?"))
  //     return;
  //   try {
  //     const response = await deleteAnnouncement(id);
  //     if (response) {
  //       setSnackbar({
  //         open: true,
  //         message: response.message,
  //         severity: "success",
  //       });
  //       navigate("/app");
  //     }
  //   } catch (error) {
  //     setSnackbar({ open: true, message: "Delete failed", severity: "error" });
  //   }
  // };

  // const handleDuplicate = async () => {
  //   try {
  //     const response = await duplicateAnnouncement(id);
  //     if (response) {
  //       setSnackbar({
  //         open: true,
  //         message: response.message,
  //         severity: "success",
  //       });
  //       navigate("/app");
  //     }
  //   } catch (error) {
  //     setSnackbar({
  //       open: true,
  //       message: "Duplicate failed",
  //       severity: "error",
  //     });
  //   }
  // };

  // const handlePublishToggle = async () => {
  //   try {
  //     setFormData((prev) => ({ ...prev, enabled: !prev.enabled }));
  //     // If saving to server immediately:
  //     if (isEditMode) {
  //       const response = await updateAnnouncement({
  //         id,
  //         data: { ...formData, enabled: !formData.enabled },
  //       });
  //       if (response) {
  //         setSnackbar({
  //           open: true,
  //           message: response.message,
  //           severity: "success",
  //         });
  //         navigate("/app");
  //       }
  //     }
  //   } catch (error) {
  //     setSnackbar({
  //       open: true,
  //       message: "Failed to update status",
  //       severity: "error",
  //     });
  //   }
  // };

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

  const handleApiError = (error) => {
    const errorResponse = error.response?.data;
    const errorMessage = errorResponse?.message;
    let message = "Failed to save announcement";

    if (Array.isArray(errorResponse) && errorResponse.length > 0) {
      message = errorResponse.join(" | ");
    } else if (errorResponse?.message) {
      message = errorResponse.message;
    } else if (error.message) {
      message = error.message;
    }
    if (Array.isArray(errorMessage)) {
      // API returns array of validation errors
      const newErrors = {};
      errorMessage.forEach((msg) => {
        if (typeof msg === "string") {
          if (msg.toLowerCase().includes("title")) {
            newErrors.title = msg;
          }
          // else if (msg.toLowerCase().includes("description")) {
          //   newErrors.description = msg;
          // }
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      }
    } else {
      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
    }
  };

  const isSubmitting = isEditMode
    ? updateMutation.isPending
    : createMutation.isPending;

  React.useEffect(() => {
    if (isEditMode && id) {
      fetchData();
    }
  }, [id, isEditMode, announcementDetail]);

  // React.useEffect(() => {
  //   if (announcementListData?.data.length >= 10) {
  //     setSnackbar({
  //       open: true,
  //       message:
  //         "Cannot create more than 10 Announcement. Please delete an existing one to create a new one.",
  //       severity: "info",
  //     });
  //   }
  // }, [announcementListData]);

  if (isEditMode && announcementDetailLoading) {
    return <Loader />;
  }

  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
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
              bgcolor: formData.enabled ? "#dcfce7" : "#feeded",
              color: formData.enabled ? "#44895e" : "#d17688",
              px: 1,
              py: "5px",
              borderRadius: "7px",
              fontSize: "12px",
            }}
          >
            {formData.enabled ? "Active" : "Inactive"}
          </Box>
        </Box>
        <Stack direction="row" spacing={1}>
          {/* {isEditMode && (
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
          )} */}
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isSubmitting} // || announcementListData?.data.length >= 10
            size="small"
            sx={{
              bgcolor: "#202223",
              color: "white",
              textTransform: "none",
              padding: "4px 20px",
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={20} color="success" />
            ) : isEditMode ? (
              "Save"
            ) : (
              "Create"
            )}
          </Button>
          <Button
            variant="outlined"
            disabled={isSubmitting}
            onClick={handleNavigateBack}
            size="small"
            sx={{ textTransform: "none", padding: "4px 20px" }}
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
          p: 2,
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
          sx={{
            borderRadius: "6px",
            textTransform: "none",
            fontSize: "14px",
            p: "3px 14px",
          }}
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
            fontSize: "14px",
            p: "3px 14px",
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
