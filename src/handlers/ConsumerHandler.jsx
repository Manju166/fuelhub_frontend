import { useMutation } from '@apollo/client';
import { CREATE_CONSUMER, UPDATE_CONSUMER, DELETE_CONSUMER } from '../mutations/ConsumerMutation';

export const useAddConsumer = (refetch, setIsModalOpen, setErrorMessage) => {
  const [createConsumer] = useMutation(CREATE_CONSUMER);

  const handleAdd = async (formData) => {
    if (!formData.name.trim() || !formData.address.trim()) {
      setErrorMessage('Name and Address cannot be empty.');
      return;
    }

    try {
      const { data } = await createConsumer({
        variables: { consumerDetails: { name: formData.name, address: formData.address, email: formData.email, phoneNumber: formData.phoneNumber } },
      });

      if (data.createConsumer.consumer) {
        refetch();  
        setIsModalOpen(false);
        setErrorMessage('');
      } else {
        console.error('Error adding consumer:', data.createConsumer.errors);
      }
    } catch (error) {
      console.error('Error adding consumer:', error);
    }
  };

  return handleAdd;
};

export const useEditConsumer = (refetch, setIsModalOpen, setErrorMessage) => {
  const [updateConsumer] = useMutation(UPDATE_CONSUMER);

  const handleUpdate = async (selectedConsumer, formData) => {
    const { id } = selectedConsumer;
    if (!formData.name.trim() || !formData.address.trim()) {
      setErrorMessage('Name and Address cannot be empty.');
      return;
    }

    try {
      const { data } = await updateConsumer({
        variables: { id, consumerDetails: { name: formData.name, address: formData.address, email: formData.email, phoneNumber: formData.phoneNumber } },
      });

      if (data.updateConsumer.consumer) {
        refetch(); 
        setIsModalOpen(false);
        setErrorMessage('');
        console.log('Consumer updated:', data.updateConsumer.consumer);
      } else {
        console.error('Error updating consumer:', data.updateConsumer.errors);
      }
    } catch (error) {
      console.error('Error updating consumer:', error);
    }
  };

  return handleUpdate;
};

export const useDeleteConsumer = (refetch) => {
  const [deleteConsumer] = useMutation(DELETE_CONSUMER);

  const handleDelete = async (consumer) => {
    const { id } = consumer;
    try {
      const { data } = await deleteConsumer({ variables: { input: { id } } });

      if (data.deleteConsumer.success) {
        refetch();  // Refetch consumers after deleting
        console.log('Consumer deleted:', data.deleteConsumer.success);
      } else {
        console.error('Error deleting consumer:', data.deleteConsumer.errors);
      }
    } catch (error) {
      console.error('Error deleting consumer:', error);
    }
  };

  return handleDelete;
};
