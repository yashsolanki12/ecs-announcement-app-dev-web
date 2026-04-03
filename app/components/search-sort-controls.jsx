import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const SearchSortControls = ({
  searchQuery,
  setSearchQuery,
  sortOrder,
  setSortOrder,
  minSearchLength = 3,
}) => {
  const [debouncedSearch, setDebouncedSearch] = React.useState(searchQuery);

  // Debounce search input - only update search query after 3 characters
  React.useEffect(() => {
    const timer = setTimeout(() => {
      // Only set search query if it meets the minimum length or is empty (to clear search)
      if (
        debouncedSearch.length >= minSearchLength ||
        debouncedSearch.length === 0
      ) {
        setSearchQuery(debouncedSearch);
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [debouncedSearch, minSearchLength, setSearchQuery]);

  // Reset all filters
  const handleReset = React.useCallback(() => {
    setDebouncedSearch("");
    setSearchQuery("");
    setSortOrder("desc");
  }, [setSearchQuery, setSortOrder]);

  const handleSearchChange = React.useCallback((e) => {
    setDebouncedSearch(e.target.value);
  }, []);

  const handleSortChange = React.useCallback(
    (e) => {
      setSortOrder(e.target.value);
    },
    [setSortOrder],
  );

  const handleKeyDown = React.useCallback(
    (e) => {
      if (e.key === "Enter" && debouncedSearch.length >= minSearchLength) {
        setSearchQuery(debouncedSearch);
      }
    },
    [debouncedSearch, minSearchLength, setSearchQuery],
  );

  // Check if any filters are active
  const hasActiveFilters = debouncedSearch.length > 0 || sortOrder !== "desc";

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", sm: "center" }}
      spacing={2}
      sx={{ width: "100%" }}
    >
      {/* Search Field */}
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        placeholder={`Search by announcement name...`}
        value={debouncedSearch}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        sx={{
          minWidth: { xs: "auto", sm: 200, md: 300 },
          width: { xs: "100%", sm: "auto" },
          backgroundColor: "white",
        }}
        helperText={
          debouncedSearch.length > 0 && debouncedSearch.length < minSearchLength
            ? `Enter at least ${minSearchLength} characters`
            : ""
        }
      />

      {/* Sort & Reset Controls */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ width: { xs: "100%", sm: "auto" } }}
      >
        {/* Sort Dropdown */}
        <FormControl
          size="small"
          sx={{
            minWidth: { xs: "auto", sm: 120, md: 150 },
            backgroundColor: "white",
          }}
        >
          <InputLabel>Sort Order</InputLabel>
          <Select
            value={sortOrder}
            label="Sort Order"
            onChange={handleSortChange}
          >
            <MenuItem value="desc">Oldest</MenuItem>
            <MenuItem value="asc">Newest</MenuItem>
          </Select>
        </FormControl>

        {/* Reset Button */}
        <Button
          variant="outlined"
          onClick={handleReset}
          disabled={!hasActiveFilters}
          size="small"
          disableTypography
          sx={{
            minWidth: { xs: "100%", sm: 80, md: 100 },
            backgroundColor: "white",
            textTransform: "none",
          }}
        >
          Reset
        </Button>
      </Stack>
    </Stack>
  );
};

export default SearchSortControls;
