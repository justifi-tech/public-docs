In order to process payments, each of your customers (whom we refer to as `sub accounts`) will go through an approval process. JustiFi's onboarding API allows you to utilize your own onboarding frontend to collect the required business and financial information from each of your sub accounts. Once approved, your sub account can process payments through JustiFi.

To onboard a new sub account via the API
1. Create a sub account
2. Create an onboarding entry
3. Check the sub account's status


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

Use the sub accounts API to [create a sub account](/tag/Sub-Accounts#operation/CreateSubAccount) on JustiFi that is associated with your platform. You will need the `account_id` from the sub account you create for the next step.


### Create an onboarding entry
Use the onboarding API to [create an onboarding entry](#operation/CreateOnboardingEntry) containing the required information for the sub account you made.


### Check the sub account status


#### Retrieve a sub account
```sh
curl -X GET https://api.justifi.ai/v1/sub_accounts/ACCOUNT_ID \
    -H 'Authorization: Bearer [access_token]' \
    -H 'Accept: application/json'
```

Once you create the account's onboarding entry, we'll review their information. This approval process can take up to a few business days. In order to check the account's onboarding status, call the [Get a Sub Account endpoint](/tag/Sub-Accounts#operation/GetSubAccount) or use an event publisher to subscribe to the `sub_account.updated` events.
