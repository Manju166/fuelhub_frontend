import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { AgGridReact } from 'ag-grid-react';
import {GET_OUTLETS} from '../query/ConsumerBranchQuery'
function ConsumerBranch() {
  const { consumerId } = useParams(); 
  const { loading, error, data } = useQuery(GET_OUTLETS, {
    variables: { id: consumerId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: There was an error fetching the data.</p>;

  const columnDefs = [
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    { headerName: 'Address', field: 'address', sortable: true, filter: true },
    { headerName: 'Consumer ID', field: 'consumerId', sortable: true, filter: true },
  ];

  return (
    <div className="ag-theme-alpine table-container">
      <h1>Outlet List for Consumer {consumerId}</h1>
      <AgGridReact
        rowData={data.outlets.consumerOutlets}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
        domLayout="autoHeight"
        className='table'
      />
    </div>
  );
}

export default ConsumerBranch;
