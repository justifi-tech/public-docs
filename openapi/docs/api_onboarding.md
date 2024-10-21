In order to process payments, each of your customers (whom we refer to as `businesses`) will have to be onboarded on the JustiFi platform. Once they are added they go through an approval process. JustiFi's onboarding API allows you to utilize your own onboarding frontend to collect the required business and financial information from each of your businesses. Once approved, your business can process payments through JustiFi.

To onboard a new business via the API
1. Create a business
2. Create a bank account
3. Upload documents
4. Accept terms and conditions
5. Provision the business
6. Check the sub account's status


### Create a business

#### Create a business
```sh
curl -X POST \
  https://api.justifi.ai/v1/entities/business \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "legal_name": "Business name"
  }'
```

Use the business API to [create a business](https://docs.justifi.tech/api-spec#tag/Business/operation/CreateBusiness) on JustiFi that is associated with your platform. The create business API endpoint does not require any parameters but they will be required when the business is provisioned (see step 5).
You will need the ID from the business you create for the next steps.


### Create a bank account
Use the bank account API to [create a bank account](https://docs.justifi.tech/api-spec#tag/Bank-Account/operation/CreateBankAccount). This bank account will be used to pay out earnings for payment processing to the business.


### Upload documents
Use the document API to [upload a document](https://docs.justifi.tech/api-spec#tag/Document/operation/CreateDocument). The minimum document requirement (for small businesses and sole proprietors) is a voided check.


### Accepte terms and conditions
Use the terms and conditions API to [accept terms for payment processing](https://docs.justifi.tech/api-spec#tag/Terms-and-Conditions/operation/TermsAndConditions). 

### Provision the business

#### Provision the business for payment processing
```sh
curl -X POST \
  https://api.justifi.ai/v1/entities/provisioning \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{
      "business_id": "biz_123",
      "product_category": "payment"
      }'
```

Once you have submitted all business related information use the provisioning API to [provision the business for payment processing](https://docs.justifi.tech/api-spec#tag/Provisioning/operation/ProductProvisioning). At this point all required parameters for payment processing are validated. An error is returned if any fields are missing. 
If successful, the product provisioning request will create a sub account associated with the business.
The response will include the ID of that associated sub account. It is required for any payment processing related API requests.

### Check the sub account status

#### Retrieve a sub account
```sh
curl -X GET https://api.justifi.ai/v1/sub_accounts/ACCOUNT_ID \
    -H 'Authorization: Bearer [access_token]' \
    -H 'Accept: application/json'
```

Once you have provisioned the busiess, we'll review their information. This approval process can take up to a few business days. In order to check the associated sub account's onboarding status, call the [Get a Sub Account endpoint](https://docs.justifi.tech/api-spec#tag/Sub-Accounts/operation/GetSubAccount) or use an event publisher to subscribe to the `sub_account.updated` events.
