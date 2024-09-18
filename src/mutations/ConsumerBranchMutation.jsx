import { gql } from '@apollo/client';

export const CREATE_OUTLET = gql`
  mutation CreateOutlet($outletDetails: OutletInput!) {
    createOutlet(input: { outletDetails: $outletDetails }) {
      outlet {
        name
        id
        address
        consumerId
      }
      message
      errors
    }
  }
`;

export const DELETE_OUTLET = gql`
  mutation DeleteOutlet($id: ID!) {
    deleteOutlet(input: { id: $id }) {
      outlet {
        name
        address
        id
        consumerId
      }
      errors
      message
    }
  }
`;

export const UPDATE_OUTLET = gql`
  mutation UpdateOutlet($outletDetails: OutletInput!) {
    updateOutlet(input: { outletDetails: $outletDetails }) {
      outlet {
        name
        address
        id
        consumerId
      }
      errors
      message
    }
  }
`;
