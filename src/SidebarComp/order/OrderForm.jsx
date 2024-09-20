import React, { useState } from 'react';
import Select from 'react-select'; // Optional if using react-select
import '../../styles/order.css'
const OrderForm = () => {
  const [consumerName, setConsumerName] = useState('');
  const [customerBranch, setCustomerBranch] = useState('');

  // Example options for dropdowns
  const consumerOptions = [
    { value: 'consumer1', label: 'Consumer 1' },
    { value: 'consumer2', label: 'Consumer 2' },
    { value: 'consumer3', label: 'Consumer 3' },
  ];

  const branchOptions = [
    { value: 'branch1', label: 'Branch 1' },
    { value: 'branch2', label: 'Branch 2' },
    { value: 'branch3', label: 'Branch 3' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Consumer Name:', consumerName);
    console.log('Customer Branch:', customerBranch);
  };

  return (
    <div className="order-form">
      <h2>Order Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="consumer-name">Consumer Name:</label>
          <Select
            id="consumer-name"
            options={consumerOptions}
            onChange={(selectedOption) => setConsumerName(selectedOption.value)}
            placeholder="Select Consumer"
          />
        </div>
        <div className="form-group">
          <label htmlFor="customer-branch">Customer Branch:</label>
          <Select
            id="customer-branch"
            options={branchOptions}
            onChange={(selectedOption) => setCustomerBranch(selectedOption.value)}
            placeholder="Select Branch"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default OrderForm;
