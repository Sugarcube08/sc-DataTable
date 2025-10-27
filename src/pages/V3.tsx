import GenericDataTable from "../components/GenericDataTable"
import Theme from "../components/Theme";
import type { Api } from "../components/GenericDataTable";
import { useEffect } from "react";
import { useResponseStruct } from "../context/ResponseStructContext";

const V3 = () => {
  const { setResponseStruct } = useResponseStruct();
  const columns = [
    { title: 'User Name', dataIndex: 'username', sort: true },
    { title: 'Name', dataIndex: 'name', sort: true },
    { title: 'Email', dataIndex: 'email', sort: true },
    { title: 'Age', dataIndex: 'age', sort: true },
  ];

  const api: Api = {
    url: 'http://localhost:3000/api/datatable/v2',
    method: 'GET',
  }

  useEffect(() => {
    setResponseStruct({
      dataSrc: 'data',
      limit: "limit",
      skip: "skip",
      total: "totalItems",
      sortBy: "sortBy",
      sortOrder: "sortOrder",
      searchRoute: '/search',
      searchParam: 'search'
    });
  }, [setResponseStruct]);

  return (
    <Theme>
      <div className="overflow-x-auto mb-6">
        <GenericDataTable
          api={api}
          serial={true}
          columns={columns}
          searchDebounce={1000}
        />
      </div>
    </Theme>
  )
}

export default V3