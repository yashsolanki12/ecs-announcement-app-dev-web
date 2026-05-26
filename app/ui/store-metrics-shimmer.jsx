import React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const StoreMetricsShimmer = ({ list }) => {
  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        backgroundColor: "#fff",
      }}
    >
      {/* Text shimmer */}
      <Skeleton
        variant="text"
        width={`${list ? "40%" : "85%"}`}
        height={28}
        sx={{ mb: 1 }}
      />

      {/* Progress bar shimmer */}
      <Skeleton
        variant="rounded"
        width="100%"
        height={8}
        sx={{ borderRadius: 4 }}
      />
    </Box>
  );
};

export default StoreMetricsShimmer;
