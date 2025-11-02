import React from "react";

interface MediaPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function MediaPagination({
  page,
  totalPages,
  onPageChange,
}: MediaPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Previous
      </button>
      <span className="px-4 py-2 text-gray-700">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  );
}

