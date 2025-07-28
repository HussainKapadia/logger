import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Log,
  PaginationInfo,
  LogsResponse,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
} from "@/types/logs";

// URL Parameters Hook
export interface LogsFilterState {
  apps: string[];
  levels: string[];
  sort: "asc" | "desc";
}

export function useUrlParams() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = parseInt(
    searchParams.get("page") || DEFAULT_PAGE.toString()
  );
  const limit = parseInt(searchParams.get("limit") || DEFAULT_LIMIT.toString());

  // Memoize arrays from URL params
  const apps = useMemo(() => searchParams.getAll("apps"), [searchParams]);
  const levels = useMemo(() => searchParams.getAll("levels"), [searchParams]);
  const sort = (searchParams.get("sort") as "asc" | "desc") || "desc";

  // Memoize filterState to avoid re-renders
  const filterState = useMemo(() => {
    const state = { apps, levels, sort };
    console.log("[useUrlParams] filterState created:", state);
    return state;
  }, [apps, levels, sort]);

  const updateUrl = (newParams: {
    page?: number;
    limit?: number;
    apps?: string[];
    levels?: string[];
    userId?: string;
    sort?: "asc" | "desc";
    clearFilters?: boolean;
  }) => {
    const params = new URLSearchParams(searchParams);

    if (newParams.page !== undefined) {
      params.set("page", newParams.page.toString());
    }

    if (newParams.limit !== undefined) {
      params.set("limit", newParams.limit.toString());
      params.set("page", "1");
    }

    if (newParams.clearFilters) {
      params.delete("apps");
      params.delete("levels");
      params.delete("sort");
    } else {
      if (newParams.apps !== undefined) {
        params.delete("apps");
        newParams.apps.forEach((a) => params.append("apps", a));
      }
      if (newParams.levels !== undefined) {
        params.delete("levels");
        newParams.levels.forEach((l) => params.append("levels", l));
      }
      if (newParams.sort !== undefined) {
        params.set("sort", newParams.sort);
      }
    }

    console.log(
      "[updateUrl] called with:",
      newParams,
      "Resulting params:",
      params.toString()
    );
    router.push(`/logs?${params.toString()}`);
  };

  return { currentPage, limit, updateUrl, filterState };
}

// Logs Data Hook
interface UseLogsReturn {
  logs: Log[];
  pagination: PaginationInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLogs(
  page: number,
  limit: number,
  filters: LogsFilterState
): UseLogsReturn {
  const [logs, setLogs] = useState<Log[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async (
    page: number,
    limit: number,
    filters: LogsFilterState
  ) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      filters.apps.forEach((a) => params.append("apps", a));
      filters.levels.forEach((l) => params.append("levels", l));
      if (filters.sort) params.set("sort", filters.sort);

      const response = await fetch(`/api/logs?${params.toString()}`);

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
    console.log("[useLogs] fetchLogs triggered", { page, limit, filters });
    fetchLogs(page, limit, filters);
  }, [page, limit, filters.apps, filters.levels, filters.sort]);

  const refetch = () => {
    fetchLogs(page, limit, filters);
  };

  return { logs, pagination, loading, error, refetch };
}
