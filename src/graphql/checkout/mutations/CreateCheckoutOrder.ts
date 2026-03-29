import { gql } from "@apollo/client";

export const CREATE_CHECKOUT_ORDER_MUTATION = gql`
  mutation CreateCheckoutOrder {
    createCheckoutOrder(
      input: {}
    ) {
      checkoutOrder {
        id
        orderId
      }
    }
  }
`;
