import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Checkbox from "@mui/material/Checkbox";

/**
 * TableShimmerLoader - A skeleton loader component for tables
 *
 * @param {Object} props
 * @param {Array} props.columns - Column configurations to match table structure
 * @param {Boolean} props.showCheckbox - Whether to show checkbox column
 * @param {Boolean} props.showActions - Whether to show actions column
 * @param {Number} props.rowCount - Number of skeleton rows to display (default: 5)
 * @param {ReactNode} props.searchControls - Optional search/sort controls to display above table
 */
const TableShimmerLoader = ({
  columns = [],
  showCheckbox = false,
  showActions = false,
  rowCount = 5,
  searchControls = null,
}) => {
  return (
    <>
      {/* Search and Sort Controls placeholder */}
      {searchControls && <Box sx={{ mb: 2 }}>{searchControls}</Box>}

      <TableContainer
        component={Box}
        sx={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: 1,
          maxHeight: 450,
          overflowY: "auto",
        }}
      >
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="skeleton table">
          <TableHead>
            <TableRow>
              {showCheckbox && (
                <TableCell
                  sx={{
                    color: "#6b7280",
                    fontWeight: 600,
                    fontSize: 13,
                    backgroundColor: "#f7f7f7",
                    width: 50,
                    padding: 0,
                  }}
                >
                  <Checkbox disabled />
                </TableCell>
              )}
              {columns.map((column, index) => (
                <TableCell
                  key={`header-${index}`}
                  sx={{
                    color: "#6b7280",
                    fontWeight: 600,
                    fontSize: 13,
                    backgroundColor: "#f7f7f7",
                    width: column.width || "auto",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
              {showActions && (
                <TableCell
                  sx={{
                    color: "#6b7280",
                    fontWeight: 600,
                    fontSize: 13,
                    backgroundColor: "#f7f7f7",
                    width: 120,
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <TableRow key={`row-${rowIndex}`}>
                {showCheckbox && (
                  <TableCell sx={{ padding: 0 }}>
                    <Checkbox disabled />
                  </TableCell>
                )}
                {columns.map((column, colIndex) => {
                  // Different skeleton shapes based on column type
                  let skeletonWidth = "80%";
                  let skeletonVariant = "rectangular";

                  if (column.type === "status") {
                    skeletonWidth = "80px";
                  } else if (column.type === "tooltip") {
                    skeletonWidth = "170px";
                  } else if (
                    column.key === "createdAt" ||
                    column.key === "updatedAt"
                  ) {
                    skeletonWidth = "180px";
                  }

                  return (
                    <TableCell
                      key={`cell-${rowIndex}-${colIndex}`}
                      sx={{ padding: 0 }}
                    >
                      <Skeleton
                        variant={skeletonVariant}
                        width={skeletonWidth}
                        height={column.type === "status" ? 24 : 20}
                        sx={{ borderRadius: "4px" }}
                      />
                    </TableCell>
                  );
                })}
                {showActions && (
                  <TableCell sx={{ padding: 0.85 }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton variant="circular" width={32} height={32} />
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TableShimmerLoader;
