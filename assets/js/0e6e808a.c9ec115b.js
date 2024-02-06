"use strict";(self.webpackChunkpublic_docs=self.webpackChunkpublic_docs||[]).push([[5884],{1320:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>l,default:()=>u,frontMatter:()=>s,metadata:()=>a,toc:()=>c});var o=t(2488),r=t(6316),i=t(7828);const s={title:"Payment Form",sidebar_label:"Payment Form",description:"Payment Form implementation guide",keywords:["web components","payments","implementation"]},l="Payment Form Implementation Guide",a={id:"payments/guides/paymentForm",title:"Payment Form",description:"Payment Form implementation guide",source:"@site/docs/payments/guides/paymentForm.mdx",sourceDirName:"payments/guides",slug:"/payments/guides/paymentForm",permalink:"/public-docs/payments/guides/paymentForm",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/payments/guides/paymentForm.mdx",tags:[],version:"current",frontMatter:{title:"Payment Form",sidebar_label:"Payment Form",description:"Payment Form implementation guide",keywords:["web components","payments","implementation"]},sidebar:"docsSidebar",previous:{title:"Credit Card Form",permalink:"/public-docs/payments/guides/cardForm"}},d={},c=[{value:"Overview",id:"overview",level:2},{value:"Key Features of the Payment Form",id:"key-features-of-the-payment-form",level:2},{value:"Integrating the Payment Form",id:"integrating-the-payment-form",level:2},{value:"Initial Setup",id:"initial-setup",level:3},{value:"Customizing the Payment Form",id:"customizing-the-payment-form",level:3},{value:"Handling Form Submissions",id:"handling-form-submissions",level:3},{value:"Example Code",id:"example-code",level:2},{value:"Best Practices",id:"best-practices",level:3},{value:"Component example",id:"component-example",level:2}];function m(e){const n={h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",strong:"strong",ul:"ul",...(0,r.M)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.h1,{id:"payment-form-implementation-guide",children:"Payment Form Implementation Guide"}),"\n",(0,o.jsx)(n.h2,{id:"overview",children:"Overview"}),"\n",(0,o.jsx)(n.p,{children:"The Payment Form in JustiFi's API is a versatile tool designed to consolidate the features of both\nACH and Card Forms. This all-in-one solution not only processes card and bank transfer payments\nbut also collects the cardholder's billing address, ensuring a comprehensive and secure payment\nexperience."}),"\n",(0,o.jsx)(n.h2,{id:"key-features-of-the-payment-form",children:"Key Features of the Payment Form"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Unified Payment Solution:"})," Integrates ACH and Card payment options in one form."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Billing Address Collection:"})," Includes fields for collecting the cardholder\u2019s billing address,\ncrucial for verifying and securing transactions."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Customizable Design:"})," Offers flexibility to tailor the form\u2019s appearance to align with your\napplication\u2019s UI."]}),"\n"]}),"\n",(0,o.jsx)(n.h2,{id:"integrating-the-payment-form",children:"Integrating the Payment Form"}),"\n",(0,o.jsx)(n.h3,{id:"initial-setup",children:"Initial Setup"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"API Configuration:"})," Ensure your JustiFi API setup is prepared to handle both card and ACH\ntransactions."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Form Integration:"})," Instructions on embedding the Payment Form into your web application."]}),"\n"]}),"\n",(0,o.jsx)(n.h3,{id:"customizing-the-payment-form",children:"Customizing the Payment Form"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Styling and Layout:"})," Tips on customizing the look and feel of the Payment Form."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Field Configurations:"})," Guide on adjusting input fields, including billing address details."]}),"\n"]}),"\n",(0,o.jsx)(n.h3,{id:"handling-form-submissions",children:"Handling Form Submissions"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Data Capture:"})," Steps to collect and manage user input from the Payment Form."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Secure Processing:"})," Implementing tokenization and security measures for handling sensitive\npayment information."]}),"\n"]}),"\n",(0,o.jsx)(n.h2,{id:"example-code",children:"Example Code"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Embedding the Form:"})," Sample code snippet demonstrating how to integrate the Payment Form."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Processing Submissions:"})," Example implementation for securely handling the collected data."]}),"\n"]}),"\n",(0,o.jsx)(n.h3,{id:"best-practices",children:"Best Practices"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Comprehensive Validation:"})," Ensure robust validation of all inputs, including billing address\ndetails."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Enhanced Security Compliance:"})," Adhere to security standards like PCI DSS, especially when\nhandling card information."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Optimizing User Experience:"})," Recommendations for a user-friendly form, providing clear\ninstructions and feedback."]}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"By implementing JustiFi's Payment Form, you can offer a streamlined, secure, and efficient method\nfor handling various types of payments, elevating the transaction process in your application."}),"\n",(0,o.jsx)(n.h2,{id:"component-example",children:"Component example"}),"\n",(0,o.jsx)(i.YX,{})]})}function u(e={}){const{wrapper:n}={...(0,r.M)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(m,{...e})}):m(e)}},7828:(e,n,t)=>{t.d(n,{_e:()=>l,qo:()=>s,YX:()=>a});var o=t(6651);const r=function(e){const[n,t]=(0,o.useState)(e?"loading":"idle");return(0,o.useEffect)((()=>{if(!e)return void t("idle");let n=document.querySelector(`script[src="${e}"]`);if(n)t(n.getAttribute("data-status"));else{n=document.createElement("script"),n.src=e,n.type="module",n.async=!0,n.setAttribute("data-status","loading"),document.body.appendChild(n);const t=e=>{n?.setAttribute("data-status","load"===e.type?"ready":"error")};n.addEventListener("load",t),n.addEventListener("error",t)}const o=e=>{t("load"===e.type?"ready":"error")};return n.addEventListener("load",o),n.addEventListener("error",o),()=>{n&&(n.removeEventListener("load",o),n.removeEventListener("error",o))}}),[e]),n};var i=t(2488);function s(){return r("https://cdn.jsdelivr.net/npm/@justifi/webcomponents@4.6.4/dist/webcomponents/webcomponents.esm.js"),(0,i.jsx)("div",{style:{border:"solid black 2px",padding:"20px"},children:(0,i.jsx)("justifi-card-form",{children:(0,i.jsx)("style",{children:":root {\n            --jfi-load-google-font: 'Inter:wght@200;400;700;900&family=Agdasima';\n            --jfi-layout-font-family: Agdasima;\n            --jfi-layout-padding: 4px;\n            --jfi-layout-form-control-spacing-x: .5rem;\n            --jfi-layout-form-control-spacing-y: 1rem;\n            --jfi-form-label-font-weight: 100;\n            --jfi-form-label-font-family: Inter;\n            --jfi-form-label-margin: 0 0 .5rem 0;\n            --jfi-form-control-background-color: #F4F4F6;\n            --jfi-form-control-background-color-hover: #EEEEF5;\n            --jfi-form-control-border-color: rgba(0, 0, 0, 0.42);\n            --jfi-form-control-border-color-hover: rgba(0, 0, 0, 0.62);\n            --jfi-form-control-border-color-focus: #fccc32;\n            --jfi-form-control-border-color-error: #C12727;\n            --jfi-form-control-border-top-width: 0;\n            --jfi-form-control-border-left-width: 0;\n            --jfi-form-control-border-bottom-width: 1px;\n            --jfi-form-control-border-right-width: 0;\n            --jfi-form-control-border-radius: 4px 4px 0 0;\n            --jfi-form-control-border-style: solid;\n            --jfi-form-control-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);\n            --jfi-form-control-box-shadow-focus: none;\n            --jfi-form-control-box-shadow-error-focus: none;\n            --jfi-form-control-border-style: solid;\n            --jfi-form-control-color: #212529;\n            --jfi-form-control-font-size: 1rem;\n            --jfi-form-control-font-weight: 400;\n            --jfi-form-control-line-height: 2;\n            --jfi-form-control-margin: 0;\n            --jfi-form-control-padding: .5rem .875rem;\n            --jfi-error-message-color: #C12727;\n            --jfi-error-message-margin: .25rem 0 0 0;\n            --jfi-error-message-font-size: .875rem;\n          }"})})})}function l(){return r("https://cdn.jsdelivr.net/npm/@justifi/webcomponents@4.6.4/dist/webcomponents/webcomponents.esm.js"),(0,i.jsx)("div",{style:{border:"solid black 2px",padding:"20px"},children:(0,i.jsx)("justifi-bank-account-form",{})})}function a(){return r("https://cdn.jsdelivr.net/npm/@justifi/webcomponents@4.6.4/dist/webcomponents/webcomponents.esm.js"),(0,i.jsx)("div",{style:{border:"solid black 2px",padding:"20px"},children:(0,i.jsx)("justifi-payment-form",{})})}},6316:(e,n,t)=>{t.d(n,{I:()=>l,M:()=>s});var o=t(6651);const r={},i=o.createContext(r);function s(e){const n=o.useContext(i);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),o.createElement(i.Provider,{value:n},e.children)}}}]);