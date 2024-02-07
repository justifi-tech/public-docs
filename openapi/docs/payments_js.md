## Overview

PaymentsJS provides a developer-friendly experience that makes it easy to collect payment methods in a safe manner, without bringing your application into PCI (Payment Card Industry) compliance scope. By including it in your page, you'll be able to render payment method inputs, bind to their events, and tokenize the completed payment method information so that it can be used to make a payment.

Currently, PaymentsJS works with vanilla javascript and React applications. While it may work in other front-end frameworks, it has not been tested and is currently unsupported.
## Get Started

### Include the JavaScript module

Part of what allows PaymentsJS to keep your application out of PCI compliance scope is that the source code is hosted by JustiFi. Therefore, it's not an installable package and should be included directly from the justifi.ai domain. To do this, include the script in the `head` of your HTML file.

```html
<html>
<head>
    <script
        type="text/javascript"
        src="https://js.justifi.ai/payments/v1/payments.js"></script>
```

### Initialize PaymentsJS

Once the JavaScript has been included, it can be initialized by calling `window.JustiFiPaymentsJS` with the **client id** from your API key. **Reminder: use your client id. Never share your client secret publicly.** If needed, you can look up your client id or create a new API key in the Developer Tools section of the app.

```javascript
const justifiJS = window.JustiFiPaymentsJS({ clientKey: "test_xxx" });
```

If you're a Platform and processing a payment on behalf of a Sub Account, you must also pass the `account` option to `JustiFiPaymentsJS`. For example:

```javascript
const justifiJS = window.JustiFiPaymentsJS({
  clientKey: "test_xxx",
  account: "acc_testsubacct"
});
```

When `JustiFiPaymentsJS` is called, it will return an object with the following methods:

#### appendTo(*selector*)

Takes the selector of an element and appends a payment method input element to it.

```javascript
 justifiJS.appendTo('#card-form');
```

#### on('ready', *handler*)

The 'ready' event is triggered when the payment method input has rendered, and initial validation errors will be passed to the provided event handler.

```javascript
justifiJS.on('ready', (data: any) => {
  // You can use the 'ready' event to set your app's loading state
  // so that the card field does not 'pop in' when it is first rendered.
  loading = false;

  // You can also use the 'ready' event to retrieve initial errors,
  // which can then be shown if the form is submitted prematurely.
  paymentMethodErrors = data.errors;
})
```

#### on('change', *handler*)

The 'change' event is triggered when the payment method input's value changes. Validation will be generated and passed along to the provided event handler.

```javascript
justifiJS.on('change', (data: any) => {
  paymentMethodErrors = data.errors;
});
```

#### on('blur', *handler*)

The 'blur' event is triggered when the payment method input is blurred/loses focus. Validation will be generated and passed along to the provided event handler.

```javascript
justifiJS.on('blur', (data: any) => {
  paymentMethodErrors = data.errors;
});
```

#### tokenize(*paymentMethodData*)

The `tokenize` method returns a `Promise`. It will create a payment method `token` from sensitive payment method information entered by a user. Then, it will resolve the promise with the newly-created `token`. The returned `token` can be used when creating a payment. In order to tokenize the payment method, `paymentMethodData` needs to be provided.

If tokenization fails for some reason (such as invalid information being tokenized, or connectivity issues), `errors` will be returned instead.

```javascript
const paymentMethodData = {
  email: 'john.doe@example.com',
  name: 'John Doe',
  address_line1: '123 Broadway',
  address_line2: '',
  address_city: 'Minneapolis',
  address_state: 'Minnesota',
  address_postal_code: '55413',
  address_country: 'US'
};

const tokenizeResponse = await justifiJS.tokenize(paymentMethodData);

if (tokenizeResponse.token) {
  const payment = new Payment({
    amount: 2000,
    description: 'Delicious wood fire pizza',
    payment_method: {
      token: tokenizeResponse.token // use the token as payment method
    }
  });
  // ...submit payment logic...
} else {
  console.err(tokenizeResponse.errors)
}
```

## Process a Payment
Once you've generated a token, you can process a payment by passing that token to your own backend. (This is necessary because it's not secure to expose your JustiFi client secret in the browser.) From your server, use our Payments API to [create a payment](#operation/CreatePayment) with the payment method token. This will authorize and capture the specified amount of funds.

## Using PaymentsJS in React

When implementing PaymentsJS in React, there are a few 'gotchas' to look out for. The implementation details are otherwise very similar to implementing in a vanilla JavaScript application.

If your React application uses function components, make sure to initialize PaymentsJS outside of your function component to ensure it's only initialized one time.

```javascript
const justifiJS = window.JustiFiPaymentsJS({ clientKey: "test_xxx" });

function MyComponent(props) {
}
```

When calling `appendTo`, make sure to do it inside of your `useEffect` hook. This ensures that the element you're appending to has already been rendered.

```jsx
function MyComponent(props) {
  useEffect(() => {
    justifiJS.appendTo('#card-form');
  }, []);

  return(
    <form>
      ...
      <div id="card-form"></div>
      <input type="submit" />
    </form>
  );
}
```
