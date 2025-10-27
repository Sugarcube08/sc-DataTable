import GenericDataTable from "../components/GenericDataTable"
import Theme from "../components/Theme";
import type { Api } from "../components/GenericDataTable";

const V4 = () => {
  const columns = [
    { title: 'User Name', dataIndex: 'username', sort: true },
    { title: 'Name', dataIndex: 'name', sort: true },
    { title: 'Email', dataIndex: 'email', sort: true },
    { title: 'Age', dataIndex: 'age', sort: true },
  ];
  
  const api: Api = {
    url: 'http://localhost:3000/api/datatable/v1',
    method: 'GET',
  }

  const payload = {
    search: 'Noah'
  };

  return (
    <Theme>
        <div className="overflow-x-auto mb-6">
          <GenericDataTable
            api={api}
            columns={columns}
            payload={payload}
          />
        </div>
    </Theme>
  )
}

export default V4