// Column configurations for different tables

/**
 * Announcement List Columns
 */
export const announcementColumns = [
  {
    key: "announcement_name",
    label: "Announcement Name",
    type: "tooltip",
    tooltipFontSize: "12px",
  },
  {
    key: "enabled",
    label: "Status",
    // align: "center",
    type: "status",
  },
];

/**
 * Announcement List Actions
 */
export const announcementActions = [
  {
    name: "edit",
    icon: "edit",
    tooltip: "Edit",
    color: "primary",
    type: "link",
    to: (row) => `/app/ecs-announcement/${row._id}`,
  },
  {
    name: "duplicate",
    icon: "content_copy",
    tooltip: "Duplicate",
    color: "secondary",
    type: "action",
  },
  {
    name: "delete",
    icon: "delete",
    tooltip: "Delete",
    color: "error",
    type: "action",
  },
];
