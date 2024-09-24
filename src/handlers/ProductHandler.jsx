import { useMutation } from "@apollo/client";
import { CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT } from "../mutations/ProductMutation";

export const useAddProduct = (refetch, setIsModalOpen, setErrorMessage) => {
  const [createProduct] = useMutation(CREATE_PRODUCT);

  const handleAdd = async (formData) => {
    if (
      !formData.name.trim() ||
      !formData.category.trim() ||
      !formData.status.trim() ||
      !formData.unit.trim()
    ) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      const { data } = await createProduct({
        variables: { productDetails: formData },
      });
      if (data.createProduct.product) {
        refetch();
        setIsModalOpen(false);
        setErrorMessage("");
      } else {
        setErrorMessage(data.createProduct.errors.join(", "));
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
  return handleAdd;
}
export const useEditProduct = (refetch, setIsModalOpen, setErrorMessage) => {
  const [updateProduct] = useMutation(UPDATE_PRODUCT);

  const handleUpdate = async (selectedProduct, formData) => {
    if (
      !formData.name.trim() ||
      !formData.category.trim() ||
      !formData.status.trim() ||
      !formData.unit.trim()
    ) {
      setErrorMessage("All fields are required.");
      return;
    }
  
    try {
      const { data } = await updateProduct({
        variables: { 
          productDetails: { 
            id: selectedProduct.id, // Ensure the ID is included
            ...formData 
          } 
        },
      });
  
      if (data.updateProduct.product) {
        refetch();
        setIsModalOpen(false);
        setErrorMessage("");
      } else {
        setErrorMessage(data.updateProduct.errors.join(", "));
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setErrorMessage("An error occurred while updating the product.");
    }
  };

  return handleUpdate; // Return handleUpdate so it can be used
};

export const useDeleteProduct = (refetch) => {
  const [deleteProduct] = useMutation(DELETE_PRODUCT);

  const handleDelete = async (product) => {
    try {
      const { data } = await deleteProduct({ variables: { id: product.id } });
      if (data.deleteProduct.product) {
        refetch();
      } else {
        console.error(
          "Error deleting product:",
          data.deleteProduct.errors.join(", ")
        );
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  return handleDelete;
};
