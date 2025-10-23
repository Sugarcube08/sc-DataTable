# GenericDataTable

**GenericDataTable** is a powerful, flexible, and fully customizable React data table component built with TypeScript and TailwindCSS. Designed for modern React applications, it provides seamless API integration, advanced features like server-side pagination, search, sorting, and extensive theming capabilities — all with zero external dependencies beyond React and TailwindCSS.

---

## 🚧 Project Status: Production Ready

This component is fully functional and ready for production use. It's designed as a reusable component that can be easily integrated into any React project, providing enterprise-grade data table functionality with modern UI/UX.

---

## 📋 Requirements

- **React**: 18.0.0 or higher
- **React DOM**: 18.0.0 or higher
- **TailwindCSS**: 4.0.0 or higher (for styling)
- **TypeScript**: 5.0.0 or higher (optional, for TypeScript projects)

---

## 🔧 Setup Requirements

### TailwindCSS Configuration
The component uses TailwindCSS for styling. Make sure your project has TailwindCSS properly configured:

```bash
# Install TailwindCSS
npm install -D tailwindcss
npx tailwindcss init

# Configure tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Import TailwindCSS
Add TailwindCSS directives to your CSS file:

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## ✨ Key Features

- 🔌 **API Integration**  
  Seamless integration with REST APIs supporting both GET and POST methods with automatic request handling and error management.

- 📄 **Server-Side Pagination**  
  Built-in pagination with customizable rows per page (10, 25, 50, 100) and automatic page reset on search/filter changes.

- 🔍 **Advanced Search**  
  Real-time search functionality with configurable debouncing (default: 500ms) that filters across all data fields with case-insensitive matching.

- 🔄 **Multi-State Sorting**  
  Three-state sorting system: ascending → descending → original order, with visual indicators and customizable sort behavior per column.

- 🎨 **Extensive Theming**  
  Complete customization system with theme-aware styling that automatically adapts to your application's design system.

- ⚡ **TypeScript Support**  
  Full TypeScript implementation with comprehensive type definitions for all props, data structures, and configuration options.

- 🖼️ **Custom Rendering**  
  Support for custom cell rendering with access to row data, row index, and column information for maximum flexibility.

- 📱 **Responsive Design**  
  Mobile-first responsive design with horizontal scrolling for large datasets and adaptive layouts.

- 🔧 **Developer Friendly**  
  Comprehensive prop system with sensible defaults, extensive customization options, and clear separation of concerns.

- 🎯 **Zero Dependencies**  
  Only requires React and TailwindCSS — no additional UI libraries or complex setup required.

---

## 📦 Installation

### Option 1: NPM Package (Recommended)
Install the component as an npm package in your React project:

```bash
npm install generic-datatable
```

Then import and use in your components:

```tsx
import GenericDataTable from 'generic-datatable';

<GenericDataTable
  api={{ url: 'https://api.example.com/data', method: 'GET' }}
  columns={columns}
  pagination={20}
/>
```

### Option 2: Direct Component Usage
Simply copy the `GenericDataTable.tsx` component to your React project:

```bash
# Copy the component file to your project
cp GenericDataTable.tsx your-project/src/components/
```

### Option 3: Package Integration
For easier maintenance and updates, integrate the component into your build system:

```typescript
// Add to your component library
import GenericDataTable from './components/GenericDataTable';

// Use in your React components
<GenericDataTable
  api={{ url: 'https://api.example.com/data', method: 'GET' }}
  columns={columns}
  pagination={20}
/>
```

### Option 4: Build from Source
If you want to customize the component or contribute to it:

```bash
# Clone or download the source
git clone https://github.com/your-username/generic-datatable.git
cd generic-datatable

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build:lib
```

---

## 🏗️ Building as a Library

To build the component as a reusable library:

```bash
# Build the library
npm run build:lib

# This creates:
# - dist/index.js (ES modules)
# - dist/index.umd.js (UMD build)
# - dist/index.d.ts (TypeScript declarations)
```

The built files can then be published to npm or used directly in other projects.

---

## 🛠️ Quick Start

### Basic Usage

```tsx
import React from 'react';
import GenericDataTable from './components/GenericDataTable';

const MyDataTable = () => {
  const columns = [
    { title: 'Name', dataIndex: 'name', sort: true },
    { title: 'Email', dataIndex: 'email', sort: true },
    { title: 'Status', dataIndex: 'status' },
    { title: 'Created', dataIndex: 'createdAt' }
  ];

  return (
    <GenericDataTable
      api={{ url: 'https://api.example.com/users', method: 'GET' }}
      columns={columns}
      pagination={10}
      searchDebounce={500}
    />
  );
};

export default MyDataTable;
```

### With Custom Rendering

```tsx
const columns = [
  {
    title: 'User',
    dataIndex: 'name',
    sort: true,
    render: (value: any, row: any) => (
      <div className="flex items-center space-x-2">
        <img src={row.avatar} alt={value} className="w-8 h-8 rounded-full" />
        <span className="font-medium">{value}</span>
      </div>
    )
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (value: any) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        value === 'active' ? 'bg-green-100 text-green-800' :
        value === 'inactive' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {value}
      </span>
    )
  }
];
```

---

## 📚 API Reference

### Props

#### `DataTableProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `api` | `{ url: string; method: "GET" \| "POST" }` | ✅ | - | API endpoint configuration |
| `columns` | `Column[]` | ✅ | - | Column definitions |
| `payload` | `Partial<Payload>` | ❌ | `{}` | Additional request payload |
| `pagination` | `number \| null` | ❌ | `10` | Rows per page (null to disable) |
| `searchDebounce` | `number \| boolean` | ❌ | `500` | Search debounce delay in ms (false to disable) |
| `extendsClasses` | `ClassProps` | ❌ | - | Extend existing styles |
| `replaceClasses` | `ClassProps` | ❌ | - | Replace default styles |
| `initialData` | `any` | ❌ | - | Initial data for static tables |

#### `Column`

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | `string` | ✅ | Column header text |
| `dataIndex` | `string` | ✅ | Field name in data object (supports dot notation) |
| `dataSrc` | `string` | ❌ | Alternative data source key |
| `sort` | `boolean` | ❌ | Enable sorting for this column |
| `render` | `function` | ❌ | Custom render function |

#### `ClassProps`

| Property | Type | Description |
|----------|------|-------------|
| `theadClasses` | `string` | Table header styling |
| `tbodyClasses` | `string` | Table body styling |
| `thClasses` | `string` | Header cell styling |
| `tdClasses` | `string` | Data cell styling |
| `rowOddClasses` | `string` | Odd row styling |
| `rowEvenClasses` | `string` | Even row styling |
| `searchInputClasses` | `string` | Search input styling |
| `searchContainerClasses` | `string` | Search container styling |

### Column Configuration

#### Basic Column
```tsx
{
  title: 'Product Name',
  dataIndex: 'name',
  sort: true
}
```

#### Nested Data Access
```tsx
{
  title: 'User Profile',
  dataIndex: 'user.profile.name'
}
```

#### Custom Data Source
```tsx
{
  title: 'Products',
  dataIndex: 'title',
  dataSrc: 'products'  // Looks for data in apiResponse.products
}
```

#### Custom Rendering
```tsx
{
  title: 'Actions',
  dataIndex: 'id',
  render: (value, row, index) => (
    <div className="space-x-2">
      <button className="text-blue-600 hover:text-blue-800">Edit</button>
      <button className="text-red-600 hover:text-red-800">Delete</button>
    </div>
  )
}
```

---

## 🎨 Theming & Customization

### Default Theme
The component comes with a beautiful gradient theme:
- **Header**: Purple to pink to yellow gradient
- **Body**: Clean white with subtle gray borders
- **Rows**: Alternating colors with hover effects
- **Search**: Purple accent with focus states

### Custom Themes

#### Dark Theme
```tsx
<GenericDataTable
  {...props}
  replaceClasses={{
    theadClasses: "bg-gray-800 text-gray-200",
    thClasses: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-700",
    tbodyClasses: "divide-y divide-gray-700 bg-gray-900",
    tdClasses: "px-4 py-3 text-sm text-gray-300",
    rowOddClasses: "bg-gray-800/80 hover:bg-gray-700/80 transition duration-150",
    rowEvenClasses: "bg-gray-900/80 hover:bg-gray-700/80 transition duration-150"
  }}
/>
```

#### Vibrant Theme
```tsx
<GenericDataTable
  {...props}
  replaceClasses={{
    theadClasses: "bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white shadow-md",
    thClasses: "px-6 py-3 text-center text-sm font-bold uppercase",
    tbodyClasses: "divide-y divide-gray-200 bg-white",
    tdClasses: "px-6 py-4 text-sm text-gray-800",
    rowOddClasses: "bg-white hover:bg-red-50 transition duration-200",
    rowEvenClasses: "bg-gray-50 hover:bg-red-50 transition duration-200"
  }}
/>
```

#### Corporate Blue Theme
```tsx
<GenericDataTable
  {...props}
  replaceClasses={{
    theadClasses: "bg-blue-50 text-blue-800 border-b border-blue-300",
    thClasses: "px-4 py-2 text-center text-xs font-semibold uppercase border-r border-blue-200",
    tbodyClasses: "divide-y divide-blue-100 bg-white",
    tdClasses: "px-4 py-2 text-sm text-gray-700 border-r border-blue-100",
    rowOddClasses: "bg-white hover:bg-blue-50",
    rowEvenClasses: "bg-blue-50/50 hover:bg-blue-50"
  }}
/>
```

### Theme Detection System
The component includes intelligent theme detection that automatically adapts search bar styling based on your existing theme classes. It recognizes common theme patterns and adjusts colors accordingly.

---

## 🌐 API Integration

### GET Request
```tsx
<GenericDataTable
  api={{ url: 'https://api.example.com/data', method: 'GET' }}
  columns={columns}
  payload={{ category: 'electronics', status: 'active' }}
/>
```

### POST Request
```tsx
<GenericDataTable
  api={{ url: 'https://api.example.com/search', method: 'POST' }}
  columns={columns}
  payload={{ filters: { dateRange: '2024-01-01..2024-01-31' } }}
/>
```

### Response Format Support
The component automatically handles various API response formats:

```typescript
// Array response
[{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]

// Object with data property
{
  data: [{ id: 1, name: 'John' }],
  total: 100,
  page: 1
}

// Nested data source
{
  products: [{ id: 1, title: 'Product 1' }],
  total: 50
}
```

### Custom Data Source
```tsx
const columns = [
  { title: 'Product', dataIndex: 'title', dataSrc: 'products' },
  { title: 'Price', dataIndex: 'price', dataSrc: 'products' }
];
```

---

## 🔍 Search & Filtering

### Basic Search
```tsx
<GenericDataTable
  api={{ url: 'https://api.example.com/data', method: 'GET' }}
  columns={columns}
  searchDebounce={500}  // 500ms delay
/>
```

### Disable Search
```tsx
<GenericDataTable
  {...props}
  searchDebounce={false}  // Disable search functionality
/>
```

### Custom Search Implementation
The search filters across all visible text content in each row with case-insensitive matching.

---

## 📄 Pagination

### Basic Pagination
```tsx
<GenericDataTable
  {...props}
  pagination={20}  // 20 items per page
/>
```

### Custom Rows Per Page Options
```tsx
<GenericDataTable
  {...props}
  pagination={null}  // Disable pagination
/>
```

### Static Data with Pagination
```tsx
const staticData = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
  // ... more data
];

<GenericDataTable
  api={{ url: '', method: 'GET' }}  // Empty URL for static data
  columns={columns}
  pagination={10}
  initialData={staticData}
/>
```

---

## 🔄 Sorting

### Enable Sorting
```tsx
const columns = [
  { title: 'Name', dataIndex: 'name', sort: true },
  { title: 'Created', dataIndex: 'createdAt', sort: true },
  { title: 'Status', dataIndex: 'status' }  // No sorting
];
```

### Sort Modes
- **Click 1**: Ascending (A → Z, 1 → 9)
- **Click 2**: Descending (Z → A, 9 → 1)
- **Click 3**: Original order (resets to initial state)

---

## 📱 Responsive Design

The component includes responsive features:

- **Horizontal Scrolling**: Automatic horizontal scroll for large tables on mobile
- **Adaptive Search**: Search bar repositions on smaller screens
- **Flexible Layout**: Pagination controls adapt to screen size
- **Touch Friendly**: Proper touch targets for mobile interactions

---

## ⚡ Performance Features

- **Debounced Search**: Configurable search delay prevents excessive API calls
- **Memoized Classes**: CSS class calculations are optimized
- **Efficient Re-renders**: Smart state management minimizes unnecessary updates
- **Lazy Loading Ready**: Designed to work with virtual scrolling if needed

---

## 🔧 Advanced Usage

### Complex Data Structures
```tsx
const columns = [
  {
    title: 'User Details',
    dataIndex: 'user.profile.name',
    sort: true,
    render: (value, row) => (
      <div>
        <div className="font-medium">{value}</div>
        <div className="text-sm text-gray-500">{row.user.email}</div>
      </div>
    )
  }
];
```

### Dynamic Column Configuration
```tsx
const getColumns = (userRole: string) => {
  const baseColumns = [
    { title: 'Name', dataIndex: 'name', sort: true }
  ];

  if (userRole === 'admin') {
    return [
      ...baseColumns,
      { title: 'Email', dataIndex: 'email' },
      { title: 'Permissions', dataIndex: 'permissions' }
    ];
  }

  return baseColumns;
};
```

### Conditional Styling
```tsx
const columns = [
  {
    title: 'Status',
    dataIndex: 'status',
    render: (value, row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        value === 'active' ? 'bg-green-100 text-green-800' :
        value === 'pending' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {value}
      </span>
    )
  }
];
```

---

## 🐛 Error Handling

The component includes comprehensive error handling:

- **Network Errors**: Displays user-friendly error messages
- **Invalid Responses**: Handles malformed API responses gracefully
- **Loading States**: Shows loading indicators during data fetch
- **Empty States**: Displays appropriate messages for no data scenarios

---

## 🧪 Testing

### Example Test Setup
```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GenericDataTable from './GenericDataTable';

const mockApiResponse = {
  data: [
    { id: 1, name: 'John Doe', email: 'john@example.com' }
  ],
  total: 1
};

describe('GenericDataTable', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiResponse)
      })
    );
  });

  it('renders data correctly', async () => {
    render(<GenericDataTable {...props} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
```

---

## 🔄 Migration Guide

### From React-Table
```tsx
// Before (React-Table v7)
import { useTable, usePagination, useSortBy } from 'react-table';

const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    // ... many other properties
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 10 }
    },
    useSortBy,
    usePagination
  );

  return (
    // Complex JSX structure
  );
};

// After (GenericDataTable)
<GenericDataTable
  api={{ url: 'https://api.example.com/data', method: 'GET' }}
  columns={columns}
  pagination={10}
  searchDebounce={500}
/>
```

### From Material-UI Table
```tsx
// Before (Material-UI)
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

<TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        {columns.map(col => (
          <TableCell key={col.id}>{col.label}</TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {data.map(row => (
        <TableRow key={row.id}>
          {columns.map(col => (
            <TableCell key={col.id}>{row[col.id]}</TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

// After (GenericDataTable)
<GenericDataTable
  api={{ url: 'https://api.example.com/data', method: 'GET' }}
  columns={[
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' }
  ]}
  pagination={10}
/>
```

---

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Initial release
- ✅ API integration (GET/POST)
- ✅ Server-side pagination
- ✅ Search with debouncing
- ✅ Multi-state sorting
- ✅ Custom rendering support
- ✅ Comprehensive theming system
- ✅ TypeScript support
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states

### Upcoming Features
- 🔄 Virtual scrolling for large datasets
- 🎨 Additional pre-built themes
- 📊 Export functionality (CSV, Excel)
- 🔧 Column resizing
- 📱 Mobile-optimized touch interactions
- 🌙 Dark mode support
- ♿ Accessibility improvements

---

## 🤝 Contributing

**GenericDataTable is open for contributions!**

We welcome improvements, bug reports, and feature requests. Here's how you can contribute:

* 🚀 Suggest new features or enhancements
* 🐛 Report bugs or issues
* ✨ Improve TypeScript types or add new functionality
* 📚 Enhance documentation or add examples
* 🎨 Contribute new theme variations

> To contribute, please open an issue first to discuss your ideas, then submit a pull request with your improvements.

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use it in your personal and commercial projects.

---

## ☕ Support

If you find this component useful and want to support its development, consider:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support%20Me-orange?style=flat-square&logo=buy-me-a-coffee)](https://www.buymeacoffee.com/sugarcube08)

---

## 🔗 Connect

Follow for more React components and web development content:

[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?logo=YouTube&logoColor=white)](https://www.youtube.com/@SugarCode-Z?sub_confirmation=1)
[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?logo=Instagram&logoColor=white)](https://www.instagram.com/sugarcodez)
[![WhatsApp Channel](https://img.shields.io/badge/WhatsApp-%25D366.svg?logo=whatsapp&logoColor=white)](https://whatsapp.com/channel/0029Vb5fFdzKgsNlaxFmhg1T)

---

## 🏆 Why Choose GenericDataTable?

- **🚀 Production Ready**: Built with modern React patterns and best practices
- **🔧 Highly Customizable**: Extensive theming and configuration options
- **📱 Responsive**: Works perfectly on all device sizes
- **⚡ Performance Optimized**: Efficient rendering and API handling
- **🎯 TypeScript First**: Full type safety and IntelliSense support
- **🎨 Beautiful by Default**: Stunning UI out of the box
- **📚 Well Documented**: Comprehensive documentation with examples
- **🔒 Reliable**: Comprehensive error handling and edge case management

> **GenericDataTable** – The data table component that adapts to your needs, not the other way around.
