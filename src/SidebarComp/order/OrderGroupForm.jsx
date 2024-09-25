import React, { useState } from 'react';
import { Form, Input, Select, Button, DatePicker, Radio } from 'antd';
import { useMutation, useQuery } from "@apollo/client";
import '../../styles/orderForm.css';
import { GET_CONSUMERS } from '../../query/ConsumerQuery';
import { GET_OUTLETS } from '../../query/ConsumerBranchQuery';
import { GET_PRODUCTS } from '../../query/ProductQuery'; 
import { CREATE_ORDER } from '../../mutations/OrderMutation';

const OrderGroupForm = () => {
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedConsumerId, setSelectedConsumerId] = useState(null);
  const [lineItems, setLineItems] = useState([{ productId: '', status: '', quantity: '' }]); 
  const { data: consumersData } = useQuery(GET_CONSUMERS);
  const { data: outletsData } = useQuery(GET_OUTLETS, {
    variables: { id: selectedConsumerId },
    skip: !selectedConsumerId, 
  });
  const { data: productsData } = useQuery(GET_PRODUCTS);
  const [createOrderGroup] = useMutation(CREATE_ORDER);
  const statusOptions = ["pending", "verified", "unverified"];
  
  const handleRecurringChange = (e) => {
    setIsRecurring(e.target.value);
  };

  const handleLineItemChange = (index, event) => {
    const { name, value } = event.target;
    const updatedLineItems = [...lineItems];
    updatedLineItems[index][name] = value;
    setLineItems(updatedLineItems);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { productId: '', status: '', quantity: '' }]);
  };

  const removeLineItem = (index) => {
    const updatedLineItems = lineItems.filter((_, i) => i !== index);
    setLineItems(updatedLineItems);
  };

  const handleSubmit = async(values) => {
    // Combine the form values with line items
   
    const orderData = {
      ...values,
      lineItems,
      completedAt:'2024-09-23',
      endDate:'2024-09-23',
      plannedAt:'2024-09-23',
      startDate:'2024-09-23'
    };
    console.log('values', orderData,values) 
    // console.log(orderData); 
    try {
      console.log("hello ")
      const { data } = await createOrderGroup({
        variables: { orderGroupInput: orderData }, // Pass the order data to the mutation
      });
      console.log("Order created:", data.createOrderGroup);
      // Optionally reset the form or navigate to a different page
    } catch (error) {
      console.error("Error creating order:", error);
      // Handle error, e.g., display an error message
    }
  };

  return (
    <Form onFinish={handleSubmit} className="order-group-form">
      <Form.Item label="Status" name="status" rules={[{ required: true }]}>
        <Select placeholder="Select Status" required>
          {statusOptions.map((status) => (
            <Select.Option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Planned Date" name="plannedAt" rules={[{ required: true }]}>
        <DatePicker required />
      </Form.Item>

      <Form.Item label="Completed Date" name="completedAt" rules={[{ required: true }]}>
        <DatePicker required />
      </Form.Item>

      <Form.Item label="Consumer" name="consumerId" rules={[{ required: true }]}>
        <Select placeholder="Select Consumer" onChange={(value) => setSelectedConsumerId(value)} required>
          {consumersData?.consumers.map((consumer) => (
            <Select.Option key={consumer.id} value={consumer.id}>
              {consumer.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Frequency" name="frequency" rules={[{ required: true }]}>
        <Select placeholder="Select Frequency" required>
          <Select.Option value="daily">Daily</Select.Option>
          <Select.Option value="weekly">Weekly</Select.Option>
          <Select.Option value="bi-weekly">Bi-Weekly</Select.Option>
          <Select.Option value="monthly">Monthly</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="Is Recurring?" name="recurring">
        <Radio.Group onChange={handleRecurringChange}>
          <Radio value={true}>True</Radio>
          <Radio value={false}>False</Radio>
        </Radio.Group>
      </Form.Item>

      {isRecurring && (
        <>
          <Form.Item label="Start Date" name="startDate" rules={[{ required: true }]}>
            <DatePicker required />
          </Form.Item>

          <Form.Item label="End Date" name="endDate" rules={[{ required: true }]}>
            <DatePicker required />
          </Form.Item>
        </>
      )}

      <Form.Item label="Delivery Planned Date" name="plannedAt" rules={[{ required: true }]}>
        <DatePicker required />
      </Form.Item>

      <Form.Item label="Delivery Completed Date" name="completedAt" rules={[{ required: true }]}>
        <DatePicker required />
      </Form.Item>

      {/* <Form.Item label="Consumer Outlet" name="consumerOutletId" rules={[{ required: true }]}>
        <Select placeholder="Select Outlet" disabled={!selectedConsumerId}>
          {outletsData?.outlets?.consumerOutlets.map((outlet) => (
            <Select.Option key={outlet.id} value={outlet.id}>
              {outlet.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item> */}

      {/* Line Items Section */}
      {/* <Form.Item label="Line Items"> */}
        {lineItems.map((lineItem, index) => (
          <div key={index} className="line-item-row">
            <Form.Item>
              <Select
                name="productId"
                value={lineItem.productId}
                onChange={(value) => handleLineItemChange(index, { target: { name: 'productId', value } })}
                placeholder="Select Product"
                required
              >
                {productsData?.products.products.map((product) => (
                  <Select.Option key={product.id} value={product.id}>
                    {product.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Select
                name="status"
                value={lineItem.status}
                onChange={(value) => handleLineItemChange(index, { target: { name: 'status', value } })}
                placeholder="Select Status"
                required
              >
                {statusOptions.map((status) => (
                  <Select.Option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Input
                type="number"
                name="quantity"
                value={lineItem.quantity}
                onChange={(e) => handleLineItemChange(index, e)}
                placeholder="Quantity"
                required
                min={0}
              />
            </Form.Item>

            <Button type="button" onClick={() => removeLineItem(index)}>Remove</Button>
          </div>
        ))}
        <Button type="button" onClick={addLineItem}>Add Line Item</Button>
      {/* </Form.Item> */}

      <Button type="primary" htmlType="submit">Submit</Button>
    </Form>
  );
};

export default OrderGroupForm;
