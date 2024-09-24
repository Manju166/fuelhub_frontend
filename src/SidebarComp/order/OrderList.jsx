import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Table, Modal, Button } from 'antd';
import { GET_ALL_ORDERS } from '../../query/OrderListQuery';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import OrderGroupForm from './OrderGroupForm'; // Import the form component
import '../../styles/orderForm.css';
import { useOrderHandler } from '../../handlers/OrderHander';

const OrderList = () => {
  const { loading, error, data } = useQuery(GET_ALL_ORDERS);
  const { handleCreateOrder, handleUpdateOrder, handleDeleteOrder } = useOrderHandler();
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isAddingOrder, setIsAddingOrder] = useState(false); 
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const orderGroups = data.getAllOrders.orderGroups.map(orderGroup => ({
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
    setIsViewModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedOrder(record);
    setIsEditModalVisible(true);
    setIsAddingOrder(false); // For editing
  };

  const handleAdd = () => {
    setSelectedOrder(null); // Clear form for adding new order
    setIsEditModalVisible(true);
    setIsAddingOrder(true); // For adding
  };

  const handleDelete = async (record) => {
    const success = await handleDeleteOrder(record.id, record.recurringStatus);
    if (success) {
      // Refresh the order list or handle the UI update as needed
      console.log('Order deleted successfully');
    }
  };

  const handleEditModalSubmit = async (values) => {
    console.log('Submitted Values:', values); // Log the input data to the console
    if (isAddingOrder) {
      await handleCreateOrder(values); // Add the new order
    } else {
      await handleUpdateOrder(selectedOrder.id, values); // Update the order
    }
    setIsEditModalVisible(false);
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
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
      title: 'Consumer ID',
      dataIndex: 'consumerId',
      key: 'consumerId',
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
              .reduce((prev, curr) => [prev, ', ', curr]) || 'N/A',
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
          <button onClick={() => handleDelete(record)}>
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

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
      <Button type="primary" onClick={handleAdd}>
        Add New Order
      </Button>
      <Table 
        columns={columns} 
        dataSource={orderGroups} 
        rowKey="id"
        expandable={{
          expandedRowRender: expandedRowRender,
          rowExpandable: (record) => record.lineItems.length > 0,
        }} 
      />

      {/* View Order Modal */}
      <Modal
        title="View Order"
        visible={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={null}
      >
        {selectedOrder && (
          <div>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Consumer ID:</strong> {selectedOrder.consumerId}</p>
            <p><strong>Tenant ID:</strong> {selectedOrder.tenantId}</p>
          </div>
        )}
      </Modal>

      <Modal
        title={isAddingOrder ? "Add New Order" : "Edit Order"}
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <OrderGroupForm
          initialValues={selectedOrder || {}}
          onFinish={handleEditModalSubmit}
        />
      </Modal>
    </div>
  );
};

export default OrderList;
