export interface Log {
  _id: string;
  AppName: string;
  LogId: number;
  UserId: number;
  Log: {
    Level: string;
    TimeStamp: string;
    Details: any;
  };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface LogsResponse {
  data: Log[];
  pagination: PaginationInfo;
}

export type LogLevel = "error" | "warn" | "info" | "debug";

// Constants
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const LIMIT_OPTIONS = [5, 10, 20, 50];

export const LOG_LEVEL_STYLES = {
  error: "bg-red-100 text-red-800",
  warn: "bg-yellow-200 text-yellow-800",
  info: "bg-blue-100 text-blue-800",
  debug: "bg-gray-100 text-gray-800",
  default: "bg-gray-100 text-gray-800",
} as const;
