import { useQuery, gql } from '@apollo/client';

const GET_ALL_RECURRING_JOBS = gql`
  query GetAllRecurringJobs {
    recurringJobs {
      id
      status
      frequency
      startDate
      endDate
      consumerId
      parentId
      deliveryOrder {
        id
        plannedAt
        consumerOutletId
        completedAt
        lineItems {
          id
          name
          unit
          quantity
          status
        }
      }
    }
  }
`;