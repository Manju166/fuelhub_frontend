import { gql } from "@apollo/client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { AgGridReact } from "ag-grid-react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Modal from "react-modal";
import "../styles/product.css";
import { GET_PRODUCTS } from "../query/ProductQuery";
import { useAddProduct, useDeleteProduct, useEditProduct } from "../handlers/ProductHandler";
import { UPLOAD_CSV } from "../mutations/ProductCsvMutation";
import Papa from "papaparse";

Modal.setAppElement("#root");

const Products = () => {
  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS);
  const [uploadCsv] = useMutation(UPLOAD_CSV); // Mutation hook
  const [products, setProducts] = useState([]); // State for products
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    status: "",
    unit: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [csvFile, setCsvFile] = useState(null); // State for the CSV file

  const handleAdd = useAddProduct(refetch, setIsModalOpen, setErrorMessage);
  const handleUpdate = useEditProduct(refetch, setIsModalOpen, setErrorMessage);
  const handleDelete = useDeleteProduct(refetch);

  const handleCsvChange = (event) => {
    setCsvFile(event.target.files[0]);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const categoryOptions = [
    { value: "", label: "Select Category" },
    { value: "fuel", label: "Fuel" },
    { value: "lubricants", label: "Lubricants" },
    { value: "additives", label: "Additives" },
  ];
  const statusOptions = ["available", "out_of_stock", "discontinued"];
  const unitOptions = ["liters", "gallons"];

  const columnDefs = [
    { headerName: "ID", field: "id", sortable: true, filter: true, width: 90 },
    { headerName: "Name", field: "name", sortable: true, filter: true, width: 155 },
    { headerName: "Category", field: "category", sortable: true, filter: true },
    { headerName: "Status", field: "status", sortable: true, filter: true },
    { headerName: "Unit", field: "unit", sortable: true, filter: true },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div className="action-buttons">
          <button onClick={() => handleView(params.data)}><FaEye /></button>
          <button onClick={() => handleEdit(params.data)}><FaEdit /></button>
          <button onClick={() => handleDelete(params.data)}><FaTrash /></button>
        </div>
      ),
    },
  ];

  const handleView = (product) => {
    setSelectedProduct(product);
    setModalMode("view");
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
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setFormData({ name: "", category: "", status: "", unit: "" });
    setModalMode("add");
    setIsModalOpen(true);
    setErrorMessage("");
  };

  const filteredProducts = selectedCategory
    ? data.products.products.filter((product) => product.category === selectedCategory)
    : data.products.products;

  // const handleImportCsv = async () => {
  //   if (!csvFile) {
  //     setErrorMessage("Please select a CSV file to upload.");
  //     return;
  //   }
  //   const reader = new FileReader();
  //   reader.onload = async (event) => {
  //     const text = event.target.result;
  //     Papa.parse(text, {
  //       header: true,
  //       complete: async (results) => {
  //         const newProducts = results.data.map((item) => ({
  //           id: item.id,
  //           name: item.name,
  //           category: item.category,
  //           status: item.status,
  //           unit: item.unit,
  //         }));
  //         console.log(newProducts);
  //         setProducts((prevProducts) => [...prevProducts, ...newProducts]); // Append to existing products
  //         setErrorMessage("");
  //       },
  //       error: (error) => {
  //         setErrorMessage(`Parsing failed: ${error.message}`);
  //       },
  //     });
  //   };
  //   reader.readAsText(csvFile); // Parse the CSV file content
  // };
  const handleImportCsv = async () => {
    if (!csvFile) {
      setErrorMessage("Please select a CSV file to upload.");
      return;
    }
  
    const reader = new FileReader();
  
    reader.onload = async (event) => {
      const text = event.target.result;
  
      // Parse the CSV file content
      Papa.parse(text, {
        header: true,
        complete: async (results) => {
          const newProducts = results.data.map((item) => ({
            name: item.name,          // Ensure the keys match your database schema
            category: item.category,
            status: item.status,
            unit: item.unit,
          }));
  
          try {
            // Assuming your backend has a mutation for adding multiple products
            const response = await uploadCsv({
              variables: {
                input: { products: newProducts }, // Adjust according to your mutation structure
              },
            });
  
            if (response.data.uploadCsv.success) {
              refetch(); // Refresh the product list after successful upload
              setErrorMessage("");
            } else {
              setErrorMessage("CSV upload failed: " + response.data.uploadCsv.errors);
            }
          } catch (error) {
            setErrorMessage("Error uploading CSV: " + error.message);
          }
        },
        error: (error) => {
          setErrorMessage(`Parsing failed: ${error.message}`);
        },
      });
    };
  
    reader.readAsText(csvFile); // Read the CSV file content
  };
  
  

  return (
    <>
      <h1>Product List</h1>
      <div className="product">
        <div className="category">
          <label>Select Category:</label>
          <select
            name="productCategory"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <button className="table-container__add-product-btn" onClick={openAddModal}>
          Add Product
        </button>
        <input
          type="file"
          accept=".csv"
          onChange={handleCsvChange}
          className="table-container__csv-input"
        />
        <button className="table-container__csv-btn" onClick={handleImportCsv}>
          Import CSV
        </button>
      </div>

      <div className="ag-theme-alpine table-container" style={{ width: "100%" }}>
        <AgGridReact
          rowData={[...filteredProducts, ...products]} // Combine products from API and CSV
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          domLayout="autoHeight"
        />

        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel={modalMode === "view" ? "View Product" : modalMode === "edit" ? "Edit Product" : "Add Product"}
            className="product-modal"
          >
            <div className="modal-header">
              <h2>{modalMode === "view" ? "View Product" : modalMode === "edit" ? "Edit Product" : "Add Product"}</h2>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {modalMode === "view" ? (
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
                    {categoryOptions.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
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
                      <option key={status} value={status}>{status}</option>
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
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
                <button
  type="submit"
  onClick={(e) => {
    e.preventDefault();
    modalMode === "add" ? handleAdd(formData) : handleUpdate(selectedProduct, formData); // Pass selectedProduct
  }}
>
  {modalMode === "add" ? "Add" : "Update"} Product
</button>

              </form>
            )}
          </Modal>
        )}
      </div>
    </>
  );
};

export default Products;
