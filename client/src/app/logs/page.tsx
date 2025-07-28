"use client";

import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  PageHeader,
} from "@/components/logs/UIComponents";
import LogsTable from "@/components/logs/LogsTable";
import Pagination from "@/components/logs/Pagination";
import LogsFilterPanel from "@/components/logs/LogsFilterPanel";
import { useEffect, useState } from "react";
import type { LogsFilterState } from "@/hooks/useLogs";
import { useUrlParams, useLogs } from "@/hooks/useLogs";
import { Log } from "@/types/logs";

export default function LogsPage() {
  const { currentPage, limit, updateUrl, filterState } = useUrlParams();
  const { logs, pagination, loading, error, refetch } = useLogs(
    currentPage,
    limit,
    filterState
  );

  const [appNames, setAppNames] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/logs/app-names")
      .then((res) => res.json())
      .then((data) => setAppNames(data.appNames || []));
    fetch("/api/logs/levels")
      .then((res) => res.json())
      .then((data) => setLevels(data.levels || []));
  }, []);

  const handleFilterChange = (filters: LogsFilterState) => {
    updateUrl({
      apps: filters.apps,
      levels: filters.levels,
      sort: filters.sort,
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
    updateUrl({ limit: newLimit });
  };

  const handleLogRowClick = (log: Log) => {
    // Handle log row click - implement log details modal/page here
    console.log("Log clicked:", log);
  };

  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="min-h-screen h-screen bg-gray-50">
      <div
        className="max-w-full h-full mx-auto px-6 sm:px-8 lg:px-12 py-0 flex flex-col"
        style={{ height: "100vh" }}
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
        <div className="flex flex-1 gap-6 mt-4 h-0 min-h-0">
          {/* Filter Sidebar */}
          <div className="h-full flex-shrink-0">
            <LogsFilterPanel
              appNames={appNames}
              levels={levels}
              selectedApps={filterState.apps}
              selectedLevels={filterState.levels}
              sort={filterState.sort}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </div>
          <div className="flex-1 min-w-0 h-full overflow-y-auto bg-white rounded-lg shadow p-4">
            {error ? (
              <ErrorMessage message={error} onRetry={handleRetry} />
            ) : loading ? (
              <LoadingSpinner />
            ) : logs.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-4">
                <LogsTable
                  logs={logs}
                  limit={limit}
                  onLimitChange={handleLimitChange}
                  onRowClick={handleLogRowClick}
                />
                {pagination && (
                  <Pagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
