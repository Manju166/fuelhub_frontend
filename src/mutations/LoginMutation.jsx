import { gql } from "@apollo/client";

const LOGIN_MUTATION = gql`
 mutation loginUser($email: String!, $password: String!, $tenantId: Int!) {
  loginUser(input: {
    email: $email
    password: $password
    tenantId: $tenantId
  }) {
    token
    message
    user {
      email
      jti
    }
  }
}
`;
export default LOGIN_MUTATION
