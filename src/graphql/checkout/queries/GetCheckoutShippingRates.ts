import { gql } from "@apollo/client";

export const GET_CHECKOUT_SHIPPING_RATES_QUERY = gql`
  query CheckoutShippingRates {
    collectionShippingRates {
      id
      code
      description
      method
      price
      label
    }
  }
`;
