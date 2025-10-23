import React, { useState, useEffect, useMemo, useCallback } from 'react';

export type SortMode = "asc" | "desc" | "original" | null;

export type Column = {
    title: string;
    dataIndex: string;
    dataSrc?: string;
    sort?: boolean;
    render?: (value: any, row: any, rowIndex: number) => React.ReactNode;
};

export type ClassProps = {
    theadClasses?: string;
    tbodyClasses?: string;
    thClasses?: string;
    tdClasses?: string;
    rowOddClasses?: string;
    rowEvenClasses?: string;
    searchInputClasses?: string;
    searchContainerClasses?: string;
};

export type Payload = { skip: number; limit: number };

export type DataTableProps = {
    api: { url: string; method: "GET" | "POST" };
    columns: Column[];
    payload?: Partial<Payload>;
    pagination?: number | null;
    searchDebounce?: number | boolean;
    extendsClasses?: ClassProps;
    replaceClasses?: ClassProps;
    initialData?: any;
};

// Icons
const ChevronUp = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
        viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="m18 15-6-6-6 6" />
    </svg>
);
const ChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
        viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="m6 9 6 6 6-6" />
    </svg>
);
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
        viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
);

// Helpers
const getNestedValue = (obj: any, path: string): any =>
    path.split('.').reduce((acc, key) => acc?.[key], obj);

const parseApiResponse = (columns: Column[], apiResponse: any): any[] => {
    let dataSource: any[] = [];
    if (Array.isArray(apiResponse)) dataSource = apiResponse;
    else {
        const dataSrc = columns.find(c => c.dataSrc)?.dataSrc;
        if (dataSrc && Array.isArray(apiResponse[dataSrc])) dataSource = apiResponse[dataSrc];
        else if (Array.isArray(apiResponse.products)) dataSource = apiResponse.products;
        else dataSource = [apiResponse];
    }
    return dataSource.map(item =>
        Object.fromEntries(columns.map(col => [col.title, getNestedValue(item, col.dataIndex)]))
    );
};

const getClassName = (defaults: string, replace?: string, extend?: string) =>
    replace || (extend ? `${defaults} ${extend}` : defaults);

const GenericDataTable = ({
    api,
    pagination,
    columns,
    payload,
    searchDebounce = 500,
    extendsClasses,
    replaceClasses,
    initialData,
}: DataTableProps) => {
    const [data, setData] = useState<any[]>(() =>
        initialData ? parseApiResponse(columns, initialData) : []
    );
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(initialData?.total || 0);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortMode, setSortMode] = useState<SortMode>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(payload?.limit ?? pagination ?? 10);
    const totalPages = Math.max(Math.ceil(totalItems / rowsPerPage), 1);
    const startIndex = (page - 1) * rowsPerPage;

    const fetchData = useCallback(async () => {
        if (!api.url) return;
        setLoading(true);
        setError('');
        const skipAmount = (page - 1) * rowsPerPage;

        try {
            let url = api.url.replace(/\/$/, '');
            const params: any = {
                limit: rowsPerPage,
                skip: skipAmount,
                ...(sortKey && sortMode && sortMode !== 'original'
                    ? { sortBy: sortKey, order: sortMode }
                    : {}),
            };
            if (debouncedSearch.trim()) {
                url += '/search';
                params.q = debouncedSearch;
            }

            let options: RequestInit = { method: api.method };
            if (api.method === 'GET') {
                const query = new URLSearchParams({ ...payload, ...params } as any).toString();
                url += `?${query}`;
            } else {
                options = {
                    ...options,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...payload, ...params }),
                };
            }

            const res = await fetch(url, options);
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            const json = await res.json();

            setData(parseApiResponse(columns, json));
            setTotalItems(json.total || 0);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, [api, columns, page, rowsPerPage, sortKey, sortMode, debouncedSearch, payload]);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchTerm), typeof searchDebounce === "number" ? searchDebounce : 500);
        return () => clearTimeout(handler);
    }, [searchTerm, searchDebounce]);

    useEffect(() => { setPage(1); }, [debouncedSearch]);
    useEffect(() => { if (!initialData) fetchData(); }, [fetchData, initialData]);

    const handleSortClick = (key: string) => {
        let newMode: SortMode =
            sortKey === key ? (sortMode === 'asc' ? 'desc' : sortMode === 'desc' ? 'original' : 'asc') : 'asc';
        setSortKey(newMode === 'original' ? null : key);
        setSortMode(newMode === 'original' ? null : newMode);
        setPage(1);
    };

    const classes = useMemo(() => ({
        thead: getClassName(
            "bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white sticky top-0 z-10",
            replaceClasses?.theadClasses, extendsClasses?.theadClasses),
        th: getClassName(
            "px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide",
            replaceClasses?.thClasses, extendsClasses?.thClasses),
        tbody: getClassName("divide-y divide-gray-100 bg-white",
            replaceClasses?.tbodyClasses, extendsClasses?.tbodyClasses),
        td: getClassName("px-4 py-2 text-sm text-gray-800",
            replaceClasses?.tdClasses, extendsClasses?.tdClasses),
        rowOdd: getClassName("bg-gray-50 hover:bg-gray-100 transition-colors",
            replaceClasses?.rowOddClasses, extendsClasses?.rowOddClasses),
        rowEven: getClassName("bg-white hover:bg-gray-100 transition-colors",
            replaceClasses?.rowEvenClasses, extendsClasses?.rowEvenClasses),
        searchInput: getClassName(
            "w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-sm",
            replaceClasses?.searchInputClasses, extendsClasses?.searchInputClasses),
        searchContainer: getClassName(
            "w-full flex justify-center mb-6",
            replaceClasses?.searchContainerClasses, extendsClasses?.searchContainerClasses),
    }), [replaceClasses, extendsClasses]);

    const PaginationControls = () => (
        <div className="flex justify-center items-center gap-4 mt-4">
            <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-purple-600 transition">
                Previous
            </button>
            <span className="text-sm font-medium text-gray-700">
                Page {page} of {totalPages}
            </span>
            <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-purple-600 transition">
                Next
            </button>
        </div>
    );

    if (loading) return <div className="py-10 text-center text-gray-500">Loading...</div>;
    if (error) return <div className="py-10 text-center text-red-600">{error}</div>;

    return (
        <div className="p-4 bg-white rounded-xl shadow-xl border border-gray-100">
            {(searchDebounce || rowsPerPage < totalItems) && (
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                    {searchDebounce && (
                        <div className={`${classes.searchContainer} md:w-64`}>
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className={classes.searchInput}
                                />
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                            </div>
                        </div>
                    )}

                    <select
                        value={rowsPerPage}
                        onChange={e => setRowsPerPage(Number(e.target.value))}
                        className="w-full md:w-28 bg-white border border-gray-300 rounded-lg shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    >
                        {[payload?.limit ?? 10, 25, 50, 100].map(rpp => (
                            <option key={rpp} value={rpp}>{rpp}</option>
                        ))}
                    </select>

                    {rowsPerPage < totalItems && <PaginationControls />}
                </div>
            )}

            <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className={classes.thead}>
                        <tr>
                            {columns.map((col, idx) => {
                                const isSorted = sortKey === col.dataIndex;
                                const sortIcon = isSorted
                                    ? sortMode === "asc"
                                        ? <ChevronUp />
                                        : <ChevronDown />
                                    : <ChevronUp className="opacity-40" />;
                                return (
                                    <th key={idx} className={classes.th}>
                                        {col.sort ? (
                                            <button
                                                onClick={() => handleSortClick(col.dataIndex)}
                                                className="flex items-center justify-between w-full px-2 py-1 rounded-md hover:bg-black/10 transition"
                                            >
                                                <span>{col.title}</span>
                                                <span className={`ml-2 ${isSorted ? "text-white" : "text-gray-300"}`}>{sortIcon}</span>
                                            </button>
                                        ) : (
                                            <span>{col.title}</span>
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>

                    <tbody className={classes.tbody}>
                        {data.length > 0 ? data.map((row, i) => {
                            const rowClass = (startIndex + i) % 2 === 0 ? classes.rowEven : classes.rowOdd;
                            return (
                                <tr key={startIndex + i} className={rowClass}>
                                    {columns.map((col, j) => (
                                        <td key={j} className={classes.td}>
                                            {col.render ? col.render(row[col.title], row, startIndex + j) : row[col.title] ?? "-"}
                                        </td>
                                    ))}
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-8 text-gray-500 font-medium">
                                    No data available. {debouncedSearch && `(No results for "${debouncedSearch}")`}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GenericDataTable;
