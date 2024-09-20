import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { AgGridReact } from 'ag-grid-react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { GET_CONSUMERS } from '../query/ConsumerQuery';
import Modal from 'react-modal';
import '../styles/consumer.css';
import { useAddConsumer, useDeleteConsumer, useEditConsumer } from '../handlers/ConsumerHandler';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

function Consumer() {
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(GET_CONSUMERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedConsumer, setSelectedConsumer] = useState(null);
  const [formData, setFormData] = useState({ name: '', address: '', email: '', phoneNumber: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleAdd = useAddConsumer(refetch, setIsModalOpen, setErrorMessage);
  const handleUpdate = useEditConsumer(refetch, setIsModalOpen, setErrorMessage);
  const handleDelete = useDeleteConsumer(refetch);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: There was an error fetching the data.</p>;

  const columnDefs = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true, width:60 },
    { headerName: 'Name', field: 'name', sortable: true, filter: true, width:170 },
    { headerName: 'Address', field: 'address', sortable: true, filter: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true, width:210 },
    { headerName: 'Phone no.', field: 'phoneNumber', sortable: true, filter: true, width:130 },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: (params) => (
        <div className="action-buttons">
          <button onClick={() => handleView(params.data)}>
            <FaEye />
          </button>
          <button onClick={() => handleEdit(params.data)}>
            <FaEdit />
          </button>
          <button onClick={() => handleDelete(params.data)}>
            <FaTrash />
          </button>
        </div>
      ), width:145
    },
    {
      headerName: 'Branch Detail',
      field: 'branch',
      cellRenderer: (params) => (
        <button
          onClick={() => handleShowBranches(params.data.id)}
          className="show-branch-button">
          Show
        </button>
      ), width:130
    },
  ];

  const handleShowBranches = (consumerId) => {
    navigate(`/consumerbranch/${consumerId}`);
  };

  const handleView = (consumer) => {
    setSelectedConsumer(consumer);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEdit = (consumer) => {
    setSelectedConsumer(consumer);
    setFormData({ name: consumer.name, address: consumer.address, email: consumer.email, phoneNumber: consumer.phoneNumber });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setFormData({ name: '', address: '', email: '', phoneNumber: '' });
    setModalMode('add');
    setIsModalOpen(true);
    setErrorMessage('');
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[0-9]*$/; 
    return phoneRegex.test(phoneNumber);
  };

  const handlePhoneNumberChange = (e) => {
    const phoneNumber = e.target.value;
    if (isValidPhoneNumber(phoneNumber)) {
      setFormData({ ...formData, phoneNumber });
      setErrorMessage('');
    } else {
      setErrorMessage('Phone number must contain only digits.');
    }
  };

  return (
    <>
      <h1>Consumer List</h1>
<div className="consumer">
<div className=""></div>
      <button className="table-container__add-customer-btn" onClick={openAddModal}>
        Add Customer
      </button>
</div>
    <div className="ag-theme-alpine table-container" style={{width: '100%' }}>
      <AgGridReact
        rowData={data.consumers}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50]}
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel={modalMode === 'view' ? 'View Consumer' : modalMode === 'edit' ? 'Edit Consumer' : 'Add Consumer'}
          className="consumer-modal"
        >
          <div className="modal-header">
            <h2>{modalMode === 'view' ? 'View Consumer' : modalMode === 'edit' ? 'Edit Consumer' : 'Add Consumer'}</h2>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {modalMode === 'view' ? (
            <div>
              <p><strong>ID:</strong> {selectedConsumer?.id}</p>
              <p><strong>Name:</strong> {selectedConsumer?.name}</p>
              <p><strong>Address:</strong> {selectedConsumer?.address}</p>
              <p><strong>Email:</strong> {selectedConsumer?.email}</p>
              <p><strong>Phone no. :</strong> {selectedConsumer?.phoneNumber}</p>
            </div>
          ) : (
            <form>
              <div>
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label>Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label>Phone Number</label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={handlePhoneNumberChange}
                />
              </div>
              <div className="modal-footer">
                {modalMode === 'add' ? (
                  <button type="button" onClick={() => handleAdd(formData)}>Add</button>
                ) : (
                  <button type="button" onClick={() => handleUpdate(selectedConsumer, formData)}>Update</button>
                )}
                <button type="button" className="cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
    </>
  );
}

export default Consumer;
