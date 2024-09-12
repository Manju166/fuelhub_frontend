import { gql } from "@apollo/client";

export const GET_TENANTS = gql`
  query AllSearchTenantby_id {
    tenants {
      id
      name
    }
  }
`;
