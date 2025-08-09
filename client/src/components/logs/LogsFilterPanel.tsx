import React, { useEffect, useState, useCallback, useMemo } from "react";

interface LogsFilterPanelProps {
  appNames: string[];
  levels: string[];
  userIds: string[];
  selectedApps: string[];
  selectedLevels: string[];
  selectedUserIds: string[];
  sort: "asc" | "desc";
  from?: string;
  to?: string;
  onChange: (filters: {
    apps: string[];
    levels: string[];
    userIds: string[];
    sort: "asc" | "desc";
    from?: string;
    to?: string;
  }) => void;
  onClear: () => void;
}

const LogsFilterPanel: React.FC<LogsFilterPanelProps> = ({
  appNames,
  levels,
  userIds,
  selectedApps,
  selectedLevels,
  selectedUserIds,
  sort,
  from,
  to,
  onChange,
  onClear,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAppChange = (app: string) => {
    const newApps = selectedApps.includes(app)
      ? selectedApps.filter((a) => a !== app)
      : [...selectedApps, app];
    onChange({
      apps: newApps,
      levels: selectedLevels,
      userIds: selectedUserIds,
      sort,
      from,
      to,
    });
  };

  const handleLevelChange = (level: string) => {
    const newLevels = selectedLevels.includes(level)
      ? selectedLevels.filter((l) => l !== level)
      : [...selectedLevels, level];
    onChange({
      apps: selectedApps,
      levels: newLevels,
      userIds: selectedUserIds,
      sort,
      from,
      to,
    });
  };

  const handleUserIdChange = (userId: string) => {
    const newUserIds = selectedUserIds.includes(userId)
      ? selectedUserIds.filter((u) => u !== userId)
      : [...selectedUserIds, userId];
    onChange({
      apps: selectedApps,
      levels: selectedLevels,
      userIds: newUserIds,
      sort,
      from,
      to,
    });
  };

  const handleSortToggle = () => {
    onChange({
      apps: selectedApps,
      levels: selectedLevels,
      userIds: selectedUserIds,
      sort: sort === "asc" ? "desc" : "asc",
      from,
      to,
    });
  };

  const handleSelectAllUserIds = () => {
    const filteredUserIds = userIds.filter((userId) =>
      userId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const allSelected = filteredUserIds.every((userId) =>
      selectedUserIds.includes(userId)
    );

    let newUserIds: string[];
    if (allSelected) {
      // Deselect all filtered items
      newUserIds = selectedUserIds.filter(
        (userId) => !filteredUserIds.includes(userId)
      );
    } else {
      // Select all filtered items
      newUserIds = [...new Set([...selectedUserIds, ...filteredUserIds])];
    }

    onChange({
      apps: selectedApps,
      levels: selectedLevels,
      userIds: newUserIds,
      sort,
      from,
      to,
    });
  };

  const filteredUserIds = useMemo(() => {
    return userIds.filter((userId) =>
      userId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [userIds, searchTerm]);

  const appCheckboxes = useMemo(
    () =>
      appNames.map((app) => (
        <label
          key={app}
          className="flex items-center space-x-2 text-black hover:bg-gray-50 p-1 rounded cursor-pointer"
        >
          <input
            type="checkbox"
            checked={selectedApps.includes(app)}
            onChange={() => handleAppChange(app)}
            className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm">{app}</span>
        </label>
      )),
    [appNames, selectedApps]
  );

  const levelCheckboxes = useMemo(
    () =>
      levels.map((level) => (
        <label
          key={level}
          className="flex items-center space-x-2 text-black hover:bg-gray-50 p-1 rounded cursor-pointer"
        >
          <input
            type="checkbox"
            checked={selectedLevels.includes(level)}
            onChange={() => handleLevelChange(level)}
            className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm">{level}</span>
        </label>
      )),
    [levels, selectedLevels]
  );

  const isAllFilteredUserIdsSelected = useMemo(() => {
    return (
      filteredUserIds.length > 0 &&
      filteredUserIds.every((userId) => selectedUserIds.includes(userId))
    );
  }, [filteredUserIds, selectedUserIds]);

  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 ${
        collapsed ? "h-auto" : ""
      }`}
      style={{
        minWidth: collapsed ? "auto" : "280px",
        maxWidth: "100%",
        transition: "all 0.2s ease-in-out",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        <button
          className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand filters" : "Collapse filters"}
        >
          {collapsed ? (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Content */}
      {!collapsed && (
        <div className="p-4 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
          {/* App Name */}
          <div>
            <h3 className="font-medium mb-3 text-gray-800 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              App Name
            </h3>
            <div className="space-y-1 max-h-32 overflow-y-auto bg-gray-50 rounded-lg p-2">
              {appNames.length === 0 ? (
                <div className="text-gray-500 text-sm text-center py-2">
                  No apps available
                </div>
              ) : (
                appCheckboxes
              )}
            </div>
          </div>

          {/* Level */}
          <div>
            <h3 className="font-medium mb-3 text-gray-800 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Level
            </h3>
            <div className="space-y-1 max-h-32 overflow-y-auto bg-gray-50 rounded-lg p-2">
              {levels.length === 0 ? (
                <div className="text-gray-500 text-sm text-center py-2">
                  No levels available
                </div>
              ) : (
                levelCheckboxes
              )}
            </div>
          </div>

          {/* User ID */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                User ID
              </h3>
              <label className="flex items-center space-x-1 text-xs">
                <input
                  type="checkbox"
                  checked={isAllFilteredUserIdsSelected}
                  onChange={handleSelectAllUserIds}
                  className="form-checkbox h-3 w-3 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-gray-600 font-medium">All</span>
              </label>
            </div>

            <input
              type="text"
              placeholder="Search User IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />

            <div className="space-y-1 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50">
              {filteredUserIds.length === 0 ? (
                <div className="text-gray-500 text-sm text-center py-4">
                  {searchTerm
                    ? "No matching User IDs found"
                    : "No User IDs available"}
                </div>
              ) : (
                filteredUserIds.map((userId) => (
                  <label
                    key={userId}
                    className="flex items-center space-x-2 text-black hover:bg-white p-1 rounded cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(userId)}
                      onChange={() => handleUserIdChange(userId)}
                      className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">User {userId}</span>
                  </label>
                ))
              )}
            </div>

            {selectedUserIds.length > 0 && (
              <div className="mt-2 text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded">
                {selectedUserIds.length} user
                {selectedUserIds.length !== 1 ? "s" : ""} selected
              </div>
            )}
          </div>

          {/* Timestamp Sort */}
          <div>
            <h3 className="font-medium mb-3 text-gray-800 flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Timestamp Sort
            </h3>
            <button
              className="w-full border border-gray-300 rounded-lg px-3 py-2 flex items-center justify-between text-black hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              onClick={handleSortToggle}
            >
              <span className="font-medium">
                Sort: {sort === "asc" ? "Oldest First" : "Newest First"}
              </span>
              <span className="text-lg">{sort === "asc" ? "↑" : "↓"}</span>
            </button>
          </div>

          {/* Date Range */}
          <div>
            <h3 className="font-medium mb-3 text-gray-800 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Date Range
            </h3>
            <div className="space-y-3">
              <label className="flex flex-col text-gray-700">
                <span className="text-sm font-medium mb-1">From:</span>
                <input
                  type="date"
                  value={from || ""}
                  onChange={(e) =>
                    onChange({
                      apps: selectedApps,
                      levels: selectedLevels,
                      userIds: selectedUserIds,
                      sort,
                      from: e.target.value,
                      to,
                    })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </label>
              <label className="flex flex-col text-gray-700">
                <span className="text-sm font-medium mb-1">To:</span>
                <input
                  type="date"
                  value={to || ""}
                  onChange={(e) =>
                    onChange({
                      apps: selectedApps,
                      levels: selectedLevels,
                      userIds: selectedUserIds,
                      sort,
                      from,
                      to: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </label>
            </div>
          </div>

          {/* Clear Button */}
          <button
            className="w-full bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-4 py-2 font-medium transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            onClick={onClear}
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(LogsFilterPanel);
