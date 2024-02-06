"use strict";(self.webpackChunkpublic_docs=self.webpackChunkpublic_docs||[]).push([[9192],{2212:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>a,default:()=>h,frontMatter:()=>r,metadata:()=>o,toc:()=>d});var s=t(2488),i=t(6316);const r={title:"Payment Methods",sidebar_label:"Payment Methods",dscription:"Understand what payment methods are and which are available",keywords:["paymet methods","card presend","card not present","cnp","ach"]},a="Payment Methods",o={id:"payments/paymentMethods",title:"Payment Methods",description:"Overview",source:"@site/docs/payments/paymentMethods.mdx",sourceDirName:"payments",slug:"/payments/paymentMethods",permalink:"/public-docs/payments/paymentMethods",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/payments/paymentMethods.mdx",tags:[],version:"current",frontMatter:{title:"Payment Methods",sidebar_label:"Payment Methods",dscription:"Understand what payment methods are and which are available",keywords:["paymet methods","card presend","card not present","cnp","ach"]},sidebar:"docsSidebar",previous:{title:"PCI Complaince",permalink:"/public-docs/payments/compliance"},next:{title:"Tokenization",permalink:"/public-docs/payments/tokenization"}},c={},d=[{value:"Overview",id:"overview",level:2},{value:"ACH Payments",id:"ach-payments",level:2},{value:"Description",id:"description",level:3},{value:"Key Features",id:"key-features",level:3},{value:"Card Not Present (CNP) Transactions",id:"card-not-present-cnp-transactions",level:2},{value:"Description",id:"description-1",level:3},{value:"Key Features",id:"key-features-1",level:3},{value:"Card Present (CP) Transactions",id:"card-present-cp-transactions",level:2},{value:"Description",id:"description-2",level:3},{value:"Key Features",id:"key-features-2",level:3},{value:"Integrating Payment Methods",id:"integrating-payment-methods",level:2}];function l(e){const n={h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",strong:"strong",ul:"ul",...(0,i.M)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"payment-methods",children:"Payment Methods"}),"\n",(0,s.jsx)(n.h2,{id:"overview",children:"Overview"}),"\n",(0,s.jsx)(n.p,{children:"The JustiFi API supports a variety of payment methods to cater to diverse transactional needs. This\npage provides an overview of the three primary methods: Automated Clearing House (ACH) payments,\nCard Not Present (CNP), and Card Present (CP) transactions."}),"\n",(0,s.jsx)(n.h2,{id:"ach-payments",children:"ACH Payments"}),"\n",(0,s.jsx)(n.h3,{id:"description",children:"Description"}),"\n",(0,s.jsx)(n.p,{children:"ACH payments are electronic payments made through the ACH network. They are ideal for direct\nbank-to-bank transactions, such as direct deposits and bill payments."}),"\n",(0,s.jsx)(n.h3,{id:"key-features",children:"Key Features"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Cost-Effective:"})," Lower transaction fees compared to other methods."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Security:"})," Enhanced safety measures for secure transactions."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Convenience:"})," Suitable for recurring payments, consumers without access to cards, and other ."]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"card-not-present-cnp-transactions",children:"Card Not Present (CNP) Transactions"}),"\n",(0,s.jsx)(n.h3,{id:"description-1",children:"Description"}),"\n",(0,s.jsx)(n.p,{children:"CNP transactions occur when the cardholder is not physically present, typical in online purchases.\nThis method includes payments made via online forms, telephone orders, or recurring billing."}),"\n",(0,s.jsx)(n.h3,{id:"key-features-1",children:"Key Features"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Flexibility:"})," Facilitates a wide range of online transactions."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Security:"})," Requires robust fraud prevention and verification mechanisms."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Global Reach:"})," Ideal for e-commerce and international transactions."]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"card-present-cp-transactions",children:"Card Present (CP) Transactions"}),"\n",(0,s.jsx)(n.h3,{id:"description-2",children:"Description"}),"\n",(0,s.jsx)(n.p,{children:"CP transactions involve the physical use of a credit or debit card at a point of sale. This method\nis typical in retail or in-person services."}),"\n",(0,s.jsx)(n.h3,{id:"key-features-2",children:"Key Features"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Immediate Processing:"})," Real-time transaction authorization."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Security:"})," Utilizes EMV chip technology for enhanced security."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Customer Experience:"})," Allows for seamless in-person payment experiences."]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"integrating-payment-methods",children:"Integrating Payment Methods"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"API Integration:"})," Each payment method can be integrated into your platform using JustiFi's\nAPI, with specific endpoints and parameters detailed in our API documentation."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Compliance and Security:"})," Adherence to PCI DSS and other relevant standards is crucial,\nespecially for card-based transactions."]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"By offering these diverse payment methods, JustiFi ensures that your business can cater to various\ncustomer preferences and transaction scenarios, all while maintaining security and efficiency."})]})}function h(e={}){const{wrapper:n}={...(0,i.M)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},6316:(e,n,t)=>{t.d(n,{I:()=>o,M:()=>a});var s=t(6651);const i={},r=s.createContext(i);function a(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);