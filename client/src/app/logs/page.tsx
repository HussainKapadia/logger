"use client";

import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  PageHeader,
} from "@/components/logs/UIComponents";
import LogsTable from "@/components/logs/LogsTable";
import Pagination from "@/components/logs/Pagination";
import { useUrlParams, useLogs } from "@/hooks/useLogs";
import { Log } from "@/types/logs";

export default function LogsPage() {
  const { currentPage, limit, updateUrl } = useUrlParams();
  const { logs, pagination, loading, error, refetch } = useLogs(
    currentPage,
    limit
  );

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
  );
}
