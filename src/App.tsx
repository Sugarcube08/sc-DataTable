import GenericDataTable from './components/GenericDataTable';

const App = () => {
  const columns = [
    { title: 'Serial', serial: true, render: (value: string | number | boolean) => <span className="font-bold text-lg">{value}</span> },
    { title: 'Title', dataIndex: 'title', sort: true },
    { title: 'Price', dataIndex: 'price', render: (value: string | number | boolean) => <a href='https://github.com/Sugarcube08/sc-DataTable' className="text-green-600 bg-blue-200 p-2 rounded-full border-2 font-bold">${value}</a>, sort: true },
    { title: 'Discount Percentage', dataIndex: 'discountPercentage' },
    { title: 'SKU', dataIndex: 'sku' },
    { title: 'Weight', dataIndex: 'weight' },
    { title: 'Width', dataIndex: 'dimensions.width' },
    { title: 'Height', dataIndex: 'dimensions.height' },
    { title: 'Depth', dataIndex: 'dimensions.depth' },
    { title: 'Created At', dataIndex: 'meta.createdAt' },
    { title: 'Updated At', dataIndex: 'meta.updatedAt' },
    { title: 'Barcode', dataIndex: 'meta.barcode' },
    { title: 'QR Code', dataIndex: 'meta.qrCode' },
  ];

  const payload = {
    limit: 5,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-6xl bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gradient bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
          CSV Data Viewer
        </h1>

        <div className="overflow-x-auto mb-6">
          <GenericDataTable
            api={{ url: 'https://dummyjson.com/products', method: 'GET' }}
            payload={payload}
            columns={columns}
            searchDebounce={1000} 
          />
        </div>
        <div className="overflow-x-auto mb-6 bg-gray-900 p-4 rounded-xl shadow-2xl">
          <GenericDataTable
            api={{ url: 'https://dummyjson.com/products', method: 'GET' }}
            payload={payload}
            columns={columns}
            searchDebounce={1000}
            replaceClasses={{
              theadClasses: "bg-gray-800 text-gray-200",
              thClasses: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-700",
              tbodyClasses: "divide-y divide-gray-700 bg-gray-900",
              tdClasses: "px-4 py-3 text-sm text-gray-300",
              rowOddClasses: "bg-gray-800/80 hover:bg-gray-700/80 transition duration-150",
              rowEvenClasses: "bg-gray-900/80 hover:bg-gray-700/80 transition duration-150",
            }}
          />
        </div>

        <div className="overflow-x-auto mb-6 bg-white p-4 rounded-lg shadow-lg">
          <GenericDataTable
            api={{ url: 'https://dummyjson.com/products', method: 'GET' }}
            payload={payload}
            columns={columns}
            searchDebounce={1000}
            replaceClasses={{
              theadClasses: "bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white shadow-md",
              thClasses: "px-6 py-3 text-center text-sm font-bold uppercase",
              tbodyClasses: "divide-y divide-gray-200 bg-white",
              tdClasses: "px-6 py-4 text-sm text-gray-800",
              rowOddClasses: "bg-white hover:bg-red-50 transition duration-200",
              rowEvenClasses: "bg-gray-50 hover:bg-red-50 transition duration-200",
              searchInputClasses: "w-full pl-10 pr-4 py-2 bg-white rounded-lg text-gray-800 placeholder-gray-500 border-4 border-transparent focus:outline-none focus:ring-0 relative",
              searchContainerClasses: "w-full flex justify-center mb-6",
            }}
          />
        </div>

        <div className="overflow-x-auto mb-6">
          <GenericDataTable
            api={{ url: 'https://dummyjson.com/products', method: 'GET' }}
            payload={payload}
            columns={columns}
            searchDebounce={1000}
            replaceClasses={{
              theadClasses: "bg-green-600 text-white",
              thClasses: "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider shadow-inner",
              tbodyClasses: "divide-y divide-green-200 bg-white border border-green-300",
              tdClasses: "px-4 py-2 text-sm text-green-800",
              rowOddClasses: "bg-green-50 hover:bg-green-100/70",
              rowEvenClasses: "bg-white hover:bg-green-100/70",
              searchInputClasses: "w-full pl-10 pr-4 py-2 bg-white border border-green-300 rounded-lg text-green-800 placeholder-green-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition shadow-lg",
              searchContainerClasses: "w-full flex justify-center mb-6"
            }}
          />
        </div>

        <div className="overflow-x-auto mb-6 border border-blue-200 rounded-md">
          <GenericDataTable
            api={{ url: 'https://dummyjson.com/products', method: 'GET' }}
            payload={payload}
            columns={columns}
            searchDebounce={1000}
            replaceClasses={{
              theadClasses: "bg-blue-50 text-blue-800 border-b border-blue-300",
              thClasses: "px-4 py-2 text-center text-xs font-semibold uppercase border-r border-blue-200",
              tbodyClasses: "divide-y divide-blue-100 bg-white",
              tdClasses: "px-4 py-2 text-sm text-gray-700 border-r border-blue-100",
              rowOddClasses: "bg-white hover:bg-blue-50",
              rowEvenClasses: "bg-blue-50/50 hover:bg-blue-50",
              searchInputClasses: "w-full pl-10 pr-4 py-2 bg-white border border-blue-300 rounded-lg text-blue-800 placeholder-blue-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-lg",
              searchContainerClasses: "w-full flex justify-center mb-6"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
