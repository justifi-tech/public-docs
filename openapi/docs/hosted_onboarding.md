In order to process payments, each of your customers (whom we refer to as `businesses`) will have to be onboarded on our platform. Once they are added they go through an approval process. JustiFi's hosted onboarding provides you with an easy-to-implement, user-friendly way to collect the required business and financial information from each business within your platform. Once approved, your business can process payments through JustiFi.

To onboard a new business via hosted onboarding:
1. Get an access token
2. Create a business
3. Generate a web component token
4. Include JustiFi Hosted Onboarding in your application
5. (optional) Listen to success/fail message
6. Check the underwriting status of the sub account connected to the business

### 1. Get an access token
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

### 2. Create a business
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

### 3. Generate a web component token
To render the Hosted Onboarding form, you must generate a web component token. This is a short lived token which is meant to grant short term, fine grained access. The web component requires the role of `write:business:${businessId}` with the id of the business you created in the previous step.
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

### 4. Include JustiFi Hosted Onboarding in your application
To present the JustiFi hosted onboarding form to your user, create an iframe with with the following source:\
`https://components.justifi.ai/onboarding?business_id=BUSINESS_ID&web_component_token=WEB_COMPONENT_TOKEN`,\
where `BUSINESS_ID` is the `business_id` that was created in step 2 and `WEB_COMPONENT_TOKEN` is the `access_token` that was created in step 3.\
This iframe will present your user with a multi-step form where they can enter the business and financial information needed for approval. Upon submission, a success message will display.

<!-- (*Note: Passing a `sub_account_id` to the iframe instead of a `business_id` is still supported but will be deprecated soon*)} -->


### 5. (optional) Listen to success/fail message

#### Listen to success/fail message
```js
const handleOnboardingCompletion = (e) => {
  const { eventType } = e.data;
  if (eventType === 'submitSuccess') {
    // Handle successful onboarding
  }
  if (eventType === 'submitFailure') {
    // Handle failed onboarding
  }
};

window.addEventListener('message', handleOnboardingCompletion);
```

When the onboarding is completed, success or failure, the JustiFi iframe will send a postMessage. This allows your platform to take a next step, for example closing a modal, or redirecting to another page.

### 6. Check the underwriting status of the sub account connected to the business

Once your business submits the onboarding form
1. We will provision your business for payment processing and create a `sub account` for this business. This sub account is the representation of your business for payment processing.
2. We'll review the submitted information. This approval process can take up to a few business days. In order to check the account's onboarding status, call the [Get a Sub Account endpoint](https://docs.justifi.tech/api-spec#tag/Sub-Accounts/operation/GetSubAccount) or use an event publisher to subscribe to the [`sub_account.updated` events](https://docs.justifi.tech/api-spec#tag/Events/operation/subAccountEvent)

#### Retrieve a sub account
```sh
curl -X GET https://api.justifi.ai/v1/sub_accounts/ACCOUNT_ID \
    -H 'Authorization: Bearer [access_token]' \
    -H 'Accept: application/json'
```


