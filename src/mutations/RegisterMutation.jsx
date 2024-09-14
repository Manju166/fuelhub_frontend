import { gql } from "@apollo/client";

const REGISTER_MUTATION = gql`
  mutation createUser($email: String!, $password: String!, $passwordConfirmation: String!, $tenantId: Int!) {
  createUser(input: {
    email: $email
    password: $password
    passwordConfirmation: $passwordConfirmation
    tenantId: $tenantId
  }) {
    user {
      id
      email
      tenantId
    }
    errors
  }
}
`;
export default REGISTER_MUTATION
