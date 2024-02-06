"use strict";(self.webpackChunkpublic_docs=self.webpackChunkpublic_docs||[]).push([[6128],{4928:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>o,contentTitle:()=>r,default:()=>m,frontMatter:()=>a,metadata:()=>l,toc:()=>c});var i=t(2488),s=t(6316);const a={title:"Payment Intents"},r="Payment Intents",l={id:"payments/paymentIntents",title:"Payment Intents",description:"Overview",source:"@site/docs/payments/paymentIntents.mdx",sourceDirName:"payments",slug:"/payments/paymentIntents",permalink:"/payments/paymentIntents",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/payments/paymentIntents.mdx",tags:[],version:"current",frontMatter:{title:"Payment Intents"}},o={},c=[{value:"Overview",id:"overview",level:2},{value:"Why Payment Intents?",id:"why-payment-intents",level:2},{value:"What are Payment Intents?",id:"what-are-payment-intents",level:2},{value:"Key Benefits",id:"key-benefits",level:3},{value:"Using Payment Intents",id:"using-payment-intents",level:2},{value:"Creating a Payment Intent",id:"creating-a-payment-intent",level:3},{value:"Managing Payment Intent States",id:"managing-payment-intent-states",level:3},{value:"Example Implementation",id:"example-implementation",level:2},{value:"Best Practices",id:"best-practices",level:3}];function d(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",strong:"strong",ul:"ul",...(0,s.M)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"payment-intents",children:"Payment Intents"}),"\n",(0,i.jsx)(n.h2,{id:"overview",children:"Overview"}),"\n",(0,i.jsx)(n.p,{children:"Payment Intents in JustiFi API represent a crucial component in managing complex payment processes.\nThis feature is designed to facilitate the handling of various payment stages, from initiation to\nfinal confirmation."}),"\n",(0,i.jsx)(n.h2,{id:"why-payment-intents",children:"Why Payment Intents?"}),"\n",(0,i.jsx)(n.p,{children:"The implementation of Payment Intents in JustiFi's API brings several significant advantages to the\npayment process:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Streamlined Transaction Flow:"})," Payment Intents simplify complex payment scenarios, handling\nvarious stages from authorization to final settlement."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Adaptability to Payment Regulations:"})," They support advanced security measures like 3D Secure,\nwhich are becoming increasingly necessary due to evolving payment regulations."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Enhanced User Experience:"})," By managing multiple payment states, Payment Intents ensure a\nsmoother and more intuitive experience for the end user."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Reduction in Payment Failures:"})," They help in identifying and addressing issues early in the\npayment process, reducing the likelihood of failed transactions."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"what-are-payment-intents",children:"What are Payment Intents?"}),"\n",(0,i.jsx)(n.p,{children:"Payment Intents are objects in JustiFi\u2019s API that capture the intention to make a payment. They\ntrack the lifecycle of a payment, managing different states like authorization, capturing funds,\nand handling additional authentication requirements."}),"\n",(0,i.jsx)(n.h3,{id:"key-benefits",children:"Key Benefits"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Improved Success Rates:"})," Optimizes the payment process to increase the likelihood of successful\ntransactions."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Enhanced Security:"})," Supports additional verification steps, crucial for secure transactions."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Flexibility:"})," Adaptable to various payment scenarios and methods."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"using-payment-intents",children:"Using Payment Intents"}),"\n",(0,i.jsx)(n.h3,{id:"creating-a-payment-intent",children:"Creating a Payment Intent"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"API Call:"})," Instructions on generating a Payment Intent via API, including necessary parameters\nlike amount, currency, and customer information."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Handling Responses:"})," Guidance on interpreting responses to Payment Intent API calls."]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"managing-payment-intent-states",children:"Managing Payment Intent States"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"State Transitions:"})," Overview of various states (e.g., ",(0,i.jsx)(n.code,{children:"requires_payment_method"}),",\n",(0,i.jsx)(n.code,{children:"requires_confirmation"}),", ",(0,i.jsx)(n.code,{children:"requires_action"}),") and how to handle them."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Capturing Payments:"})," Steps to capture funds after authorization is complete."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"example-implementation",children:"Example Implementation"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Sample Code/Scenario:"})," Example code or a detailed scenario demonstrating the creation and\nmanagement of a Payment Intent."]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"best-practices",children:"Best Practices"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Monitoring State Changes:"})," Tips on efficiently tracking and responding to changes in the state\nof a Payment Intent."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Error Handling:"})," Strategies for handling errors or declines in the payment process."]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"By effectively utilizing Payment Intents, you can ensure a smooth and reliable payment process,\nadapting to various requirements and scenarios with ease."})]})}function m(e={}){const{wrapper:n}={...(0,s.M)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},6316:(e,n,t)=>{t.d(n,{I:()=>l,M:()=>r});var i=t(6651);const s={},a=i.createContext(s);function r(e){const n=i.useContext(a);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),i.createElement(a.Provider,{value:n},e.children)}}}]);