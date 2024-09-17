import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
query{ 
  products{
    products{
      id
      category
      name
      status
      unit
    }
    errors
  }
}
`;