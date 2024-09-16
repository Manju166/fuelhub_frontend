import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { AgGridReact } from 'ag-grid-react';
import { FaEye, FaEdit, FaTrash, FaTimes, FaPlus } from 'react-icons/fa';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { GET_CONSUMERS } from '../query/ConsumerQuery';
import { DELETE_CONSUMER, UPDATE_CONSUMER, CREATE_CONSUMER } from '../mutations/ConsumerMutation';
import Modal from 'react-modal';
import '../styles/consumer.css'
Modal.setAppElement('#root');

function Consumer() {
  const { loading, error, data, refetch } = useQuery(GET_CONSUMERS);
  const [deleteConsumer] = useMutation(DELETE_CONSUMER);
  const [updateConsumer] = useMutation(UPDATE_CONSUMER);
  const [createConsumer] = useMutation(CREATE_CONSUMER);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedConsumer, setSelectedConsumer] = useState(null);
  const [formData, setFormData] = useState({ name: '', address: '' });
  const [errorMessage, setErrorMessage] = useState('');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: There was an error fetching the data.</p>;

  const columnDefs = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true },
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    { headerName: 'Address', field: 'address', sortable: true, filter: true },
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
      ),
    },
  ];

  // Handlers for View, Edit, and Delete actions
  const handleView = (consumer) => {
    setSelectedConsumer(consumer);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEdit = (consumer) => {
    setSelectedConsumer(consumer);
    setFormData({ name: consumer.name, address: consumer.address });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = async (consumer) => {
    const { id } = consumer;
    try {
      const { data } = await deleteConsumer({ variables: { input: { id } } });
      if (data.deleteConsumer.success) {
        refetch();
      } else {
        console.error('Error deleting consumer:', data.deleteConsumer.errors);
      }
    } catch (error) {
      console.error('Error deleting consumer:', error);
    }
  };

  // Add Consumer Handler with Validation
  const handleAdd = async () => {
    // Validate the form inputs
    if (!formData.name.trim() || !formData.address.trim()) {
      setErrorMessage('Name and Address cannot be empty.');
      return;
    }

    try {
      const { data } = await createConsumer({
        variables: { consumerDetails: { name: formData.name, address: formData.address } },
      });

      if (data.createConsumer.consumer) {
        refetch();
        setIsModalOpen(false); // Close modal after successful addition
        setErrorMessage(''); // Clear the error message
      } else {
        console.error('Error adding consumer:', data.createConsumer.errors);
      }
    } catch (error) {
      console.error('Error adding consumer:', error);
    }
  };

  // Update Consumer Handler
  const handleUpdate = async () => {
    const { id } = selectedConsumer;
    if (!formData.name.trim() || !formData.address.trim()) {
      setErrorMessage('Name and Address cannot be empty.');
      return;
    }

    try {
      const { data } = await updateConsumer({
        variables: { id, consumerDetails: { name: formData.name, address: formData.address } },
      });

      if (data.updateConsumer.consumer) {
        refetch();
        setIsModalOpen(false); // Close modal after successful update
        setErrorMessage(''); // Clear the error message
      } else {
        console.error('Error updating consumer:', data.updateConsumer.errors);
      }
    } catch (error) {
      console.error('Error updating consumer:', error);
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormData({ name: '', address: '' }); // Clear form for new data
    setModalMode('add'); // Set modal mode to "add"
    setIsModalOpen(true);
    setErrorMessage(''); // Clear any previous error message
  };

  return (
    <div className="ag-theme-alpine table-container">
      <h1>Consumer List</h1>
      
      {/* Add Customer Button */}
      <button className="table-container__add-customer-btn" onClick={openAddModal}>
  Add Customer
</button>
<AgGridReact
  rowData={data.consumers}
  columnDefs={columnDefs}
  pagination={true}
  paginationPageSize={10} 
  paginationPageSizeSelector={[10, 20, 50]}
/>


      {/* Modal Logic */}
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

          {/* Error Message */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {/* Modal Body */}
          {modalMode === 'view' ? (
            <div>
              <p><strong>ID:</strong> {selectedConsumer?.id}</p>
              <p><strong>Name:</strong> {selectedConsumer?.name}</p>
              <p><strong>Address:</strong> {selectedConsumer?.address}</p>
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
              <div className="modal-footer">
                {modalMode === 'add' ? (
                  <button type="button" onClick={handleAdd}>Add</button>
                ) : (
                  <button type="button" onClick={handleUpdate}>Update</button>
                )}
                <button type="button" className="cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}

export default Consumer;
