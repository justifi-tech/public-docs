A Checkout is used to initiate the collection of a Card Payment, ACH Payment, Insurance Quote Payment, BNPL Payment, or Card Reader payment (not yet available) in a single flow. This walk through will take you through collecting a payment via Checkout. We assume you have an activated Sub Account for payment processing. We will walk through using our API directly and using our Checkout component in vanilla node.js.

1. Get an access token
2. Create a Checkout
3. Generate a Web Component Token
4. Render the checkout component
5. Handle success/failure events


### Get an access token
On your backend, using your client id and client secret from the Developer > API keys section of the JustiFi dashboard. Using those, generate an (access token)[https://docs.justifi.tech/api-spec#tag/API-Credentials/operation/CreateAccessToken].

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
From you backend, (create a checkout)[#tag/Checkouts/operation/CreateCheckout]. A Checkout requires a payment amount and descripton. You can also pass a (Payment Method Group)[#tag/Payment-Method-Groups], if you want a customer's pre-entered card information to be shown on the checkout. To render the checkout component, you must set the origin_url parameter to be the domain on which you will render the component. For example, to develop locally you could specificy "http://localhost:3000" if you're developing on port 3000

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
      "payment_method_group_id": "(optional)",
      "origin_url": http://localhost:3000
    })
  });
  const data = await response.json();
  return data;
}

const subAccountId = "acc_5Et9iXrSSAZR2KSouQGAWi
const checkout = await makeCheckout(token, subAccountId);
```

### Generate a Web Component Token
To render the checkout component, you must generate a web component token. This is a short lived token which is meant to grant short term, fine grained access. The Checkout component requires the role of `write:checkout:{checkout id}` for the checkout you want to process and `write:tokenize:{account id}` with the sub account id you are processing the payment.
```
async function getWebComponentToken(token, checkoutId, accountId) {
  const response = await fetch('https://api.justifi.ai/v1/web_component_tokens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      "resources": [`write:checkout:${checkoutId}`, `write:tokenize:${accountId}]
    })
  });
  const data = await response.json();
  return data.access_token;
}

const webComponentToken = await getWebComponentToken(token, checkout.id, subAccountId);
```

### Render the checkout component
Using the web component token generated about and the checkout id, render the Checkout component. This will allow a customer to complete a checkout via Credit Card payment, ACH Payment, or BNPL payment depending upon the sub account configuration. It will also process payments for attached insurance quotes, if the Insurance components were used.
```
<justifi-checkout auth-token="${webComponentToken}" checkout-id="${checkout.id}"></justifi-checkout>
```

### Handle success/failure events
TODO

### API only checkout

### Tokenize or select a payment method
In order to complete a checkout, you must provide a payment method token. To avoid entering PCI scope, we recommend using our Card Form, Bank Account Form or Payment Form. You can also collect these directly and use our Payment Method APIs, but you will likely be entering PCI scope. Once you have tokenized a payment method, using the ID you can complete a checkout.

### Complete a checkout
To complete a checkout, using the (Complete Checkout)[https://docs.justifi.tech/api-spec#tag/Checkouts/operation/CompleteCheckout] API. Pass the payment_token collected above, as well as a Sub-Account header and an Idempotency-Key. A Checkout COmpletion will be recorded upon success or failure. Check the for payment_status attribute to be `succeeded` on the response, which means the payment has been collected. If insurance quotes have been attached, the outcome of those payments will be in the `additional_transactions` attribute.