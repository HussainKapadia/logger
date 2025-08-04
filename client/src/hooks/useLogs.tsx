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
  userIds: string[];
  sort: "asc" | "desc";
  from?: string;
  to?: string;
}

//calculate the new page
function calculateNewPage(
  currentPage: number,
  currentLimit: number,
  newLimit: number,
  totalItems: number
): number {
  const startIndex = (currentPage - 1) * currentLimit;

  const newPage = Math.floor(startIndex / newLimit) + 1;

  if (newPage < 1) return 1;
  const maxPages = Math.ceil(totalItems / newLimit);

  if (maxPages < 1) return 1;
  const finalPage = Math.min(newPage, maxPages);

  return finalPage;
}

export function useUrlParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [totalItems, setTotalItems] = useState<number>(0);

  const currentPage = parseInt(
    searchParams.get("page") || DEFAULT_PAGE.toString()
  );
  const limit = parseInt(searchParams.get("limit") || DEFAULT_LIMIT.toString());

  // Memoize arrays from URL params
  const apps = useMemo(() => searchParams.getAll("apps"), [searchParams]);
  const levels = useMemo(() => searchParams.getAll("levels"), [searchParams]);
  const userIds = useMemo(() => searchParams.getAll("userIds"), [searchParams]);
  const sort = (searchParams.get("sort") as "asc" | "desc") || "desc";
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;

  // Memoize filterState to avoid re-renders
  const filterState = useMemo(() => {
    const state = { apps, levels, userIds, sort, from, to };
    console.log("[useUrlParams] filterState created:", state);
    return state;
  }, [apps, levels, userIds, sort, from, to]);

  const updateUrl = (newParams: {
    page?: number;
    limit?: number;
    apps?: string[];
    levels?: string[];
    userIds?: string[];
    sort?: "asc" | "desc";
    from?: string;
    to?: string;
    clearFilters?: boolean;
    totalItems?: number;
  }) => {
    const params = new URLSearchParams(searchParams);
    let targetPage = newParams.page;

    if (newParams.limit !== undefined && newParams.limit !== limit) {
      const newLimit = newParams.limit;
      const currentTotalItems = newParams.totalItems || totalItems;

      if (currentTotalItems > 0) {
        targetPage = calculateNewPage(
          currentPage,
          limit,
          newLimit,
          currentTotalItems
        );
        console.log(
          `[updateUrl] Limit changed from ${limit} to ${newLimit}. Page adjusted from ${currentPage} to ${targetPage} (total items: ${currentTotalItems})`
        );
      } else {
        console.warn(
          `[updateUrl] No total items available, resetting to first page. Current total items: ${currentTotalItems}`
        );
        targetPage = 1;
      }

      params.set("limit", newLimit.toString());
    }

    if (targetPage !== undefined) {
      params.set("page", targetPage.toString());
    }

    if (newParams.clearFilters) {
      params.delete("apps");
      params.delete("levels");
      params.delete("userIds");
      params.delete("sort");
      params.delete("from");
      params.delete("to");
      params.set("page", "1");
    } else {
      if (newParams.apps !== undefined) {
        params.delete("apps");
        newParams.apps.forEach((a) => params.append("apps", a));
      }
      if (newParams.levels !== undefined) {
        params.delete("levels");
        newParams.levels.forEach((l) => params.append("levels", l));
      }
      if (newParams.userIds !== undefined) {
        params.delete("userIds");
        newParams.userIds.forEach((u) => params.append("userIds", u));
      }
      if (newParams.sort !== undefined) {
        params.set("sort", newParams.sort);
      }
      if (newParams.from !== undefined) {
        if (newParams.from) params.set("from", newParams.from);
        else params.delete("from");
      }
      if (newParams.to !== undefined) {
        if (newParams.to) params.set("to", newParams.to);
        else params.delete("to");
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

  const updateTotalItems = (total: number) => {
    setTotalItems(total);
  };

  return { currentPage, limit, updateUrl, filterState, updateTotalItems };
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
      filters.userIds.forEach((u) => params.append("userIds", u));
      if (filters.sort) params.set("sort", filters.sort);
      if (filters.from) params.set("from", filters.from);
      if (filters.to) params.set("to", filters.to);

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
  }, [
    page,
    limit,
    filters.apps,
    filters.levels,
    filters.userIds,
    filters.sort,
    filters.from,
    filters.to,
  ]);

  const refetch = () => {
    fetchLogs(page, limit, filters);
  };

  return { logs, pagination, loading, error, refetch };
}
