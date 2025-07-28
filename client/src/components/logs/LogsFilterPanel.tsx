import React, { useEffect, useState, useCallback, useMemo } from "react";

interface LogsFilterPanelProps {
  appNames: string[];
  levels: string[];
  selectedApps: string[];
  selectedLevels: string[];
  sort: "asc" | "desc";
  onChange: (filters: {
    apps: string[];
    levels: string[];
    sort: "asc" | "desc";
  }) => void;
  onClear: () => void;
}

const LogsFilterPanel: React.FC<LogsFilterPanelProps> = ({
  appNames,
  levels,
  selectedApps,
  selectedLevels,
  sort,
  onChange,
  onClear,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const handleAppChange = (app: string) => {
    const newApps = selectedApps.includes(app)
      ? selectedApps.filter((a) => a !== app)
      : [...selectedApps, app];
    onChange({
      apps: newApps,
      levels: selectedLevels,
      sort,
    });
  };

  const handleLevelChange = (level: string) => {
    const newLevels = selectedLevels.includes(level)
      ? selectedLevels.filter((l) => l !== level)
      : [...selectedLevels, level];
    onChange({
      apps: selectedApps,
      levels: newLevels,
      sort,
    });
  };

  const handleSortToggle = () => {
    onChange({
      apps: selectedApps,
      levels: selectedLevels,
      sort: sort === "asc" ? "desc" : "asc",
    });
  };

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
            <h3 className="font-medium mb-2 text-black">Timestamp</h3>
            <button
              className="w-full border border-gray-300 rounded px-2 py-1 flex items-center justify-between text-black"
              onClick={handleSortToggle}
            >
              <span>Sort: {sort === "asc" ? "Oldest" : "Newest"}</span>
              <span>{sort === "asc" ? "↑" : "↓"}</span>
            </button>
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
