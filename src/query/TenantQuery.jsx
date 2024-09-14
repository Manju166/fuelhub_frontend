import { gql } from "@apollo/client";

export const GET_TENANTS =  gql`
 query GetTenants {
  tenants{
    id
    name
   }
}
`;
