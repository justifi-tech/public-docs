import React, { useEffect, DOMAttributes } from 'react'
import useScript from './useScript'


type CustomElement<T> = Partial<T & DOMAttributes<T> & { children?: React.ReactNode }>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'justifi-bank-account-form': CustomElement<any>; // Specify more specific types as needed
      'justifi-card-form': CustomElement<any>; // Specify more specific types as needed
      'justifi-payment-form': CustomElement<any>; // Specify more specific types as needed
      'justifi-payment-details': CustomElement<any>; // Specify more specific types as needed
    }
  }
}

export function CardForm() {
  // Load the script asynchronously
  useScript(`https://cdn.jsdelivr.net/npm/@justifi/webcomponents@4.6.4/dist/webcomponents/webcomponents.esm.js`)
  return (
    <div style={{border: "solid black 2px", padding:"20px"}}>
      <justifi-card-form>
        <style>
          {`:root {
            --jfi-load-google-font: 'Inter:wght@200;400;700;900&family=Agdasima';
            --jfi-layout-font-family: Agdasima;
            --jfi-layout-padding: 4px;
            --jfi-layout-form-control-spacing-x: .5rem;
            --jfi-layout-form-control-spacing-y: 1rem;
            --jfi-form-label-font-weight: 100;
            --jfi-form-label-font-family: Inter;
            --jfi-form-label-margin: 0 0 .5rem 0;
            --jfi-form-control-background-color: #F4F4F6;
            --jfi-form-control-background-color-hover: #EEEEF5;
            --jfi-form-control-border-color: rgba(0, 0, 0, 0.42);
            --jfi-form-control-border-color-hover: rgba(0, 0, 0, 0.62);
            --jfi-form-control-border-color-focus: #fccc32;
            --jfi-form-control-border-color-error: #C12727;
            --jfi-form-control-border-top-width: 0;
            --jfi-form-control-border-left-width: 0;
            --jfi-form-control-border-bottom-width: 1px;
            --jfi-form-control-border-right-width: 0;
            --jfi-form-control-border-radius: 4px 4px 0 0;
            --jfi-form-control-border-style: solid;
            --jfi-form-control-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            --jfi-form-control-box-shadow-focus: none;
            --jfi-form-control-box-shadow-error-focus: none;
            --jfi-form-control-border-style: solid;
            --jfi-form-control-color: #212529;
            --jfi-form-control-font-size: 1rem;
            --jfi-form-control-font-weight: 400;
            --jfi-form-control-line-height: 2;
            --jfi-form-control-margin: 0;
            --jfi-form-control-padding: .5rem .875rem;
            --jfi-error-message-color: #C12727;
            --jfi-error-message-margin: .25rem 0 0 0;
            --jfi-error-message-font-size: .875rem;
          }`}
        </style>

      </justifi-card-form>
    </div>
  )
}

export function ACHForm() {
  useScript(`https://cdn.jsdelivr.net/npm/@justifi/webcomponents@4.6.4/dist/webcomponents/webcomponents.esm.js`)

  return (
    <div style={{border: "solid black 2px", padding:"20px"}}>
      <justifi-bank-account-form></justifi-bank-account-form>
    </div>
  )
}

export function PaymentForm() {
  useScript(`https://cdn.jsdelivr.net/npm/@justifi/webcomponents@4.6.4/dist/webcomponents/webcomponents.esm.js`)

  return (
    <div style={{border: "solid black 2px", padding:"20px"}}>
      <justifi-payment-form></justifi-payment-form>
    </div>
  )
}

export function PaymentDetails() {
  // Load the script asynchronously
  useScript(`https://cdn.jsdelivr.net/npm/@justifi/webcomponents@4.6.4/dist/webcomponents/webcomponents.esm.js`)

  const [styleStr, setStyle] = React.useState(`
        justifi-payment-details::part(detail-head) {
          background-color: rgba(100, 200, 250, 0.2);
          border-left: 4px solid rgba(100, 200, 250, 1);
        }
        justifi-payment-details::part(detail-info-item-title),
        justifi-payment-details::part(detail-method-item-title) {
          border-radius: 3px;
          background-color: rgba(0, 0, 0, 0.8);
          text-align: center;
          padding: 0 10px;
          color: white !important;
        }
        justifi-payment-details::part(detail-metadata) {
          background-color: rgba(100,100,255,0.2)
        }`
  )

  const handleChange = (event: any) => {
    setStyle(event.target.value);
  }

  return (
    <div>
      <textarea value={styleStr} onChange={handleChange}/>
      <justifi-payment-details
        data-testid="justifi-payment-details"
        auth-token="eyJraWQiOiJqdXN0aWZpLWUyNDgyMmU3ODE1MmEzZjRkMjU1IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguanVzdGlmaS5haS8iLCJhenAiOiJvYXNfMllwZDd3bFQ2NGFlZzc5aGhZaFVBdSIsInN1YiI6Im9hc18yWXBkN3dsVDY0YWVnNzloaFloVUF1QHNlc3Npb25zIiwiYXVkIjoiaHR0cHM6Ly9hcGkuanVzdGlmaS5haS92MSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbeyJyb2xlIjoicmVhZDphY2NvdW50IiwicmVzb3VyY2VfaWQiOiJhY2NfMUdCS1Mycmc3bUxsMnIzRHM0TlBQWSJ9XSwiZXhwIjoxNzA4Mjc4MTk2LCJpYXQiOjE3MDA1MDIxOTYsInBsYXRmb3JtX2FjY291bnRfaWQiOiJhY2NfN2NWbmc3ZXNDdmZIZXZXUUxTd2xuayJ9.Ks6U_mPlNDX09G9T75RPR__VKYZOeknPxLFr1O5Ri6yr9khAtUb_RwBx366qpf19MZ0NyxVtCb7qdXOhL9cb1Xl0owfqBZJXz3vvedfDui_4S9A5YdG4fy82Ja4p4fsCJGgkTgVHu_KBd9tmPY9SOTvRv8PBXdeCAYqqG4VR-sc9nSRtol62uB_kRcN3GRsptN8MTbWHwoqWGOolBCmzk12d9wjO-9t3X3jZ7LIOKP6rO9Lqn1Sh1KfoiUkyiv_TyHbwoQsqU11LZ6XWmDzPGukSdwNwV7qfSFAH4ldAiDYUGDIzFARCr6PEF2MwEC2e6myObiCXWNjg3X1C6oUS6Q"
        payment-id="py_76nDkjHlXOEFQue5o3tzMj"
      />

      <style>
        { styleStr }
      </style>

    </div>
  )
}

export function PaymentFormStory() {
  const FRAME_STYLE = {
    border: '1px solid #aaa',
  }

  /**
   * Embeds a Storybook example
   *
   * @prop story The story ID in the URL to navigate to
   */
  return (
    <div>
    <iframe
      title="Excalibur Storybook Example"
      src="https://storybook.justifi.ai/iframe.html?args=&id=components-paymentform--basic&viewMode=story"
      frameBorder={0}
      width="100%"
      height="900"
      style={FRAME_STYLE}
    ></iframe>
  </div>
)
}
