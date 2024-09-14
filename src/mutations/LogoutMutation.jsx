import { gql } from "@apollo/client";

const LOGOUT_USER = gql`
  mutation logout {
    logoutUser(input: {}) {
      success
      message
    }
  }
`;
export default LOGOUT_USER;