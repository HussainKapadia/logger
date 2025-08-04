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
  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);

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
        <label key={app} className="flex items-center space-x-2 text-black">
          <input
            type="checkbox"
            checked={selectedApps.includes(app)}
            onChange={() => handleAppChange(app)}
            className="form-checkbox"
          />
          <span>{app}</span>
        </label>
      )),
    [appNames, selectedApps]
  );

  const levelCheckboxes = useMemo(
    () =>
      levels.map((level) => (
        <label key={level} className="flex items-center space-x-2 text-black">
          <input
            type="checkbox"
            checked={selectedLevels.includes(level)}
            onChange={() => handleLevelChange(level)}
            className="form-checkbox"
          />
          <span>{level}</span>
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
    <aside
      className={`bg-white rounded-lg shadow p-4 w-64 ${
        collapsed ? "h-12 overflow-hidden" : ""
      }`}
      style={{ minWidth: collapsed ? "3rem" : "16rem", transition: "all 0.2s" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-black">Filters</h2>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand filters" : "Collapse filters"}
        >
          {collapsed ? "▶" : "▼"}
        </button>
      </div>
      {!collapsed && (
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2 text-black">App Name</h3>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {appCheckboxes}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2 text-black">Level</h3>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {levelCheckboxes}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-black">User ID</h3>
              <label className="flex items-center space-x-1 text-xs">
                <input
                  type="checkbox"
                  checked={isAllFilteredUserIdsSelected}
                  onChange={handleSelectAllUserIds}
                  className="form-checkbox h-3 w-3"
                />
                <span className="text-black">All</span>
              </label>
            </div>

            <input
              type="text"
              placeholder="Search User IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-black mb-2"
            />

            <div className="space-y-1 max-h-40 overflow-y-auto border border-gray-200 rounded p-2">
              {filteredUserIds.length === 0 ? (
                <div className="text-gray-500 text-sm text-center py-2">
                  No User IDs found
                </div>
              ) : (
                filteredUserIds.map((userId) => (
                  <label
                    key={userId}
                    className="flex items-center space-x-2 text-black"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(userId)}
                      onChange={() => handleUserIdChange(userId)}
                      className="form-checkbox h-4 w-4"
                    />
                    <span className="text-sm">User {userId}</span>
                  </label>
                ))
              )}
            </div>
            {selectedUserIds.length > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                {selectedUserIds.length} user
                {selectedUserIds.length !== 1 ? "s" : ""} selected
              </div>
            )}
          </div>

          <div>
            <h3 className="font-medium mb-2 text-black">Timestamp</h3>
            <button
              className="w-full border border-gray-300 rounded px-2 py-1 flex items-center justify-between text-black"
              onClick={handleSortToggle}
            >
              <span>Sort: {sort === "asc" ? "Oldest" : "Newest"}</span>
              <span>{sort === "asc" ? "↑" : "↓"}</span>
            </button>
          </div>

          <div>
            <h3 className="font-medium mb-2 text-black">Date Range</h3>
            <div className="flex flex-col gap-2">
              <label className="flex flex-col text-black">
                From:
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
                  className="form-input"
                />
              </label>
              <label className="flex flex-col text-black">
                To:
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
                  className="form-input"
                />
              </label>
            </div>
          </div>

          <button
            className="w-full bg-gray-100 hover:bg-gray-200 text-black rounded px-2 py-1 mt-2"
            onClick={onClear}
          >
            Clear all filters
          </button>
        </div>
      )}
    </aside>
  );
};

export default React.memo(LogsFilterPanel);
