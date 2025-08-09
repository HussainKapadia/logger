"use client";

import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  PageHeader,
} from "@/components/logs/UIComponents";
import MuiLogsTable from "@/components/logs/MuiLogsTable";
import MuiPaginationComponent from "@/components/logs/MuiPaginationComponent";
import LogsFilterPanel from "@/components/logs/LogsFilterPanel";
import { useEffect, useState } from "react";
import type { LogsFilterState } from "@/hooks/useLogs";
import { useUrlParams, useLogs } from "@/hooks/useLogs";
import { Log } from "@/types/logs";
import { Box, Container } from "@mui/material";

export default function LogsPage() {
  const { currentPage, limit, updateUrl, filterState, updateTotalItems } =
    useUrlParams();
  const { logs, pagination, loading, error, refetch } = useLogs(
    currentPage,
    limit,
    filterState
  );

  const [appNames, setAppNames] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [userIds, setUserIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/logs/app-names")
      .then((res) => res.json())
      .then((data) => setAppNames(data.appNames || []));
    fetch("/api/logs/levels")
      .then((res) => res.json())
      .then((data) => setLevels(data.levels || []));
    fetch("/api/logs/user-ids")
      .then((res) => res.json())
      .then((data) => setUserIds(data.userIds || []));
  }, []);

  useEffect(() => {
    if (pagination?.total !== undefined) {
      updateTotalItems(pagination.total);
    }
  }, [pagination?.total, updateTotalItems]);

  const handleFilterChange = (filters: LogsFilterState) => {
    updateUrl({
      apps: filters.apps,
      levels: filters.levels,
      userIds: filters.userIds,
      sort: filters.sort,
      from: filters.from,
      to: filters.to,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    updateUrl({ clearFilters: true, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage });
  };

  const handleLimitChange = (newLimit: number) => {
    updateUrl({
      limit: newLimit,
      totalItems: pagination?.total || 0,
    });
  };

  const handleLogRowClick = (log: Log) => {
    // Handle log row click - implement log details modal/page here
    console.log("Log clicked:", log);
  };

  const handleRetry = () => {
    refetch();
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container
        maxWidth={false}
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          px: { xs: 2, sm: 3, lg: 4 },
          py: 3,
          gap: 2,
        }}
      >
        <PageHeader
          actions={
            <button
              onClick={handleRetry}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          }
        />

        <Box
          sx={{
            display: "flex",
            gap: 3,
            flex: 1,
            alignItems: "flex-start",
            flexWrap: { xs: "wrap", lg: "nowrap" },
          }}
        >
          {/* Filter Sidebar */}
          <Box
            sx={{
              flexShrink: 0,
              width: { xs: "100%", lg: "280px" },
              maxHeight: { lg: "calc(100vh - 200px)" },
              overflowY: { lg: "auto" },
              order: { xs: 2, lg: 1 },
            }}
          >
            <LogsFilterPanel
              appNames={appNames}
              levels={levels}
              userIds={userIds}
              selectedApps={filterState.apps}
              selectedLevels={filterState.levels}
              selectedUserIds={filterState.userIds}
              sort={filterState.sort}
              from={filterState.from}
              to={filterState.to}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </Box>

          {/* Main Content */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 1,
              overflow: "hidden",
              order: { xs: 1, lg: 2 },
              minHeight: "400px",
            }}
          >
            {error ? (
              <Box sx={{ p: 3 }}>
                <ErrorMessage message={error} onRetry={handleRetry} />
              </Box>
            ) : loading ? (
              <Box sx={{ p: 3 }}>
                <LoadingSpinner />
              </Box>
            ) : logs.length === 0 ? (
              <Box sx={{ p: 3 }}>
                <EmptyState />
              </Box>
            ) : (
              <>
                <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
                  <MuiLogsTable
                    logs={logs}
                    limit={limit}
                    onLimitChange={handleLimitChange}
                    onRowClick={handleLogRowClick}
                  />
                </Box>
                {pagination && (
                  <Box sx={{ borderTop: 1, borderColor: "divider" }}>
                    <MuiPaginationComponent
                      pagination={pagination}
                      onPageChange={handlePageChange}
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
