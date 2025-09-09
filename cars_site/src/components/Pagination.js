"use client"

import React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

function Pagination({ currentPage, totalPages, onPageChange }) {
    const getPageNumbers = () => {
        const pageNumbers = []

        if (totalPages <= 7) {
            // If 7 or fewer pages, show all
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
        } else {
            // Always show first page
            pageNumbers.push(1)

            if (currentPage > 3) {
                // Show ellipsis if current page is away from start
                pageNumbers.push("ellipsis1")
            }

            // Show current page and neighbors
            const startPage = Math.max(2, currentPage - 1)
            const endPage = Math.min(totalPages - 1, currentPage + 1)

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i)
            }

            if (currentPage < totalPages - 2) {
                // Show ellipsis if current page is away from end
                pageNumbers.push("ellipsis2")
            }

            // Always show last page
            pageNumbers.push(totalPages)
        }

        return pageNumbers
    }

    if (totalPages <= 1) return null

    return (
        <div className="flex justify-center items-center space-x-1 mt-8">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`flex items-center justify-center w-10 h-10 rounded-md transition-colors duration-200 
                    ${currentPage === 1
                        ? "text-gray-400 cursor-not-allowed bg-gray-100"
                        : "text-gray-700 hover:bg-gray-200 bg-gray-100"
                    }`}
                aria-label="Previous page"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>

            {getPageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                    {page === "ellipsis1" || page === "ellipsis2" ? (
                        <span className="flex items-center justify-center w-10 h-10 text-gray-500">
                            <MoreHorizontal className="h-5 w-5" />
                        </span>
                    ) : (
                        <button
                            onClick={() => onPageChange(page)}
                            className={`w-10 h-10 rounded-md transition-colors duration-200 font-medium
                                ${currentPage === page
                                    ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-sm"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            aria-current={currentPage === page ? "page" : undefined}
                            aria-label={`Page ${page}`}
                        >
                            {page}
                        </button>
                    )}
                </React.Fragment>
            ))}

            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center w-10 h-10 rounded-md transition-colors duration-200
                    ${currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed bg-gray-100"
                        : "text-gray-700 hover:bg-gray-200 bg-gray-100"
                    }`}
                aria-label="Next page"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    )
}

export default Pagination
