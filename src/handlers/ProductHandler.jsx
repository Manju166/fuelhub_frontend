import { useMutation } from '@apollo/client';
import { CREATE_PRODUCT, DELETE_PRODUCT, UPDATE_PRODUCT } from '../mutations/ProductMutation';

export const useProductHandlers = (refetch) => {
  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);

  const handleAdd = async (formData, setErrorMessage, setIsModalOpen) => {
    if (!formData.name.trim() || !formData.category.trim() || !formData.status.trim() || !formData.unit.trim()) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      const { data } = await createProduct({ variables: { productDetails: formData } });
      if (data.createProduct.product) {
        refetch();
        setIsModalOpen(false);
        setErrorMessage('');
      } else {
        setErrorMessage(data.createProduct.errors.join(', '));
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setErrorMessage('Failed to add product.');
    }
  };

  const handleUpdate = async (selectedProduct, formData, setErrorMessage, setIsModalOpen) => {
    if (!formData.name.trim() || !formData.category.trim() || !formData.status.trim() || !formData.unit.trim()) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      const { data } = await updateProduct({ variables: { productDetails: { id: selectedProduct.id, ...formData } } });
      if (data.updateProduct.product) {
        refetch();
        setIsModalOpen(false);
        setErrorMessage('');
      } else {
        setErrorMessage(data.updateProduct.errors.join(', '));
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setErrorMessage('Failed to update product.');
    }
  };

  const handleDelete = async (product, refetch) => {
    try {
      const { data } = await deleteProduct({ variables: { id: product.id } });
      if (data.deleteProduct.product) {
        refetch();
      } else {
        console.error('Error deleting product:', data.deleteProduct.errors.join(', '));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return { handleAdd, handleUpdate, handleDelete };
};
