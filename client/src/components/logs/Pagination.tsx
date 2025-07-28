import { PaginationInfo } from "@/types/logs";

// Pagination Button
interface PaginationButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  active?: boolean;
  variant?: "default" | "navigation";
}

function PaginationButton({
  onClick,
  disabled,
  children,
  active = false,
  variant = "default",
}: PaginationButtonProps) {
  const getButtonClasses = () => {
    const baseClasses =
      "px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500";

    if (variant === "navigation") {
      return `${baseClasses} rounded-md ${
        disabled
          ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
      }`;
    }

    return `${baseClasses} ${
      active
        ? "bg-blue-600 text-white border border-blue-600"
        : disabled
        ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
    }`;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={getButtonClasses()}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </button>
  );
}

// Main Pagination Component
interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  pagination,
  onPageChange,
}: PaginationProps) {
  const generatePageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const { page: currentPage, totalPages } = pagination;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage <= 4) {
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startItem = (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(
    pagination.page * pagination.limit,
    pagination.total
  );

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      {/* Mobile pagination */}
      <div className="flex-1 flex justify-between sm:hidden">
        <PaginationButton
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={!pagination.hasPrev}
          variant="navigation"
        >
          Previous
        </PaginationButton>
        <PaginationButton
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={!pagination.hasNext}
          variant="navigation"
        >
          Next
        </PaginationButton>
      </div>

      {/* Desktop pagination */}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem}</span> to{" "}
            <span className="font-medium">{endItem}</span> of{" "}
            <span className="font-medium">{pagination.total}</span> results
          </p>
        </div>

        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <PaginationButton
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              variant="navigation"
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </PaginationButton>

            {generatePageNumbers().map((pageNum, index) => (
              <div key={`${pageNum}-${index}`}>
                {pageNum === "..." ? (
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                ) : (
                  <PaginationButton
                    onClick={() => onPageChange(pageNum as number)}
                    active={pageNum === pagination.page}
                  >
                    {pageNum}
                  </PaginationButton>
                )}
              </div>
            ))}

            <PaginationButton
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
              variant="navigation"
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </PaginationButton>
          </nav>
        </div>
      </div>
    </div>
  );
}
