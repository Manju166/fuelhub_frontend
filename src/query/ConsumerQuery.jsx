import { gql } from "@apollo/client"

export const GET_CONSUMERS = gql`
query GetConsumers{
    consumers {
      id
      name
      tenantId
      address
      email
      phoneNumber
    }
  }
`;
