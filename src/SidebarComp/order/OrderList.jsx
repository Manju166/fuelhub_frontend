import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Table, Modal, Button } from 'antd';
import { GET_ALL_ORDERS } from '../../query/OrderListQuery';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import OrderGroupForm from './OrderGroupForm'; // Import the form component
import '../../styles/orderForm.css';
import { useAddOrder, useDeleteOrder, useEditOrder } from '../../handlers/OrderHandler';

const OrderList = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_ORDERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({ status: '', tenantId: '', consumerId: '', frequency: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddOrder = useAddOrder(refetch, setIsModalOpen, setErrorMessage);
  const handleUpdateOrder = useEditOrder(refetch, setIsModalOpen, setErrorMessage);
  const handleDeleteOrder = useDeleteOrder(refetch);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Consumer ID',
      dataIndex: 'consumerId',
      key: 'consumerId',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Tenant ID',
      dataIndex: 'tenantId',
      key: 'tenantId',
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
    },
    {
      title: 'Recurring Status',
      dataIndex: 'recurringStatus',
      key: 'recurringStatus',
      render: (text, record) => (record.recurringStatus ? 'True' : 'False'),
    },
    {
      title: 'Line Item',
      key: 'lineItems',
      children: [
        {
          title: 'Product ID',
          key: 'productId',
          render: (text, record) =>
            record.lineItems
          ?.map((item) => <span key={item.productId}>{item.productId}</span>)
          .reduce((prev, curr) => [prev, ', ', curr], []) || 'N/A',        
        },
        {
          title: 'Status',
          dataIndex: 'lineItems',
          key: 'lineItemStatus',
          render: (text, record) =>
            record.lineItems?.map((item) => item.status).join(', ') || 'N/A',
        },
        {
          title: 'Quantity',
          dataIndex: 'lineItems',
          key: 'quantity',
          render: (text, record) =>
            record.lineItems?.map((item) => item.quantity).join(', ') || 'N/A',
        },
      ],
    },
    {
      title: 'Delivery Order',
      key: 'deliveryOrder',
      children: [
        {
          title: 'Consumer Outlet ID',
          dataIndex: 'deliveryOrder.consumerOutletId',
          key: 'consumerOutletId',
          render: (text, record) =>
            record.deliveryOrder?.consumerOutletId || 'N/A',
        },
        {
          title: 'Planned At',
          dataIndex: 'deliveryOrder.plannedAt',
          key: 'plannedAt',
          render: (text, record) =>
            record.deliveryOrder?.plannedAt
              ? new Date(record.deliveryOrder.plannedAt).toLocaleString()
              : 'N/A',
        },
        {
          title: 'Completed At',
          dataIndex: 'deliveryOrder.completedAt',
          key: 'completedAt',
          render: (text, record) =>
            record.deliveryOrder?.completedAt
              ? new Date(record.deliveryOrder.completedAt).toLocaleString()
              : 'N/A',
        },
      ],
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="action-buttons">
          <button onClick={() => handleView(record)}>
            <FaEye />
          </button>
          <button onClick={() => handleEdit(record)}>
            <FaEdit />
          </button>
          <button onClick={() => handleDeleteOrder(record.id, record.recurringStatus)}>
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  const orderGroups = data.getAllOrders.orderGroups.map((orderGroup) => ({
    id: orderGroup.id,
    status: orderGroup.status,
    tenantId: orderGroup.tenantId,
    consumerId: orderGroup.consumerId,
    frequency: orderGroup.frequency,
    recurringStatus: orderGroup.recurring,
    deliveryOrder: orderGroup.deliveryOrder,
    lineItems: orderGroup.deliveryOrder?.lineItems || [],
  }));

  const handleView = (record) => {
    setSelectedOrder(record);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setFormData({ status: '', tenantId: '', consumerId: '', frequency: '' });
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedOrder(record);
    setFormData({ 
      status: record.status, 
      tenantId: record.tenantId, 
      consumerId: record.consumerId, 
      frequency: record.frequency 
    });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const expandedRowRender = (record) => {
    return (
      <div>
        <h4>Line Items</h4>
        <Table
          columns={[
            {
              title: 'Product Name',
              dataIndex: 'product',
              render: (product) => product?.name || 'N/A',
              width: 200,
            },
            {
              title: 'Status',
              dataIndex: 'product',
              render: (product) => product?.status || 'N/A',
              width: 200,
            },
            {
              title: 'Category',
              dataIndex: 'product',
              render: (product) => product?.category || 'N/A',
              width: 200,
            },
            {
              title: 'Unit',
              dataIndex: 'product',
              render: (product) => product?.unit || 'N/A',
            },
          ]}
          dataSource={record.lineItems}
          pagination={false}
          rowKey="id"
        />
      </div>
    );
  };

  return (
    <div>
      <h1>Order List</h1>
      <Button type="primary" onClick={openAddModal}>Add Order</Button>
      <Table
        columns={columns}
        dataSource={orderGroups}
        rowKey="id"
        expandable={{
          expandedRowRender: expandedRowRender,
          rowExpandable: (record) => record.lineItems.length > 0,
        }}
      />
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          title={modalMode === 'view' ? 'View Order' : modalMode === 'edit' ? 'Edit Order' : 'Add Order'}
          footer={null}
        >
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {modalMode === 'view' ? (
            <div>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Consumer ID:</strong> {selectedOrder.consumerId}</p>
              <p><strong>Tenant ID:</strong> {selectedOrder.tenantId}</p>
            </div>
          ) : (
            <OrderGroupForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={modalMode === 'add' ? () => handleAddOrder(formData) : () => handleUpdateOrder(selectedOrder.id, formData)}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default OrderList;
