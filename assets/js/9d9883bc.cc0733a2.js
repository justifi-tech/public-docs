"use strict";(self.webpackChunkpublic_docs=self.webpackChunkpublic_docs||[]).push([[8016],{7136:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>d,frontMatter:()=>o,metadata:()=>r,toc:()=>u});var i=n(2488),a=n(6316);const o={title:"Authentication",description:"Understand the steps necessary to authenticate to the API",sidebar_label:"Authentication",keywords:["oauth","api","security","tokens"]},s="Authentication While Using JustiFi's API",r={id:"apiFundamentals/authentication",title:"Authentication",description:"Understand the steps necessary to authenticate to the API",source:"@site/docs/apiFundamentals/authentication.mdx",sourceDirName:"apiFundamentals",slug:"/apiFundamentals/authentication",permalink:"/apiFundamentals/authentication",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/apiFundamentals/authentication.mdx",tags:[],version:"current",frontMatter:{title:"Authentication",description:"Understand the steps necessary to authenticate to the API",sidebar_label:"Authentication",keywords:["oauth","api","security","tokens"]},sidebar:"docsSidebar",previous:{title:"Overview",permalink:"/apiFundamentals/"},next:{title:"Idempotency",permalink:"/apiFundamentals/idempotency"}},c={},u=[{value:"OAuth2 and Bearer Token Authentication",id:"oauth2-and-bearer-token-authentication",level:2},{value:"Obtaining Your API Key",id:"obtaining-your-api-key",level:2},{value:"Steps to Get Your API Key:",id:"steps-to-get-your-api-key",level:3},{value:"Don&#39;t Have an Account?",id:"dont-have-an-account",level:2},{value:"Create Your Bearer Token",id:"create-your-bearer-token",level:2}];function h(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",strong:"strong",...(0,a.M)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.h1,{id:"authentication-while-using-justifis-api",children:"Authentication While Using JustiFi's API"}),"\n",(0,i.jsx)(t.p,{children:"Secure and efficient access to JustiFi's API is paramount. We use OAuth2 authentication, a\nstandard protocol for authorization, and secure your API requests with Bearer tokens for robust\nprotection."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.a,{href:"https://developer.justifi.ai/tag/API-Credentials#operation/CreateAccessToken",children:"API Specification"})}),"\n",(0,i.jsx)(t.h2,{id:"oauth2-and-bearer-token-authentication",children:"OAuth2 and Bearer Token Authentication"}),"\n",(0,i.jsx)(t.p,{children:"OAuth2 provides a secure and standardized way to authorize API requests. When you access JustiFi's\nAPI, your request must include a Bearer token, which is a unique token obtained after a successful\nOAuth2 authentication process. This token ensures that your interactions with our API are secure\nand authenticated."}),"\n",(0,i.jsx)(t.h2,{id:"obtaining-your-api-key",children:"Obtaining Your API Key"}),"\n",(0,i.jsx)(t.p,{children:"To start using our API, you'll need an API Key, which you can obtain from our customer dashboard.\nThis key is essential for the OAuth2 authentication process."}),"\n",(0,i.jsx)(t.h3,{id:"steps-to-get-your-api-key",children:"Steps to Get Your API Key:"}),"\n",(0,i.jsxs)(t.ol,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"Access the Customer Dashboard:"})," Log in to your JustiFi ",(0,i.jsx)(t.a,{href:"https://app.justifi.ai",children:"account"}),"."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"Navigate to the Developer Section:"})," Find the API section where you can manage your keys."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"Continue to the API Keys Section:"})," Follow the steps to generate a new API key."]}),"\n"]}),"\n",(0,i.jsxs)(t.admonition,{type:"tip",children:[(0,i.jsx)(t.h2,{id:"dont-have-an-account",children:"Don't Have an Account?"}),(0,i.jsx)(t.p,{children:"If you're new to JustiFi and don't have an account yet, getting started is easy:"}),(0,i.jsxs)(t.ol,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"Contact Us:"})," ",(0,i.jsx)(t.a,{href:"/contact",children:"Reach out to our team"})," to set up an account."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"Account Setup:"})," Our team will guide you through the account setup process and help you get\nyour API Key."]}),"\n"]})]}),"\n",(0,i.jsx)(t.h2,{id:"create-your-bearer-token",children:"Create Your Bearer Token"}),"\n",(0,i.jsxs)(t.p,{children:["Once you have your API Key, you'll use it to obtain a Bearer token. Here's an example to generate\nan Authentication Token. You can replace the ",(0,i.jsx)(t.code,{children:"client_id"})," and ",(0,i.jsx)(t.code,{children:"client_secret"})," to use your\nown. ",(0,i.jsx)(t.strong,{children:"Be sure to use TEST keys!"})]})]})}function d(e={}){const{wrapper:t}={...(0,a.M)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},6316:(e,t,n)=>{n.d(t,{I:()=>r,M:()=>s});var i=n(6651);const a={},o=i.createContext(a);function s(e){const t=i.useContext(o);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:s(e.components),i.createElement(o.Provider,{value:t},e.children)}}}]);