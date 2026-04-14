import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";

const StepPlacement = ({ formData, setFormData }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: "8px" }}>
        {/* <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 2, fontSize: "16px" }}
        >
          Placement Settings
        </Typography> */}
        <Typography
          variant="body2"
          sx={{ mb: 2, color: "black", fontSize: "14px", fontWeight: 650 }}
        >
          Select pages to display the bar
        </Typography>

        <Box sx={{ mt: 2 }}>
          {/* <Typography
            sx={{
              color: "#6b7280",
              mb: 0.5,
              display: "block",
              fontSize: "12px",
            }}
          >
            Display On Pages (Optional)
          </Typography> */}
          <FormControl
            size="small"
            sx={{ mt: 1, width: "100%", maxWidth: 500 }}
          >
            <InputLabel id="page-display-label">Display on</InputLabel>
            <Select
              labelId="page-display-label"
              id="page-display"
              multiple
              value={formData.page_display}
              label="Display On"
              onChange={(e) => {
                const value = e.target.value;
                const newValue =
                  typeof value === "string" ? value.split(",") : value;

                const wasAllSelected = formData.page_display.includes("all");
                const isAllSelected = newValue.includes("all");

                if (isAllSelected && !wasAllSelected) {
                  setFormData({
                    ...formData,
                    page_display: [
                      "all",
                      "home",
                      "products",
                      "catalog",
                      "contact",
                    ],
                  });
                } else if (wasAllSelected && !isAllSelected) {
                  setFormData({ ...formData, page_display: [] });
                } else {
                  // If all items are selected without "all", or "all" was removed
                  const pagesOnly = ["home", "products", "catalog", "contact"];
                  const allPagesSelected = pagesOnly.every((p) =>
                    newValue.includes(p),
                  );

                  if (allPagesSelected && !newValue.includes("all")) {
                    setFormData({
                      ...formData,
                      page_display: ["all", ...newValue],
                    });
                  } else if (!allPagesSelected && newValue.includes("all")) {
                    setFormData({
                      ...formData,
                      page_display: newValue.filter((p) => p !== "all"),
                    });
                  } else {
                    setFormData({ ...formData, page_display: newValue });
                  }
                }
              }}
              input={<OutlinedInput label="Display On" />}
              renderValue={(selected) => {
                if (!selected || selected.length === 0) {
                  return "Select pages";
                }
                const allPages = [
                  "all",
                  "home",
                  "products",
                  "catalog",
                  "contact",
                ];
                const allSelected = allPages.every((p) => selected.includes(p));
                if (allSelected || selected.includes("all")) {
                  return "All Pages";
                }
                const displayPages = selected
                  .filter((i) => i !== "all")
                  .map((i) => i.charAt(0).toUpperCase() + i.slice(1))
                  .join(", ");
                return displayPages || "Select pages";
              }}
            >
              <MenuItem value="all">
                <Checkbox checked={formData.page_display.includes("all")} />
                <ListItemText
                  primary="All pages"
                  primaryTypographyProps={{ sx: { fontSize: "14px" } }}
                />
              </MenuItem>
              <MenuItem value="home">
                <Checkbox checked={formData.page_display.includes("home")} />
                <ListItemText
                  primary="Home Page"
                  primaryTypographyProps={{ sx: { fontSize: "14px" } }}
                />
              </MenuItem>
              <MenuItem value="products">
                <Checkbox
                  checked={formData.page_display.includes("products")}
                />
                <ListItemText
                  primary="Product Page"
                  primaryTypographyProps={{ sx: { fontSize: "14px" } }}
                />
              </MenuItem>
              <MenuItem value="catalog">
                <Checkbox checked={formData.page_display.includes("catalog")} />
                <ListItemText
                  primary="Collection Page"
                  primaryTypographyProps={{ sx: { fontSize: "14px" } }}
                />
              </MenuItem>
              <MenuItem value="contact">
                <Checkbox checked={formData.page_display.includes("contact")} />
                <ListItemText
                  primary="Contact Page"
                  primaryTypographyProps={{ sx: { fontSize: "14px" } }}
                />
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>
    </Box>
  );
};

export default StepPlacement;
