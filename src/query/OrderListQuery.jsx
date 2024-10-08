import { gql } from '@apollo/client';

export const GET_ALL_ORDERS = gql`
query getAllOrders {
  getAllOrders {
    orderGroups {
      id
      status
      tenantId
      consumerId
      frequency
      recurring
      deliveryOrder {
        id
        consumerOutletId
        plannedAt
        completedAt
        lineItems {
          id
          status
          quantity
          productId
          product {
            name
            status
            category
            unit
          }
        }
      }
    }
    errors
  }
}
`;
