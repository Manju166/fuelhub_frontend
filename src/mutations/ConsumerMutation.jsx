import { gql } from '@apollo/client';

export const CREATE_CONSUMER = gql`
  mutation CreateConsumer($consumerDetails: ConsumerInput!) {
    createConsumer(input: { consumerDetails: $consumerDetails }) {
      consumer {
        name
        address
        tenantId
      }
      errors
    }
  }
`;

export const UPDATE_CONSUMER = gql`
  mutation UpdateConsumer($id: ID!, $consumerDetails: ConsumerInput!) {
    updateConsumer(input: { id: $id, consumerDetails: $consumerDetails }) {
      consumer {
        name
        tenantId
        id
      }
      errors
    }
  }
`;

export const DELETE_CONSUMER = gql`
  mutation DeleteConsumer($input: DeleteConsumerInput!) {
    deleteConsumer(input: $input) {
      success
      errors
    }
  }
`;
