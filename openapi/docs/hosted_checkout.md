JustiFi provides a hosted checkout solution which allows you to collect a payment via a checkout form which we host. This solution provides less customization compared to using our PaymentsJS / Payment Web Components, however it requires less frontend integration work on your platform.

To collect a payment via hosted checkout, you must first ensure you ask the JustiFi team to enable the hosted checkout feature for your platform. We will also configure the branding for the checkout at this time.

Once you have configured hosted checkout, you must complete the following steps to complete a payment:

1. Create a Payment Intent
2. Create a Checkout Session
3. Redirect to our hosted checkout
4. Handle successful payment redirect
5. OR handle redirect back from checkout (optional)
6. Handle payment_intent.succeeded event (optional)

### Create a payment intent
[Create a Payment Intent](/tag/Payment-Intents#operation/CreatePaymentIntent) with the amount you'd like to capture, and a description of the payment.

### Create a checkout session
[Create a checkout session](/tag/Checkout-Sessions#operation/CreateCheckoutSession) which will be used to redirect your customer to the JustiFi checkout page. This in includes the payment intent, a url to redirect for a back/cancel action, and a url for redirect after completing the payment. At this point You have 24 hours to complete the checkout.

### Redirect to our hosted checkout
Using the checkout session id returned from the previous step, redirect to **https://checkout.justifi.ai/r/{checkout_session_id}**, this will redirect your customer our checkout form with your branding.

### Handle AFTER payment redirect
If the checkout is completed, we will redirect to the after payment url provided when the checkout session was created. Please note, it is possible the payment may not be in a pending, or failed status, so please interrogate the payment via API.

### OR handle redirect back from checkout
If a customer decides not to pay, we have a back button on the checkout form. If you provide a back_url, we will redirect the customer back to that url.

### (Optional) handle payment_intent.succeeded event
In addition to the after payment redirect, we recommend creating an [Event Publisher](/tag/Events) which publishes [`payment_intent.succeeded` events](/tag/Events#operation/paymentIntentEvent). This will provide a secondary means to ensure the payment was successful if there are network issues with the redirect.
