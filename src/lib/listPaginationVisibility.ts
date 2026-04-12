/** Row counts at or below this hide per-page controls and the "Showing x–y of z" summary. */
export const LIST_PAGINATION_FOOTER_MIN_ROWS = 20;

/**
 * Whether to show list footer chrome: "Items per page", row range summary, and bottom pagination.
 * Uses filtered count so small result sets (e.g. 4 of 4) stay clean, while workflow lists still
 * show controls when the server total exceeds the threshold even if the current page is smaller.
 */
export function shouldShowListPaginationFooter(options: {
    filteredRowCount: number;
    /** Full dataset size (e.g. Redux totalEntries or unfiltered client list length). */
    logicalTotalCount: number;
}): boolean {
    return (
        options.filteredRowCount > LIST_PAGINATION_FOOTER_MIN_ROWS ||
        options.logicalTotalCount > LIST_PAGINATION_FOOTER_MIN_ROWS
    );
}
