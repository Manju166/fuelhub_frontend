import { useMutation } from '@apollo/client';
import { CREATE_ORDER, DELETE_ORDER, UPDATE_ORDER } from '../mutations/OrderMutation';

export const useOrderHandler = () => {
  // Handler for adding an order group
  const [createOrderGroup, { loading: addingLoading, error: addError }] = useMutation(CREATE_ORDER);
  const addOrderGroup = async (orderGroupInput) => {
    try {
      const { data } = await createOrderGroup({ variables: { orderGroupInput } });
      if (data.createOrderGroup.errors.length > 0) {
        console.error(data.createOrderGroup.errors);
        return null;
      }
      return data.createOrderGroup.orderGroup; // Return the created order group
    } catch (err) {
      console.error('Error creating order group:', err);
    }
  };

  // Handler for updating an order group
  const [updateOrderGroup, { loading: updatingLoading, error: updateError }] = useMutation(UPDATE_ORDER);
  const updateOrder = async (id, orderGroupInput) => {
    try {
      const { data } = await updateOrderGroup({ variables: { id, orderGroupInput } });
      if (data.updateOrderGroup.errors.length > 0) {
        console.error(data.updateOrderGroup.errors);
        return null;
      }
      return data.updateOrderGroup.orderGroup; // Return the updated order group
    } catch (err) {
      console.error('Error updating order group:', err);
    }
  };

  // Handler for deleting an order group
  const [deleteOrderGroup, { loading: deletingLoading, error: deleteError }] = useMutation(DELETE_ORDER);
  const removeOrderGroup = async (id, recurring) => {
    try {
      const { data } = await deleteOrderGroup({ variables: { id, recurring } });
      if (data.deleteOrderGroup.errors.length > 0) {
        console.error(data.deleteOrderGroup.errors);
        return null;
      }
      return data.deleteOrderGroup.success; // Return success status
    } catch (err) {
      console.error('Error deleting order group:', err);
    }
  };

  return {
    addOrderGroup,
    addingLoading,
    addError,
    updateOrder,
    updatingLoading,
    updateError,
    removeOrderGroup,
    deletingLoading,
    deleteError,
  };
};
