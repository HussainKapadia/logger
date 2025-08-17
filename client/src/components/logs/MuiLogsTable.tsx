"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Log, LOG_LEVEL_STYLES } from "@/types/logs";
import LimitSelector from "./LimitSelector";

// Styled components
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: "#FF9187",
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#ffffff",
  padding: theme.spacing(1.5, 3),
  backgroundColor: "#FF9187", // reapply bg so sticky works
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: "#FFFFFF",
  },
  "&:not(:last-child)": {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  fontSize: "0.875rem",
}));

const DetailsCell = styled(StyledTableCell)({
  maxWidth: "300px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

// Log Level Chip Component
interface LogLevelChipProps {
  level: string;
}

const LogLevelChip: React.FC<LogLevelChipProps> = ({ level }) => {
  const getChipColor = (level: string) => {
    const normalizedLevel =
      level.toLowerCase() as keyof typeof LOG_LEVEL_STYLES;
    switch (normalizedLevel) {
      case "error":
        return { bgcolor: "#fee2e2", color: "#991b1b" };
      case "warn":
        return { bgcolor: "#fef3c7", color: "#92400e" };
      case "info":
        return { bgcolor: "#dbeafe", color: "#1e40af" };
      case "debug":
        return { bgcolor: "#f3f4f6", color: "#374151" };
      default:
        return { bgcolor: "#f3f4f6", color: "#374151" };
    }
  };

  const chipColors = getChipColor(level);

  return (
    <Chip
      label={level}
      size="small"
      sx={{
        ...chipColors,
        fontWeight: 600,
        fontSize: "0.75rem",
        height: 24,
      }}
    />
  );
};

// Main Table Component
interface MuiLogsTableProps {
  logs: Log[];
  limit: number;
  onLimitChange: (newLimit: number) => void;
  onRowClick?: (log: Log) => void;
}

const TABLE_HEADERS = ["App Name", "User ID", "Level", "Timestamp", "Details"];

const MuiLogsTable: React.FC<MuiLogsTableProps> = ({
  logs,
  limit,
  onLimitChange,
  onRowClick,
}) => {
  const formatDetails = (details: any): string => {
    if (typeof details === "string") {
      return details;
    }
    return JSON.stringify(details);
  };

  const handleRowClick = (log: Log) => {
    if (onRowClick) {
      onRowClick(log);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Limit Selector */}
      <Box sx={{ mb: 3 }}>
        <LimitSelector limit={limit} onLimitChange={onLimitChange} />
      </Box>

      {/* Table with sticky header */}
      <Paper
        sx={{
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          borderRadius: 1,
        }}
      >
        <TableContainer sx={{ maxHeight: 750 }}>
          <Table stickyHeader>
            <StyledTableHead>
              <TableRow>
                {TABLE_HEADERS.map((header) => (
                  <StyledHeaderCell key={header}>{header}</StyledHeaderCell>
                ))}
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <StyledTableCell
                    colSpan={TABLE_HEADERS.length}
                    align="center"
                  >
                    <Box sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No logs found
                      </Typography>
                    </Box>
                  </StyledTableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <StyledTableRow
                    key={log._id}
                    onClick={() => handleRowClick(log)}
                  >
                    <StyledTableCell>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        color="text.primary"
                      >
                        {log.AppName}
                      </Typography>
                    </StyledTableCell>

                    <StyledTableCell>
                      <Typography variant="body2" color="text.secondary">
                        {log.UserId}
                      </Typography>
                    </StyledTableCell>

                    <StyledTableCell>
                      <LogLevelChip level={log.Log.Level} />
                    </StyledTableCell>

                    <StyledTableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(log.Log.TimeStamp).toLocaleString()}
                      </Typography>
                    </StyledTableCell>

                    <DetailsCell title={formatDetails(log.Log.Details)}>
                      <Typography variant="body2" color="text.secondary">
                        {formatDetails(log.Log.Details)}
                      </Typography>
                    </DetailsCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default MuiLogsTable;
