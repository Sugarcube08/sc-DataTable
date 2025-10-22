import React, { useState, useEffect, useMemo } from 'react';

// Type Definitions
type SortMode = "asc" | "desc" | "original" | null;

type ClassProps = {
    theadClasses?: string;
    tbodyClasses?: string;
    thClasses?: string;
    tdClasses?: string;
    rowOddClasses?: string;
    rowEvenClasses?: string;
    searchInputClasses?: string;
    searchContainerClasses?: string;
};

type DataTableProps = {
    api: { url: string };
    sorting?: boolean;
    pagination?: number | null;
    search?: boolean;
    extendsClasses?: ClassProps;
    replaceClasses?: ClassProps;
};

// Icons (No change)
const ChevronUp = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 15-6-6-6 6" />
    </svg>
);
const ChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
    </svg>
);
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
);

// Sorting function (Reverted to a simpler, more robust number check)
const sortJSONRows = (rows: any[], key: string, mode: SortMode) => {
    if (mode === "original" || mode === null) return rows; // Safety check
    return [...rows].sort((a, b) => {
        const valA = a[key], valB = b[key];

        // Handle null/undefined values
        if (valA == null && valB == null) return 0;
        if (valA == null) return mode === "asc" ? 1 : -1;
        if (valB == null) return mode === "asc" ? -1 : 1;

        // Robust number check (handles numeric strings)
        const aIsNum = !isNaN(Number(valA)) && !isNaN(parseFloat(String(valA)));
        const bIsNum = !isNaN(Number(valB)) && !isNaN(parseFloat(String(valB)));

        if (aIsNum && bIsNum) {
            const aNum = Number(valA);
            const bNum = Number(valB);
            return mode === "asc" ? aNum - bNum : bNum - aNum;
        }

        // Default to string comparison (numerical-aware)
        const aStr = String(valA), bStr = String(valB);
        const comparison = aStr.localeCompare(bStr, undefined, { sensitivity: "base", numeric: true });
        return mode === "asc" ? comparison : -comparison;
    });
};

// Class Helper (Re-added)
const getClassName = (defaultClasses: string, replace?: string, extend?: string) => {
    if (replace) return replace;
    if (extend) return `${defaultClasses} ${extend}`;
    return defaultClasses;
};

const GenericDataTable = ({
    api,
    sorting = true,
    pagination,
    search = true,
    extendsClasses,
    replaceClasses,
}: DataTableProps) => {

    // State for fetch, data, error
    const [data, setData] = useState<any[]>([]);
    // Added: Stores the original fetched data for the 'original' sort mode
    const [originalData, setOriginalData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Pagination & Sorting
    const [page, setPage] = useState(1);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortMode, setSortMode] = useState<SortMode>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Fetch data from API
    // --- Core Function for complete SSR Model
    // - - - - - - - - - - - - - - -
    useEffect(() => {
        let ignore = false;
        if (!api?.url) {
            setError("API URL not provided");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(api.url);
                if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                const json = await res.json();
                if (!Array.isArray(json)) throw new Error('API response is not an array');
                if (!ignore) {
                    setData(json);
                    setOriginalData(json); // Store original data
                }
            } catch (err: any) {
                console.error('Server fetch error:', err);
                if (!ignore) setError(err.message || 'Failed to fetch data');
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        fetchData();
        return () => { ignore = true; };
    }, [api.url]);

    // Debounced search & Page reset (No change)
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => setPage(1), [debouncedSearch, sortKey, sortMode]);

    // Default Styling & Class Application (Re-added)
    const defaultTheadClasses = "bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white";
    const defaultThClasses = "px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide";
    const defaultTbodyClasses = "divide-y divide-gray-100 bg-white";
    const defaultTdClasses = "px-4 py-2 text-sm text-gray-800";
    // Simplified hover for better striping visibility
    const defaultRowOddClasses = "bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50 hover:bg-yellow-100/50";
    const defaultRowEvenClasses = "bg-gradient-to-r from-blue-50 via-green-50 to-teal-50 hover:bg-teal-100/50";
    const defaultSearchInputClasses = "w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition shadow-lg";
    const defaultSearchContainerClasses = "w-full flex justify-center mb-6";
    const searchIconColor = 'text-gray-500';

    const theadClass = getClassName(defaultTheadClasses, replaceClasses?.theadClasses, extendsClasses?.theadClasses);
    const thClass = getClassName(defaultThClasses, replaceClasses?.thClasses, extendsClasses?.thClasses);
    const tbodyClass = getClassName(defaultTbodyClasses, replaceClasses?.tbodyClasses, extendsClasses?.tbodyClasses);
    const tdClass = getClassName(defaultTdClasses, replaceClasses?.tdClasses, extendsClasses?.tdClasses);
    const rowOddClass = getClassName(defaultRowOddClasses, replaceClasses?.rowOddClasses, extendsClasses?.rowOddClasses);
    const rowEvenClass = getClassName(defaultRowEvenClasses, replaceClasses?.rowEvenClasses, extendsClasses?.rowEvenClasses);
    const searchInputClass = getClassName(defaultSearchInputClasses, replaceClasses?.searchInputClasses, extendsClasses?.searchInputClasses);
    const searchContainerClass = getClassName(defaultSearchContainerClasses, replaceClasses?.searchContainerClasses, extendsClasses?.searchContainerClasses);


    // Memoized filtered & sorted data (Updated to use originalData)
    const filteredAndSortedData = useMemo(() => {
        // Start with original data to ensure 'original' sort mode works
        let currentData = originalData;

        if (search && debouncedSearch) {
            const lower = debouncedSearch.toLowerCase();
            currentData = currentData.filter(row =>
                Object.values(row).some(cell =>
                    cell != null && String(cell).toLowerCase().includes(lower)
                )
            );
        }
        // Only sort if sorting is enabled, a key is set, and mode is asc/desc
        if (sorting && sortKey && (sortMode === "asc" || sortMode === "desc")) {
            currentData = sortJSONRows(currentData, sortKey, sortMode);
        }
        return currentData;
    }, [originalData, search, debouncedSearch, sorting, sortKey, sortMode]);

    // Pagination (Fixed to use filteredAndSortedData)
    const rowsPerPage = (typeof pagination === 'number' && pagination > 0) ? pagination : filteredAndSortedData.length;
    const totalRows = filteredAndSortedData.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
    const startIndex = (page - 1) * rowsPerPage;
    const paginatedRows = filteredAndSortedData.slice(startIndex, startIndex + rowsPerPage);


    // Render early states
    if (loading) return <div className="py-10 text-center">Loading...</div>;
    if (error) return <div className="py-10 text-center text-red-600">{error}</div>;
    // Use originalData for initial check
    if (!originalData || originalData.length === 0) return <div className="py-10 text-center text-gray-500">No data available</div>;

    const headers = Object.keys(originalData[0]); // Use originalData to get headers reliably

    // Sorting click (Fixed to cycle asc -> desc -> original (null))
    const handleSortClick = (key: string) => {
        let newMode: SortMode;
        if (sortKey === key) {
            // Cycle: asc -> desc -> original (null)
            newMode = sortMode === "asc" ? "desc" : sortMode === "desc" ? "original" : "asc";
        } else {
            // New key always starts with asc
            newMode = "asc";
        }

        if (newMode === "original" || newMode === null) {
            setSortKey(null); setSortMode(null);
        } else {
            setSortKey(key); setSortMode(newMode);
        }
    };

    // Pagination Controls Component (Re-added informative summary)
    const PaginationControls = (
        <div className="flex justify-between items-center p-2 text-sm border-t border-gray-200 mt-4">
            <span className="text-gray-600">
                Showing {Math.min(totalRows, startIndex + 1)} to {Math.min(totalRows, startIndex + rowsPerPage)} of {totalRows} entries
            </span>
            <div className="flex items-center">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 disabled:opacity-50 text-purple-600 hover:text-purple-800 transition-colors border rounded-l-lg"
                >
                    Previous
                </button>
                <span className="p-2 text-gray-700 border-t border-b">Page {page} of {totalPages}</span>
                <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="p-2 disabled:opacity-50 text-purple-600 hover:text-purple-800 transition-colors border rounded-r-lg"
                >
                    Next
                </button>
            </div>
        </div>
    );

    console.log("paginatedRows", paginatedRows);

    return (
<div className="p-4 bg-white rounded-xl shadow-2xl border border-gray-100">
    {(search || (pagination && totalPages > 1)) && (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            
            {/* Search Input (Takes full width up to medium size) */}
            {search && (
                <div className={`${searchContainerClass} !w-full md:!w-auto md:max-w-xs !m-0`}>
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search data..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className={searchInputClass}
                        />
                        <SearchIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${searchIconColor}`} />
                    </div>
                </div>
            )}
            
            {/* Additional Controls Placeholder (e.g., Export Button) */}
            {/* <div className="flex space-x-2">
                <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">Export</button>
            </div> */}
        </div>
    )}

    {/* Table Container */}
    <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className={theadClass}>
                <tr>
                    {headers.map((header, idx) => {
                        const isSorted = sorting && sortKey === header;

                        let sortIcon = <ChevronUp className="opacity-50" />;
                        if (isSorted) {
                            sortIcon = sortMode === "asc" ? <ChevronUp /> : <ChevronDown />;
                        }
                        const iconColor = isSorted ? 'text-white' : 'text-gray-200 opacity-50';

                        const headerContent = (
                            <div className="flex items-center justify-between">
                                <span className="truncate">{header}</span>
                                {sorting && (
                                    <span className={`ml-2 transition duration-200 ${iconColor}`}>
                                        {sortIcon}
                                    </span>
                                )}
                            </div>
                        );

                        return (
                            <th key={idx} className={thClass}>
                                {sorting ? (
                                    <button
                                        onClick={() => handleSortClick(header)}
                                        className="flex items-center w-full p-2 -my-2 -ml-4 pl-4 transition hover:bg-black/10 rounded-lg cursor-pointer"
                                    >
                                        {headerContent}
                                    </button>
                                ) : headerContent}
                            </th>
                        );
                    })}
                </tr>
            </thead >
            <tbody className={tbodyClass}>
                {paginatedRows.map((row, i) => {
                    const rowClass = (i) % 2 === 0 ? rowEvenClass : rowOddClass;
                    return (
                        <tr key={startIndex + i} className={`transition-colors duration-200 ${rowClass}`}>
                            {headers.map((header, j) => <td key={j} className={tdClass}>{row[header] ?? '-'}</td>)}
                        </tr>
                    );
                })}
                {paginatedRows.length === 0 && (
                    <tr><td colSpan={headers.length} className="py-8 text-center text-gray-500">No results found.</td></tr>
                )}
            </tbody>
        </table>
    </div>

    {/* -- UX IMPROVEMENT: Pagination Controls --
      The controls are now rendered inside a dedicated component 
      which should handle the 'Showing X of Y' text and the buttons.
      The previous fixed version already introduced the `PaginationControls` component 
      (which is not shown here, but assumed to exist).
    */}
    {(pagination && totalPages > 1) && PaginationControls}
</div>
    );
};

export default GenericDataTable;