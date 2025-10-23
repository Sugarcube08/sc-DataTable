import React, { useState, useEffect, useMemo } from 'react';

// --- Type Definitions
type SortMode = "asc" | "desc" | "original" | null;

type Column = {
    title: string;
    dataIndex: string;
    src?: string;
    sorting?: boolean;
}

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

type Payload = {
    page: number;
    per_page: number;
    sort?: { key: string; order: "asc" | "desc" } | null;
    filters?: Record<string, string | number | boolean> | null;
}

type DataTableProps = {
    api: { url: string, method: 'GET' | 'POST' };
    columns: Column[];
    payload?: Payload;
    pagination?: number | null;
    search?: boolean;
    extendsClasses?: ClassProps;
    replaceClasses?: ClassProps;
    initialData?: any;
};

// --- Icons
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

// --- Helpers
const getNestedValue = (obj: any, path: string): any => {
    if (!obj || !path) return undefined;
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
};

const parseApiResponse = (columns: Column[], apiResponse: any): any[] => {
    let dataSource: any[] = [];

    if (Array.isArray(apiResponse)) dataSource = apiResponse;
    else {
        const src = columns.find(c => c.src)?.src;
        if (src && Array.isArray(apiResponse[src])) dataSource = apiResponse[src];
        else dataSource = [apiResponse];
    }

    return dataSource.map((item: any) => {
        const row: Record<string, any> = {};
        columns.forEach(col => {
            row[col.title] = getNestedValue(item, col.dataIndex);
        });
        return row;
    });
};

const sortJSONRows = (rows: any[], key: string, mode: SortMode) => {
    if (mode === "original" || mode === null) return rows;
    return [...rows].sort((a, b) => {
        const valA = a[key], valB = b[key];
        if (valA == null && valB == null) return 0;
        if (valA == null) return mode === "asc" ? 1 : -1;
        if (valB == null) return mode === "asc" ? -1 : 1;

        const aIsNum = !isNaN(Number(valA)) && !isNaN(parseFloat(String(valA)));
        const bIsNum = !isNaN(Number(valB)) && !isNaN(parseFloat(String(valB)));

        if (aIsNum && bIsNum) {
            return mode === "asc" ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
        }

        return mode === "asc"
            ? String(valA).localeCompare(String(valB), undefined, { sensitivity: "base", numeric: true })
            : String(valB).localeCompare(String(valA), undefined, { sensitivity: "base", numeric: true });
    });
};

const getClassName = (defaultClasses: string, replace?: string, extend?: string) => {
    if (replace) return replace;
    if (extend) return `${defaultClasses} ${extend}`;
    return defaultClasses;
};

// --- Main Component
const GenericDataTable = ({
    api,
    pagination,
    columns,
    payload,
    search = true,
    extendsClasses,
    replaceClasses,
    initialData,
}: DataTableProps) => {

    const [data, setData] = useState<any[]>(() => initialData ? parseApiResponse(columns, initialData) : []);
    const [originalData, setOriginalData] = useState<any[]>(() => initialData ? parseApiResponse(columns, initialData) : []);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState('');

    const [page, setPage] = useState(1);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortMode, setSortMode] = useState<SortMode>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // --- Fetch Data (with payload)
    const fetchData = async (customPayload?: Partial<Payload>) => {
        if (!api?.url) return;

        setLoading(true);
        setError('');

        try {
            let url = api.url;
            let fetchOptions: RequestInit = {};

            // If method is GET, append query params
            if (api.method === 'GET') {
                const params = new URLSearchParams({
                    page: String(page),
                    per_page: String(pagination ?? 10),
                    ...(debouncedSearch ? { q: debouncedSearch } : {}),
                });
                url += `?${params.toString()}`;
                fetchOptions = { method: 'GET' };
            } else {
                // POST payload
                const finalPayload: Payload = {
                    page,
                    per_page: pagination ?? 10,
                    sort: sortKey ? { key: sortKey, order: sortMode ?? "asc" } : null,
                    filters: debouncedSearch ? { q: debouncedSearch } : null,
                    ...payload,
                    ...customPayload,
                };

                fetchOptions = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(finalPayload),
                };
            }

            const res = await fetch(url, fetchOptions);
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            const json = await res.json();
            const parsed = parseApiResponse(columns, json);

            setData(parsed);
            setOriginalData(parsed);

        } catch (err: any) {
            console.error('Server fetch error:', err);
            setError(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!initialData) fetchData();
    }, [api.url, columns, page, sortKey, sortMode, debouncedSearch]);

    // --- Debounce search
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => setPage(1), [debouncedSearch, sortKey, sortMode]);

    // --- Classes
    const theadClass = getClassName("bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white", replaceClasses?.theadClasses, extendsClasses?.theadClasses);
    const thClass = getClassName("px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide", replaceClasses?.thClasses, extendsClasses?.thClasses);
    const tbodyClass = getClassName("divide-y divide-gray-100 bg-white", replaceClasses?.tbodyClasses, extendsClasses?.tbodyClasses);
    const tdClass = getClassName("px-4 py-2 text-sm text-gray-800", replaceClasses?.tdClasses, extendsClasses?.tdClasses);
    const rowOddClass = getClassName("bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50 hover:bg-yellow-100/50", replaceClasses?.rowOddClasses, extendsClasses?.rowOddClasses);
    const rowEvenClass = getClassName("bg-gradient-to-r from-blue-50 via-green-50 to-teal-50 hover:bg-teal-100/50", replaceClasses?.rowEvenClasses, extendsClasses?.rowEvenClasses);
    const searchInputClass = getClassName("w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition shadow-lg", replaceClasses?.searchInputClasses, extendsClasses?.searchInputClasses);
    const searchContainerClass = getClassName("w-full flex justify-center mb-6", replaceClasses?.searchContainerClasses, extendsClasses?.searchContainerClasses);

    // --- Filter & Sort
    const filteredAndSortedData = useMemo(() => {
        let currentData = originalData;

        if (search && debouncedSearch) {
            const lower = debouncedSearch.toLowerCase();
            currentData = currentData.filter(row =>
                Object.values(row).some(cell =>
                    cell != null && String(cell).toLowerCase().includes(lower)
                )
            );
        }

        if (sortKey && (sortMode === "asc" || sortMode === "desc")) {
            currentData = sortJSONRows(currentData, sortKey, sortMode);
        }

        return currentData;
    }, [originalData, search, debouncedSearch, sortKey, sortMode]);

    const rowsPerPage = (typeof pagination === 'number' && pagination > 0) ? pagination : filteredAndSortedData.length;
    const totalRows = filteredAndSortedData.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
    const startIndex = (page - 1) * rowsPerPage;
    const paginatedRows = filteredAndSortedData.slice(startIndex, startIndex + rowsPerPage);

    const handleSortClick = (key: string) => {
        let newMode: SortMode;
        if (sortKey === key) {
            newMode = sortMode === "asc" ? "desc" : sortMode === "desc" ? "original" : "asc";
        } else newMode = "asc";

        if (newMode === "original" || newMode === null) {
            setSortKey(null);
            setSortMode(null);
        } else {
            setSortKey(key);
            setSortMode(newMode);
        }
    };

    if (loading) return <div className="py-10 text-center">Loading...</div>;
    if (error) return <div className="py-10 text-center text-red-600">{error}</div>;
    if (!originalData || originalData.length === 0) return <div className="py-10 text-center text-gray-500">No data available</div>;

    return (
        <div className="p-4 bg-white rounded-xl shadow-2xl border border-gray-100">
            {(search || (pagination && totalPages > 1)) && (
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
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
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className={theadClass}>
                        <tr>
                            {columns.map((col, idx) => {
                                const isSorted = sortKey === col.title;
                                const sortIcon = isSorted
                                    ? (sortMode === "asc" ? <ChevronUp /> : <ChevronDown />)
                                    : <ChevronUp className="opacity-50" />;
                                const iconColor = isSorted ? 'text-white' : 'text-gray-200 opacity-50';

                                return (
                                    <th key={idx} className={thClass}>
                                        <button
                                            onClick={() => handleSortClick(col.title)}
                                            className="flex items-center justify-between w-full p-2 -my-2 -ml-4 pl-4 transition hover:bg-black/10 rounded-lg cursor-pointer"
                                        >
                                            <span className="truncate">{col.title}</span>
                                            <span className={`ml-2 transition duration-200 ${iconColor}`}>{sortIcon}</span>
                                        </button>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className={tbodyClass}>
                        {paginatedRows.map((row, i) => {
                            const rowClass = i % 2 === 0 ? rowEvenClass : rowOddClass;
                            return (
                                <tr key={startIndex + i} className={`transition-colors duration-200 ${rowClass}`}>
                                    {columns.map((col, j) => (
                                        <td key={j} className={tdClass}>{row[col.title] ?? '-'}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GenericDataTable;
