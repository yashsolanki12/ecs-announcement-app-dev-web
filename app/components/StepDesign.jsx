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
import Select from "@mui/material/Select";
import { templates } from "../utils/helper";

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
            Template selection
          </Typography>
          <Select
            fullWidth
            name="templateId"
            value={formData.templateId || "custom"}
            onChange={handleTemplateChange}
            size="small"
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 260,
                  width: 250,
                },
              },
            }}
          >
            {templates.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {formData.type === "multiple" && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Arrow icon color
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <input
                type="color"
                name="arrowIconColor"
                value={formData.arrowIconColor || "#17d0d3"}
                onChange={handleChange}
                style={{
                  width: "40px",
                  height: "40px",
                  border: "none",
                  cursor: "pointer",
                }}
              />
              <TextField
                name="arrowIconColor"
                value={formData.arrowIconColor || "#17d0d3"}
                onChange={handleChange}
                size="small"
                sx={{ width: "120px" }}
              />
            </Box>
          </Box>
        )}
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

        {/* Typography Settings */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          {/* Title Size */}
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
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 200,
                    width: 250,
                  },
                },
              }}
            >
              {[10, 11, 12, 13, 14, 15, 16, 17, 18].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}px
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Title Color */}
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
              {/* Subheading Size  */}
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
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 200,
                        width: 250,
                      },
                    },
                  }}
                >
                  {[10, 11, 12, 13, 14, 15, 16, 17, 18].map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}px
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* Subheading Color */}
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
        </Box>

        {/* Button Settings */}
        {(formData.type === "multiple" || formData.type === "running") && (
          <>
            <Typography
              variant="subtitle2"
              sx={{
                mt: 4,
                mb: 2,
                color: "text.secondary",
                pt: 2,
                borderTop: "1px solid #dfe3e8",
              }}
            >
              Button
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: { xs: 1.5, sm: 2 },
              }}
            >
              {/* Font Size */}
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Font size
                </Typography>
                <Select
                  fullWidth
                  name="buttonFontSize"
                  value={formData.buttonFontSize || 14}
                  onChange={handleChange}
                  size="small"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 200,
                        width: 250,
                      },
                    },
                  }}
                >
                  {[10, 11, 12, 13, 14, 15].map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}px
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* Text Color */}
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Text color
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <input
                    type="color"
                    name="buttonTextColor"
                    value={formData.buttonTextColor || "#ffffff"}
                    onChange={handleChange}
                    style={{
                      width: "32px",
                      height: "32px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  />
                  <TextField
                    name="buttonTextColor"
                    value={formData.buttonTextColor || "#ffffff"}
                    onChange={handleChange}
                    size="small"
                    fullWidth
                  />
                </Box>
              </Grid>

              {/*  Border style  */}
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Border style
                </Typography>
                <Select
                  fullWidth
                  name="buttonBorderStyle"
                  value={formData.buttonBorderStyle || "none"}
                  onChange={handleChange}
                  size="small"
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="solid">Solid</MenuItem>
                  <MenuItem value="dashed">Dashed</MenuItem>
                  <MenuItem value="dotted">Dotted</MenuItem>
                </Select>
              </Grid>

              {/* Border color */}
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Border color
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <input
                    type="color"
                    name="buttonBorderColor"
                    value={formData.buttonBorderColor || "#9dfc1f"}
                    onChange={handleChange}
                    style={{
                      width: "32px",
                      height: "32px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  />
                  <TextField
                    name="buttonBorderColor"
                    value={formData.buttonBorderColor || "#9dfc1f"}
                    onChange={handleChange}
                    size="small"
                    fullWidth
                  />
                </Box>
              </Grid>

              {/* Background Color */}
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Background
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <input
                    type="color"
                    name="buttonBackgroundColor"
                    value={formData.buttonBackgroundColor || "#55c521"}
                    onChange={handleChange}
                    style={{
                      width: "32px",
                      height: "32px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  />
                  <TextField
                    name="buttonBackgroundColor"
                    value={formData.buttonBackgroundColor || "#55c521"}
                    onChange={handleChange}
                    size="small"
                    fullWidth
                  />
                </Box>
              </Grid>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default StepDesign;
