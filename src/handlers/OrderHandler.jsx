import { useMutation } from "@apollo/client";
import { DELETE_ORDER } from "../mutations/OrderMutation";

export const useDeleteOrder = (refetch) => {
  const [deleteOrder] = useMutation(DELETE_ORDER, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Error deleting order:", error);
    },
  });

  return (id, recurring) => {
    deleteOrder({ variables: { id, recurring } });
  };
};
