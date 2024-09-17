import { gql } from '@apollo/client';

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($productDetails: ProductInput!) {
    createProduct(input: { productDetails: $productDetails }) {
      product {
        id
        name
        category
        status
        unit
      }
      errors
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($productDetails: ProductInput!) {
    updateProduct(input: { productDetails: $productDetails }) {
      product {
        id
        name
        category
        status
        unit
      }
      errors
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(input: { id: $id }) {
      product {
        id
        name
        category
        status
        unit
      }
      errors
      message
    }
  }
`;
