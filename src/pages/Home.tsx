import Theme from "../components/Theme";
import NavCard from "../components/NavCard";

const Home = () => {
    const v1 = `
DataTable using custom express api, with pagination, sorting, and search.
using """ /api/datatable/vi """ endpoint.

api response format:
{
  success: true,
  data: data,
  pagination: {
    totalItems: totalItems,
    offset: skip,
    limit: limit,
  }
}
searchRoute url: ''
searchPram: 'search'
payload format:
None

  `;

    const v2 = `    
DataTable using public dummyjson api, with pagination, sorting, and search.
api response format:
{
    products: data,
    total: totalItems,
    skip: skip,
    limit: limit,
}
searchRoute url: '/search'
searchPram: 'q'
payload format:
None
    `;

    const v3 = `
DataTable using custom express api, with pagination, sorting, and search.
using """ /api/datatable/v2 """ endpoint.

api response format:
{
    success: true,
    data: data,
    totalDocuments: totalItems,
    offset: skip,
    rowsPerPage: limit,
}
searchRoute url: '/search'
searchPram: 'search'
payload format:
None
    `;
    const v4 = `
DataTable using custom express api, with pagination and sorting.
No search functionality. already searched data is returned.
using """ /api/datatable/v1 """ endpoint.

api response format:
{
    success: true,
    data: data,
    pagination: {
        totalItems: totalItems,
        offset: skip,
        limit: limit,
    }
}
searchRoute url: ''
searchPram: 'search'
payload format:
{
    search: 'search term'
}
    `;
    const v5 = `
DataTable using custom express api, with pagination and sorting and search.
But this time payload.skip numbers of items are skipped from the api response.
using """ /api/datatable/v1 """ endpoint.

api response format:
{
    success: true,
    data: data,
    pagination: {
        totalItems: totalItems,
        offset: skip,
        limit: limit,
    }
}
searchRoute url: ''
searchPram: 'search'
payload format:
{
    skip: number of items to skip,
}
    `;

    const v6 = `
DataTable using public dummyjson api, with pagination and search.
But this time no sorting functionality. response is already sorted according to sortBy and sortOrder.
using """ /api/datatable/v1 """ endpoint.
api response format:
{
    success: true,
    data: data,
    pagination: {
        totalItems: totalItems,
        offset: skip,
        limit: limit,
    }
}
searchRoute url: ''
searchPram: 'search'
payload format:
{
    sortBy: 'sortBy',
    sortOrder: 'asc' | 'desc',
}
    `;

    return (
        <Theme>
            <main className="flex flex-col items-center justify-center px-4 py-10 bg-gray-50">
                <section className="w-full max-w-6xl">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <NavCard title="V1" description={v1} link="/v1" />
                        <NavCard title="V2" description={v2} link="/v2" />
                        <NavCard title="V3" description={v3} link="/v3" />
                        <NavCard title="V4" description={v4} link="/v4" />
                        <NavCard title="V5" description={v5} link="/v5" />
                        <NavCard title="V6" description={v6} link="/v6" />
                    </div>
                </section>
            </main>
        </Theme>
    );
};

export default Home;
