In addition to direct EventBridge publishing, we offer event delivery to your app via webhooks.
Webhooks are a reliable method to subscribe to our published events via an API endpoint.

Webhooks are secured by signature verification, which you will need to verify by generating a SHA-256 hex using the following information:

| Parameter  | Header            | Value                                                           |
|------------|-------------------|-----------------------------------------------------------------|
| Timestamp  | JUSTIFI-TIMESTAMP | ISO string format                                               |
| Signature  | JUSTIFI-SIGNATURE | String                                                          |
| Algorithm  | ----------------- | SHA-256                                                         |
| Secret Key | ----------------- | Found in your event publisher's page                            |
| Message    | ----------------- | String in the format `<timestamp_header>.<received_event_json>` |

To verify the signature simply compare the generated SHA-256 hex against it; if it is successful the webhook signature is valid.

Here is a code example for reference:
```ruby
def webhook_signature_valid?(signature, received_event, timestamp, secret_key)
  timestamp_payload = "#{timestamp}.#{received_event.to_json}"
  algorithm = OpenSSL::Digest.new("sha256")
  hex = OpenSSL::HMAC.hexdigest(algorithm, secret_key, timestamp_payload)

  signature == hex
end
```

If you are using any of our SDKs, we provide a convenient method for validating the signature.

After validating, you must respond with a `200 OK` with in **5 seconds**. In the event of a non-200 response or a delay of more than 5 seconds, delivery will be
attempted again. For live accounts, webhooks are retried 10 times over 24 hours.
For test accounts, webhooks are retried 3 times over 1 hour.

**When you're ready to get started:**

- Create the endpoint on your server that will receive published events
- Add an event publisher with webhook delivery method in the Developer Tools section of the app (you’ll subscribe your endpoint to the event types of your choice). We recommend starting with a test account.
- Test the publisher by prompting one of the event types you chose and making sure your subscribed endpoint receives the published event
