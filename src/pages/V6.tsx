import GenericDataTable from "../components/GenericDataTable"
import Theme from "../components/Theme";
import type { Api, Payload } from "../components/GenericDataTable";

const V6 = () => {
    const columns = [
        { title: 'Serial', serial: true },
        { title: 'User Name', dataIndex: 'username' },
        { title: 'Name', dataIndex: 'name' },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Age', dataIndex: 'age' },
    ];

    const api: Api = {
        url: 'http://localhost:3000/api/datatable/v1',
        method: 'GET',
        limit: "pagination.limit",
        skip: "pagination.skip",
        total: "pagination.totalItems",
        sortBy: "sortBy",
        sortOrder: "sortOrder",
        searchPram: 'search'
    }

    const payload: Payload = {
        sortBy: 'age',
        sortOrder: 'asc'
    };

    return (
        <Theme>
            <div className="overflow-x-auto mb-6">
                <GenericDataTable
                    api={api}
                    columns={columns}
                    searchDebounce={1000}
                    payload={payload}
                />
            </div>
        </Theme>
    )
}

export default V6