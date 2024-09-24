import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_ORDER_GROUP, UPDATE_ORDER_GROUP } from './orderHandler';

const OrderForm = ({ orderGroup, isEditing, onSave }) => {
  const [formState, setFormState] = useState({
    status: orderGroup?.status || '',
    plannedAt: orderGroup?.plannedAt || '',
    completedAt: orderGroup?.completedAt || '',
    consumerId: orderGroup?.consumerId || '',
    deliveryOrder: {
      plannedAt: orderGroup?.deliveryOrder?.plannedAt || '',
      completedAt: orderGroup?.deliveryOrder?.completedAt || '',
      consumerOutletId: orderGroup?.deliveryOrder?.consumerOutletId || '',
      lineItems: orderGroup?.deliveryOrder?.lineItems || [],
    },
  });

  const [createOrderGroup] = useMutation(CREATE_ORDER_GROUP);
  const [updateOrderGroup] = useMutation(UPDATE_ORDER_GROUP);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const variables = { orderGroupInput: formState };

    if (isEditing) {
      await updateOrderGroup({ variables: { id: orderGroup.id, ...variables } });
    } else {
      await createOrderGroup({ variables });
    }

    onSave();
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields for status, plannedAt, completedAt, consumerId, deliveryOrder */}
      <button type="submit">{isEditing ? 'Update Order' : 'Create Order'}</button>
    </form>
  );
};

export default OrderForm;
