import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { LIMIT_OPTIONS } from "@/types/logs";

interface LimitSelectorProps {
  limit: number;
  onLimitChange: (newLimit: number) => void;
  label?: string;
}

const LimitSelector: React.FC<LimitSelectorProps> = ({
  limit,
  onLimitChange,
  label = "Logs per page:",
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontWeight: 500 }}
      >
        {label}
      </Typography>
      <FormControl size="small" sx={{ minWidth: 80 }}>
        <Select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#d1d5db",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#9ca3af",
            },
            "& .MuiSelect-select": {
              py: 1,
              fontSize: "0.875rem",
            },
          }}
        >
          {LIMIT_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LimitSelector;
