import { useMutation } from '@apollo/client';
import { CREATE_ORDER, DELETE_ORDER, UPDATE_ORDER } from '../mutations/OrderMutation';

export const useAddOrder = (refetch, setIsModalOpen, setErrorMessage) => {
  const [createOrderGroup] = useMutation(CREATE_ORDER);
    const handleAddOrder = async (formData) => {
      console.log("Form Data:", formData);
      
      const lineItems = formData.deliveryOrder?.lineItems?.map((item) => ({
        productId: item.productId,
        status: item.status,
        quantity: item.quantity,
      })) || [];
  
      console.log("Mapped Line Items:", lineItems);
  
      try {
        const { data } = await createOrderGroup({ 

          variables: { 
            // orderGroupInput: {
            //   status: formData.status,
            //   tenantId: formData.tenantId,
            //   consumerId: formData.consumerId,
            //   frequency: formData.frequency,
            //   recurringStatus: formData.recurringStatus,
            //   deliveryOrder: {
            //     ...formData.deliveryOrder,
            //     lineItems: lineItems,  
            //   },
            // },
            orderGroupInput:{
              status:"pending",
              consumerId:37
               
                //   "status": "pending",
                //   "plannedAt": "2024-09-23",
                //   "completedAt": "2024-09-26",
                //   "consumerId": 37,
                //   "frequency": "daily",
                //   "recurring": true,
                //   "startDate": "2024-09-22",
                //   "endDate": "2024-09-24",
                //   "deliveryOrderAttributes": {
                //     "plannedAt": "2024-09-23",
                //     "completedAt": "2024-09-26",
                //     "consumerOutletId": 6,
                //     "lineItemsAttributes": [
                //       {
                //         "productId": 5,
                //         "status": "scheduled",
                //         "quantity": 5
                //       },
                //       {
                //         "productId": 6,
                //         "status": "scheduled",
                //         "quantity": 2
                //       }
                //     ]
                  
                // }}
            }
          },
        });
  
        if (data.createOrderGroup.errors.length > 0) {
          setErrorMessage('Error creating order group');
          return null;
        }
  
        refetch();
        setIsModalOpen(false);
        setErrorMessage('');
        return data.createOrderGroup.orderGroup;
      } catch (err) {
        setErrorMessage('Error creating order group');
        console.error(err);
      }
    };
  
    return handleAddOrder;
  };
  
  export const useEditOrder = (refetch, setIsModalOpen, setErrorMessage) => {
    const [updateOrderGroup] = useMutation(UPDATE_ORDER);
  
    const handleUpdateOrder = async (id, formData) => {
      try {
        const { data } = await updateOrderGroup({ variables: { id, formData } });
        if (data.updateOrderGroup.errors.length > 0) {
          setErrorMessage('Error updating order group');
          return null;
        }
        refetch();
        setIsModalOpen(false);
        setErrorMessage('');
        return data.updateOrderGroup.orderGroup;
      } catch (err) {
        setErrorMessage('Error updating order group');
        console.error(err);
      }
    };
    return handleUpdateOrder;
  };
  
  
export const useDeleteOrder = (refetch) => {
  const [deleteOrder] = useMutation(DELETE_ORDER, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Error deleting order:", error);
    }
  });

  return (id, recurring) => {
    deleteOrder({ variables: { id, recurring } });
  };
};
