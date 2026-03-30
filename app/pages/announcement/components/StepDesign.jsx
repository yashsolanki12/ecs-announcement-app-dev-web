import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Select } from "@mui/material";

const templates = [
  {
    id: "custom",
    name: "Custom (Manual)",
  },
  {
    id: "soft_blush",
    name: "Soft Blush",
    config: {
      backgroundType: "image",
      backgroundImage: "/holiday_pink_pattern.png",
      titleColor: "#202223",
      subheadingColor: "#202223",
      titleSize: 14,
    },
  },
  {
    id: "sunset_orange",
    name: "Sunset Orange",
    config: {
      backgroundType: "image",
      backgroundImage: "/sunset_orange.png",
      gradientColors: ["#ff7e5f", "#feb47b"],
      subheadingColor: "#ffffff",
      titleSize: 14,
    },
  },
  {
    id: "nature_teal",
    name: "Nature Teal",
    config: {
      backgroundType: "image",
      backgroundImage: "/modern_abstract_pattern.png",
      titleColor: "#ffffff",
      subheadingColor: "#ffffff",
      titleSize: 15,
    },
  },
  {
    id: "winter_magic",
    name: "Winter Magic",
    config: {
      backgroundType: "image",
      backgroundImage: "/winter_snowflake_pattern.png",
      titleColor: "#ffffff",
      subheadingColor: "#ffffff",
      titleSize: 15,
    },
  },
  {
    id: "midnight_blue",
    name: "Midnight Blue",
    config: {
      backgroundType: "image",
      backgroundImage: "/midnight_galaxy_pattern.png",
      titleColor: "#ffffff",
      subheadingColor: "#ffffff",
      titleSize: 14,
    },
  },
  {
    id: "lavender_breeze",
    name: "Lavender Breeze",
    config: {
      backgroundType: "image",
      backgroundImage: "/lavender_floral_pattern.png",
      titleColor: "#202223",
      subheadingColor: "#202223",
      titleSize: 14,
    },
  },
  {
    id: "arctic_frost",
    name: "Arctic Frost",
    config: {
      backgroundType: "image",
      backgroundImage: "/arctic_frost_crystal.png",
      backgroundColor: "#e0f7fa",
      titleColor: "#006064",
      subheadingColor: "#006064",
      titleSize: 13,
    },
  },
  {
    id: "royal_gold",
    name: "Royal Gold",
    config: {
      backgroundType: "image",
      // SVG Marble/Geo Pattern
      backgroundImage: "/royal_gold.png",
      backgroundColor: "#fffdf0",
      titleColor: "#202223",
      subheadingColor: "#202223",
      titleSize: 15,
    },
  },
];

const StepDesign = ({ formData, setFormData, setSnackbar }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGradientChange = (index, color) => {
    const newGradients = [...formData.gradientColors];
    newGradients[index] = color;
    setFormData((prev) => ({ ...prev, gradientColors: newGradients }));
  };
  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    const selectedTemplate = templates.find((t) => t.id === templateId);

    if (selectedTemplate && selectedTemplate.config) {
      setFormData((prev) => ({
        ...prev,
        templateId,
        ...selectedTemplate.config,
      }));
    } else {
      setFormData((prev) => ({ ...prev, templateId }));
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: "8px" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 2, fontSize: "18px" }}
        >
          Template
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Positioning
          </Typography>
          <Select
            fullWidth
            name="position"
            value={formData.position}
            onChange={handleChange}
            size="small"
          >
            <MenuItem value="top">Top Page</MenuItem>
            <MenuItem value="bottom">Bottom Page</MenuItem>
          </Select>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Template Selection
          </Typography>
          <Select
            fullWidth
            name="templateId"
            value={formData.templateId || "custom"}
            onChange={handleTemplateChange}
            size="small"
          >
            {templates.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
        {/* <Box sx={{ display: "flex", gap: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                name="sticky"
                checked={formData.sticky}
                onChange={handleChange}
                size="small"
              />
            }
            label="Sticky Bar"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="closeButton"
                checked={formData.closeButton}
                onChange={handleChange}
                size="small"
              />
            }
            label="Close Button"
          />
        </Box> */}
        {/* {formData.closeButton && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Close icon color
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <input
                type="color"
                name="closeIconColor"
                value={formData.closeIconColor}
                onChange={handleChange}
                style={{ width: "40px", height: "40px", border: "none" }}
              />
              <TextField
                name="closeIconColor"
                value={formData.closeIconColor}
                onChange={handleChange}
                size="small"
                sx={{ width: "120px" }}
              />
            </Box>
          </Box>
        )} */}
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: "8px" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 2, fontSize: "18px" }}
        >
          Background
        </Typography>
        <RadioGroup
          name="backgroundType"
          value={formData.backgroundType}
          onChange={handleChange}
        >
          <FormControlLabel
            value="single"
            control={<Radio size="small" />}
            label="Single color background"
          />
          {formData.backgroundType === "single" && (
            <Box sx={{ ml: 4, mb: 2 }}>
              <input
                type="color"
                name="backgroundColor"
                value={formData.backgroundColor}
                onChange={handleChange}
                style={{
                  width: "40px",
                  height: "40px",
                  border: "none",
                  cursor: "pointer",
                }}
              />
            </Box>
          )}

          <FormControlLabel
            value="gradient"
            control={<Radio size="small" />}
            label="Gradient background"
          />
          {formData.backgroundType === "gradient" && (
            <Box sx={{ ml: 4, mb: 2, display: "flex", gap: 2 }}>
              <input
                type="color"
                value={formData.gradientColors[0]}
                onChange={(e) => handleGradientChange(0, e.target.value)}
                style={{
                  width: "40px",
                  height: "40px",
                  border: "none",
                  cursor: "pointer",
                }}
              />
              <input
                type="color"
                value={formData.gradientColors[1]}
                onChange={(e) => handleGradientChange(1, e.target.value)}
                style={{
                  width: "40px",
                  height: "40px",
                  border: "none",
                  cursor: "pointer",
                }}
              />
            </Box>
          )}

          <FormControlLabel
            value="image"
            control={<Radio size="small" />}
            label="Upload Image background"
          />
          {formData.backgroundType === "image" && (
            <Box sx={{ ml: 4, mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Box
                  sx={{
                    width: { xs: "100%", sm: 120 },
                    height: 120,
                    border: "1px solid #dfe3e8",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    bgcolor: "#f6f6f7",
                    flexShrink: 0,
                  }}
                >
                  {formData.backgroundImage ? (
                    <img
                      src={formData.backgroundImage}
                      alt="Background"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Box sx={{ textAlign: "center", p: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        No Image
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    flexGrow: 1,
                    width: "100%",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Max size: 2MB. Supports PNG, JPEG.
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      component="label"
                      sx={{
                        textTransform: "none",
                        borderColor: "#dfe3e8",
                        color: "#202223",
                        "&:hover": {
                          borderColor: "#c4cdd5",
                          bgcolor: "#f6f6f7",
                        },
                      }}
                    >
                      Upload Image
                      <input
                        type="file"
                        hidden
                        accept=".png,.jpg,.jpeg"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              setSnackbar({
                                open: true,
                                message: "Image size must be less than 2MB.",
                                severity: "error",
                              });
                              e.target.value = "";
                              return;
                            }
                            const allowedTypes = [
                              "image/png",
                              "image/jpeg",
                              "image/jpg",
                            ];
                            if (!allowedTypes.includes(file.type)) {
                              setSnackbar({
                                open: true,
                                message:
                                  "Invalid format. Supported formats are PNG, JPEG (Max 2MB).",
                                severity: "error",
                              });
                              e.target.value = "";
                              return;
                            }

                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData((prev) => ({
                                ...prev,
                                backgroundImage: reader.result,
                              }));
                              e.target.value = "";
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </Button>
                    {formData.backgroundImage && (
                      <Button
                        variant="text"
                        color="error"
                        size="small"
                        sx={{ textTransform: "none" }}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            backgroundImage: "",
                          }))
                        }
                      >
                        Remove
                      </Button>
                    )}
                  </Stack>
                </Box>
              </Box>
            </Box>
          )}
        </RadioGroup>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: "8px" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 2, fontSize: "18px" }}
        >
          Announcements List Design
        </Typography>
        <Typography variant="subtitle2" sx={{ mb: 2, color: "text.secondary" }}>
          Typography
        </Typography>
        <Grid container spacing={3}>
          {/* Row 1: Title Size | Title Color */}
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Title size
            </Typography>
            <Select
              fullWidth
              name="titleSize"
              value={formData.titleSize}
              onChange={handleChange}
              size="small"
            >
              {[10, 11, 12, 13, 14, 15, 16, 17, 18].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}px
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Title color
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <input
                type="color"
                name="titleColor"
                value={formData.titleColor}
                onChange={handleChange}
                style={{
                  width: "32px",
                  height: "32px",
                  border: "none",
                  cursor: "pointer",
                }}
              />
              <TextField
                name="titleColor"
                value={formData.titleColor}
                onChange={handleChange}
                size="small"
                fullWidth
              />
            </Box>
          </Grid>

          {formData.type !== "running" && (
            <>
              {" "}
              {/* Row 2: Subheading Size | Subheading Color */}
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Subheading size
                </Typography>
                <Select
                  fullWidth
                  name="subheadingSize"
                  value={formData.subheadingSize}
                  onChange={handleChange}
                  size="small"
                >
                  {[10, 11, 12, 13, 14, 15, 16, 17, 18].map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}px
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Subheading color
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <input
                    type="color"
                    name="subheadingColor"
                    value={formData.subheadingColor}
                    onChange={handleChange}
                    style={{
                      width: "32px",
                      height: "32px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  />
                  <TextField
                    name="subheadingColor"
                    value={formData.subheadingColor}
                    onChange={handleChange}
                    size="small"
                    fullWidth
                  />
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default StepDesign;
