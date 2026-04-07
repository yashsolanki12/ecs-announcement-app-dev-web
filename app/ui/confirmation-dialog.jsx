import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

const ConfirmationDialog = (props) => {
  const {
    open,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    onClose,
    onConfirm,
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading = false,
  } = props;
  return (
    <Dialog
      open={open}
      onClose={(reason) => {
        // Only allow closing via Cancel button, not outside click or escape
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
      }}
      aria-labelledby="confirm-dialog-title"
    >
      <DialogTitle id="confirm-dialog-title">
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>{title}</span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="inherit">{message}</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pb: 2, px: 3 }}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{
            backgroundColor: "#e0e0e0",
            borderRadius: "6px",
            textTransform: "none",
          }}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          autoFocus
          disabled={loading}
          sx={{ borderRadius: "6px", textTransform: "none" }}
        >
          {loading ? (
            <CircularProgress size={24} color="success" />
          ) : (
            confirmText
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
