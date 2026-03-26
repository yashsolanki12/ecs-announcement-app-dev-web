import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAnnouncementSubmit = (mutationFn, setSnackBar, options = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, invalidateKeys = [] } = options;

  const mutation = useMutation({
    mutationFn,
    onError: (error) => {
      setSnackBar({
        open: true,
        message: error.message || "An error occurred",
        severity: "error",
      });
    },
    onSuccess: (data) => {
      // Show success snackbar immediately
      setSnackBar({
        open: true,
        message: data?.message || "Operation successful",
        severity: "success",
      });

      // Call custom onSuccess callback to redirect in /app route
      if (onSuccess) {
        onSuccess(data);
      }

      // Invalidate queries after snackbar is shown
      if (invalidateKeys.length > 0) {
        setTimeout(() => {
          invalidateKeys.forEach((key) => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        }, 2000); // Delay to let snackbar show first
      }
    },
  });

  return mutation;
};

export default useAnnouncementSubmit;
