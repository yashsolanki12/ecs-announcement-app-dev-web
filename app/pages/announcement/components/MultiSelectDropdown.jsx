import React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const options = ["All", "Product page", "Contact page", "Collection page"];

export default function MultiSelectDropdown({ value, onChange }) {
  const handleChange = (event) => {
    const {
      target: { value: newValue },
    } = event;
    onChange(typeof newValue === "string" ? newValue.split(",") : newValue);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: "100%" }}>
        <InputLabel id="multiple-checkbox-label">Select Pages</InputLabel>
        <Select
          labelId="multiple-checkbox-label"
          id="multiple-checkbox"
          multiple
          value={value}
          onChange={handleChange}
          input={<OutlinedInput label="Select Pages" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
          fullWidth
        >
          {options.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={value.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
