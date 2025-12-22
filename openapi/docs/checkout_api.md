A checkout is used to initiate the collection of a credit card payment, ACH payment, insurance quote payment, BNPL payment, or card reader payment in a single flow. This walk through will take you through collecting a payment via checkout. We assume you have an activated sub account for payment processing. 
If you want to offer BNPL or insurance as part of the checkout process you will need to implement the [Unified Fintech Checkout™](https://docs.justifi.tech/api-spec#tag/Checkout-via-Component).

1. Get an access token
2. Create a checkout
3. Tokenize or select a payment method
4. Complete a checkout


### Get an access token
On your backend, using your client id and client secret from the Developer > API keys section of the JustiFi dashboard, generate an [access token](https://docs.justifi.tech/api-spec#tag/API-Credentials/operation/CreateAccessToken).

```
function getToken() {
  return fetch('https://api.justifi.ai/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "client_id": "YOUR CLIENT ID",
      "client_secret": "YOUR CLIENT SECRET"
    })
  })
    .then(response => response.json())
    .then(data => data.access_token);
}

const token = await getToken();
```

### Create a checkout
From your backend create a checkout using the [Checkout API](https://docs.justifi.tech/api-spec#tag/Checkouts/operation/CreateCheckout). A checkout requires a payment `amount` and `descripton`. You can also pass a [Payment Method Group](https://docs.justifi.tech/api-spec#tag/Payment-Method-Groups), if you want a customer's pre-entered card information to be shown on the checkout. 

```
async function makeCheckout(token, subAccountId) {
  const response = await fetch('https://api.justifi.ai/v1/checkouts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Sub-Account': `${subAccount}`,
    },
    body: JSON.stringify({
      "amount": 1799,
      "description": "One Chocolate Donut",
      "payment_method_group_id": "(optional)"
    })
  });
  const data = await response.json();
  return data;
}

const subAccountId = "acc_5Et9iXrSSAZR2KSouQGAWi
const checkout = await makeCheckout(token, subAccountId);
```

### Tokenize or select a payment method
In order to complete a checkout, you must provide a payment method token. To avoid entering PCI scope, we recommend using our [Payment Form](/web-components/payment-facilitation/tokenize-payment-method/index) web component. You can also collect the payment method information directly and use our Payment Method APIs, but you will likely be entering PCI scope. Once you have tokenized a payment method you can complete a checkout using the ID of the payment method as payment method token.

### Complete a checkout
To complete a checkout, using the [Complete Checkout API](https://docs.justifi.tech/api-spec#tag/Checkouts/operation/CompleteCheckout) pass the payment method token collected above as well as an `Idempotency-Key`. A checkout completion will be recorded upon success or failure. If the `payment_status` attribute in the response is `succeeded` the payment has been collected. If insurance quotes have been attached, the outcome of those payments will be in the `additional_transactions` attribute.
