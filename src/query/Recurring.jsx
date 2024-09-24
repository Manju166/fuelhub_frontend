import { gql } from "@apollo/client"

export const GET_ALL_RECURRING = gql`
query GetAllRecurringJobs {
    recurringJobs {
      id
      status
      recurring
      frequency
      startDate
      endDate
      consumerId
      deliveryOrder{
        id
        plannedAt
        consumerOutletId
        completedAt
        lineItems{
          id
          productId
          quantity
          status
          product{
            name
            unit
            status
            category
          }
        }
      }
    }
  }
  `;