import React, { useState } from 'react';
import { Form, Input, Select, Button, DatePicker, Radio } from 'antd';
import { useQuery } from "@apollo/client";
import '../../styles/orderForm.css';
import { GET_CONSUMERS } from '../../query/ConsumerQuery';
import { GET_OUTLETS } from '../../query/ConsumerBranchQuery';
import { GET_PRODUCTS } from '../../query/ProductQuery'; 

const OrderGroupForm = () => {
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedConsumerId, setSelectedConsumerId] = useState(null);

  const { data: consumersData, loading: consumersLoading } = useQuery(GET_CONSUMERS);
  
  const { data: outletsData, loading: outletsLoading } = useQuery(GET_OUTLETS, {
    variables: { id: selectedConsumerId },
    skip: !selectedConsumerId, 
  });
  
  const { data: productsData, loading: productsLoading } = useQuery(GET_PRODUCTS);

  const statusOptions = ["pending", "verified", "unverified"];
  
  const handleRecurringChange = (e) => {
    setIsRecurring(e.target.value);
  };

  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
    <Form onFinish={handleSubmit} layout="vertical" className="order-group-form">
      <div className="form-row">
        <Form.Item label="Status" name="status" className="form-item" rules={[{ required: true }]}>
          <Select loading={productsLoading}>
            {statusOptions.map((status) => (
              <Select.Option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)} {/* Capitalize first letter */}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      <div className="form-row">
        <Form.Item label="Planned Date" name="plannedAt" className="form-item" rules={[{ required: true, message: 'Please select Planned date' }]}>
          <DatePicker />
        </Form.Item>

        <Form.Item label="Completed Date" name="completedAt" className="form-item"
        rules={[{ required: true, message: 'Please select completed date' }]}>
          <DatePicker />
        </Form.Item>
      </div>

      <div className="form-row">
        <Form.Item label="Consumer" name="consumerId" className="form-item" rules={[{ required: true }]}>
          <Select
            loading={consumersLoading}
            onChange={(value) => setSelectedConsumerId(value)}
          >
            {consumersData?.consumers.map((consumer) => (
              <Select.Option key={consumer.id} value={consumer.id}>
                {consumer.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Frequency" name="frequency" className="form-item" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="daily">Daily</Select.Option>
            <Select.Option value="weekly">Weekly</Select.Option>
            <Select.Option value="bi-weekly">Bi-Weekly</Select.Option>
            <Select.Option value="monthly">Monthly</Select.Option>
          </Select>
        </Form.Item>
      </div>

      {/* Recurring Radio Button */}
      <div className="form-row">
        <Form.Item label="Is Recurring?" name="recurring" className="form-item">
          <Radio.Group onChange={handleRecurringChange}>
            <Radio value={true}>True</Radio>
            <Radio value={false}>False</Radio>
          </Radio.Group>
        </Form.Item>
      </div>

      {/* Conditional Recurring Fields */}
      {isRecurring && (
        <div className="form-row">
          <Form.Item label="Start Date" name="startDate" className="form-item" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>

          <Form.Item label="End Date" name="endDate" className="form-item" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
        </div>
      )}

      {/* Delivery Order Section */}
      <div className="form-row">
        <Form.Item label="Delivery Planned Date" name={['delivery', 'plannedAt']} className="form-item" rules={[{ required: true, message: 'Please select Planned date' }]}>
          <DatePicker />
        </Form.Item>

        <Form.Item label="Delivery Completed Date" name={['delivery', 'completedAt']} className="form-item" 
        rules={[{ required: true, message: 'Please select completed date' }]}>
          <DatePicker />
        </Form.Item>
      </div>

      {/* ConsumerOutletId Dropdown */}
      <div className="form-row">
        <Form.Item label="Consumer Outlet" name={['delivery', 'consumerOutletId']} className="form-item" rules={[{ required: true, message: 'Please enter Consumer Outlet ID' }]}>
          <Select
            loading={outletsLoading}
            disabled={!selectedConsumerId}
          >
            {outletsData?.outlets?.consumerOutlets.map((outlet) => (
              <Select.Option key={outlet.id} value={outlet.id}>
                {outlet.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      {/* Line Items Section */}
      <Form.List name={['delivery', 'lineItems']}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey }) => (
              <div key={key} className="form-row line-item-row">
                <Form.Item label="Product" name={[name, 'productId']} className="form-item" fieldKey={[fieldKey, 'productId']} rules={[{ required: true, message:'product id is requiredd' }]}>
                  <Select loading={productsLoading}>
                    {productsData?.products.products.map((product) => (
                      <Select.Option key={product.id} value={product.id}>
                        {product.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Status" name={[name, 'status']} className="form-item" fieldKey={[fieldKey, 'status']} rules={[{ required: true, message:'product status is required' }]}>
                  <Select>
                    {statusOptions.map((status) => (
                      <Select.Option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)} 
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Quantity"
                  name={[name, 'quantity']}
                  className="form-item"
                  fieldKey={[fieldKey, 'quantity']}
                  rules={[
                    { required: true, message: 'Quantity is required' },
                    { type: 'number', min: 0, message: 'Quantity must be a non-negative number' },
                  ]}
                  validateTrigger={['onBlur', 'onChange']} // Trigger validation on blur or change
                >
                  <Input type="number" min={0} />
                </Form.Item>

                <Button type="danger" onClick={() => remove(name)}>Remove</Button>
              </div>
            ))}
            <Button type="dashed" onClick={() => add()}>Add Line Item</Button>
          </>
        )}
      </Form.List>


      <Button type="primary" htmlType="submit">Submit</Button>
    </Form>
  );
};

export default OrderGroupForm;

