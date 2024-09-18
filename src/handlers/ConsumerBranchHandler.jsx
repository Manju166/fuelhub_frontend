import { useMutation } from '@apollo/client';
import { CREATE_OUTLET, DELETE_OUTLET, UPDATE_OUTLET } from '../mutations/ConsumerBranchMutation';

export const useAddBranch = (refetch, setIsModalOpen, setErrorMessage) => {
  const [addBranch] = useMutation(CREATE_OUTLET);
  return async (formData) => {
    try {
      await addBranch({ variables: { input: { name: formData.name, branch: formData.branch, customerId: formData.customerId } } });
      refetch();  // Refresh the branch list
      setIsModalOpen(false);  // Close modal
    } catch (error) {
      setErrorMessage('Error adding branch: ' + error.message);
    }
    console.log(formData);
  };
};

export const useUpdateBranch = (refetch, setIsModalOpen, setErrorMessage) => {
  const [updateBranch] = useMutation(UPDATE_OUTLET);
  return async (branch, formData) => {
    try {
      await updateBranch({ variables: { id: branch.id, input: { name: formData.name, branch: formData.branch } } });
      refetch();  // Refresh the branch list
      setIsModalOpen(false);  // Close modal
    } catch (error) {
      setErrorMessage('Error updating branch: ' + error.message);
    }
  };
};

export const useDeleteBranch = (refetch) => {
  const [deleteBranch] = useMutation(DELETE_OUTLET);
  return async (branch) => {
    try {
      await deleteBranch({ variables: { id: branch.id } });
      refetch();  // Refresh the branch list
    } catch (error) {
      console.error('Error deleting branch: ' + error.message);
    }
  };
};
