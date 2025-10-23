import GenericDataTable from './components/GenericDataTable';

const App = () => {

  const columns = [
    { title: 'Title', dataIndex: 'title', src: 'products' },
    { title: 'Price', dataIndex: 'price', src: 'products' },
    { title: 'Discount Percentage', dataIndex: 'discountPercentage', src: 'products' },
    { title: 'SKU', dataIndex: 'sku', src: 'products' },
    { title: 'Weight', dataIndex: 'weight', src: 'products' },
    { title: 'Width', dataIndex: 'dimensions.width', src: 'products' },
    { title: 'Height', dataIndex: 'dimensions.height', src: 'products' },
    { title: 'Depth', dataIndex: 'dimensions.depth', src: 'products' },
    { title: 'Created At', dataIndex: 'meta.createdAt', src: 'products' },
    { title: 'Updated At', dataIndex: 'meta.updatedAt', src: 'products' },
    { title: 'Barcode', dataIndex: 'meta.barcode', src: 'products' },
    { title: 'QR Code', dataIndex: 'meta.qrCode', src: 'products' },
  ];

  const payload = {
    page: 1,
    per_page: 5,
    filters: null,
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
            search={true}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
