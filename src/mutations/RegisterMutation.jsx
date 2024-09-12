import { gql } from "@apollo/client";

const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!, $organizationId: ID!) {
    register(email: $email, password: $password, organizationId: $organizationId) {
      token
      user {
        id
        email
        password
      }
    }
  }
`;
export default REGISTER_MUTATION
