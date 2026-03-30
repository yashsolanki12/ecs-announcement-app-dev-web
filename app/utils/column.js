// Column configurations for different tables
import { getFormattedDate } from "../utils/helper";

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
  {
    key: "createdAt",
    label: "Created At",
    render: (value) => getFormattedDate(new Date(value)),
  },
  {
    key: "updatedAt",
    label: "Updated At",
    render: (value) => getFormattedDate(new Date(value)),
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
