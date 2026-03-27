import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import SafeLink from "../../helper/safe-link";
import ConfirmDialog from "../../ui/confirmation-dialog";
import Checkbox from "@mui/material/Checkbox";

// Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

/**
 * DataTable - A customizable table component
 *
 * @param {Object} props
 * @param {Array} props.data - Array of data items to display
 * @param {Array} props.columns - Array of column configurations
 * @param {Array} props.actions - Array of action button configurations
 * @param {Object} props.mutations - Object containing mutations (deleteMutation, toggleMutation, etc.)
 * @param {Function} props.onDelete - Callback when delete is triggered
 * @param {Function} props.onEdit - Callback when edit is triggered
 * @param {Function} props.onAction - Callback for custom action
 * @param {Boolean} props.showStatus - Whether to show status column
 * @param {String} props.emptyMessage - Message to show when no data
 * @param {Function} props.getId - Function to get unique ID from row
 * @param {Object} props.snackbarState - External snackbar state (optional)
 * @param {Function} props.setSnackbar - Function to set snackbar state (optional)
 */
const DataTable = ({
  data = [],
  columns = [],
  actions = [],
  mutations = {},
  onDelete,
  onEdit,
  onAction,
  showStatus = true,
  emptyMessage = "No data found",
  getId = (row) => row._id || row.id,
  snackbarState,
  setSnackbar,
  showCheckbox = false,
  selectedIds = [],
  onSelectAll,
  onSelectOne,
}) => {
  // Internal snackbar state (used if external state not provided)
  const [internalSnackbar, setInternalSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Use external snackbar if provided, otherwise use internal
  const currentSnackbar = snackbarState || internalSnackbar;
  const setCurrentSnackbar = setSnackbar || setInternalSnackbar;

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);

  // Toggle state
  const [togglingId, setTogglingId] = React.useState(null);

  // Check if delete is in progress
  const isDeleting = mutations?.deleteMutation?.isPending;

  // Default actions if none provided
  const defaultActions = [
    {
      name: "edit",
      icon: "edit",
      tooltip: "Edit",
      color: "primary",
      onClick: (row) => onEdit?.(row),
    },
    {
      name: "delete",
      icon: "delete",
      tooltip: "Delete",
      color: "error",
      onClick: (row) => {
        setSelectedId(getId(row));
        setDeleteDialogOpen(true);
      },
    },
  ];

  const actionButtons = actions.length > 0 ? actions : defaultActions;

  const handleConfirmDelete = () => {
    if (selectedId) {
      const deleteMutation = mutations?.deleteMutation;
      if (deleteMutation) {
        deleteMutation.mutate(selectedId, {
          onSuccess: (response) => {
            setCurrentSnackbar({
              open: true,
              message: response?.message || "Deleted successfully",
              severity: "success",
            });
          },
          onError: (error) => {
            setCurrentSnackbar({
              open: true,
              message: error?.message || "Failed to delete",
              severity: "error",
            });
          },
          onSettled: () => {
            setDeleteDialogOpen(false);
            setSelectedId(null);
          },
        });
      } else if (onDelete) {
        onDelete(selectedId);
        setDeleteDialogOpen(false);
        setSelectedId(null);
      }
    }
  };

  const handleToggleEnabled = (row) => {
    const toggleMutation = mutations?.toggleMutation;
    const id = getId(row);

    if (toggleMutation) {
      setTogglingId(id);
      toggleMutation.mutate(id, {
        onSettled: () => {
          setTogglingId(null);
        },
      });
    }
  };

  const handleActionClick = (action, row) => {
    const id = getId(row);

    // Handle action type (for delete etc)
    if (action.type === "action") {
      // If action has onClick, call it
      if (action.onClick) {
        action.onClick(id);
      }
      // Handle duplicate action
      else if (action.name === "duplicate" && mutations?.duplicateMutation) {
        mutations.duplicateMutation.mutate(id, {
          onSuccess: (response) => {
            setCurrentSnackbar({
              open: true,
              message: response?.message || "Duplicated successfully",
              severity: "success",
            });
          },
          onError: (error) => {
            setCurrentSnackbar({
              open: true,
              message: error?.message || "Failed to duplicate",
              severity: "error",
            });
          },
        });
      }
      // Otherwise check if deleteMutation is available
      else if (action.name === "delete" && mutations?.deleteMutation) {
        setSelectedId(id);
        setDeleteDialogOpen(true);
      }
    }
    // Call custom onAction callback
    if (onAction) {
      onAction(action.name, row);
    }
  };

  const handleCloseSnackbar = () => {
    setCurrentSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Get icon component by name
  const getIcon = (iconName) => {
    const icons = {
      edit: <EditIcon fontSize="medium" />,
      delete: <DeleteIcon fontSize="medium" />,
      view: <VisibilityIcon fontSize="medium" />,
      visibility: <VisibilityIcon fontSize="medium" />,
      visibilityOff: <VisibilityOffIcon fontSize="medium" />,
      content_copy: <ContentCopyIcon fontSize="medium" />,
      custom: null,
    };
    return icons[iconName] || icons.custom;
  };

  // Helper to get cell value with render function applied
  const getCellValue = (column, row) => {
    if (column.render) {
      return column.render(row[column.key], row);
    }
    return row[column.key];
  };

  // Render cell content based on column configuration
  const renderCellContent = (column, row) => {
    if (column.render) {
      return column.render(row[column.key], row);
    }

    if (column.type === "component") {
      return column.component(row);
    }

    if (column.type === "status") {
      const isEnabled = row.enabled !== false;
      return (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            backgroundColor: isEnabled ? "#dcfce7" : "#fee2e2",
            color: isEnabled ? "#166534" : "#991b1b",
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          {isEnabled ? "Enabled" : "Disabled"}
        </Box>
      );
    }

    if (column.type === "actions") {
      return null; // Actions are rendered separately
    }

    return row[column.key];
  };

  return (
    <>
      <TableContainer
        component={Box}
        sx={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: 1,
          maxHeight: 450,
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: "8px",
          },
        }}
      >
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="data table">
          <TableHead>
            <TableRow>
              {showCheckbox && (
                <TableCell
                  sx={{
                    color: "#6b7280",
                    fontWeight: 600,
                    fontSize: 13,
                    backgroundColor: "#f7f7f7",
                  }}
                >
                  <Checkbox
                    indeterminate={
                      selectedIds.length > 0 && selectedIds.length < data.length
                    }
                    checked={
                      data.length > 0 && selectedIds.length === data.length
                    }
                    onChange={onSelectAll}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.align || "left"}
                  sx={{
                    color: "#6b7280",
                    fontWeight: 600,
                    fontSize: 13,
                    backgroundColor: "#f7f7f7",
                    ...column.sx,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
              {actionButtons.length > 0 && (
                <TableCell
                  align="right"
                  sx={{
                    color: "#6b7280",
                    fontWeight: 600,
                    fontSize: 13,

                    backgroundColor: "#f7f7f7",
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((row) => {
                const rowId = getId(row);
                const isSelected = selectedIds.includes(rowId);
                return (
                  <TableRow
                    key={rowId}
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: isSelected ? "#e3f2fd" : "#f4f4f4",
                      },
                      "&:hover": {
                        backgroundColor: isSelected ? "#bbdefb" : "#f7f7f7",
                      },
                      "&:last-child td, &:last-child th": { border: 0 },
                      opacity: row.enabled !== false ? 1 : 0.6,
                    }}
                  >
                    {showCheckbox && (
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => onSelectOne(rowId)}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell
                        key={`${rowId}-${column.key}`}
                        align={column.align || "left"}
                        style={{ paddingTop: "10px", paddingBottom: "10px" }}
                        sx={column.sx}
                      >
                        {column.type === "tooltip" ? (
                          <Tooltip
                            placement="top"
                            slotProps={{
                              tooltip: {
                                sx: {
                                  fontSize: column.tooltipFontSize || "12px",
                                  maxWidth: column.maxWidth || "300px",
                                },
                              },
                              popper: {
                                modifiers: [
                                  {
                                    name: "offset",
                                    options: {
                                      offset: [0, 10],
                                    },
                                  },
                                ],
                              },
                            }}
                            title={getCellValue(column, row)}
                            arrow
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: column.fontSize || "14px",
                                maxWidth: column.maxWidth || 200,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                marginRight: "auto",
                                display: "block",
                                width: "fit-content",
                                ...column.typographySx,
                              }}
                            >
                              <span>{getCellValue(column, row)}</span>
                            </Typography>
                          </Tooltip>
                        ) : (
                          <span>{renderCellContent(column, row)}</span>
                        )}
                      </TableCell>
                    ))}
                    {actionButtons.length > 0 && (
                      <TableCell
                        align="right"
                        sx={{ paddingTop: "2px", paddingBottom: "2px" }}
                      >
                        {/* Toggle/Visibility Button */}
                        {showStatus && mutations?.toggleMutation && (
                          <Tooltip
                            title={
                              row.enabled
                                ? "Disable (Hide from store)"
                                : "Enable (Show in store)"
                            }
                            placement="top"
                            slotProps={{
                              popper: {
                                modifiers: [
                                  {
                                    name: "offset",
                                    options: {
                                      offset: [0, -18],
                                    },
                                  },
                                ],
                              },
                            }}
                          >
                            <IconButton
                              onClick={() => handleToggleEnabled(row)}
                              color={
                                row.enabled !== false ? "success" : "default"
                              }
                              disabled={togglingId === rowId}
                            >
                              {row.enabled !== false ? (
                                <VisibilityIcon fontSize="medium" />
                              ) : (
                                <VisibilityOffIcon fontSize="medium" />
                              )}
                            </IconButton>
                          </Tooltip>
                        )}

                        {/* Custom Action Buttons */}
                        {actionButtons.map((action) => (
                          <Tooltip
                            key={action.name}
                            title={action.tooltip || action.name}
                            placement="top"
                            slotProps={{
                              popper: {
                                modifiers: [
                                  {
                                    name: "offset",
                                    options: {
                                      offset: [0, -18],
                                    },
                                  },
                                ],
                              },
                            }}
                          >
                            {action.type === "link" ? (
                              <IconButton
                                component={SafeLink}
                                to={action.to ? action.to(row) : "#"}
                                color={action.color || "default"}
                                disabled={action.disabled?.(row)}
                                sx={action.sx}
                              >
                                {getIcon(action.icon)}
                              </IconButton>
                            ) : (
                              <IconButton
                                onClick={() => handleActionClick(action, row)}
                                color={action.color || "default"}
                                disabled={action.disabled?.(row)}
                                sx={action.sx}
                              >
                                {getIcon(action.icon)}
                              </IconButton>
                            )}
                          </Tooltip>
                        ))}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (actionButtons.length > 0 ? 1 : 0) +
                    (showCheckbox ? 1 : 0)
                  }
                  align="center"
                >
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirm Delete?"
        message="This action cannot be undone. This will permanently delete the entry."
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />

      {/* Snackbar for messages */}
      <Snackbar
        open={currentSnackbar.open}
        autoHideDuration={currentSnackbar.severity === "error" ? 3000 : 2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={currentSnackbar.severity}
          variant="standard"
          sx={{ width: "100%" }}
        >
          {currentSnackbar.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default DataTable;
