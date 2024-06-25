_**NOTE: This API is under active development and subject to change**_

JustiFi provides a card present solution which allows you to collect a payment via a terminal provider via one of our technology partners.

To collect a payment via terminal, you must first ensure you ask the JustiFi team to enable the card present feature for your platform. Next, we will work to provision and configure terminals for your sub accounts.

Once you have configured a terminal, you must complete the following steps to complete a payment:

1. Create a Checkout
2. Send a checkout to a terminal
3. Terminal processes payment async
4. Handle checkout.completed event (recommended)
5. OR poll checkouts API for status change (optional)

### Create a checkout
[Create a Checkout](https://docs.justifi.tech/api-spec#tag/Checkouts/operation/CreateCheckout) with the amount you'd like to capture, and a description of the payment.

### Send a checkout to a terminal
[POST to the terminal pay endpoint](https://docs.justifi.tech/api-spec#tag/Terminals/operation/payTerminal) which will be used to send a your checkout to a terminal for processing. This process can take some time as it requires customer interaction. For this reason, the API will return immediately but the process is asynchronusly happening on a terminal.

### Terminal processes payment async
At this point, the process is handed over to the terminal to complete. Once the payment transaction is completed, we will publish an event for you to continue the process and take further action, as noted in the next step.

### Handle checkout.completed event
Create an [Event Publisher](https://docs.justifi.tech/api-spec#tag/Events) which publishes [`checkout.completed` events](https://docs.justifi.tech/api-spec#tag/Events/operation/paymentIntentEvent). This will provide a means to ensure the payment was successful. You can also listen to checkout completion events, for example a checkout.completion.failed event will be published each time a card is attempted to be processed but the transaction fails for some reason.

### Poll checkouts API for status change
If you do not have the ability to handle event publishing, you could poll our checkout API with the id of the checkout you are processing. Contine to poll until the checkout status attribute changes. We recommend you use the checkout events instead of this approach.