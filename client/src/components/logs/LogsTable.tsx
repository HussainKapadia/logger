import { Log, LIMIT_OPTIONS, LOG_LEVEL_STYLES } from "@/types/logs";

// Limit Selector
interface LimitSelectorProps {
  limit: number;
  onLimitChange: (newLimit: number) => void;
  label?: string;
}

function LimitSelector({
  limit,
  onLimitChange,
  label = "Logs per page:",
}: LimitSelectorProps) {
  return (
    <div className="mb-6 flex items-center gap-2">
      <label htmlFor="limit" className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id="limit"
        value={limit}
        onChange={(e) => onLimitChange(parseInt(e.target.value))}
        className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {LIMIT_OPTIONS.map((option) => (
          <option
            key={option}
            value={option}
            className="text-gray-900 bg-white"
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

// Log Level Badge
function LogLevelBadge({ level }: { level: string }) {
  const normalizedLevel = level.toLowerCase() as keyof typeof LOG_LEVEL_STYLES;
  const styleClass =
    LOG_LEVEL_STYLES[normalizedLevel] || LOG_LEVEL_STYLES.default;

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styleClass}`}
    >
      {level}
    </span>
  );
}

// Main Table Component
interface LogsTableProps {
  logs: Log[];
  limit: number;
  onLimitChange: (newLimit: number) => void;
  onRowClick?: (log: Log) => void;
}

const TABLE_HEADERS = [
  "App Name",
  //"Log ID",
  "User ID",
  "Level",
  "Timestamp",
  "Details",
];

export default function LogsTable({
  logs,
  limit,
  onLimitChange,
  onRowClick,
}: LogsTableProps) {
  const formatDetails = (details: any) => {
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
    <div className="space-y-4">
      <LimitSelector limit={limit} onLimitChange={onLimitChange} />

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {TABLE_HEADERS.map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr
                  key={log._id}
                  className={`hover:bg-gray-50 ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => handleRowClick(log)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.AppName}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.LogId}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.UserId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <LogLevelBadge level={log.Log.Level} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.Log.TimeStamp).toLocaleString()}
                  </td>
                  <td
                    className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate"
                    title={formatDetails(log.Log.Details)}
                  >
                    {formatDetails(log.Log.Details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
