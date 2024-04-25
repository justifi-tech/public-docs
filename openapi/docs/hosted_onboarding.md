In order to process payments, each of your customers (whom we refer to as `sub accounts`) will go through an approval process. JustiFi's hosted onboarding provides you with an easy-to-implement, user-friendly way to collect the required business and financial information from each sub accounts within your platform. Once approved, your sub account can process payments through JustiFi.

To onboard a new sub account via hosted onboarding
1. Create a sub account
2. Include JustiFi hosted onboarding in your application
3. (optional) Listen to success/fail message
4. Check the sub account's status


### Create a sub account

#### Create a sub account
```sh
curl -X POST \
  https://api.justifi.ai/v1/sub_accounts \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Sub account name"
  }'
```

Use the sub accounts API to [create a sub account](https://docs.justifi.tech/api-spec#tag/Sub-Accounts/operation/CreateSubAccount) on JustiFi that is associated with your platform. You will need the `account_id` from the account you create for the next step.

### Include JustiFi hosted onboarding in your application
To present the JustiFi hosted onboarding form to your user, create an iframe with a source of `https://accounts.justifi.ai/onboarding/SUB_ACCOUNT_ID`, where `SUB_ACCOUNT_ID` is the `account_id` that was created in the previous step. This iframe will present your user with a multi-step form where they can enter the business and financial information needed for approval. Upon submission, a success message will display.

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

### Check the sub account status

#### Retrieve a sub account
```sh
curl -X GET https://api.justifi.ai/v1/sub_accounts/ACCOUNT_ID \
    -H 'Authorization: Bearer [access_token]' \
    -H 'Accept: application/json'
```

Once your sub account submits the onboarding form, we'll review their information. This approval process can take up to a few business days. In order to check the account's onboarding status, call the [Get a Sub Account endpoint](https://docs.justifi.tech/api-spec#tag/Sub-Accounts/operation/GetSubAccount) or use an event publisher to subscribe to the `sub_account.updated` events
