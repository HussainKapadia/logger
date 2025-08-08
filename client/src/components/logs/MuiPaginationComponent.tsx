import React from "react";
import {
  Box,
  Pagination as MuiPagination,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PaginationInfo } from "@/types/logs";

interface MuiPaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

const MuiPaginationComponent: React.FC<MuiPaginationProps> = ({
  pagination,
  onPageChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    onPageChange(page);
  };

  const startItem = (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(
    pagination.page * pagination.limit,
    pagination.total
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        py: 2,
        px: 1,
        bgcolor: "background.paper",
        borderTop: "1px solid",
        borderTopColor: "divider",
      }}
    >
      {/* Results info */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ order: { xs: 2, sm: 1 } }}
      >
        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{" "}
        <strong>{pagination.total}</strong> results
      </Typography>

      {/* MUI Pagination */}
      <Box sx={{ order: { xs: 1, sm: 2 } }}>
        <MuiPagination
          count={pagination.totalPages}
          page={pagination.page}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          color="primary"
          size={isMobile ? "small" : "medium"}
          siblingCount={isMobile ? 0 : 1}
          boundaryCount={isMobile ? 1 : 1}
          showFirstButton={!isMobile}
          showLastButton={!isMobile}
          sx={{
            "& .MuiPaginationItem-root": {
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              fontWeight: 500,
              minWidth: isMobile ? "32px" : "40px",
              height: isMobile ? "32px" : "40px",
              "&.Mui-selected": {
                backgroundColor: "#FF9187",
                color: "white",
                "&:hover": {
                  backgroundColor: "#FF9187",
                },
              },
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
              "&.MuiPaginationItem-ellipsis": {
                fontSize: isMobile ? "0.75rem" : "0.875rem",
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default MuiPaginationComponent;
