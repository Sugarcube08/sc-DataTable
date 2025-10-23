import React, { useState, useEffect, useMemo, useCallback } from 'react';

// --- Type Definitions
type SortMode = "asc" | "desc" | "original" | null;

type Column = {
    title: string;
    dataIndex: string;
    src?: string;
    sort?: boolean; 
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
    skip: number;
    limit: number;
    sort?: { key: string; order: "asc" | "desc" } | null; 
    filters?: Record<string, string | number | boolean> | null;
};

type DataTableProps = {
    api: { url: string, method: 'GET' | 'POST' };
    columns: Column[];
    payload?: Partial<Payload>;
    pagination?: number | null;
    search?: number | boolean;
    extendsClasses?: ClassProps;
    replaceClasses?: ClassProps;
    initialData?: any;
};

// --- Icons (Same as original)
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

// --- Helpers (Same as original)
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
        else if (apiResponse.products && Array.isArray(apiResponse.products)) dataSource = apiResponse.products;
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
    search = 1000,
    extendsClasses,
    replaceClasses,
    initialData,
}: DataTableProps) => {

    const [data, setData] = useState<any[]>(() => initialData ? parseApiResponse(columns, initialData) : []);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState('');

    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(initialData?.total || 0);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortMode, setSortMode] = useState<SortMode>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // --- Dynamic Pagination Values
    const rowsPerPage = useMemo(() => {
        const limit = payload?.limit ?? pagination ?? 10;
        return (typeof limit === 'number' && limit > 0) ? limit : 10;
    }, [payload?.limit, pagination]);
    
    const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;
    const startIndex = (page - 1) * rowsPerPage;

    // --- Fetch Data (Server-Side Logic)
    const fetchData = useCallback(async () => {
        if (!api?.url) return;

        setLoading(true);
        setError('');

        const skipAmount = (page - 1) * rowsPerPage;
        
        try {
            let url = api.url;
            let fetchOptions: RequestInit = {};

            // 1. Define Sorting Parameters
            const sortParams = (sortKey && sortMode && sortMode !== 'original')
                ? { sortBy: sortKey, order: sortMode } 
                : {};
            const finalRequestParams: Record<string, string | number | boolean> = {
                limit: rowsPerPage, 
                skip: skipAmount,
                ...(debouncedSearch ? { q: debouncedSearch } : {}),
                ...sortParams, 
            };


            if (api.method === 'GET') {
                const finalGetParams = { ...payload, ...finalRequestParams }; 
                
                const params = new URLSearchParams(
                    Object.entries(finalGetParams)
                        .filter(([_, v]) => v != null)
                        .map(([k, v]) => [k, String(v)])
                );
                
                url += `?${params.toString()}`;
                fetchOptions = { method: 'GET' };

            } else {
                const finalPayload: Payload = {
                    ...payload,
                    ...finalRequestParams,
                } as Payload;

                fetchOptions = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(finalPayload),
                };
            }

            const res = await fetch(url, fetchOptions);
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            const json = await res.json();
            const parsedData = parseApiResponse(columns, json);
            setTotalItems(json.total || 0); 
            setData(parsedData); 
            
        } catch (err: any) {
            console.error('Server fetch error:', err);
            setError(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, [api.url, api.method, columns, page, rowsPerPage, sortKey, sortMode, debouncedSearch, payload]);

    useEffect(() => {
        if (!initialData) fetchData();
    }, [fetchData, initialData]);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchTerm), search);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        if (page !== 1) setPage(1);
        else fetchData();
    }, [debouncedSearch, sortKey, sortMode]);

    useEffect(() => {
        fetchData(); 
    }, [page, fetchData]);


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
    const theadClass = getClassName("bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white", replaceClasses?.theadClasses, extendsClasses?.theadClasses);
    const thClass = getClassName("px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide", replaceClasses?.thClasses, extendsClasses?.thClasses);
    const tbodyClass = getClassName("divide-y divide-gray-100 bg-white", replaceClasses?.tbodyClasses, extendsClasses?.tbodyClasses);
    const tdClass = getClassName("px-4 py-2 text-sm text-gray-800", replaceClasses?.tdClasses, extendsClasses?.tdClasses);
    const rowOddClass = getClassName("bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50 hover:bg-yellow-100/50", replaceClasses?.rowOddClasses, extendsClasses?.rowOddClasses);
    const rowEvenClass = getClassName("bg-gradient-to-r from-blue-50 via-green-50 to-teal-50 hover:bg-teal-100/50", replaceClasses?.rowEvenClasses, extendsClasses?.rowEvenClasses);
    const searchInputClass = getClassName("w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition shadow-lg", replaceClasses?.searchInputClasses, extendsClasses?.searchInputClasses);
    const searchContainerClass = getClassName("w-full flex justify-center mb-6", replaceClasses?.searchContainerClasses, extendsClasses?.searchContainerClasses);
    const paginatedRows = data; 
    const PaginationControls = () => (
        <div className="flex justify-center items-center gap-4 mt-4">
            <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-purple-600 transition"
            >
                Previous
            </button>
            <span className="text-sm font-medium text-gray-700">
                Page {page} of {totalPages}
            </span>
            <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-purple-600 transition"
            >
                Next
            </button>
        </div>
    );
    
    // --- Render Logic
    if (loading) return <div className="py-10 text-center">Loading...</div>;
    if (error) return <div className="py-10 text-center text-red-600">{error}</div>;
    if (!data || data.length === 0) return <div className="py-10 text-center text-gray-500">No data available</div>;

    return (
        <div className="p-4 bg-white rounded-xl shadow-2xl border border-gray-100">
            {(search || (rowsPerPage < totalItems)) && (
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
                    {rowsPerPage < totalItems && <PaginationControls />}
                </div>
            )}

            <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className={theadClass}>
                        <tr>
                            {columns.map((col, idx) => {
                                const isSortable = col.sort === true; 
                                const isSorted = sortKey === col.dataIndex; 
                                const sortIcon = isSorted
                                    ? (sortMode === "asc" ? <ChevronUp /> : <ChevronDown />)
                                    : <ChevronUp className="opacity-50" />;
                                const iconColor = isSorted ? 'text-white' : 'text-gray-200 opacity-50';

                                return (
                                    <th key={idx} className={thClass}>
                                        {isSortable ? (
                                            <button
                                                onClick={() => handleSortClick(col.dataIndex)}
                                                className="flex items-center justify-between w-full p-2 -my-2 -ml-4 pl-4 transition hover:bg-black/10 rounded-lg cursor-pointer"
                                            >
                                                <span className="truncate">{col.title}</span>
                                                <span className={`ml-2 transition duration-200 ${iconColor}`}>{sortIcon}</span>
                                            </button>
                                        ) : (
                                            <span className="truncate">{col.title}</span>
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className={tbodyClass}>
                        {paginatedRows.map((row, i) => {
                            const rowClass = (startIndex + i) % 2 === 0 ? rowEvenClass : rowOddClass;
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
            {rowsPerPage < totalItems && <PaginationControls />}
        </div>
    );
};

export default GenericDataTable;