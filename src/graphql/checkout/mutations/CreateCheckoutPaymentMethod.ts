import { gql } from "@apollo/client";

export const CREATE_CHECKOUT_PAYMENT_METHOD_MUTATION = gql`
  mutation CreateCheckoutPaymentMethodMutation(
    $paymentMethod: String!
    $successUrl: String
    $failureUrl: String
    $cancelUrl: String
  ) {
    createCheckoutPaymentMethod(
      input: {
        paymentMethod: $paymentMethod
        paymentSuccessUrl: $successUrl
        paymentFailureUrl: $failureUrl
        paymentCancelUrl: $cancelUrl
      }
    ) {
      checkoutPaymentMethod {
        success
        message
        paymentGatewayUrl
        paymentData
      }
    }
  }
`;
