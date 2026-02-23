In order to process payments, each of your customers must be onboarded on the JustiFi platform. Once they are added they go through an approval process. JustiFi's [PaymentProvisioning web component](/web-components/entities/payment-provisioning) allows you to collect the required business and financial information from each of your customers. Once approved, your customer can process payments through JustiFi.

To onboard a new business via PaymentProvisioning web component

1. Get an access token
2. Create a business
3. Generate a web component token
4. Render the Payment Provisioning web component
5. Handle success/failure events of the web component
6. Check the sub account's status


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

### Create a business
From your backend create a business using the [Business API](https://docs.justifi.tech/api-spec#tag/Business/operation/CreateBusiness). A business only requires one parameter (e.g. `legal_name`) but you can pass as much information about your customer as you have. When you render the web component all the data you passed to the business will be pre-filled in the form and can be updated by your customer. 
```
async function createBusiness(token) {
  const response = await fetch('https://api.justifi.ai/v1/entities/business', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      "legal_name": "First Business"
    })
  });
  const data = await response.json();
  return data;
}

const business = await createBusiness(token);
```

### Generate a web component token
To render the PaymentProvisioning web component, you must generate a web component token. This is a short lived token which is meant to grant short term, fine grained access. The web component requires the role of `write:business:${businessId}` with the id of the business you created in the previous step.
```
async function getWebComponentToken(token, businessId) {
  const response = await fetch('https://api.justifi.ai/v1/web_component_tokens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      "resources": [`write:business:${businessId}`]
    })
  });
  const data = await response.json();
  return data.access_token;
}

const webComponentToken = await getWebComponentToken(token, business.id);
```

### Render the PaymentProvisioning web component
Using the web component token generated above and the business id, render the [PaymentProvisioning web component](/web-components/entities/payment-provisioning). This will allow your customer to provide all business information required for payment processing
```
<justifi-payment-provisioning auth-token="${webComponentToken}" business-id="${business.id}"></justifi-payment-provisioning>
```

### Handle success/failure events of the web component
The web component makes an API request every time the user moves to a `Next` step and when the user submits the form. Whenever the web component receives an API response it emits a `submitted` event that contains the API response.

When the form is submitted we provision the business and create a sub account for the business. The `submitted` event data will contain the response from the [Provisioning API request](https://docs.justifi.tech/api-spec#tag/Provisioning/operation/ProductProvisioning). If the provisioning request was successful the response will include the `sub_account_id` attribute of that newly created sub account. Otherwise, an error message can be presented to the user. Our example below covers both.

The `error` event means there was an issue with the PaymentProvisioning form connecting to the network, etc.

```
<script>
  const justifiPaymentProvisioning = document.querySelector('justifi-payment-provisioning');
  justifiPaymentProvisioning.addEventListener('submit-event', (event) => {
    if (event.details.data) {
      console.log("Form sumbission succeeded!");
    } else {
      console.log("An error occured")
    }
  });
  justifiPaymentProvisioning.addEventListener('error-event', (event) => {
    console.log(event);
  });
</script>
```

### Check the sub account's status
Once your business submits the onboarding form
1. We will provision your business for payment processing and create a `sub account` for this business as mentioned above. This sub account is the representation of your business for payment processing.
2. We'll review the submitted information. This underwriting process can take up to a few business days. Once approved the status of the sub account will be updated to `enabled` and payments can be processed. 

In order to check the account's onboarding status, call the [Get a Sub Account endpoint](https://docs.justifi.tech/api-spec#tag/Sub-Accounts/operation/GetSubAccount) or use an event publisher to subscribe to the [`sub_account.updated` events](https://docs.justifi.tech/api-spec#tag/Events/operation/subAccountEvent)

#### Retrieve a sub account

```
async function getBusiness(token, accountId) {
  const response = await fetch(`https://api.justifi.ai/v1/sub_accounts/${accountId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data;
}

const business = await getBusiness(toke, account.id);
```