import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Log,
  PaginationInfo,
  LogsResponse,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
} from "@/types/logs";

// URL Parameters Hook
export function useUrlParams() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = parseInt(
    searchParams.get("page") || DEFAULT_PAGE.toString()
  );
  const limit = parseInt(searchParams.get("limit") || DEFAULT_LIMIT.toString());

  const updateUrl = (newParams: { page?: number; limit?: number }) => {
    const params = new URLSearchParams(searchParams);

    if (newParams.page !== undefined) {
      params.set("page", newParams.page.toString());
    }

    if (newParams.limit !== undefined) {
      params.set("limit", newParams.limit.toString());
      params.set("page", "1");
    }

    router.push(`/logs?${params.toString()}`);
  };

  return { currentPage, limit, updateUrl };
}

// Logs Data Hook
interface UseLogsReturn {
  logs: Log[];
  pagination: PaginationInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLogs(page: number, limit: number): UseLogsReturn {
  const [logs, setLogs] = useState<Log[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async (page: number, limit: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/logs?page=${page}&limit=${limit}`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch logs: ${response.status} ${response.statusText}`
        );
      }

      const data: LogsResponse = await response.json();
      setLogs(data.data);
      setPagination(data.pagination);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page, limit);
  }, [page, limit]);

  const refetch = () => {
    fetchLogs(page, limit);
  };

  return { logs, pagination, loading, error, refetch };
}
