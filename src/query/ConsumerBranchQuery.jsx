
import { gql } from "@apollo/client";

export const GET_OUTLETS = gql`
  query GetOutlet($id: ID!) {
    outlets(id: $id) {
      consumerOutlets {
        name
        id
        consumerId
        address
      }
    }
  }
`;
