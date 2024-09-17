import { gql } from '@apollo/client';

export const GET_RESOURCES = gql`
 query {
  getResources {
    resources {
      id
      resourceCategory
      resourceStatus
      tenantId
    }
    errors
  }
}
`;
