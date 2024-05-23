In order to process payments, each of your customers (whom we refer to as `businesses`) will have to be onboarded on our platform. Once they are added they go through an approval process. JustiFi's hosted onboarding provides you with an easy-to-implement, user-friendly way to collect the required business and financial information from each business within your platform. Once approved, your business can process payments through JustiFi.

To onboard a new business via hosted onboarding
1. Create a business
2. Include JustiFi hosted onboarding in your application
3. (optional) Listen to success/fail message
4. Check the underwriting status of the sub account connected to the business



### Create a business

#### Create a business
```sh
curl -X POST \
  https://api.justifi.ai/v1/entities/business \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "legal_name": "legal business name"
  }'
```

Use the entities API to [create a business](https://docs.justifi.tech/api-spec#tag/Business/operation/CreateBusiness) on JustiFi that is associated with your platform. You will need the `business_id` from the business you create for the next step.

### Include JustiFi hosted onboarding in your application
To present the JustiFi hosted onboarding form to your user, create an iframe with a source of `https://onboarding.justifi.ai/v1/provisioning/BUSINESS_ID`, where `BUSINESS_ID` is the `business_id` that was created in the previous step. This iframe will present your user with a multi-step form where they can enter the business and financial information needed for approval. Upon submission, a success message will display.

(*Note: Passing a `sub_account_id` to the iframe instead of a `business_id` is still supported but will be deprecated soon*)

### (optional) Listen to success/fail message

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

### Check the underwriting status of the sub account connected to the business

Once your business submits the onboarding form
1. We will provision your business for payment processing and create a `sub account` for this business. This sub account is the representation of your business for payment processing.
2. We'll review the submitted information. This approval process can take up to a few business days. In order to check the account's onboarding status, call the [Get a Sub Account endpoint](https://docs.justifi.tech/api-spec#tag/Sub-Accounts/operation/GetSubAccount) or use an event publisher to subscribe to the [`sub_account.updated` events](https://docs.justifi.tech/api-spec#tag/Events/operation/subAccountEvent)

#### Retrieve a sub account
```sh
curl -X GET https://api.justifi.ai/v1/sub_accounts/ACCOUNT_ID \
    -H 'Authorization: Bearer [access_token]' \
    -H 'Accept: application/json'
```


