import { useMutation } from "@apollo/client";
import {
  CREATE_RESOURCE,
  DELETE_RESOURCE,
  UPDATE_RESOURCE,
} from "../mutations/ResourceMutation";

export const useAddResource = (refetch, setIsModalOpen, setErrorMessage) => {
  const [createResource] = useMutation(CREATE_RESOURCE);

  return async (formData) => {
    if (!formData.resourceStatus.trim() || !formData.resourceCategory.trim()) {
      setErrorMessage("Status and Category cannot be empty.");
      return;
    }

    try {
      const { data } = await createResource({
        variables: {
          resourceInput: {
            resourceStatus: formData.resourceStatus,
            resourceCategory: formData.resourceCategory,
          },
        },
      });

      if (data.createResource.resource) {
        refetch();
        setIsModalOpen(false);
        setErrorMessage("");
      } else {
        setErrorMessage("Error adding resource");
      }
    } catch (error) {
      setErrorMessage("Error adding resource");
    }
  };
};

export const useEditResource = (refetch, setIsModalOpen, setErrorMessage) => {
  const [updateResource] = useMutation(UPDATE_RESOURCE);

  return async (selectedResource, formData) => {
    if (!formData.resourceStatus.trim() || !formData.resourceCategory.trim()) {
      setErrorMessage("Status and Category cannot be empty.");
      return;
    }

    try {
      const { data } = await updateResource({
        variables: {
          id: selectedResource.id,
          resource: {
            resourceStatus: formData.resourceStatus,
            resourceCategory: formData.resourceCategory,
          },
        },
      });

      if (data.updateResource.resource) {
        refetch();
        setIsModalOpen(false);
        setErrorMessage("");
      } else {
        setErrorMessage("Error updating resource");
      }
    } catch (error) {
      setErrorMessage("Error updating resource");
    }
  };
};

export const useDeleteResource = (refetch) => {
  const [deleteResource] = useMutation(DELETE_RESOURCE);

  return async (resource) => {
    try {
      const { data } = await deleteResource({ variables: { id: resource.id } });

      if (data.deleteResource.success) {
        refetch();
      } else {
        console.error("Error deleting resource:", data.deleteResource.errors);
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };
};
