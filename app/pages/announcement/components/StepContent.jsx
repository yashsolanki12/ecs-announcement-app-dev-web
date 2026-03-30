import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import RichTextEditor from "./RichTextEditor";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Slider from "@mui/material/Slider";
import IconPickerModal from "./IconPickerModal";

const StepContent = ({ formData, setFormData, setSnackbar }) => {
  const [isIconModalOpen, setIsIconModalOpen] = React.useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;
    if (name === "name" && typeof newValue === "string")
      newValue = newValue.slice(0, 30);
    if (name === "subheading" && typeof newValue === "string")
      newValue = newValue.slice(0, 50);
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleTitleChange = (newValue) => {
    setFormData((prev) => ({ ...prev, title: newValue }));
  };

  const handleFileUpload = (e) => {
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
        "image/svg+xml",
      ];
      if (
        !allowedTypes.includes(file.type) &&
        !file.name.toLowerCase().endsWith(".svg")
      ) {
        setSnackbar({
          open: true,
          message: "Invalid format. Supported formats are PNG, JPEG, and SVG.",
          severity: "error",
        });
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, icon: reader.result }));
        e.target.value = "";
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Configuration Section */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: "8px" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 2, fontSize: "18px" }}
        >
          Announcement Config
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Announcement Name
          </Typography>
          <TextField
            fullWidth
            name="announcement_name"
            value={formData.announcement_name || ""}
            onChange={handleChange}
            inputProps={{ maxLength: 30 }}
            helperText={`${(formData.announcement_name || "").length}/30`}
            size="small"
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Announcement type
          </Typography>
          <RadioGroup name="type" value={formData.type} onChange={handleChange}>
            <FormControlLabel
              value="simple"
              control={<Radio size="small" />}
              label="Simple announcement"
            />
            <FormControlLabel
              value="running"
              control={<Radio size="small" />}
              label="Running announcement"
            />
            <FormControlLabel
              value="multiple"
              control={<Radio size="small" />}
              label="Multiple announcement"
            />
          </RadioGroup>
        </Box>

        {formData.type === "running" && (
          <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid #dfe3e8" }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Running Animation Settings
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Marquee Direction
              </Typography>
              <RadioGroup
                name="marqueeDirection"
                value={formData.marqueeDirection || "right"}
                onChange={handleChange}
                row
              >
                <FormControlLabel
                  value="left"
                  control={<Radio size="small" />}
                  label="Left to Right"
                />
                <FormControlLabel
                  value="right"
                  control={<Radio size="small" />}
                  label="Right to Left"
                />
              </RadioGroup>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Animation Speed (Seconds)
              </Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={formData.marqueeSpeed || 20}
                  onChange={(e, val) =>
                    setFormData((prev) => ({ ...prev, marqueeSpeed: val }))
                  }
                  min={10}
                  max={20}
                  step={1}
                  valueLabelDisplay="auto"
                  sx={{ color: "#202223" }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: -1,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Fast (10s)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Slow (20s)
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Content Details Section */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: "8px" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 2, fontSize: "18px" }}
        >
          Announcements List
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Title
          </Typography>
          <RichTextEditor
            value={formData.title}
            onChange={handleTitleChange}
            maxLength={30}
          />
        </Box>

        {formData.type !== "running" && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Subheading
            </Typography>
            <TextField
              fullWidth
              name="subheading"
              value={formData.subheading || ""}
              onChange={handleChange}
              inputProps={{ maxLength: 50 }}
              helperText={`${(formData.subheading || "").length}/50`}
              size="small"
            />
          </Box>
        )}

        {formData.type === "running" && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Call to action
              </Typography>
              <Select
                fullWidth
                name="ctaType"
                value={formData.ctaType || "none"}
                onChange={handleChange}
                size="small"
              >
                <MenuItem value="none">No call to action</MenuItem>
                <MenuItem value="button">Button</MenuItem>
                <MenuItem value="clickable_bar">
                  Make entire bar clickable
                </MenuItem>
              </Select>
            </Box>
            {(formData.ctaType === "button" ||
              formData.ctaType === "clickable_bar") && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Link
                </Typography>
                <TextField
                  fullWidth
                  name="ctaLink"
                  value={formData.ctaLink || ""}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  size="small"
                />
              </Box>
            )}
          </>
        )}

        {/* {(formData.type === "running"
          ? formData.ctaType === "button"
          : formData.ctaType === "button" ||
            formData.ctaType === "clickable_bar") && (
         
        )} */}

        {formData.type !== "running" && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Icon
            </Typography>
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
                  width: 100,
                  height: 100,
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
                {formData.icon ? (
                  formData.icon.startsWith("<svg") ? (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: formData.iconColor,
                        "& svg": { width: 32, height: 32 },
                      }}
                      dangerouslySetInnerHTML={{ __html: formData.icon }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        backgroundColor: formData.iconColor,
                        maskImage: `url(${formData.icon})`,
                        maskSize: "contain",
                        maskRepeat: "no-repeat",
                        maskPosition: "center",
                        WebkitMaskImage: `url(${formData.icon})`,
                        WebkitMaskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                      }}
                    />
                  )
                ) : (
                  <Box sx={{ color: "#919191" }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
                      <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
                      <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
                      <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
                      <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
                      <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
                    </svg>
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
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Icon color
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <input
                      type="color"
                      name="iconColor"
                      value={formData.iconColor}
                      onChange={handleChange}
                      style={{
                        width: "32px",
                        height: "32px",
                        border: "1px solid #dfe3e8",
                        borderRadius: "4px",
                        cursor: "pointer",
                        padding: "0",
                      }}
                    />
                    <TextField
                      name="iconColor"
                      value={formData.iconColor}
                      onChange={handleChange}
                      size="small"
                      sx={{ width: "100px" }}
                    />
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Max size: 2MB. Supports PNG, SVG, JPEG.
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setIsIconModalOpen(true)}
                    sx={{ textTransform: "none" }}
                  >
                    Choose from library
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    component="label"
                    sx={{ textTransform: "none" }}
                  >
                    Upload Icon{" "}
                    <input
                      type="file"
                      hidden
                      accept=".png,.svg,.jpeg"
                      onChange={handleFileUpload}
                    />
                  </Button>
                  {formData.icon && (
                    <Button
                      variant="text"
                      color="error"
                      size="small"
                      sx={{ textTransform: "none" }}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, icon: "" }))
                      }
                    >
                      Delete
                    </Button>
                  )}
                </Stack>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Scheduling Section */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: "8px" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 2, fontSize: "18px" }}
        >
          Scheduling
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Start time
            </Typography>
            <TextField
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              size="small"
            />
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  name="hasEndDate"
                  checked={formData.hasEndDate}
                  onChange={handleChange}
                  size="small"
                />
              }
              label="Set end date"
            />
          </Box>
          {formData.hasEndDate && (
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                End Date
              </Typography>
              <TextField
                type="datetime-local"
                name="endDate"
                value={formData.endDate || ""}
                onChange={handleChange}
                size="small"
              />
            </Box>
          )}
        </Stack>
      </Paper>

      <IconPickerModal
        open={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
        onSelect={(svg) => setFormData((prev) => ({ ...prev, icon: svg }))}
        selectedIcon={formData.icon}
      />
    </Box>
  );
};

export default StepContent;
