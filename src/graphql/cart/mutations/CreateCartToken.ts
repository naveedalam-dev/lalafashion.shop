import { gql } from "@apollo/client";

export const CREATE_CART_TOKEN_MUTATION = gql`
  mutation CreateCart {
    createCartToken(input: {}) {
      cartToken {
         id
      cartToken
      customerId
      success
      message
      sessionToken
      isGuest
      }
    }
  }
`;
