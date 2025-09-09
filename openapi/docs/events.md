Our event publishing system allows you to subscribe to certain events on the JustiFi platform.
Once subscribed, your application will be notified anytime those events occur, so you can react
accordingly in real time. You can receive events via webhooks. See the [Webhook Delivery section](https://docs.justifi.tech/api-spec#tag/Webhook-Delivery) for more details.

We will publish the following events:

- payment.created
- payment.succeeded
- payment.failed
- payment.pending
- payment.authorized
- payment.captured
- payment.canceled
- payment.refunded
- payment.refund.updated
- payment.dispute.created
- payment.dispute.closed
- payment_method.created
- payment_method.updated
- payment_method.bin_mapped
- payment_intent.attached
- payment_intent.created
- payment_intent.requires_capture
- payment_intent.succeeded
- payout.bank_account.activated
- payout.created
- payout.paid
- payout.failed
- proceeds.payout.created
- sub_account.updated
- application_fee_rate.created
- application_fee_rate.updated
- entity.business.created
- entity.business.updated
- entity.identity.created
- entity.identity.updated
- entity.address.created
- entity.address.updated
- entity.document.created
- entity.document.uploaded
- entity.bank_account.created
- checkout.created
- checkout.completed
- checkout.completion.succeeded
- checkout.completion.failed
- account.payment_setting.updated
- account.payout_setting.updated
- terminal_order.created
- terminal_order.updated
