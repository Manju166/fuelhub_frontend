import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { AgGridReact } from 'ag-grid-react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Modal from 'react-modal';
import '../styles/product.css';
import { GET_PRODUCTS } from '../query/ProductQuery';
import { CREATE_PRODUCT, DELETE_PRODUCT, UPDATE_PRODUCT } from '../mutations/ProductMutation';

Modal.setAppElement('#root');

const Products = () => { 
  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS);
  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: '', status: '', unit: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const categoryOptions = ['fuel','lubricants','additives'];
  const statusOptions = ['available', 'out_of_stock', 'discontinued'];
  const unitOptions=['liters','gallons'];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const columnDefs = [
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    { headerName: 'Category', field: 'category', sortable: true, filter: true },
    { headerName: 'Status', field: 'status', sortable: true, filter: true },
    { headerName: 'Unit', field: 'unit', sortable: true, filter: true },
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

  const handleView = (product) => {
    setSelectedProduct(product);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      status: product.status,
      unit: product.unit,
    });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setFormData({ name: '', category: '', status: '', unit: '' });
    setModalMode('add');
    setIsModalOpen(true);
    setErrorMessage('');
  };

  const handleAdd = async (formData) => {
    if (!formData.name.trim() || !formData.category.trim() || !formData.status.trim() || !formData.unit.trim()) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      const { data } = await createProduct({ variables: { productDetails: formData } });
      if (data.createProduct.product) {
        refetch();
        setIsModalOpen(false);
        setErrorMessage('');
      } else {
        setErrorMessage(data.createProduct.errors.join(', '));
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleUpdate = async (selectedProduct, formData) => {
    if (!formData.name.trim() || !formData.category.trim() || !formData.status.trim() || !formData.unit.trim()) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      const { data } = await updateProduct({ variables: { productDetails: { id: selectedProduct.id, ...formData } } });
      if (data.updateProduct.product) {
        refetch();
        setIsModalOpen(false);
        setErrorMessage('');
      } else {
        setErrorMessage(data.updateProduct.errors.join(', '));
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDelete = async (product) => {
    try {
      const { data } = await deleteProduct({ variables: { id: product.id } });
      if (data.deleteProduct.product) {
        refetch();
      } else {
        console.error('Error deleting product:', data.deleteProduct.errors.join(', '));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="ag-theme-alpine table-container">
      <h1>Product List</h1>

      <button className="table-container__add-product-btn" onClick={openAddModal}>
        Add Product
      </button>

      <AgGridReact
        rowData={data.products.products}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50]}
        domLayout='autoheight'
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel={modalMode === 'view' ? 'View Product' : modalMode === 'edit' ? 'Edit Product' : 'Add Product'}
          className="product-modal"
        >
          <div className="modal-header">
            <h2>{modalMode === 'view' ? 'View Product' : modalMode === 'edit' ? 'Edit Product' : 'Add Product'}</h2>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {modalMode === 'view' ? (
            <div>
              <p><strong>Name:</strong> {selectedProduct?.name}</p>
              <p><strong>Category:</strong> {selectedProduct?.category}</p>
              <p><strong>Status:</strong> {selectedProduct?.status}</p>
              <p><strong>Unit:</strong> {selectedProduct?.unit}</p>
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
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="" disabled>Select status</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  <option value="" disabled>Select unit</option>
                  {unitOptions.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                {modalMode === 'add' ? (
                  <button type="button" onClick={() => handleAdd(formData)}>Add</button>
                ) : (
                  <button type="button" onClick={() => handleUpdate(selectedProduct, formData)}>Update</button>
                )}
                <button type="button" className="cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Products; 
