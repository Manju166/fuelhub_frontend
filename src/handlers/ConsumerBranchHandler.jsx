import { useMutation } from '@apollo/client';
import { CREATE_OUTLET, UPDATE_OUTLET, DELETE_OUTLET } from '../mutations/ConsumerBranchMutation';

export const useAddOutlet = (refetch, setIsModalOpen, setErrorMessage) => {
  const [createOutlet] = useMutation(CREATE_OUTLET);

  const handleAdd = async (formData, consumerId) => {
    const { name, address } = formData;

    if (!name.trim() || !address.trim()) {
      setErrorMessage('Name and Address cannot be empty.');
      return;
    }

    try {
      const { data } = await createOutlet({
        variables: { outletDetails: { name, address, consumerId } },
      });

      if (data.createOutlet.outlet) {
        refetch();
        setIsModalOpen(false);
        setErrorMessage('');
      } else {
        setErrorMessage('Failed to add outlet.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while adding the outlet.');
    }
  };

  return handleAdd;
};

export const useEditOutlet = (refetch, setIsModalOpen, setErrorMessage) => {
  const [updateOutlet] = useMutation(UPDATE_OUTLET);

  const handleUpdate = async (formData) => {
    try {
      await updateOutlet({
        variables: {
          outletDetails: {
            id: formData.id,
            name: formData.name,
            address: formData.address,
            consumerId: formData.consumerId,
          },
        },
      });

      refetch();
      setIsModalOpen(false);
    } catch (error) {
      setErrorMessage('Failed to update outlet.');
    }
  };

  return handleUpdate;
};

export const useDeleteOutlet = (refetch) => {
  const [deleteOutlet] = useMutation(DELETE_OUTLET);

  const handleDelete = async (outlet) => {
    try {
      await deleteOutlet({ variables: { id: outlet.id } });
      refetch();
    } catch (err) {
      console.error('Error deleting outlet:', err);
    }
  };

  return handleDelete;
};
