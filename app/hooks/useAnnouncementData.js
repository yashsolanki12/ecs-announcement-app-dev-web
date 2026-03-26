import React from "react";
import { useQuery } from "@tanstack/react-query";

export const useAnnouncementData = (queryKey, queryFn, setSnackBar, options = {}) => {
  const { enabled = true, staleTime = 0, showSuccessToast = false } = options;

  // Call useQuery at the top level
  const { error, data, isLoading, refetch, isSuccess } = useQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: queryFn,
    enabled: enabled,
    staleTime: staleTime,
    // Refetch every time component mounts
    refetchOnMount: true,
    // Optional: Prevent retries to stop repeated error cycles during debugging
    retry: false,
  });

  const errorMessage = error?.message;
  React.useEffect(() => {
    if (errorMessage && setSnackBar) {
      setSnackBar((prev) => {
        if (prev.message === errorMessage && prev.open) return prev;

        return {
          open: true,
          message: errorMessage,
          severity: "error",
        };
      });
    }
  }, [errorMessage, setSnackBar]);

  // Show success toast when data is successfully fetched (only if setSnackBar is provided)
  React.useEffect(() => {
    if (isSuccess && setSnackBar && data?.message) {
      // Add small delay to avoid overlapping with mutation toasts
      setTimeout(() => {
        setSnackBar((prev) => {
          if (prev.message === data.message && prev.open) return prev;

          return {
            open: true,
            message: data.message,
            severity: "success",
          };
        });
      }, 500);
    }
  }, [isSuccess, setSnackBar, data]);

  return { error, data, isLoading, refetch };
};
export default useAnnouncementData;
