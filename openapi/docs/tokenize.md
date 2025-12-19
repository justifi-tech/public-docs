The Tokenize Payment Method web component allows you to securely collect your customers' credit card and ACH (bank accout) payment methods without any sensitive data entering your system. 

The following guide takes you through the few simple steps of integrating the [Tokenize Payment Method web component](/web-components/payment-facilitation/tokenize-payment-method/index) on your platform. We assume you have an activated sub account for payment processing.

*Note: If you want to charge a payment at time of payment method tokenization consider using the [Unified Fintech Checkout™ web component](https://docs.justifi.tech/api-spec#tag/Checkout-via-Component) instead.*

1. Get an access token
2. Generate a web component token
3. Render the web component
4. Handle success/failure events
5. Listen to payment method events


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

### Generate a web component token
To render the web component you need to generate a web component token. This is a short lived token which is meant to grant short term, fine grained access. The Tokenize Payment Method web component requires the role of `write:tokenize:{accountId}` with the sub account id you are saving the payment method for. 

*Note: Consider setting up a [Platform Wallet Account](https://docs.justifi.tech/api-spec#tag/Platform-Wallet-Accounts) if your customers will use payment methods accross different sub accounts on your platform.*
```
async function getWebComponentToken(token, accountId) {
  const response = await fetch('https://api.justifi.ai/v1/web_component_tokens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      "resources": [`write:tokenize:${accountId}]
    })
  });
  const data = await response.json();
  return data.access_token;
}

const webComponentToken = await getWebComponentToken(token, subAccountId);
```

### Render the web component
Use the web component token generated above and the sub account id passed to the web component token API to render the [Tokenize Payment Method web component](/web-components/payment-facilitation/tokenize-payment-method/index). This will allow you to collect a customer's credit card or ACH payment method. It will not process a payment.

```
<justifi-tokenize-payment-method auth-token="${webComponentToken}" account-id="${subAccountId}"></justifi-tokenize-payment-method>
```

### Handle success/failure events
The web component will emit a `submitted` event when a payment method is submitted. This event will contain the response of the [Create Payment Method API](https://docs.justifi.tech/api-spec#tag/Payment-Methods/operation/CreatePaymentMethod) which includes the payment method `token` attribute.
To charge a payment to the newly tokenized payment method pass this token as payment method token to the [Payments API](https://docs.justifi.tech/api-spec#tag/Payments/operation/CreatePayment). 

An `error` event means there was an issue with the Tokenize Payment Method web component, connecting to the network, etc.

```
<script>
  const justifiTokenizePaymentMethod = document.querySelector('justifi-tokenize-payment-method');
  justifiTokenizePaymentMethod.addEventListener('submit-event', (event) => {
    console.log('Submitted data:', event.detail);
  });
  justifiTokenizePaymentMethod.addEventListener('error-event', (event) => {
    console.error('error-event:', event.detail);
  });
</script>
```

At this point, the payment method has been tokenized and can be used for future payments!

### Listen to payment method events
In addition to the web component events you can listen to [payment method specific events](https://docs.justifi.tech/api-spec#tag/Events) via event publisher. To set up an event publisher go to the Developer > Event Pubslisher section of the JustiFi dashboard. 