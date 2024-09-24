import { gql } from '@apollo/client';

export const CREATE_ORDER = gql`
  mutation CreateOrderGroup($orderGroupInput: OrderGroupInput!) {
  createOrderGroup(input: { orderGroupInput: $orderGroupInput }) {
    errors
    orderGroup {
      id
      status
      plannedAt
      completedAt
      consumerId
      orderGroupId
      recurring
      frequency
      startDate
      endDate
      deliveryOrder {
        id
        plannedAt
        completedAt
        consumerOutletId
        lineItems {
          id
  				productId
          status
          quantity
          product{
            name
            status
            category
            unit
          }
          
        }
      }
    }
  }
}
`;

export const UPDATE_ORDER = gql`
  mutation UpdateOrderGroup($id:ID!, $orderGroupInput:OrderGroupInput!){
  updateOrderGroup(input: {id: $id, orderGroupInput: $orderGroupInput}){
    errors
    orderGroup {
      id
      status
      plannedAt
      completedAt
      consumerId
      recurring
      startDate
      endDate
      deliveryOrder {
        plannedAt
        completedAt
        consumerOutletId
        lineItems {
          id
          quantity
          status
          productId
          product{
            name
            category
            unit
            status
          }
        }
      }
    }
  }
}
`;

export const DELETE_ORDER = gql`
 mutation DeleteOrderGroup($id: ID!, $recurring: Boolean!) {
  deleteOrderGroup(input: { id: $id, recurring: $recurring }) {
    errors
    success
  }
}
`;
