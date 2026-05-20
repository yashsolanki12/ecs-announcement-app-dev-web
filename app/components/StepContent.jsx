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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import ConfirmDialog from "../ui/confirmation-dialog";

const StepContent = ({ formData, setFormData, setSnackbar }) => {
  const [isIconModalOpen, setIsIconModalOpen] = React.useState(false);
  const [expandedIndex, setExpandedIndex] = React.useState(null);
  const [iconModalForIndex, setIconModalForIndex] = React.useState(null);
  const [announcementDeleteDialogOpen, setAnnouncementDeleteDialogOpen] =
    React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState({
    id: null,
    title: "",
  });

  const handleAnnouncementChange = (index, name, value) => {
    setFormData((prev) => {
      const newAnnouncements = [...(prev.announcements || [])];
      newAnnouncements[index] = { ...newAnnouncements[index], [name]: value };
      // If it's the first one, also sync with base formData for backward compatibility/LivePreview
      if (index === 0) {
        return { ...prev, announcements: newAnnouncements, [name]: value };
      }
      return { ...prev, announcements: newAnnouncements };
    });
  };

  const handleAnnouncementTitleChange = (index, newValue) => {
    handleAnnouncementChange(index, "title", newValue);
  };

  const addNewAnnouncement = () => {
    const newAnnouncement = {
      title: "New Announcement",
      subheading: "Subheading",
      cta_type: "none",
      cta_link: "",
      cta_text: "Shop now!",
      icon: "",
      icon_color: "#e14749",
    };
    setFormData((prev) => ({
      ...prev,
      announcements: [...(prev.announcements || []), newAnnouncement],
    }));
    setExpandedIndex((formData.announcements || []).length);
  };
  const deleteAnnouncementItem = (index, title) => {
    let result = title.replace(/<\/?(mark|p|strong|u|em)>/g, "");
    setItemToDelete({ id: index, title: result });
    setAnnouncementDeleteDialogOpen(true);
  };

  const confirmDeleteAnnouncement = () => {
    const index = itemToDelete.id;
    if (index === null) return;

    setFormData((prev) => {
      const newAnnouncements = prev.announcements.filter((_, i) => i !== index);
      // If we deleted the first one and there are others, sync the new first one to base
      const updates = { announcements: newAnnouncements };
      if (index === 0 && newAnnouncements.length > 0) {
        updates.title = newAnnouncements[0].title;
        updates.subheading = newAnnouncements[0].subheading;
        updates.icon = newAnnouncements[0].icon;
        updates.icon_color = newAnnouncements[0].icon_color;
      }
      return { ...prev, ...updates };
    });
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else if (expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }

    setItemToDelete({ id: null, title: "" });
    setAnnouncementDeleteDialogOpen(false);
  };

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
      // reader.onload = (e) => {
      //   const base64Image = e.target.value;
      //   setFormData((prev) => ({
      //     ...prev,
      //     icon: base64Image,
      //   }));
      //   e.target.value;
      // };
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, icon: reader.result }));
        e.target.value = "";
      };
      reader.readAsDataURL(file);
    }
  };

  React.useEffect(() => {
    if (formData.announcement_type === "simple") {
      setFormData((prev) => ({ ...prev, cta_type: "none" }));
    }
    if (formData.announcement_type === "multiple") {
      setFormData((prev) => {
        const announcements = [...(prev.announcements || [])];
        if (announcements.length > 0) {
          announcements[0] = {
            ...announcements[0],
            subheading: announcements[0].subheading || prev.subheading || "",
          };
        }
        return { ...prev, announcements };
      });
    }
  }, [formData.announcement_type]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Configuration Section */}
      <Paper variant="outlined" sx={{ p: 2, borderRadius: "8px" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 2, fontSize: "16px" }}
        >
          Announcement Config
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 500, fontSize: "14px" }}
          >
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
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 500, fontSize: "14px" }}
          >
            Announcement Type
          </Typography>
          <RadioGroup
            name="announcement_type"
            value={formData.announcement_type}
            onChange={handleChange}
          >
            <FormControlLabel
              value="simple"
              control={<Radio size="small" />}
              label="Simple announcement"
              componentsProps={{ typography: { sx: { fontSize: "14px" } } }}
            />
            <FormControlLabel
              value="running"
              control={<Radio size="small" />}
              label="Running announcement"
              componentsProps={{ typography: { sx: { fontSize: "14px" } } }}
            />
            <FormControlLabel
              value="multiple"
              control={<Radio size="small" />}
              label="Multiple announcement"
              componentsProps={{ typography: { sx: { fontSize: "14px" } } }}
            />
          </RadioGroup>
        </Box>

        {formData.announcement_type === "running" && (
          <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid #dfe3e8" }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Running Animation Settings
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Marquee Direction
              </Typography>
              <RadioGroup
                name="marquee_direction"
                value={formData.marquee_direction || "right"}
                onChange={handleChange}
                row
              >
                <FormControlLabel
                  value="left"
                  control={<Radio size="small" />}
                  label="Right to Left"
                />
                <FormControlLabel
                  value="right"
                  control={<Radio size="small" />}
                  label="Left to Right"
                />
              </RadioGroup>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Animation Speed (Seconds)
              </Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={formData.marquee_speed || 20}
                  onChange={(e, val) =>
                    setFormData((prev) => ({ ...prev, marquee_speed: val }))
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
      <Paper variant="outlined" sx={{ p: 2, borderRadius: "8px" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 2, fontSize: "16px" }}
        >
          Announcements List
        </Typography>

        {formData.announcement_type === "multiple" ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {(formData.announcements || []).map((announcement, index) => (
              <Box
                key={index}
                sx={{
                  border: "1px solid #dfe3e8",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                {/* Preview Header */}
                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: expandedIndex === index ? "#f6f6f7" : "white",
                  }}
                >
                  <Box
                    sx={{
                      fontSize: "14px",
                      color: "#202223",
                      "& p": { m: 0 },
                      flexGrow: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: announcement.title || "No Title",
                    }}
                  />
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() =>
                          setExpandedIndex(
                            expandedIndex === index ? null : index,
                          )
                        }
                        sx={{
                          border: "1px solid #dfe3e8",
                          borderRadius: "4px",
                          p: 0.5,
                        }}
                      >
                        <EditIcon sx={{ fontSize: "18px" }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() =>
                          deleteAnnouncementItem(index, announcement.title)
                        }
                        sx={{
                          border: "1px solid #dfe3e8",
                          borderRadius: "4px",
                          p: 0.5,
                          color: "error.main",
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: "18px" }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>

                <Collapse in={expandedIndex === index}>
                  <Divider />
                  <Box sx={{ p: 3 }}>
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, fontWeight: 500, fontSize: "14px" }}
                      >
                        Title
                      </Typography>
                      <RichTextEditor
                        value={announcement.title}
                        onChange={(val) =>
                          handleAnnouncementTitleChange(index, val)
                        }
                        maxLength={30}
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, fontWeight: 500, fontSize: "14px" }}
                      >
                        Subheading
                      </Typography>
                      <TextField
                        name="subheading"
                        fullWidth
                        value={announcement.subheading || ""}
                        onChange={(e) =>
                          handleAnnouncementChange(
                            index,
                            "subheading",
                            e.target.value,
                          )
                        }
                        inputProps={{ maxLength: 30 }}
                        helperText={`${(announcement.subheading || "").length}/30`}
                        size="small"
                        placeholder="Subheading"
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, fontWeight: 500, fontSize: "14px" }}
                      >
                        Call to action
                      </Typography>
                      <Select
                        fullWidth
                        value={announcement.cta_type || "none"}
                        onChange={(e) =>
                          handleAnnouncementChange(
                            index,
                            "cta_type",
                            e.target.value,
                          )
                        }
                        size="small"
                      >
                        <MenuItem value="none">No call to action</MenuItem>
                        <MenuItem value="button">Button</MenuItem>
                        <MenuItem value="clickable_bar">
                          Make entire bar clickable
                        </MenuItem>
                      </Select>
                    </Box>

                    {(announcement.cta_type === "button" ||
                      announcement.cta_type === "clickable_bar") && (
                      <>
                        {announcement.cta_type === "button" && (
                          <Box sx={{ mb: 3 }}>
                            <Typography
                              variant="body2"
                              sx={{ mb: 1, fontWeight: 500 }}
                            >
                              Button text
                            </Typography>
                            <TextField
                              fullWidth
                              value={announcement.cta_text || ""}
                              onChange={(e) =>
                                handleAnnouncementChange(
                                  index,
                                  "cta_text",
                                  e.target.value,
                                )
                              }
                              placeholder={announcement.cta_text}
                              size="small"
                              name="cta_text"
                              inputProps={{ maxLength: 20 }}
                              helperText={`${(announcement.cta_text || "").length}/20`}
                            />
                          </Box>
                        )}

                        <Box sx={{ mb: 3 }}>
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, fontWeight: 500 }}
                          >
                            Link
                          </Typography>
                          <TextField
                            fullWidth
                            value={announcement.cta_link || ""}
                            onChange={(e) =>
                              handleAnnouncementChange(
                                index,
                                "cta_link",
                                e.target.value,
                              )
                            }
                            placeholder="https://example.com"
                            size="small"
                          />
                        </Box>
                      </>
                    )}

                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, fontWeight: 500 }}
                      >
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
                          {announcement.icon ? (
                            announcement.icon.startsWith("<svg") ? (
                              <Box
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: announcement.icon_color,
                                  "& svg": { width: 32, height: 32 },
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: announcement.icon,
                                }}
                              />
                            ) : (
                              <Box
                                component="img"
                                src={announcement.icon}
                                alt="Icon"
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
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
                                <line
                                  x1="14.31"
                                  y1="8"
                                  x2="20.05"
                                  y2="17.94"
                                ></line>
                                <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
                                <line
                                  x1="7.38"
                                  y1="12"
                                  x2="13.12"
                                  y2="2.06"
                                ></line>
                                <line
                                  x1="9.69"
                                  y1="16"
                                  x2="3.95"
                                  y2="6.06"
                                ></line>
                                <line
                                  x1="14.31"
                                  y1="16"
                                  x2="2.83"
                                  y2="16"
                                ></line>
                                <line
                                  x1="16.62"
                                  y1="12"
                                  x2="10.88"
                                  y2="21.94"
                                ></line>
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
                            <Typography
                              variant="body2"
                              sx={{ mb: 1, fontWeight: 500 }}
                            >
                              Icon color
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                              }}
                            >
                              <TextField
                                value={announcement.icon_color}
                                onChange={(e) =>
                                  handleAnnouncementChange(
                                    index,
                                    "icon_color",
                                    e.target.value,
                                  )
                                }
                                size="small"
                                sx={{ width: "100px" }}
                              />
                              <input
                                type="color"
                                value={announcement.icon_color}
                                onChange={(e) =>
                                  handleAnnouncementChange(
                                    index,
                                    "icon_color",
                                    e.target.value,
                                  )
                                }
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  border: "1px solid #dfe3e8",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  padding: "0",
                                }}
                              />
                            </Box>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Max size: 1MB. Supports PNG, SVG, JPEG.
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                setIconModalForIndex(index);
                                setIsIconModalOpen(true);
                              }}
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
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      handleAnnouncementChange(
                                        index,
                                        "icon",
                                        reader.result,
                                      );
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </Button>
                            {announcement.icon && (
                              <Tooltip
                                placement="top"
                                title="Remove Icon"
                                arrow
                              >
                                <Button
                                  variant="text"
                                  color="error"
                                  size="small"
                                  sx={{ textTransform: "none" }}
                                  onClick={() =>
                                    handleAnnouncementChange(index, "icon", "")
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
                  </Box>
                </Collapse>
              </Box>
            ))}

            <Button
              variant="outlined"
              fullWidth
              startIcon={<AddIcon />}
              onClick={addNewAnnouncement}
              sx={{
                py: 1,
                borderStyle: "dashed",
                textTransform: "none",
                color: "#202223",
                borderColor: "#dfe3e8",
                "&:hover": {
                  borderColor: "#202223",
                  bgcolor: "transparent",
                },
              }}
            >
              Add new announcement
            </Button>
          </Box>
        ) : (
          <>
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

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Subheading
              </Typography>
              <TextField
                fullWidth
                name="subheading"
                value={formData.subheading || ""}
                onChange={handleChange}
                inputProps={{ maxLength: 30 }}
                helperText={`${(formData.subheading || "").length}/30`}
                size="small"
              />
            </Box>

            {formData.announcement_type === "running" && (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Call to action
                  </Typography>
                  <Select
                    fullWidth
                    name="cta_type"
                    value={formData.cta_type || "none"}
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
                {(formData.cta_type === "button" ||
                  formData.cta_type === "clickable_bar") && (
                  <>
                    {formData.cta_type === "button" && (
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="body2"
                          sx={{ mb: 1, fontWeight: 500 }}
                        >
                          Button Text
                        </Typography>
                        <TextField
                          fullWidth
                          value={formData.cta_text || ""}
                          onChange={handleChange}
                          placeholder={formData.cta_text}
                          size="small"
                          name="cta_text"
                          inputProps={{ maxLength: 20 }}
                          helperText={`${(formData.cta_text || "").length}/20`}
                        />
                      </Box>
                    )}

                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, fontWeight: 500 }}
                      >
                        Link
                      </Typography>
                      <TextField
                        fullWidth
                        name="cta_link"
                        value={formData.cta_link || ""}
                        onChange={handleChange}
                        placeholder="https://example.com"
                        size="small"
                      />
                    </Box>
                  </>
                )}
              </>
            )}

            {formData.announcement_type !== "running" && (
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
                      bgcolor: "#ffffff",
                      flexShrink: 0,
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
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
                            color: formData.icon_color,
                            "& svg": { width: 32, height: 32 },
                          }}
                          dangerouslySetInnerHTML={{ __html: formData.icon }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            backgroundColor: formData.icon_color,
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
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: formData.icon_color || "#919191",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
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
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, fontWeight: 500 }}
                      >
                        Icon color
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <TextField
                          name="icon_color"
                          value={formData.icon_color}
                          onChange={handleChange}
                          size="small"
                          sx={{ width: "100px" }}
                        />
                        <input
                          type="color"
                          name="icon_color"
                          value={formData.icon_color}
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
                      </Box>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Max size: 1MB. Supports PNG, SVG, JPEG.
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setIconModalForIndex(null);
                          setIsIconModalOpen(true);
                        }}
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
                        <Tooltip placement="top" title="Remove Icon" arrow>
                          <Button
                            variant="text"
                            color="error"
                            size="small"
                            sx={{ textTransform: "none" }}
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, icon: "" }))
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
          </>
        )}
      </Paper>

      {/* Scheduling Section */}
      <Paper variant="outlined" sx={{ p: 2, borderRadius: "8px" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 2, fontSize: "16px" }}
        >
          Scheduling
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Start date time
            </Typography>
            <TextField
              type="datetime-local"
              name="start_datetime"
              value={formData.start_datetime}
              onChange={handleChange}
              size="small"
              sx={{
                '& input[type="datetime-local"]': {
                  cursor: "pointer",
                },
                '& input[type="datetime-local"]::-webkit-calendar-picker-indicator':
                  {
                    cursor: "pointer",
                  },
              }}
            />
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  name="has_end_date"
                  checked={formData.has_end_date}
                  onChange={handleChange}
                  size="small"
                />
              }
              label="Set end date time"
              componentsProps={{ typography: { sx: { fontSize: "14px" } } }}
            />
          </Box>
          {formData.has_end_date && (
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                End date time
              </Typography>
              <TextField
                type="datetime-local"
                name="end_datetime"
                value={formData.end_datetime || ""}
                onChange={handleChange}
                size="small"
                sx={{
                  '& input[type="datetime-local"]': {
                    cursor: "pointer",
                  },
                  '& input[type="datetime-local"]::-webkit-calendar-picker-indicator':
                    {
                      cursor: "pointer",
                    },
                }}
              />
            </Box>
          )}
        </Stack>
      </Paper>

      <IconPickerModal
        open={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
        onSelect={(svg) => {
          if (iconModalForIndex !== null) {
            handleAnnouncementChange(iconModalForIndex, "icon", svg);
          } else {
            setFormData((prev) => ({ ...prev, icon: svg }));
          }
        }}
        selectedIcon={
          iconModalForIndex !== null
            ? formData.announcements[iconModalForIndex].icon
            : formData.icon
        }
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={announcementDeleteDialogOpen}
        title={`Delete ${itemToDelete.title}`}
        message="Are you sure you want to delete this announcement?"
        onClose={() => {
          setAnnouncementDeleteDialogOpen(false);
          setItemToDelete({ id: null, title: "" });
        }}
        onConfirm={confirmDeleteAnnouncement}
      />
    </Box>
  );
};

export default StepContent;
