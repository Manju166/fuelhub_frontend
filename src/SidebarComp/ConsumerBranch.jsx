import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { AgGridReact } from "ag-grid-react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import { GET_OUTLETS } from "../query/ConsumerBranchQuery";
import {
  useAddOutlet,
  useEditOutlet,
  useDeleteOutlet,
} from "../handlers/ConsumerBranchHandler";
import "../styles/consumer.css";
Modal.setAppElement("#root");

function ConsumerBranch() {
  const { consumerId } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    consumerId: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const { loading, error, data, refetch } = useQuery(GET_OUTLETS, {
    variables: { id: consumerId },
  });

  const handleAdd = useAddOutlet(refetch, setIsModalOpen, setErrorMessage);
  const handleUpdate = useEditOutlet(refetch, setIsModalOpen, setErrorMessage);
  const handleDelete = useDeleteOutlet(refetch);

  const columnDefs = [
    { headerName: "ID", field: "id", sortable: true, filter: true, width: 70 },
    { headerName: "Name", field: "name", sortable: true, filter: true },
    {
      headerName: "Branch Address",
      field: "address",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Consumer ID",
      field: "consumerId",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Actions",
      field: "actions",
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
      width: 120,
    },
  ];

  const handleView = (branch) => {
    setSelectedBranch(branch);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEdit = (branch) => {
    setSelectedBranch(branch);
    setFormData({
      id: branch.id,
      name: branch.name,
      address: branch.address,
      consumerId: branch.consumerId,
    });
    setModalMode("edit");
    setIsModalOpen(true);
    setErrorMessage("");
  };

  const openAddModal = () => {
    setFormData({ name: "", address: "", consumerId });
    setModalMode("add");
    setIsModalOpen(true);
    setErrorMessage("");
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: There was an error fetching the data.</p>;

  return (
    <div className="consumerBranch">
      <h1>Outlet List for Consumer {consumerId}</h1>
      <div className="consumerheader">
        <div className="breadcrumb">
          <span>
            <Link to="/">Dashboard</Link>
          </span>{" "}
          /{" "}
          <Link to="/dashboard/consumer">
            <span>Consumer List</span>{" "}
          </Link>
        </div>
        <button
          className="table-container__add-branch-btn"
          onClick={openAddModal}
        >
          Add Outlet
        </button>
      </div>

      <div className="ag-theme-alpine table-container">
        <AgGridReact
          rowData={data.outlets.consumerOutlets}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          domLayout="autoHeight"
          className="table"
        />

        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel={
              modalMode === "view"
                ? "View Outlet"
                : modalMode === "edit"
                ? "Edit Outlet"
                : "Add Outlet"
            }
            className="consumer-modal"
          >
            <div className="modal-header">
              <h2>
                {modalMode === "view"
                  ? "View Outlet"
                  : modalMode === "edit"
                  ? "Edit Outlet"
                  : "Add Outlet"}
              </h2>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {modalMode === "view" ? (
              <div>
                <p>
                  <strong>Consumer Outlet ID:</strong> {selectedBranch?.id}
                </p>
                <p>
                  <strong>Consumer ID:</strong> {selectedBranch?.consumerId}
                </p>
                <p>
                  <strong>Name:</strong> {selectedBranch?.name}
                </p>
                <p>
                  <strong>Branch Address:</strong> {selectedBranch?.address}
                </p>
              </div>
            ) : (
              <form>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Branch Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>
                <div className="modal-footer">
                  {modalMode === "add" ? (
                    <button
                      type="button"
                      onClick={() => handleAdd(formData, consumerId)}
                    >
                      Add
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUpdate(formData)}
                    >
                      Update
                    </button>
                  )}
                  <button
                    type="button"
                    className="cancel"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </Modal>
        )}
      </div>
    </div>
  );
}

export default ConsumerBranch;
