import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";

const AnnouncementForm = ({ id, heading }) => {
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const handleNavigateBack = () => {
    navigate("/app", { replace: true });
  };
  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={handleNavigateBack}
            size="small"
            sx={{ color: "#202223", cursor: "pointer" }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#202223",
              fontSize: { xs: 18, sm: 20 },
            }}
          >
            {heading ||
              (isEditMode ? "Edit Announcement" : "Create Announcement")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AnnouncementForm;
