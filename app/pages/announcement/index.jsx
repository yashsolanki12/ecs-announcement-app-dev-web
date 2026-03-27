import React from "react";
import {
  deleteAnnouncement,
  duplicateAnnouncement,
  getAllAnnouncement,
  toggleAnnouncementEnabled,
} from "../../api/announcement";
import { getCurrentShopSession } from "../../api/current-shop-session";
import useAnnouncementData from "../../hooks/useAnnouncementData";
import useAnnouncementSubmit from "../../hooks/useAnnouncementSubmit";
import Loader from "../../ui/loader";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Warning from "@mui/icons-material/Warning";
import Button from "@mui/material/Button";
import DataTable from "../../components/table/data-table";
import { announcementColumns, announcementActions } from "../../utils/column";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SafeLink from "../../helper/safe-link";
import Stack from "@mui/material/Stack";
import {
  bulkDeleteAnnouncement,
  bulkToggleAnnouncement,
} from "../../api/bulk-operation";
import ConfirmDialog from "../../ui/confirmation-dialog";

const AnnouncementListPage = ({ appEmbedEnabled, session }) => {
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Selected items state
  const [selectedIds, setSelectedIds] = React.useState([]);

  // Filter state
  const [filter, setFilter] = React.useState("all");

  // Bulk delete confirmation dialog state
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = React.useState(false);

  // Handle filter change
  const handleFilterChange = (event, newValue) => {
    setFilter(newValue);
    setSelectedIds([]); // Clear selection when filter changes
  };

  // List API
  const { data: announcementListData, isLoading: announcementListLoading } =
    useAnnouncementData(["announcement"], getAllAnnouncement, null);

  // Current shop API
  const {
    data: announcementSessionData,
    isLoading: announcementSessionLoading,
  } = useAnnouncementData(
    ["announcement-session"],
    getCurrentShopSession,
    null,
  );

  // Toggle enable mutation
  const toggleMutation = useAnnouncementSubmit(
    (id) => toggleAnnouncementEnabled(id),
    setSnackbar,
    { invalidateKeys: [["announcement"]] },
  );

  // Duplicate announcement mutation
  const duplicateMutation = useAnnouncementSubmit(
    (id) => duplicateAnnouncement(id),
    setSnackbar,
    { invalidateKeys: [["announcement"]] },
  );

  // Delete mutation
  const deleteMutation = useAnnouncementSubmit(
    (id) => deleteAnnouncement(id),
    setSnackbar,
    { invalidateKeys: [["announcement"]] },
  );

  // Bulk toggle announcement mutation
  const bulkToggleMutation = useAnnouncementSubmit(
    ({ ids, enabled }) => bulkToggleAnnouncement(ids, enabled),
    setSnackbar,
    { invalidateKeys: [["announcement"]] },
  );

  // Bulk delete announcement mutation
  const bulkDeleteMutation = useAnnouncementSubmit(
    (ids) => bulkDeleteAnnouncement(ids),
    setSnackbar,
    { invalidateKeys: [["announcement"]] },
  );

  const navigateAppEmbed = () => {
    const currentShop =
      session?.shop ||
      announcementSessionData?.session?.shop ||
      new URLSearchParams(window.location.search).get("shop") ||
      window.location.hostname;
    const url = `https://${currentShop}/admin/themes/current/editor?context=apps`;
    window.open(url, "_blank");
  };

  // Get filtered data based on filter state
  const getFilteredData = () => {
    if (!announcementListData?.data) return [];

    if (filter === "active") {
      return announcementListData.data.filter((item) => item.enabled === true);
    } else if (filter === "inactive") {
      return announcementListData.data.filter((item) => item.enabled === false);
    }
    return announcementListData.data;
  };

  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(getFilteredData().map((item) => item._id));
    } else {
      setSelectedIds([]);
    }
  };

  // Handle individual checkbox
  const handleSelectOne = (id) => {
    const currentIndex = selectedIds.indexOf(id);
    const newSelected = [...selectedIds];

    if (currentIndex === -1) {
      newSelected.push(id);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedIds(newSelected);
  };

  // Handle bulk enable
  const handleBulkEnable = () => {
    if (selectedIds.length > 0) {
      bulkToggleMutation.mutate(
        { ids: selectedIds, enabled: true },
        {
          onSuccess: () => {
            setSelectedIds([]);
          },
        },
      );
    }
  };

  // Handle bulk disable
  const handleBulkDisable = () => {
    if (selectedIds.length > 0) {
      bulkToggleMutation.mutate(
        { ids: selectedIds, enabled: false },
        {
          onSuccess: () => {
            setSelectedIds([]);
          },
        },
      );
    }
  };

  const handleBulkDeleteClick = () => {
    setBulkDeleteDialogOpen(true);
  };

  // Confirm bulk delete
  const handleConfirmBulkDelete = () => {
    if (selectedIds.length > 0) {
      bulkDeleteMutation.mutate(selectedIds, {
        onSuccess: () => {
          setSelectedIds([]);
          setBulkDeleteDialogOpen(false);
        },
        onError: () => {
          setBulkDeleteDialogOpen(false);
        },
      });
    }
  };

  if (announcementListLoading) {
    return <Loader />;
  }
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {!appEmbedEnabled && (
        <Card sx={{ borderRadius: "10px", boxShadow: 2 }}>
          <CardContent sx={{ p: { xs: 2, sm: 2 } }}>
            {/* Header/Warning Bar */}
            <Box
              sx={{
                backgroundColor: "#ffb800",
                borderRadius: "5px",
                p: { xs: 1.5, sm: 2 },
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 2,
              }}
            >
              <Warning sx={{ fontSize: { xs: 20, sm: 24 }, flexShrink: 0 }} />
              <Typography
                variant="h6"
                component="span"
                sx={{
                  color: "#232220",
                  fontSize: { xs: "0.95rem", sm: "1.1rem" },
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                Announcement is not activated yet.
              </Typography>
            </Box>

            {/* Instruction Text */}
            <Typography
              variant="body2"
              sx={{
                color: "#6d7175",
                fontSize: { xs: "0.85rem", sm: "1rem" },
                mb: 2,
              }}
            >
              Please activate the app by clicking{" "}
              <Box component="span" sx={{ fontWeight: 700, color: "black" }}>
                'Activate'
              </Box>{" "}
              button.
            </Typography>

            {/* Action Button */}
            <Button
              variant="contained"
              fullWidth={{ xs: true, sm: false }} // Auto-stretches on mobile
              sx={{
                backgroundColor: "#202223",
                color: "white",
                textTransform: "none",
                borderRadius: "6px",
                fontWeight: 600,
                px: 3,
                py: { xs: 1.5, sm: 1 },
                "&:hover": {
                  backgroundColor: "#303030",
                },
              }}
              onClick={navigateAppEmbed}
            >
              Activate
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Announcement List */}
      <Box sx={{ p: 1, marginTop: !appEmbedEnabled ? "20px" : 0 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#202223",
              fontSize: 20,
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            Announcement List
          </Typography>

          <Button
            variant="contained"
            component={SafeLink}
            to="/app/ecs-announcement/create"
            sx={{
              backgroundColor: "#202223",
              color: "white",
              textTransform: "none",
              borderRadius: "6px",
              fontWeight: 600,
              padding: "7px 18px",
              textDecoration: "none",
              "&:hover": {
                backgroundColor: "#303030",
              },
            }}
          >
            Create Announcement
          </Button>
        </Stack>
      </Box>

      {/* Filter Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={filter}
          onChange={handleFilterChange}
          aria-label="Announcement filter tabs"
        >
          <Tab
            label={`All (${announcementListData?.data?.length || 0})`}
            value="all"
          />
          <Tab
            label={`Active (${announcementListData?.data?.filter((item) => item.enabled === true).length || 0})`}
            value="active"
          />
          <Tab
            label={`Inactive (${announcementListData?.data?.filter((item) => item.enabled === false).length || 0})`}
            value="inactive"
          />
        </Tabs>
      </Box>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            gap: 1,
            mb: 2,
            p: 1.5,
            bgcolor: "#f5f5f5",
            borderRadius: 1,
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="body2"
            sx={{ textAlign: { xs: "center", sm: "left" } }}
          >
            {selectedIds.length} item(s) selected
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: { xs: "center", sm: "flex-end" },
            }}
          >
            <Button
              size="small"
              variant="outlined"
              onClick={() => setSelectedIds([])}
              sx={{ textTransform: "none" }}
            >
              Clear Selection
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleBulkEnable}
              sx={{ textTransform: "none" }}
            >
              Enable Selected
            </Button>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={handleBulkDisable}
              sx={{ textTransform: "none" }}
            >
              Disable Selected
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={handleBulkDeleteClick}
              sx={{ textTransform: "none" }}
            >
              Delete Selected
            </Button>
          </Box>
        </Box>
      )}

      <DataTable
        data={getFilteredData()}
        columns={announcementColumns}
        actions={announcementActions}
        mutations={{
          toggleMutation,
          duplicateMutation,
          deleteMutation,
        }}
        showStatus={true}
        snackbarState={snackbar}
        setSnackbar={setSnackbar}
        emptyMessage={`No Announcement found${filter !== "all" ? ` with ${filter} status` : ""}.`}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        showCheckbox={true}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        open={bulkDeleteDialogOpen}
        title="Confirm Bulk Delete?"
        message={`This action cannot be undone. This will permanently delete ${selectedIds.length} selected entries.`}
        onClose={() => setBulkDeleteDialogOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        loading={bulkDeleteMutation?.isPending}
      />
    </Box>
  );
};

export default AnnouncementListPage;
