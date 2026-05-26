import React from "react";
import {
  deleteAnnouncement,
  duplicateAnnouncement,
  getAllAnnouncement,
  toggleAnnouncementEnabled,
} from "../../api/announcement";
import { getCurrentShopSession } from "../../api/current-shop-session";
import { announcementColumns, announcementActions } from "../../utils/column";
import useAnnouncementData from "../../hooks/useAnnouncementData";
import useAnnouncementSubmit from "../../hooks/useAnnouncementSubmit";
// import Loader from "../../ui/loader";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Warning from "@mui/icons-material/Warning";
import Button from "@mui/material/Button";
import DataTable from "../../components/table/data-table";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SafeLink from "../../helper/safe-link";
import Stack from "@mui/material/Stack";
import {
  bulkDeleteAnnouncement,
  bulkToggleAnnouncement,
} from "../../api/bulk-operation";
import ConfirmDialog from "../../ui/confirmation-dialog";
import SearchSortControls from "../../components/search-sort-controls";
import { syncStoreMetrics } from "../../api/store-metrics";
import LinearProgress from "@mui/material/LinearProgress";
import StoreMetricsShimmer from "../../ui/store-metrics-shimmer";
// import TableShimmerLoader from "../../components/table/table-shimmer-loader";

const AnnouncementListPage = ({ appEmbedEnabled, session, subscription }) => {
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Selected items state
  const [selectedIds, setSelectedIds] = React.useState([]);

  // Filter state
  const [filter, setFilter] = React.useState("all");

  // Search and sort state - default is "desc" (oldest first)
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("desc");

  // Build query params for API
  const getQueryParams = () => {
    const params = {};
    if (searchQuery) {
      params.search = searchQuery;
    }
    if (sortOrder) {
      params.sortOrder = sortOrder;
    }
    return params;
  };

  // List API with search and sort params
  const { data: announcementListData, isLoading: announcementListLoading } =
    useAnnouncementData(
      ["announcement", searchQuery, sortOrder],
      () => getAllAnnouncement(getQueryParams()),
      null,
    );

  // Bulk delete confirmation dialog state
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = React.useState(false);

  // Handle filter change
  const handleFilterChange = (event, newValue) => {
    setFilter(newValue);
    setSelectedIds([]); // Clear selection when filter changes
  };

  // Current shop API
  const {
    data: announcementSessionData,
    isLoading: announcementSessionLoading,
  } = useAnnouncementData(
    ["announcement-session"],
    getCurrentShopSession,
    null,
  );

  const planName = subscription ? subscription.name || "Free" : "No Plan";
  const {
    data: announcementStoreMetricsData,
    isLoading: announcementStoreMetricsLoading,
    error: announcementStoreMetricsError,
  } = useAnnouncementData(
    ["announcement-store-metrics"],
    () => syncStoreMetrics(planName),
    null,
  );

  const isLimitExceeded = String(announcementStoreMetricsError).includes(
    "limit",
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

  React.useEffect(() => {
    if (isLimitExceeded && subscription !== undefined) {
      setSnackbar({
        open: true,
        message: String(announcementStoreMetricsError),
        severity: "error",
      });
    }
  }, [isLimitExceeded]);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 2 } }}>
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
                  fontSize: { xs: "0.95rem", sm: "1rem" },
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
              <span style={{ fontSize: "14px" }}>
                Please activate the app by clicking{" "}
              </span>
              <Box
                component="span"
                sx={{ fontWeight: 700, color: "black", fontSize: "14px" }}
              >
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
                p: "5px 10px",
                fontSize: "13px",
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
          sx={{ mb: 1 }}
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

          {announcementListData?.data.length < 10 && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
                New Announcement
              </Button>
            </Stack>
          )}
        </Stack>
      </Box>
      {announcementStoreMetricsLoading ? (
        <StoreMetricsShimmer list={"list-data"} />
      ) : (
        <>
          {" "}
          {announcementStoreMetricsData?.success === true &&
            subscription !== undefined && (
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                }}
              >
                <Typography variant="body2" sx={{ mb: 1, color: "#202223" }}>
                  You're currently on{" "}
                  <strong>
                    "{announcementStoreMetricsData.data.plan_name}"
                  </strong>{" "}
                  ({announcementStoreMetricsData.data.views_count} /{" "}
                  {announcementStoreMetricsData.data.limit === -1
                    ? "Unlimited"
                    : announcementStoreMetricsData.data.limit}{" "}
                  monthly views). One visitor can have multiple views per
                  session.
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    announcementStoreMetricsData.data.limit === -1
                      ? 0
                      : Math.min(
                          (announcementStoreMetricsData.data.views_count /
                            announcementStoreMetricsData.data.limit) *
                            100,
                          100,
                        )
                  }
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#202223",
                    },
                  }}
                />
              </Box>
            )}
        </>
      )}

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
            disableTypography
            sx={{ textTransform: "none" }}
          />
          <Tab
            label={`Active (${announcementListData?.data?.filter((item) => item.enabled === true).length || 0})`}
            value="active"
            disableTypography
            sx={{ textTransform: "none" }}
          />
          <Tab
            label={`Inactive (${announcementListData?.data?.filter((item) => item.enabled === false).length || 0})`}
            value="inactive"
            disableTypography
            sx={{ textTransform: "none" }}
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
            bgcolor: "#ffffff",
            borderRadius: 1,
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="body2"
            sx={{ textAlign: { xs: "center", sm: "left" } }}
          >
            {selectedIds.length} Item(s) Selected
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
        isLoading={announcementListLoading}
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
        searchControls={
          <SearchSortControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        }
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
