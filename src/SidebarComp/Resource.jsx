import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { AgGridReact } from 'ag-grid-react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { GET_RESOURCES } from '../query/ResourceQuery'; 
import Modal from 'react-modal';
import { CREATE_RESOURCE, DELETE_RESOURCE, UPDATE_RESOURCE } from '../mutations/ResourceMutation';
import '../styles/resource.css'

Modal.setAppElement('#root');

function Resource() {
  const { loading, error, data, refetch } = useQuery(GET_RESOURCES);
  const [createResource] = useMutation(CREATE_RESOURCE);
  const [updateResource] = useMutation(UPDATE_RESOURCE);
  const [deleteResource] = useMutation(DELETE_RESOURCE);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedResource, setSelectedResource] = useState(null);
  const [formData, setFormData] = useState({ resourceStatus: '', resourceCategory: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const categoryOptions = ['tanker_truck', 'rails_tank', 'tank_wagon', 'tanker_LNG', 'bitumen_truck'];
  const statusOptions = ['available', 'unavailable'];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: There was an error fetching the data.</p>;

  const columnDefs = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true },
    { headerName: 'Category', field: 'resourceCategory', sortable: true, filter: true },
    { headerName: 'Status', field: 'resourceStatus', sortable: true, filter: true,
      cellRenderer: (params) => (
        <span
          className={
            params.value === 'available'
              ? 'resource-status-available'
              : params.value === 'unavailable'
              ? 'resource-status-unavailable'
              : 'product-status-default'
          }
        >
          {params.value.charAt(0).toUpperCase() + params.value.slice(1).replace(/_/g, ' ')}
        </span>
      ),
     },
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

  const handleView = (resource) => {
    setSelectedResource(resource);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEdit = (resource) => {
    setSelectedResource(resource);
    setFormData({
      resourceStatus: resource.resourceStatus,
      resourceCategory: resource.resourceCategory,
    });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setFormData({ resourceStatus: '', resourceCategory: '' });
    setModalMode('add');
    setIsModalOpen(true);
    setErrorMessage('');
  };

  const handleAdd = async (formData) => {
    if (!formData.resourceCategory.trim() || !formData.resourceStatus.trim()) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      const { data } = await createResource({
        variables: { resourceInput: formData },
      });
      if (data.createResource.resource) {
        refetch();
        setIsModalOpen(false);
        setErrorMessage('');
      } else {
        setErrorMessage(data.createResource.errors.join(', '));
      }
    } catch (error) {
      console.error('Error adding resource:', error);
    }
  };

  const handleUpdate = async (selectedResource, formData) => {
    if (!formData.resourceCategory.trim() || !formData.resourceStatus.trim()) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      const { data } = await updateResource({
        variables: { resource: { id: selectedResource.id, ...formData } },
      });
      if (data.updateResource.resource) {
        refetch();
        setIsModalOpen(false);
        setErrorMessage('');
      } else {
        setErrorMessage(data.updateResource.errors.join(', '));
      }
    } catch (error) {
      console.error('Error updating resource:', error);
    }
  };

  const handleDelete = async (resource) => {
    try {
      const { data } = await deleteResource({
        variables: { id: resource.id },
      });
      if (data.deleteResource.success) {
        refetch();
      } else {
        console.error('Error deleting resource:', data.deleteResource.errors.join(', '));
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  return (
    <>
    <h1>Resource List</h1>
    <div className="resource">
    <div className=""></div>
      <button className="table-container__add-resource-btn" onClick={openAddModal}>
        Add Resource
      </button>
    </div>

    <div className="ag-theme-alpine table-container">
      <AgGridReact
        rowData={data?.getResources?.resources}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
         paginationPageSizeSelector={[10, 20, 50]}
        domLayout="autoheight"
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel={modalMode === 'view' ? 'View Resource' : modalMode === 'edit' ? 'Edit Resource' : 'Add Resource'}
          className="resource-modal"
        >
          <div className="modal-header">
            <h2>{modalMode === 'view' ? 'View Resource' : modalMode === 'edit' ? 'Edit Resource' : 'Add Resource'}</h2>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {modalMode === 'view' ? (
            <div>
              <p><strong>ID:</strong> {selectedResource?.id}</p>
              <p><strong>Category:</strong> {selectedResource?.resourceCategory}</p>
              <p><strong>Status:</strong> {selectedResource?.resourceStatus}</p>
            </div>
          ) : (
            <form>
              <div>
                <label>Category</label>
                <select
                  value={formData.resourceCategory}
                  onChange={(e) => setFormData({ ...formData, resourceCategory: e.target.value })}
                >
                  <option value="" disabled>Select category</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Status</label>
                <select
                  value={formData.resourceStatus}
                  onChange={(e) => setFormData({ ...formData, resourceStatus: e.target.value })}>
                  <option value="" disabled>Select Status</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-footer">
                {modalMode === 'add' ? (
                  <button type="button" onClick={() => handleAdd(formData)}>Add</button>
                ) : (
                  <button type="button" onClick={() => handleUpdate(selectedResource, formData)}>Update</button>
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

export default Resource;
