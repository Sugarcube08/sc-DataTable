import React, { useMemo, useState } from 'react';

// Type Definitions
type SortMode = "asc" | "desc" | "original" | null;

// Define a type for the class structure to reuse it
type ClassProps = {
    theadClasses?: string
    tbodyClasses?: string
    thClasses?: string
    tdClasses?: string
    rowOddClasses?: string
    rowEvenClasses?: string
}

type DataTableProps = {
    data: any[]
    sorting?: boolean
    pagination?: number | null
    extendsClasses?: ClassProps
    replaceClasses?: ClassProps
}

// icons
const ChevronUp = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>;
const ChevronDown = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>;

// sorting function
const sortJSONRows = (rows: any[], key: string, mode: SortMode) => {
    return [...rows].sort((a, b) => {
        const valA = a[key], valB = b[key];

        if (valA == null && valB == null) return 0;
        if (valA == null) return mode === "asc" ? -1 : 1;
        if (valB == null) return mode === "asc" ? 1 : -1;
        
        // Use a more robust check for number sorting: 
        // Only treat as number if the value is explicitly a number or a string that safely converts to a number 
        // and is not the result of coercing a non-numeric string (which is already handled by localeCompare).
        const aNum = Number(valA);
        const bNum = Number(valB);
        if (typeof valA === 'number' && typeof valB === 'number' || (!isNaN(aNum) && !isNaN(bNum) && typeof valA !== 'string' && typeof valB !== 'string')) {
             return mode === "asc" ? aNum - bNum : bNum - aNum;
        }

        // Fallback to localeCompare for strings and mixed types
        const aStr = String(valA), bStr = String(valB);
        const comparison = aStr.localeCompare(bStr, undefined, { sensitivity: "base", numeric: true });
        return mode === "asc" ? comparison : -comparison;
    });
};


// Main
const GenericDataTable = ({
    data,
    sorting = true, // Defaulting sorting to true
    pagination,
    extendsClasses,
    replaceClasses,
}: DataTableProps) => {

    const isPaginationEnabled = typeof pagination === 'number' && pagination > 0;
    // rowsPerPage will be 'pagination' value if enabled, otherwise all data
    const rowsPerPage = isPaginationEnabled ? pagination : data.length || 10;
    const [page, setPage] = useState(1);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortMode, setSortMode] = useState<SortMode>(null);

    if (!data || data.length === 0) return null;
    const headers = Object.keys(data[0]);

    // default Styling (Tailwind CSS classes)
    const defaultTheadClasses = "bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white";
    const defaultThClasses = "px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide";
    const defaultTbodyClasses = "divide-y divide-gray-100 bg-white";
    const defaultTdClasses = "px-4 py-2 text-sm text-gray-800";
    const defaultRowOddClasses = "bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50 hover:from-purple-100 hover:via-pink-100 hover:to-yellow-100";
    const defaultRowEvenClasses = "bg-gradient-to-r from-blue-50 via-green-50 to-teal-50 hover:from-purple-100 hover:via-pink-100 hover:to-yellow-100";

    /**
     * Helper function to compute the final class name based on the required logic.
     * On replace: replace the default/fallback classes.
     * On extend: append to the default/fallback classes.
     */
    const getClassName = (defaultClasses: string, replace?: string, extend?: string) => {
        // 1. If replace is provided, use it exclusively
        if (replace) return replace;
        // 2. If extend is provided, append it to defaultClasses
        if (extend) return `${defaultClasses} ${extend}`;
        // 3. Otherwise, use the default classes
        return defaultClasses;
    };

    // Computed Class Names
    const theadClass = getClassName(defaultTheadClasses, replaceClasses?.theadClasses, extendsClasses?.theadClasses);
    const thClass = getClassName(defaultThClasses, replaceClasses?.thClasses, extendsClasses?.thClasses);
    const tbodyClass = getClassName(defaultTbodyClasses, replaceClasses?.tbodyClasses, extendsClasses?.tbodyClasses);
    const tdClass = getClassName(defaultTdClasses, replaceClasses?.tdClasses, extendsClasses?.tdClasses);
    const rowOddClass = getClassName(defaultRowOddClasses, replaceClasses?.rowOddClasses, extendsClasses?.rowOddClasses);
    const rowEvenClass = getClassName(defaultRowEvenClasses, replaceClasses?.rowEvenClasses, extendsClasses?.rowEvenClasses);


    // Memoized Sorted Data 
    const sortedData = useMemo(() => {
        // Check both `sorting` prop and internal state
        if (!sorting || !sortKey || sortMode === "original" || sortMode === null) {
            return data;
        }
        return sortJSONRows(data, sortKey, sortMode);
    }, [data, sorting, sortKey, sortMode]);

    // Sorting Handler 
    const handleSortClick = (key: string) => {
        let newMode: SortMode;
        if (sortKey === key) {
            // Cycle: asc -> desc -> original -> asc
            newMode = sortMode === "asc" ? "desc" : sortMode === "desc" ? "original" : "asc";
        } else {
            // New column: start with asc
            newMode = "asc";
        }

        if (newMode === "original" || newMode === null) {
            setSortKey(null);
            setSortMode(null);
        } else {
            setSortKey(key);
            setSortMode(newMode);
        }
        setPage(1); // Reset to first page on sort change
    };

    const totalRows = sortedData.length;
    const rowsToDisplay = rowsPerPage;
    // Ensure totalPages is at least 1 if there's data, or 1 if no data but for display purposes
    const totalPages = Math.ceil(totalRows / rowsToDisplay) || 1; 
    const startIndex = (page - 1) * rowsToDisplay;
    const paginatedRows = sortedData.slice(startIndex, startIndex + rowsToDisplay);

    // Conditional Rendering for Pagination Controls 
    const PaginationControls = isPaginationEnabled && (
        <div className="flex justify-end p-2 text-sm">
            <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 disabled:opacity-50 text-purple-600 hover:text-purple-800 transition-colors"
            >
                Previous
            </button>
            <span className="p-2 text-gray-700">Page {page} of {totalPages}</span>
            <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 disabled:opacity-50 text-purple-600 hover:text-purple-800 transition-colors"
            >
                Next
            </button>
        </div>
    );

    return (
        <div className="p-4 bg-gray-50 rounded-lg shadow-2xl">
            {PaginationControls}

            <table className="min-w-full divide-y divide-gray-200 rounded-xl overflow-hidden shadow-lg">
                {/* THEAD with Conditional Styling */}
                <thead className={theadClass}>
                    <tr>
                        {headers.map((header, idx) => {
                            const isSorted = sorting && sortKey === header;
                            const isSortable = sorting;

                            const headerContent = (
                                <div className="flex items-center justify-between">
                                    <span className="truncate">{header}</span>
                                    {/* Sorting Icons */}
                                    {isSortable && (
                                        <span className={`ml-2 transition duration-200 ${isSorted ? 'text-white' : 'text-gray-200 opacity-50'}`}>
                                            {/* Show current sort icon if sorted, otherwise show a dimmed up chevron as indicator */}
                                            {isSorted 
                                                ? (sortMode === "asc" ? <ChevronUp /> : <ChevronDown />) 
                                                : <ChevronUp className="opacity-50" />}
                                        </span>
                                    )}
                                </div>
                            );

                            return (
                                // TH with Conditional Styling
                                <th
                                    key={idx}
                                    className={thClass}
                                >
                                    {isSortable ? (
                                        <button
                                            onClick={() => handleSortClick(header)}
                                            // Ensure button spans the full width of the TH for a good click target
                                            className="flex items-center w-full py-1 -ml-4 pl-4 transition hover:bg-black/10 rounded-lg cursor-pointer group"
                                        >
                                            {headerContent}
                                        </button>
                                    ) : (
                                        headerContent
                                    )}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody className={tbodyClass}>
                    {paginatedRows.map((row: any, i: number) => {
                        // Determine row class based on index and computed class variables
                        const rowClass =
                            startIndex + i % 2 === 0
                                ? rowEvenClass
                                : rowOddClass;

                        return (
                            <tr
                                key={i}
                                className={`transition-colors duration-200 ${rowClass}`}
                            >
                                {headers.map((header, j) => (
                                    // TD with Conditional Styling
                                    <td key={j} className={tdClass}>
                                        {row[header] ?? '-'}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                    {paginatedRows.length === 0 && (
                        <tr><td colSpan={headers.length} className="py-8 text-center text-gray-500">No data available on this page.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default GenericDataTable;