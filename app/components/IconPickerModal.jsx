import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";

import { builtinIcons } from "../utils/helper";

const IconPickerModal = ({ open, onClose, onSelect, selectedIcon }) => {
  // const [searchTerm, setSearchTerm] = React.useState("");
  const [tempSelectedIcon, setTempSelectedIcon] = React.useState(selectedIcon);

  // Sync temp state when modal opens
  React.useEffect(() => {
    if (open) {
      setTempSelectedIcon(selectedIcon);
    }
  }, [open, selectedIcon]);

  const handleConfirmSelect = () => {
    onSelect(tempSelectedIcon);
    onClose();
  };

  const categories = Object.keys(builtinIcons);

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        // Only allow closing via Cancel button or X button, not outside click or escape
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
        onClose();
      }}
      disableEscapeKeyDown
      disableBackdropClick
      aria-labelledby="confirm-dialog-title"
      maxWidth="sm"
      fullWidth
      scroll="paper"
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "18px",
        }}
      >
        Change Icon
        <IconButton onClick={onClose} size="small">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 2 }}>
        {categories.map((category) => {
          const categoryIcons = builtinIcons[category];
          const filteredIcons = Object.entries(categoryIcons).filter(
            ([name]) => name.toLowerCase(),
            //.includes(searchTerm.toLowerCase())
          );

          if (filteredIcons.length === 0) return null;

          return (
            <Box key={category} sx={{ mb: 4 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  color: "text.primary",
                  textTransform: "capitalize",
                  fontSize: "13px",
                }}
              >
                {category.replace("_", " ")}
              </Typography>
              <Grid container spacing={1}>
                {filteredIcons.map(([name, svg]) => (
                  <Grid item key={name}>
                    <IconButton
                      onClick={() => setTempSelectedIcon(svg)}
                      sx={{
                        width: 44,
                        height: 44,
                        border: "1px solid",
                        borderColor:
                          tempSelectedIcon === svg ? "primary.main" : "#dfe3e8",
                        borderRadius: "8px",
                        bgcolor:
                          tempSelectedIcon === svg
                            ? "rgba(0, 128, 96, 0.05)"
                            : "transparent",
                        color:
                          tempSelectedIcon === svg ? "primary.main" : "#637381",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: "rgba(0, 128, 96, 0.05)",
                        },
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 24,
                          height: 24,
                          color: "#637381",
                          "& svg": {
                            width: "100%",
                            height: "100%",
                            fill: "none",
                            stroke: "currentColor",
                          },
                        }}
                        dangerouslySetInnerHTML={{ __html: svg }}
                      />
                    </IconButton>
                  </Grid>
                ))}
              </Grid>
            </Box>
          );
        })}

        {/* {searchTerm &&
          categories.every(
            (cat) =>
              Object.entries(builtinIcons[cat]).filter(([n]) =>
                n.toLowerCase().includes(searchTerm.toLowerCase()),
              ).length === 0,
          ) && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">
                No icons found for "{searchTerm}"
              </Typography>
            </Box>
          )} */}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderColor: "#dfe3e8",
            color: "#202223",
          }}
        >
          Close
        </Button>
        <Button
          onClick={handleConfirmSelect}
          variant="contained"
          disabled={!tempSelectedIcon}
          sx={{ textTransform: "none" }}
        >
          Select
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IconPickerModal;
