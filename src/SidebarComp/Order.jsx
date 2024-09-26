import  { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Table, Modal, Button, Form, Input, Select, DatePicker, Space, Divider, Radio } from 'antd';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { PlusOutlined } from '@ant-design/icons';
import { GET_ALL_ORDERS } from '../query/OrderListQuery';
import moment from 'moment';
import { CREATE_ORDER, UPDATE_ORDER } from '../mutations/OrderMutation';
import { GET_CONSUMERS } from '../query/ConsumerQuery';
import { GET_OUTLETS } from '../query/ConsumerBranchQuery';
import { GET_PRODUCTS } from '../query/ProductQuery';
import { useDeleteOrder } from './OrderHAndling';
import '../styles/orderForm.css'
const { Option } = Select;

const Order = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_ORDERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedConsumerId, setSelectedConsumerId] = useState(null);
  const [form] = Form.useForm();
  const statusOptions = ["pending", "verified", "unverified"];
  const lineItemStatus=['scheduled','skipped','delivered'];
  const { data: consumersData } = useQuery(GET_CONSUMERS);
  const { data: outletsData } = useQuery(GET_OUTLETS, {
variables: { id: selectedConsumerId },
    skip: !selectedConsumerId, 
  });
  const { data: productsData } = useQuery(GET_PRODUCTS);

  const [isRecurring, setIsRecurring] = useState(false);
  const [createOrder] = useMutation(CREATE_ORDER);
  const [updateOrder] = useMutation(UPDATE_ORDER);
  const handleDeleteOrder = useDeleteOrder(refetch);  if (loading) return <p>Loading...</p>;
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
            record.lineItems?.map((item) => <span key={item.productId}>{item.productId}</span>)
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
    plannedAt:orderGroup.plannedAt,
    completedAt:orderGroup.completedAt,
    tenantId: orderGroup.tenantId,
    consumerId: orderGroup.consumerId,
    frequency: orderGroup.frequency,
    recurringStatus: orderGroup.recurring,
    deliveryOrder: orderGroup.deliveryOrder,
    lineItems: orderGroup.deliveryOrder?.lineItems || [],
  }));
  const handleLineItemChange = (index, field, value) => {
    const lineItems = form.getFieldValue('lineItemsAttributes');
    const updatedLineItems = [...lineItems];
    updatedLineItems[index] = { ...updatedLineItems[index], [field]: value };
    form.setFieldsValue({ lineItems: updatedLineItems });
  };

  const handleView = (record) => {
    setSelectedOrder(record);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedOrder(record);
    setModalMode('edit');
    setIsModalOpen(true);
    
    form.setFieldsValue({
      status: record.status,
      plannedAt: moment(record.plannedAt),
      completedAt: moment(record.completedAt),
      consumerId: record.consumerId,
      frequency: record.frequency,
      recurring: record.recurringStatus,
      deliveryOrderAttributes: {
        plannedAt: record.deliveryOrder.plannedAt ? moment(record.deliveryOrder.plannedAt) : null,
        completedAt: record.deliveryOrder.completedAt ? moment(record.deliveryOrder.completedAt) : null,
        consumerOutletId: record.deliveryOrder.consumerOutletId,
      },
      lineItems: record.lineItems || [],  
    });
 };
 
  

  const handleAddOrder = () => {
    setSelectedOrder(null);
    setModalMode('add');
    setIsModalOpen(true);
    form.resetFields();
  };

  const onFinish = (values) => {
    console.log('Form Values:', values);
    

    if (modalMode === 'add') {
        handleCreateOrder(values);
    } else if (modalMode === 'edit') {
        handleUpdateOrder(values);
    }
    
    setIsModalOpen(false); 
};


const handleCreateOrder = async (values) => {
  try {
      const lineItems = values.lineItems || []; // Ensure lineItems is an array
      const missingStatusItems = lineItems.filter(item => !item.status);
      if (missingStatusItems.length > 0) {
          throw new Error(`All line items must have a status. Missing: ${JSON.stringify(missingStatusItems)}`);
      }
      
      const formattedValues = {
          ...values,
          plannedAt: values.plannedAt ? values.plannedAt.toISOString() : null,
          completedAt: values.completedAt ? values.completedAt.toISOString() : null,
          deliveryOrderAttributes: {
              ...values.deliveryOrderAttributes,
              plannedAt: values.deliveryOrderAttributes.plannedAt ? values.deliveryOrderAttributes.plannedAt.toISOString() : null,
              completedAt: values.deliveryOrderAttributes.completedAt ? values.deliveryOrderAttributes.completedAt.toISOString() : null,
              lineItemsAttributes: values.line.map(item => ({
                  productId: parseInt(item.productId, 10),
                  quantity: parseInt(item.quantity, 10),
                  status: item.status,
              })),
          },
      };

      console.log('Formatted Values:', formattedValues);

      const { data } = await createOrder({
          variables: {
              orderGroupInput: formattedValues,
          },
      });

      console.log('Order created:', data.createOrderGroup.orderGroup);
      refetch();
  } catch (error) {
      console.error('Error creating order:', error);
  }
};



const handleUpdateOrder = async (values) => {
  try {
    const lineItemsAttributes = Array.isArray(values.lineItems) ? values.lineItems : [];

    const formattedValues = {
      status: values.status,
      consumerId: values.consumerId,
      frequency: values.frequency,
      plannedAt: values.plannedAt?.toISOString(),
      completedAt: values.completedAt?.toISOString(),
      deliveryOrderAttributes: {
        consumerOutletId: values.deliveryOrderAttributes?.consumerOutletId || null,
        plannedAt: values.deliveryOrderAttributes?.plannedAt?.toISOString(),
        completedAt: values.deliveryOrderAttributes?.completedAt?.toISOString(),
        lineItemsAttributes: lineItemsAttributes.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          status: item.status,
        })),
      },
    };

    const { data } = await updateOrder({
      variables: { 
        id: selectedOrder.id,
        orderGroupInput: formattedValues 
      }
    });

    console.log('Order updated:', data.updateOrderGroup.orderGroup);
    refetch();
  } catch (error) {
    console.error('Error updating order:', error);
  }
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
      <Button type="primary" onClick={handleAddOrder} icon={<PlusOutlined />}>Add Order</Button>
      <Table columns={columns} dataSource={orderGroups} rowKey="id" expandable={{
          expandedRowRender: expandedRowRender,
          rowExpandable: (record) => record.lineItems.length > 0,
        }}/>
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title={modalMode === 'view' ? 'View Order' : modalMode === 'edit' ? 'Edit Order' : 'Add Order'}
        footer={modalMode === 'view' ? null : [
          <Button key="back" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            {modalMode === 'edit' ? 'Update' : 'Submit'}
          </Button>,
        ]}
      >
        {modalMode === 'view' ? (
          <div>
            <p><strong>Status:</strong> {selectedOrder?.status}</p>
            <p><strong>Consumer ID:</strong> {selectedOrder?.consumerId}</p>
            <p><strong>Tenant ID:</strong> {selectedOrder?.tenantId}</p>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            disabled={modalMode === 'view'}
          >
            <Form.Item label="Status" name="status" rules={[{ required: true }]}>
              <Select placeholder="Select Status" required>
                {statusOptions.map((status) => (
                  <Option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Planned Date" name="plannedAt" rules={[{ required: true }]}>
        <DatePicker required />
      </Form.Item>

      <Form.Item label="Completed Date" name="completedAt" rules={[{ required: true }]}>
        <DatePicker required />
      </Form.Item>
            <Form.Item label="Consumer ID" name="consumerId" rules={[{ required: true }]}>
            <Select placeholder="Select Consumer" onChange={(value) => setSelectedConsumerId(value)} required>
          {consumersData?.consumers.map((consumer) => (
            <Select.Option key={consumer.id} value={consumer.id}>
              {consumer.name}
            </Select.Option>
          ))}
        </Select>
            </Form.Item>

            <Form.Item label="Frequency" name="frequency" rules={[{ required: true }]}>
              <Select>
                <Option value="daily">Daily</Option>
                <Option value="weekly">Weekly</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Is Recurring?" name="recurring" rules={[{ required: true }]}>
              <Radio.Group onChange={(e) => setIsRecurring(e.target.value)}>
                <Radio value={true}>True</Radio>
                <Radio value={false}>False</Radio>
              </Radio.Group>
            </Form.Item>

            {isRecurring && (
              <>
                <Form.Item label="Start Date" name="startDate" rules={[{ required: true }]}>
                  <DatePicker format="YYYY-MM-DD" required />
                </Form.Item>

                <Form.Item label="End Date" name="endDate" rules={[{ required: true }]}>
                  <DatePicker format="YYYY-MM-DD" required />
                </Form.Item>
              </>
            )}

            <Divider />

            <h4>Delivery Order</h4>
            

            <Form.Item label="Planned At" name={['deliveryOrderAttributes', 'plannedAt']} rules={[{ required: true }]}>
              <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime required />
            </Form.Item>

            <Form.Item label="Completed At" name={['deliveryOrderAttributes', 'completedAt']} rules={[{ required: true }]}>
              <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime required />
            </Form.Item>
            <Form.Item label="Consumer Outlet" name={['deliveryOrderAttributes', 'consumerOutletId']} rules={[{ required: true }]}>
        <Select placeholder="Select Outlet" disabled={!selectedConsumerId}>
          {outletsData?.outlets?.consumerOutlets.map((outlet) => (
            <Select.Option key={outlet.id} value={outlet.id}>
              {outlet.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
            <Divider />

            <h4>Line Items</h4>
            <Form.List name="lineItemsAttributes">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item {...restField} name={[name, 'productId']} fieldKey={[fieldKey, 'productId']}>
                  <Select onChange={(value) => handleLineItemChange(name, 'productId', value)}>
                  {productsData?.products.products.map((product) => (
                  <Select.Option key={product.id} value={product.id}>
                    {product.name}
                  </Select.Option>
                ))}
                  </Select>
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'quantity']} fieldKey={[fieldKey, 'quantity']} rules={[{ required: true, message: 'Missing quantity' }]}>
                        <Input placeholder="Quantity" type="number" />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'status']} fieldKey={[fieldKey, 'status']} rules={[{ required: true, message: 'Missing status' }]}>
                      <Select placeholder="Select Status" required>
                {lineItemStatus.map((status) => (
                  <Option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Option>
                ))}
              </Select>
                      </Form.Item>
                      <Button type="link" onClick={() => remove(name)}>Remove</Button>
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Line Item
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Order;
