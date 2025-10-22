import { useEffect, useState } from 'react';
import GenericDataTable from './components/GenericDataTable';

const App = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setdata] = useState([]);

  useEffect(() => {
    fetch('data.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(json => {
        setdata(json);
      })
      .catch(err => {
        console.error('Error:', err);
        setError('Failed to load data. Please check the file path or format.');
      })
      .finally(() => setLoading(false));
  }, []);

  console.log('json Data:', data);
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-6xl bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gradient bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
          CSV Data Viewer
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500 border-opacity-70"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 font-medium">{error}</div>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-500 italic">No data found.</p>
        ) : (
          <><div className="overflow-x-auto mb-6">
            <GenericDataTable
              data={data}
              sorting={false}
              pagination={10}
            />
          </div>
            <div className="overflow-x-auto mb-6 bg-gray-900 p-4 rounded-xl shadow-2xl">
              <GenericDataTable
                data={data}
                sorting={true}
                pagination={15}
                // Styling Props: Dark/Monochromatic (Rectified to use replaceClasses object)
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
                data={data}
                sorting={true}
                pagination={10}
                // Styling Props: Vibrant Header, Simple Body (Rectified to use replaceClasses object)
                replaceClasses={{
                  theadClasses: "bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white shadow-md",
                  thClasses: "px-6 py-3 text-center text-sm font-bold uppercase",
                  tbodyClasses: "divide-y divide-gray-200 bg-white",
                  tdClasses: "px-6 py-4 text-sm text-gray-800",
                  rowOddClasses: "bg-white hover:bg-red-50 transition duration-200",
                  rowEvenClasses: "bg-gray-50 hover:bg-red-50 transition duration-200",
                }}
              />
            </div>
            <div className="overflow-x-auto mb-6">
              <GenericDataTable
                data={data}
                sorting={true}
                pagination={5}
                // Styling Props: Green Theme (Rectified to use replaceClasses object)
                replaceClasses={{
                  theadClasses: "bg-green-600 text-white",
                  thClasses: "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider shadow-inner",
                  tbodyClasses: "divide-y divide-green-200 bg-white border border-green-300",
                  tdClasses: "px-4 py-2 text-sm text-green-800",
                  rowOddClasses: "bg-green-50 hover:bg-green-100/70",
                  rowEvenClasses: "bg-white hover:bg-green-100/70",
                }}
              />
            </div>
            <div className="overflow-x-auto mb-6 border border-blue-200 rounded-md">
              <GenericDataTable
                data={data}
                sorting={false} // Turning sorting off for this style example
                pagination={20}
                // Styling Props: Bordered/Blueprint (Rectified to use replaceClasses object)
                replaceClasses={{
                  theadClasses: "bg-blue-50 text-blue-800 border-b border-blue-300",
                  thClasses: "px-4 py-2 text-center text-xs font-semibold uppercase border-r border-blue-200",
                  tbodyClasses: "divide-y divide-blue-100 bg-white",
                  tdClasses: "px-4 py-2 text-sm text-gray-700 border-r border-blue-100",
                  rowOddClasses: "bg-white hover:bg-blue-50",
                  rowEvenClasses: "bg-blue-50/50 hover:bg-blue-50",
                }}
              />
            </div>
            <details className="bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 rounded-lg p-4 border border-gray-200">
              <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                Raw JSON Data
              </summary>
              <pre className="text-sm text-gray-700 overflow-x-auto mt-2">
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
