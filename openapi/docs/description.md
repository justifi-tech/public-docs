## Introduction
The JustiFi API is a REST-based payment processing API. Our API has predictable, resource-oriented URLs, accepts JSON, and returns JSON. We use HTTP status codes and supply detailed error codes whenever possible. We'll provide you with both a `test` and `live` account with which to use our API. Each account will have its own API key, and the key you use to authenticate each request will determine whether to use your `test` or `live` account. When you use your `test` account, it won't affect your `live` data or move any real money.

## Getting Started
To process a payment with JustiFi, follow these steps

- [Get Your Accounts](#get-your-accounts)
- [Get Your API Keys](#get-your-api-keys)
- [Authenticate With JustiFi](#authenticate-with-justifi)
- For Platforms, [Create and Onboard Your Sub Accounts](https://docs.justifi.tech/api-spec#tag/Sub-Accounts)
- [Create a Payment](https://docs.justifi.tech/api-spec#tag/Payments/operation/CreatePayment)

<br>

### Get Your Accounts
Our customer onboarding team will work with you to create your `test` and `live` accounts. For platforms, our team will also guide you through setting up your sub accounts onboarding. Once you're up and running, you'll have access to the JustiFi API as well as the admin features at https://app.justifi.ai where you can see your account overview, payments, payouts, issue refunds, etc.

<br>

### Get Your API Keys
Once your `test` and `live` accounts have been created, you'll have access to generate your API keys in the Developer Tools section of the app. You'll need a `test` key and a `live` key. Each key will provide you with a client id and a client secret, which you'll use to authenticate your API requests. Requests authenticated with your `test` key will use your `test` account; requests authenticated with your `live` key will use your `live` account. Make sure to store your client secrets somewhere secure (like a password manager) because this is the only time they'll display in the UI.

Additionally, we can provide access to a sandbox environment upon request.

<br>

### Authenticate With JustiFi
<PullRight>

##### Example OAuth Client Credentials Grant Request
```sh
curl -X POST https://api.justifi.ai/oauth/token \
    -H 'Content-Type: application/json' \
    --data '{"client_id":"[your client id]","client_secret":"[your client secret]"}'
```
  ##### Example Authenticated Response
```json
{
  "access_token": "... this will be a very long string and is valid for 24 hours"
}
```
##### Example Authenticated Request
```sh
curl -X POST https://api.justifi.ai/v1/payments \
    -H 'Authorization: Bearer [access_token]' \
    -H 'Content-Type: application/json'
    -H 'Idempotency-Key: a-unique-string-for-the-transaction'
```
</PullRight>

JustiFi uses the OAuth Client Credentials authentication flow. To access, use your JustiFi client id and client secret to POST to https://api.justifi.ai/oauth/token. These are valid for 24 hours. The test key is prepended with `test_` and the live key is prepended with `live_`.

Next, take the access token in that response and pass it in all subsequent requests as the `Authorization` header.

This token is valid for 24 hours, so be sure to handle a `401 - Unauthorized` response by getting a new access token via the client credentials grant API.

## Idempotent Requests
<PullRight>

##### Example Request with Idempotency-Key Header
```sh
curl -X POST https://api.justifi.ai/v1/payments \
    -H 'Authorization: Bearer [access_token]' \
    -H 'Accept: application/json'
    -H 'Idempotency-Key: a-unique-string-for-the-transaction'
```
</PullRight>

In order to guarantee that payments and other important transactions are only ever processed a single time, we leverage the `Idempotency-Key` header in our payments APIs. This means that you MUST provide an `Idempotency-Key` header along with your request, otherwise you'll receive an error. If a second request with same idempotent key is processed concurrently, it will result in a `409` error instead of double processing.

If these requests fail with a network timeout or a `5XX` error, they should be retried with the same exact parameters. Once they're fully successful, you'll receive a `2XX` response. If you POST the same request and `Idempotency-Key` again, you'll get the response you originally received back. If you receive a `4XX` error, do not retry the request, unless the response code is a `409`.

If you try the same `Idempotency-Key` with different parameters, your request will error and won't be possible to process. The `Idempotency-Key` header is only meant for a single transaction; it's there to protect against processing the same exact thing more than once. Once the parameters change, a request is considered distinct from the original request.

You may use any string to identify your `Idempotency-Key`; we generally recommend using a generated uuid, but you may use any unique string.

## Pagination
<PullRight>

##### Example Paginated Request
```sh
curl -X GET https://api.justifi.ai/v1/payments?limit=25&after_cursor=token-from-page-info \
    -H 'Authorization: Bearer [access_token]' \
    -H 'Accept: application/json'
```
##### Example Paginated Response
```sh
{
    "id": null,
    "type": "array",
    "data":[
        { "id":"py_438xBom2Drh55kE1WfyGLg",
          "amount": 1000,
          ... additional response attributes based on resource schema
        }
    ],
    "page_info": {
      "has_previous": false,
      "has_next": true,
      "start_cursor": "WyIyMDIyLTAxLTExIDE1OjI3OjM2LjAyNzc3MDAwMCIsImNhNjQwMTk1LTEzYzMtNGJlZi1hZWQyLTU3ZjA1MzhjNjNiYSJd",
      "end_cursor": "WyIyMDIyLTAxLTExIDEyOjU5OjQwLjAwNTkxODAwMCIsImQ0Njg5MGE2LTJhZDItNGZjNy1iNzdkLWFiNmE3MDJhNTg3YSJd"
    }
}
```
</PullRight>
All top-level API resources have support for bulk fetches via `array` API methods. JustiFi uses cursor-based pagination, which supports `limit`, `before_cursor` and `after_cursor`. Each response will have a `page_info` object that contains the `has_next` and `has_previous` fields, which tells you if there are more items before or after the current page.  The `page_info` object also includes `start_cursor` and `end_cursor` values which can be used in conjunction with `before_cursor` and `after_cursor` to retrieve items from the API one page at a time.

#### Standard `array` API Request Parameters

<table layout="fixed">
    <tr>
        <th style="width: 200px">Parameter</th>
        <th>Description</th>
    </tr>
    <tr>
        <td style="vertical-align: top"><code>limit</code></td>
        <td>
            The number of resources to retrieve.<br />
            <b>type</b>: <code>integer</code><br />
            <b>default</b>: <code>25</code><br />
            <b>minimum</b>: <code>1</code><br />
            <b>maximum</b>: <code>100</code>
        </td>
    </tr>
    <tr>
        <td style="vertical-align: top"><code>after_cursor</code></td>
        <td>
            Token to fetch the next page of a list.<br />
            <b>type</b>: <code>string</code><br />
        </td>
    </tr>
    <tr>
        <td style="vertical-align: top"><code>before_cursor</code></td>
        <td>
            Token to fetch the previous page of a list.<br />
            <b>type</b>: <code>string</code><br />
        </td>
    </tr>
</table>

The `after_cursor`/`before_cursor` parameter determines which page of results will be returned.
If `after_cursor` is the encoded `id` of the last record in the collection `has_next` will be false and you'll get an empty array response. If `before_cursor` is the encoded `id` of the first record in the collection `has_previous` will be false and you'll get an empty array response.

The `limit` parameter determines the maximum number of results included in each response. If there are fewer
records available than the `limit` value, the response will include all available records. The maximum value
allowed is 100 with a default value of 25. If the `limit` value is an invalid type, the default value of 25 is used.

#### Standard API Response Structure
All of our responses are contained in the same envelope, for arrays the id field will be null
and the object will be an array.

<table layout="fixed">
    <tr>
        <th style="width: 200px">Attribute</th>
        <th>Description</th>
    </tr>
    <tr>
        <td style="vertical-align: top"><code>id</code></td>
        <td>
            The id of the object returned. Will be null for arrays.<br />
            <b>type</b>: <code>string</code><br />
            <b>default</b>: <code>"a uuid"</code>
        </td>
    </tr>
    <tr>
        <td style="vertical-align: top"><code>type</code></td>
        <td>
            The type of object returned.<br />
            <b>type</b>: <code>string</code><br />
            <b>default</b>: <code>"array"</code>
        </td>
    </tr>
    <tr>
        <td style="vertical-align: top"><code>data</code></td>
        <td>
            The resource OR an array of the requested resources.<br />
            <b>type</b>: <code>array | object</code><br />
            <b>Notes</b>: May be an empty array <code>[]</code> if no resources are available.<br />
        </td>
    </tr>
    <tr>
        <td style="vertical-align: top"><code>page_info</code></td>
        <td>
            The object containing pagination information.<br />
            <b>type</b>: <code>object</code><br />
            <b>Notes</b>: Contains <code>has_previous</code>, <code>has_next</code>, <code>start_cursor</code> and <code>end_cursor</code>
        </td>
    </tr>
</table>

## Testing
Use these card numbers to test successful transactions as well as various error scenarios. Make sure to authenticate your requests using your `test` API key (these cards won't work for `live` payments).

#### Successful Test Cards
<table layout="fixed">
  <tr>
    <th style="width: 200px">Number</th>
    <th>Brand</th>
    <th>CVC</th>
    <th>Date</th>
  </tr>
  <tr>
    <td><code>4242424242424242</code></td>
    <td>Visa</td>
    <td>Any 3 digits</td>
    <td>Any future date</td>
  </tr>
  <tr>
    <td><code>4000056655665556</code></td>
    <td>Visa (debit)</td>
    <td>Any 3 digits</td>
    <td>Any future date</td>
  </tr>
  <tr>
    <td><code>5555555555554444</code></td>
    <td>Mastercard</td>
    <td>Any 3 digits</td>
    <td>Any future date</td>
  </tr>
  <tr>
    <td><code>2223003122003222</code></td>
    <td>Mastercard (2-series)</td>
    <td>Any 3 digits</td>
    <td>Any future date</td>
  </tr>
    <tr>
    <td><code>5200828282828210</code></td>
    <td>Mastercard (debit)</td>
    <td>Any 3 digits</td>
    <td>Any future date</td>
  </tr>
    <tr>
    <td><code>5105105105105100</code></td>
    <td>Mastercard (prepaid)</td>
    <td>Any 3 digits</td>
    <td>Any future date</td>
  </tr>
  <tr>
    <td><code>378282246310005</code></td>
    <td>American Express</td>
    <td>Any 4 digits</td>
    <td>Any future date</td>
  </tr>
  <tr>
    <td><code>371449635398431</code></td>
    <td>American Express</td>
    <td>Any 4 digits</td>
    <td>Any future date</td>
  </tr>
  <tr>
    <td><code>6011000990139424</code></td>
    <td>Discover</td>
    <td>Any 3 digits</td>
    <td>Any future date</td>
  </tr>
</table>

#### Declined Test Cards
<table layout="fixed">
  <tr>
    <th style="width: 200px">Number</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>4000000000000101</code></td>
    <td>
      If a CVC number is provided, the cvc_check fails.
    </td>
  </tr>
  <tr>
    <td><code>4000000000000341</code></td>
    <td>
      Tokenizing this card succeeds, but attempts to make a payment fail.
    </td>
  </tr>
  <tr>
    <td><code>4000000000000002</code></td>
    <td>Payment is declined with a card_declined code.</td>
  </tr>
  <tr>
    <td><code>4000000000009995</code></td>
    <td>
      Payment is declined with a card_declined code. The decline_code attribute is insufficient_funds.
    </td>
  </tr>
  <tr>
    <td><code>4000000000009987</code></td>
    <td>
      Payment is declined with a card_declined code. The decline_code attribute is lost_card.
    </td>
  </tr>
  <tr>
    <td><code>4000000000009979</code></td>
    <td>
      Payment is declined with a card_declined code. The decline_code attribute is stolen_card.
    </td>
  </tr>
  <tr>
    <td><code>4000000000000069</code></td>
    <td>Payment is declined with an expired_card code.</td>
  </tr>
  <tr>
    <td><code>4000000000000127</code></td>
    <td>Payment is declined with an invalid_cvc code.</td>
  </tr>
  <tr>
    <td><code>4000000000000119</code></td>
    <td>Payment is declined with a gateway_error code.</td>
  </tr>
  <tr>
    <td><code>4242424242424241</code></td>
    <td>
      Payment is declined with an card_number_invalid code as the card number fails the Luhn check.
    </td>
  </tr>
</table>

#### Successful Bank Account (ACH)
<table layout="fixed">
  <tr>
    <th>Routing Number</th>
    <th>Account Number</th>
  </tr>
  <tr>
    <td><code>110000000</code></td>
    <td><code>000123456789</code></td>
  </tr>
</table>

#### Declined Bank Accounts (ACH)
<table layout="fixed">
  <tr>
    <th>Routing Number</th>
    <th>Account Number</th>
    <th>Payment Error</th>
  </tr>
  <tr>
    <td><code>110000000</code></td>
    <td><code>000222222227</code></td>
    <td>
      Insufficient Funds
    </td>
  </tr>
  <tr>
    <td><code>110000000</code></td>
    <td><code>000333333335</code></td>
    <td>
      The account doesn't support debits
    </td>
  </tr>
  <tr>
    <td><code>110000000</code></td>
    <td><code>000111111113</code></td>
    <td>
      The account is closed
    </td>
  </tr>
  <tr>
    <td><code>110000000</code></td>
    <td><code>000111111116</code></td>
    <td>
      The account doesn't exist
    </td>
  </tr>
</table>

## HTTP Errors
The JustiFi API may return a number of standard HTTP errors due to invalid requests. Some common errors are described
below to help you build with JustiFi.

#### Bad Request
The server cannot process the request. This error is most likely due to malformed request syntax.
- code: `400`
- status: `Bad Request`

#### Unauthorized
Similar to a `403 Forbidden`, but specifically when authentication is provided and has failed, or has not been provided.
This error is most likely due to not including your API key in the request header.
- code: `401`
- status: `Unauthorized`

#### Payment Required
There was an error processing the payment. This response is returned when errors occur while tokenizing the payment method, such
as an invalid cvc or an expiration date in the past. This can also occur when making a payment and the card is declined.
In that case, the error message will provide more specific information about why the request was declined.
- code: `402`
- status: `Payment Required`

#### Forbidden
The request was valid, but you are unable to execute the request. This error is most likely due to the API key that
was used not having the necessary permissions, or attempting a prohibited action such as creating a duplicate
record where one already exists.
- code: `403`
- status: `Forbidden`

#### Not Found
The requested resource could not be found, but may be available in the future. This error is most likely due to
requesting a resource by `id` that doesn't exist. You'll want to double check that you're referencing the correct
`id` and that it exists on your account.
- code: `404`
- status: `Not Found`

#### Concurrent Request Error
The request has an identical `Idempotency-Key` header for another request which either failed OR is processing at the same time. You can retry these requests without risk of double processing.
- code: `409`
- status: `Conflict`

#### Unprocessable Entity
The request was well-formed, but was unable to be processed due to semantic errors. This error is most likely due to
including invalid data in `POST`, `PATCH`, and `PUT` requests. Double check the request documentation to make sure
you're supplying the required attributes, and that the attribute types are correct.
- code: `422`
- status: `Unprocessable Entity`

#### Internal Server Error
An internal server error occurred due to an unexpected condition. This error is most likely due to an issue with our
servers.
- code: `500`
- status: `Internal Server Error`

#### Error Codes

Many of our `4XX` errors will provide an error code in addition to their HTTP status. Here is a list of our error codes and a brief description of the error to provide more context when applicable.

<table layout="fixed">
  <tr>
    <th style="width: 300px">Error Code</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>acct_last_four_required</code></td>
    <td>Missing required parameter: acct_last_four</td>
  </tr>
  <tr>
    <td><code>amount_below_minimum</code></td>
    <td>Amount must be greater than 50</td>
  </tr>
  <tr>
    <td><code>amount_must_be_an_integer</code></td>
    <td>Amount must be an integer</td>
  </tr>
  <tr>
    <td><code>amount_required</code></td>
    <td>Missing required parameter: amount</td>
  </tr>
  <tr>
    <td><code>amount_above_maximum</code></td>
    <td>Amount must be lower than 100000000 ($1,000,000.00)</td>
  </tr>
  <tr>
    <td><code>amount_below_minimum</code></td>
    <td>Amount must be greater than 50</td>
  </tr>
  <tr>
    <td><code>application_fee_rate_id_required</code></td>
    <td>Missing required parameter: application_fee_rate_id</td>
  </tr>
  <tr>
    <td><code>application_fee_required</code></td>
    <td>Missing required parameter: application_fee</td>
  </tr>
  <tr>
    <td><code>brand_required</code></td>
    <td>Missing required parameter: brand</td>
  </tr>
  <tr>
    <td><code>capture_strategy_invalid</code></td>
    <td>Format is invalid for parameter: capture_strategy</td>
  </tr>
  <tr>
    <td><code>card_decline_rate_limit_exceeded</code></td>
    <td>This card has been declined too many times. You can try to charge this card again after 24 hours. We suggest reaching out to your customer to make sure they have entered all of their information correctly and that there are no issues with their card.</td>
  </tr>
  <tr>
    <td><code>card_declined</code></td>
    <td>The card has been declined. When a card is declined, the error includes a decline_code attribute specifying the reason for the decline, and a network_decline_code provided by the card network, if available.</td>
  </tr>
  <tr>
    <td><code>card_name_required</code></td>
    <td>Missing required parameter: card_name</td>
  </tr>
  <tr>
    <td><code>card_number_invalid</code></td>
    <td>Format is invalid for parameter: card_number</td>
  </tr>
  <tr>
    <td><code>card_number_required</code></td>
    <td>Missing required parameter: card_number</td>
  </tr>
  <tr>
    <td><code>charge_expired_for_capture</code></td>
    <td>The charge cannot be captured as the authorization has expired. Auth and capture charges must be captured within 7 days.</td>
  </tr>
  <tr>
    <td><code>country_invalid</code></td>
    <td>Format is invalid for parameter: country</td>
  </tr>
  <tr>
    <td><code>currency_invalid</code></td>
    <td>Format is invalid for parameter: currency</td>
  </tr>
  <tr>
    <td><code>currency_required</code></td>
    <td>Missing required parameter: currency</td>
  </tr>
  <tr>
    <td><code>customer_id_required</code></td>
    <td>Missing required parameter: customer_id</td>
  </tr>
  <tr>
    <td><code>customer_max_payment_methods</code></td>
    <td>The maximum number of PaymentMethods for this Customer has been reached. Either detach some PaymentMethods from this Customer or proceed with a different Customer.</td>
  </tr>
  <tr>
    <td><code>email_invalid</code></td>
    <td>The email address is invalid (e.g., not properly formatted). Check that the email address is properly formatted and only includes allowed characters.</td>
  </tr>
  <tr>
    <td><code>email_required</code></td>
    <td>Missing required parameter: email</td>
  </tr>
  <tr>
    <td><code>expired_card</code></td>
    <td>The card has expired. Please check the expiration date or try a different card or payment method.</td>
  </tr>
  <tr>
    <td><code>gateway_account_id_required</code></td>
    <td>Missing required parameter: gateway_account_id</td>
  </tr>
  <tr>
    <td><code>gateway_authentication_error</code></td>
    <td>The payment network returned an authentication error</td>
  </tr>
  <tr>
    <td><code>gateway_error</code></td>
    <td>There was an issue processing your payment with the gateway. Please try again later.</td>
  </tr>
  <tr>
    <td><code>gateway_idempotency_error</code></td>
    <td>The gateway detected concurrent requests using this idempotency key</td>
  </tr>
  <tr>
    <td><code>gateway_rate_limit_error</code></td>
    <td>Too many requests hit the API too quickly. We recommend an exponential back-off of your requests.</td>
  </tr>
  <tr>
    <td><code>gateway_ref_id_required</code></td>
    <td>Missing required parameter: gateway_ref_id</td>
  </tr>
  <tr>
    <td><code>gateway_timeout_error</code></td>
    <td>There was a timeout with the gateway, we recommend retrying using the Should-Retry header</td>
  </tr>
  <tr>
    <td><code>idempotency_concurrent_request</code></td>
    <td>We detected concurrent requests using this idempotency key</td>
  </tr>
  <tr>
    <td><code>idempotency_key_required</code></td>
    <td>Idempotency-Key is a required header</td>
  </tr>
  <tr>
    <td><code>idempotency_params_mismatch</code></td>
    <td>The request parameters do not match those of a previous request using this idempotency key</td>
  </tr>
  <tr>
    <td><code>idempotency_request_in_progress</code></td>
    <td>Another request using this idempotency key is currently in progress</td>
  </tr>
  <tr>
    <td><code>internal_server_error</code></td>
    <td>An unexpected error has occurred. JustiFi engineers will investigate the error and contact you if any remediation steps are necessary.</td>
  </tr>
  <tr>
    <td><code>invalid_address</code></td>
    <td>The card’s address is incorrect. Please check the address or try a different card or payment method.</td>
  </tr>
  <tr>
    <td><code>invalid_card_number</code></td>
    <td>The card’s number is incorrect. Please check the number or try a different card or payment method.</td>
  </tr>
  <tr>
    <td><code>invalid_card_brand</code></td>
    <td>The card’s brand is not supported. Please use Visa, Mastercard, American Express, or Discover, or try a different payment method.</td>
  </tr>
  <tr>
    <td><code>invalid_characters</code></td>
    <td>This value provided to the field contains characters that are unsupported by the field.</td>
  </tr>
  <tr>
    <td><code>invalid_charge_amount</code></td>
    <td>Your transaction was declined because the payment amount is outside the limits set by your card issuer. Please try a different card or payment method.</td>
  </tr>
  <tr>
    <td><code>invalid_cvc</code></td>
    <td>The card’s security code is incorrect. Please check the security code or try a different card or payment method.</td>
  </tr>
  <tr>
    <td><code>invalid_expiry_month</code></td>
    <td>The card’s expiration month is incorrect. Please check the expiration date or try a different card or payment method.</td>
  </tr>
  <tr>
    <td><code>invalid_expiry_year</code></td>
    <td>The card’s expiration year is incorrect. Please check the expiration date or try a different card or payment method.</td>
  </tr>
  <tr>
    <td><code>invalid_expiry_date</code></td>
    <td>The provided expiration date is invalid. Please check the expiration date or try a different card or payment method.</td>
  </tr>
  <tr>
    <td><code>invalid_zip_code</code></td>
    <td>The card’s postal code is incorrect. Please check the postal code or try a different card or payment method.</td>
  </tr>
  <tr>
    <td><code>month_invalid</code></td>
    <td>Format is invalid for parameter: month</td>
  </tr>
  <tr>
    <td><code>not_authenticated</code></td>
    <td>Not authenticated</td>
  </tr>
  <tr>
    <td><code>not_authorized</code></td>
    <td>Not authorized</td>
  </tr>
  <tr>
    <td><code>parameter_missing</code></td>
    <td>Missing required parameter</td>
  </tr>
  <tr>
    <td><code>payment_fully_refunded</code></td>
    <td>The refund cannot be processed because the associated payment is fully refunded</td>
  </tr>
  <tr>
    <td><code>payment_intent_cannot_be_captured</code></td>
    <td>Payment Intent status is '%{status}' so it cannot be captured</td>
  </tr>
  <tr>
    <td><code>payment_intent_not_found</code></td>
    <td>Payment intent not found</td>
  </tr>
  <tr>
    <td><code>payment_intent_unexpected_state</code></td>
    <td>You cannot provide a new payment method to a PaymentIntent when it has a status of requires_capture, canceled, or succeeded</td>
  </tr>
  <tr>
    <td><code>payment_method_not_found</code></td>
    <td>Payment method not found</td>
  </tr>
  <tr>
    <td><code>payment_method_required</code></td>
    <td>Missing required parameter: payment_method</td>
  </tr>
  <tr>
    <td><code>payment_method_token_required</code></td>
    <td>Missing required parameter: payment_method_token</td>
  </tr>
  <tr>
    <td><code>payment_outside_refund_window</code></td>
    <td>The refund cannot be processed because the associated payment is outside the refund window</td>
  </tr>
  <tr>
    <td><code>postal_code_invalid</code></td>
    <td>Format is invalid for parameter: postal_code</td>
  </tr>
  <tr>
    <td><code>refund_error</code></td>
    <td>An error occurred during refunding your payment, JustiFi engineers have been alerted and are working on a solution</td>
  </tr>
  <tr>
    <td><code>refund_exceeds_amount_available</code></td>
    <td>The refund cannot be processed because the refund amount exceeds the available funds</td>
  </tr>
  <tr>
    <td><code>refund_exceeds_payment_amount</code></td>
    <td>The refund cannot be processed because the refund amount exceeds the associated payment amount</td>
  </tr>
  <tr>
    <td><code>refund_reason_invalid</code></td>
    <td>Refund reason must be one of the following: %{Refund::REASONS}</td>
  </tr>
  <tr>
    <td><code>resource_not_found</code></td>
    <td>Resource not found</td>
  </tr>
  <tr>
    <td><code>state_invalid</code></td>
    <td>Format is invalid for parameter: state</td>
  </tr>
  <tr>
    <td><code>token_already_used</code></td>
    <td>The token provided has already been used. You must create a new token before you can retry this request.</td>
  </tr>
  <tr>
    <td><code>token_in_use</code></td>
    <td>The token provided is currently being used in another request. This occurs if your integration is making duplicate requests simultaneously.</td>
  </tr>
  <tr>
    <td><code>transfer_required</code></td>
    <td>Missing required parameter: transfer</td>
  </tr>
  <tr>
    <td><code>unexpected_parameter</code></td>
    <td>Unexpected parameter for this request</td>
  </tr>
  <tr>
    <td><code>verification_invalid</code></td>
    <td>Format is invalid for parameter: verification</td>
  </tr>
  <tr>
    <td><code>year_invalid</code></td>
    <td>Format is invalid for parameter: year</td>
  </tr>
  <tr>
    <td><code>service_not_allowed</code></td>
    <td>This account is not permitted to process the type of transaction being requested, or the surcharge amount is invalid</td>
  </tr>
  <tr>
    <td><code>do_not_honor</code></td>
    <td>This card has been rejected by the issuing bank. Please try a different card or payment method.</td>
  </tr>
  <tr>
    <td><code>do_not_retry</code></td>
    <td>This card has been rejected. Please try a different card or payment method.</td>
  </tr>
  <tr>
    <td><code>refund_in_progress</code></td>
    <td>A refund for this payment is already in progress</td>
  </tr>
  <tr>
    <td><code>invalid_sub_account</code></td>
    <td>The sub account cannot process a payment for this card. Please contact customer support.</td>
  </tr>
  <tr>
    <td><code>new_card_issued</code></td>
    <td>The transaction was denied because the issuing bank has issued a new card. Please try a different card or payment method.</td>
  </tr>
  <tr>
    <td><code>account_closed</code></td>
    <td>The account associated with this payment method is been closed. Please try a different card or payment method.</td>
  </tr>
  <tr>
    <td><code>restricted_card</code></td>
    <td>This card has a restriction preventing approval for this transaction. Please try a different card or payment method.</td>
  </tr>
  <tr>
    <td><code>restricted_card</code></td>
    <td>This card has a restriction preventing approval for this transaction. Please try a different card or payment method.</td>
  </tr>
  <tr>
    <td><code>insufficient_funds</code></td>
    <td>This card has insufficient funds. Please try a different card or payment method.</td>
  </tr>
  <tr>
    <td><code>exceeds_card_limit</code></td>
    <td>The payment amount would exceed a limit placed on this card.</td>
  </tr>
  <tr>
    <td><code>pin_tries_exceeded</code></td>
    <td>The number of PIN retries has been exceeded.</td>
  </tr>
  <tr>
    <td><code>incorrect_pin</code></td>
    <td>The entered PIN is incorrect.</td>
  </tr>
  <tr>
    <td><code>pin_required</code></td>
    <td>A PIN is required.</td>
  </tr>
  <tr>
    <td><code>payment_outside_void_window</code></td>
    <td>The void cannot be processed because the associated payment is outside the void window. Try a refund instead.</td>
  </tr>
  <tr>
    <td><code>issuer_not_available</code></td>
    <td>The card issuer is not available. Please try again later.</td>
  </tr>
  <tr>
    <td><code>amount_too_small</code></td>
    <td>The specified amount is less than the minimum amount allowed. Use a higher amount and try again.</td>
  </tr>
  <tr>
    <td><code>amount_too_large</code></td>
    <td>The specified amount is less than the minimum amount allowed. Use a higher amount and try again.</td>
  </tr>
  <tr>
    <td><code>gateway_error_please_retry</code></td>
    <td>There was a temporary issue processing this payment. Please try again.</td>
  </tr>
  <tr>
    <td><code>checkout_invalid_currency</code></td>
    <td>The currency parameter does not match the currency this account is configured to process.</td>
  </tr>
</table>

## Network Errors
We provide the network error code, and the network error category to help inform you how to handle a decline. These are only returned when a transaction fails while trying to process on the card network. Please take a look at each section. The network error category is especially relevant for recurring payments. It can reduce retries on transactions which will never succeed.

### Network Error Codes

In addition to the standard error codes provided by JustiFi, some errors may include a `network_error_code` that provides more specific information about the error from the payment network. Here's a list of common `network_error_code` values and their meanings:

| Code | Description | Customer Impact & Suggested Actions |
|------|--------------|--------------------------------------|
| 005  | Do not honor (Declined by card association) | The payment was declined by the card association. The customer should try a different payment method or contact the card issuer for more information. |
| 100  |  Do not honor (Declined by card association) | The payment was declined by the card association. The customer should try a different payment method or contact the card issuer for more information. |
| 101  | Expired card | The provided card has expired. The customer needs to update with a new, non-expired card or provide a different payment method. |
| 102  | Suspected Fraud | The payment was flagged as potentially fraudulent activity. The customer should contact the card issuer to verify the transaction. |
| 104  | Restricted card | The provided card is restricted and cannot be used for this transaction type. The customer needs to use a different payment method or contact the card issuer. |
| 106  | Allowable PIN tries exceeded | The maximum allowable PIN entry attempts have been exceeded. The customer should verify the PIN and try again, or use a different payment method. |
| 110  | Invalid amount | The payment amount entered is invalid. The customer needs to recheck the amount and retry the transaction. |
| 116  | Not sufficient funds | There are insufficient funds in the account to cover this payment. The customer should add funds to the account or use a different payment method. |
| 117  | Incorrect PIN or PIN length error | The entered PIN is incorrect or has an invalid length. The customer should re-enter the correct PIN and try again. |
| 119  | Transaction not permitted to cardholder | This transaction is not permitted for the provided card/account. The customer should contact the card issuer or use a different payment method. |
| 121  | Exceeds withdrawal amount limit | The payment amount exceeds the maximum allowed withdrawal limit. The customer should try a smaller amount or use a different payment method. |
| 122  | Security violation | A security violation was detected with this payment. The customer should contact the card issuer for assistance. |
| 123  | Exceeds withdrawal frequency limit | The maximum number of allowed withdrawals within the set time period has been exceeded. The customer should try again later or use a different payment method. |
| 124  | Violation of law | This payment violates applicable laws or regulations and cannot be processed. The customer needs to use a different payment method. |
| 129  | Suspected counterfeit card | The card has been flagged as potentially counterfeit. The customer should contact the card issuer immediately. |
| 131  | Invalid account number | The provided account number is invalid. The customer needs to verify the account details and try again with the correct information. |
| 132  | Unmatched card expiry date | The provided expiration date does not match the card issuer's records. The customer should confirm the correct expiry date and retry. |
| 134  | Not sufficient funds | There are insufficient funds in the account to cover this payment. The customer should add funds to the account or use a different payment method. |
| 152  | Exceeds limit | The payment amount exceeds the maximum limit allowed. The customer should try a smaller amount or use a different payment method. |
| 154  | Over monthly limit | The maximum monthly payment limit has been exceeded. The customer should try again next month or use a different payment method. |
| 208  | Lost Card / Lost Check | The card or check was reported as lost. The customer needs to use a different, valid payment method. |
| 209  | Stolen card | The card was reported as stolen. The customer should contact the card issuer immediately and use a different payment method. |
| 213  | Invalid account number for card type | The provided account number is invalid for the specified card type. The customer needs to verify the account details and retry with the correct information. |
| 231  | Stop payment requested for all payments | A stop payment has been requested on this account, so no payments can be processed. The customer should contact the card issuer for assistance. |
| 232  | Stop all payments – account closed | This account has been closed, so no payments can be processed. The customer needs to use a different payment method or contact support to update the account details. |
| 237  | Deny – new card issued | A new card has been issued for this account. The customer needs to update the payment method with the new card details and retry. |
| 302  | Account closed | The account the customer is trying to pay from is closed and cannot be used. The customer needs to update with a different, valid payment method. |
| 317  | Max balance exceeded | This payment would cause the account balance to exceed the maximum allowed limit. The customer should try a smaller amount or use a different payment method. |
| 351  | Customer PIN authentication required | The customer must authenticate this payment by entering the PIN. The customer should follow the prompts to complete PIN authentication. |
| 414  | Void/Full Reversal request unable to process due to network cut-off window elapsed | The void or reversal request could not be processed because the network cut-off time has passed. A refund may be required instead. |
| 503  | New Account Information | New account information is available for this payment method. The customer needs to update the account details and retry the payment. |
| 504  | Do not try again | This payment was declined and should not be retried with this payment method. The customer needs to use an alternative method. |
| 505  | Please retry | There was a temporary issue processing this payment. The customer should retry the same payment again. |
| 512  | Service not allowed or invalid surcharge amount | This service or surcharge amount is not permitted for the account. The customer needs to verify the account details or try a different payment type. |
| 516  | Please retry – Reasons include: Format Error, Unable to route transaction, Switch or issuer unavailable, System Busy, Timeout | A temporary issue caused this payment to fail, the customer should retry. If it continues to fail, the card issuer should be contacted. |
| 517  | CVV2 Declined | The entered CVV2/CVC security code was declined. The customer should verify the code and retry with the correct information. |
| 531  | Retry with 3DS data - 3D Secure authentication is required for this transaction, but not supported at this time | This card requires 3D Secure authentication which is not currently supported. The customer should use an alternative payment method or contact the card issuer. |
| 528  | Debit/EBT transaction count exceeds pre-determined limit in specified time/ Withdrawal limit exceeded | The maximum allowed debit/EBT transaction count or withdrawal limit for the given time period has been exceeded. The customer should try again later or use a different payment method. |
| 902  | Invalid Transaction | The payment transaction data was invalid and could not be processed. The customer needs to verify the payment details and retry. |
| 907  | Card issuer or switch inoperative or processor not available | There was an issue with the card issuer's systems or payment processor during this transaction. The customer should retry later or use another payment method. |

### Network Error Category
Both Visa and Mastercard send additional information about how to handle a declined payment for recurring payments. Effective May 30th, 2025 we pass through this information to help handle failures. We have added the `network` and `network_error_category` attributes to declined payments, when we get the additional information from the card networks. We are working on further classification of errors, for now please only respond to those documented here.

| network | network_error_category | Definition |
|------|--------------|--------------------------------------|
| VISA | 1 | Issuer will never approve. Do not attempt again. This indicates the card is invalid, never existed or block. Cardholders can contact their bank for more information. |
| VISA | 2 | Issuer cannot approve at this time. They may try again at another time. This could be related to credit risk, velocity controls, or system issues. |
| VISA | 3 | Issuer cannot approve based on the details provided. This might be an invalid cvv, expiration date, etc. Do not try again without attempting to obtain additional information. |
| VISA | R00/R01 | Recurring payment not allowed on card. Do not attempt again. |
| MASTERCARD | 01 | Updated information needed. Similar to Visa code 3. |
| MASTERCARD | 02 | Try again later. Similar to Visa code 2. |
| MASTERCARD | 03 | Do not try again.  Do not attempt again. Similar to Visa code 1. |