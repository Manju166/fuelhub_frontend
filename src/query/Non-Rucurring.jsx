import { gql } from "@apollo/client";

export const GET_ALL_NONRECURRING = gql`
query getallnonrecuringorder{
  getOrderGroups {
    orderGroup {
      id
      status
      tenantId
      consumerId
      frequency
      recurring
      deliveryOrder{
        id
        consumerOutletId
        plannedAt
        completedAt
        lineItems{
          id
          status
          quantity
          productId
         	product{
            name
            status
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