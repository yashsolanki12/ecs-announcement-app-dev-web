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
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import { templates } from "../utils/helper";

const StepDesign = ({ formData, setFormData, setSnackbar }) => {
  const showButton =
    (formData.announcement_type !== "simple" &&
      formData.announcement_type === "multiple" &&
      formData.announcements?.some((a) => a.cta_type === "button")) ||
    formData.cta_type === "button" ||
    (formData.announcement_type === "running" &&
      formData.cta_type === "button");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGradientChange = (index, color) => {
    const newGradients = [
      ...(formData.gradient_colors || ["#ff7e5f", "#feb47b"]),
    ];
    newGradients[index] = color;
    setFormData((prev) => ({ ...prev, gradient_colors: newGradients }));
  };
  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    const selectedTemplate = templates.find((t) => t.id === templateId);

    if (selectedTemplate && selectedTemplate.config) {
      setFormData((prev) => ({
        ...prev,
        template_id: templateId,
        background_image: selectedTemplate.config.backgroundImage || "",
        ...selectedTemplate.config,
      }));
    } else {
      setFormData((prev) => ({ ...prev, template_id: templateId }));
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: "8px" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 2, fontSize: "16px" }}
        >
          Template
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 500, fontSize: "14px" }}
          >
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

        {formData.position !== "bottom" && (
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="sticky_bar"
                  checked={formData.sticky_bar}
                  onChange={handleChange}
                  size="small"
                />
              }
              label="Sticky Bar"
              componentsProps={{ typography: { sx: { fontSize: "14px" } } }}
            />
          </Box>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 500, fontSize: "14px" }}
          >
            Template selection
          </Typography>
          <Select
            fullWidth
            name="template_id"
            value={formData.template_id || "custom"}
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

        {formData.announcement_type === "multiple" &&
          formData.announcements.length > 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: 500, fontSize: "14px" }}
              >
                Arrow icon color
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <input
                  type="color"
                  name="arrow_icon_color"
                  value={formData.arrow_icon_color || "#17d0d3"}
                  onChange={handleChange}
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "none",
                    cursor: "pointer",
                  }}
                />
                <TextField
                  name="arrow_icon_color"
                  value={formData.arrow_icon_color || "#17d0d3"}
                  onChange={handleChange}
                  size="small"
                  sx={{ width: "120px" }}
                />
              </Box>
            </Box>
          )}
      </Paper>

      <Paper variant="outlined" sx={{ p: 2, borderRadius: "8px" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 2, fontSize: "16px" }}
        >
          Background
        </Typography>
        <RadioGroup
          name="background_type"
          value={formData.background_type}
          onChange={handleChange}
        >
          <FormControlLabel
            value="single"
            control={<Radio size="small" />}
            label="Single color background"
            componentsProps={{ typography: { sx: { fontSize: "14px" } } }}
          />
          {formData.background_type === "single" && (
            <Box
              sx={{
                ml: 3,
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <TextField
                name="background_color"
                value={formData.background_color}
                onChange={handleChange}
                size="small"
              />
              <input
                type="color"
                name="background_color"
                value={formData.background_color}
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
            componentsProps={{ typography: { sx: { fontSize: "14px" } } }}
          />
          {formData.background_type === "gradient" && (
            <Box sx={{ ml: 3, mb: 2, display: "flex", gap: 2 }}>
              <TextField
                name="background_color"
                value={formData.background_color}
                onChange={handleChange}
                size="small"
              />
              <input
                type="color"
                value={formData.gradient_colors?.[0] || "#ff7e5f"}
                onChange={(e) => handleGradientChange(0, e.target.value)}
                style={{
                  width: "40px",
                  height: "40px",
                  border: "none",
                  cursor: "pointer",
                }}
              />
              {/* <TextField
                name="gradient_colors"
                value={formData.gradient_colors[0]}
                onChange={handleChange}
                size="small"
              /> */}

              <TextField
                name="background_color"
                value={formData.background_color}
                onChange={handleChange}
                size="small"
              />
              <input
                type="color"
                value={formData.gradient_colors?.[1] || "#feb47b"}
                onChange={(e) => handleGradientChange(1, e.target.value)}
                style={{
                  width: "40px",
                  height: "40px",
                  border: "none",
                  cursor: "pointer",
                }}
              />
              {/* <TextField
                name="gradient_colors"
                value={formData.gradient_colors[1]}
                onChange={handleChange}
                size="small"
              /> */}
            </Box>
          )}

          <FormControlLabel
            value="image"
            control={<Radio size="small" />}
            label="Upload Image background"
            componentsProps={{ typography: { sx: { fontSize: "14px" } } }}
          />
          {formData.background_type === "image" && (
            <Box sx={{ ml: 3, mb: 2 }}>
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
                  {formData.background_image ? (
                    <img
                      src={formData.background_image}
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
                    Max size: 1MB. Supports PNG, JPEG.
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
                            if (file.size > 1 * 1024 * 1024) {
                              setSnackbar({
                                open: true,
                                message: "Image size must be less than 1MB.",
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
                                background_image: reader.result,
                              }));
                              e.target.value = "";
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </Button>
                    {formData.background_image && (
                      <Tooltip placement="top" title="Remove Image" arrow>
                        <Button
                          variant="text"
                          color="error"
                          size="small"
                          sx={{ textTransform: "none" }}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              background_image: "",
                            }))
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                    )}
                  </Stack>
                </Box>
              </Box>
            </Box>
          )}
        </RadioGroup>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2, borderRadius: "8px" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 650, mb: 2, fontSize: "16px" }}
        >
          Announcements List Design
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{ mb: 2, color: "black", fontSize: "14px", fontWeight: 700 }}
        >
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
              name="title_size"
              value={formData.title_size}
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
              <TextField
                name="title_color"
                value={formData.title_color}
                onChange={handleChange}
                size="small"
                fullWidth
              />
              <input
                type="color"
                name="title_color"
                value={formData.title_color ?? "#ffa8B6"}
                onChange={handleChange}
                style={{
                  width: "32px",
                  height: "32px",
                  border: "none",
                  cursor: "pointer",
                }}
              />
            </Box>
          </Grid>

          <>
            {/* Subheading Size  */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Subheading size
              </Typography>
              <Select
                fullWidth
                name="subheading_size"
                value={formData.subheading_size}
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
                <TextField
                  name="subheading_color"
                  value={formData.subheading_color}
                  onChange={handleChange}
                  size="small"
                  fullWidth
                />
                <input
                  type="color"
                  name="subheading_color"
                  value={formData.subheading_color ?? "#a28089"}
                  onChange={handleChange}
                  style={{
                    width: "32px",
                    height: "32px",
                    border: "none",
                    cursor: "pointer",
                  }}
                />
              </Box>
            </Grid>
          </>
        </Box>
        {/* Button Settings */}
        {showButton && (
          <>
            <Typography
              variant="subtitle2"
              sx={{
                mt: 4,
                mb: 2,
                color: "black",
                pt: 2,
                borderTop: "1px solid #dfe3e8",
                fontWeight: 700,
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
                  name="button_font_size"
                  value={formData.button_font_size || 14}
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
                  <TextField
                    name="button_text_color"
                    value={formData.button_text_color || "#ffffff"}
                    onChange={handleChange}
                    size="small"
                    fullWidth
                  />
                  <input
                    type="color"
                    name="button_text_color"
                    value={formData.button_text_color || "#ffffff"}
                    onChange={handleChange}
                    style={{
                      width: "32px",
                      height: "32px",
                      border: "none",
                      cursor: "pointer",
                    }}
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
                  name="button_border_style"
                  value={formData.button_border_style || "none"}
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
                  <TextField
                    name="button_border_color"
                    value={formData.button_border_color || "#9dfc1f"}
                    onChange={handleChange}
                    size="small"
                    fullWidth
                  />
                  <input
                    type="color"
                    name="button_border_color"
                    value={formData.button_border_color || "#9dfc1f"}
                    onChange={handleChange}
                    style={{
                      width: "32px",
                      height: "32px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  />
                </Box>
              </Grid>

              {/* Background Color */}
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Background
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextField
                    name="button_background_color"
                    value={formData.button_background_color || "#55c521"}
                    onChange={handleChange}
                    size="small"
                    fullWidth
                  />
                  <input
                    type="color"
                    name="button_background_color"
                    value={formData.button_background_color || "#55c521"}
                    onChange={handleChange}
                    style={{
                      width: "32px",
                      height: "32px",
                      border: "none",
                      cursor: "pointer",
                    }}
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
