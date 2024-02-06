"use strict";(self.webpackChunkpublic_docs=self.webpackChunkpublic_docs||[]).push([[5764],{3340:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>d,contentTitle:()=>r,default:()=>u,frontMatter:()=>t,metadata:()=>o,toc:()=>c});var i=a(2488),s=a(6316);const t={title:"Pagination",description:"Learn how to manage large datasets",sidebar_label:"Pagination",keywords:["api","pagination","datasets"]},r="Pagination in JustiFi API",o={id:"apiFundamentals/pagination",title:"Pagination",description:"Learn how to manage large datasets",source:"@site/docs/apiFundamentals/pagination.mdx",sourceDirName:"apiFundamentals",slug:"/apiFundamentals/pagination",permalink:"/public-docs/apiFundamentals/pagination",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/apiFundamentals/pagination.mdx",tags:[],version:"current",frontMatter:{title:"Pagination",description:"Learn how to manage large datasets",sidebar_label:"Pagination",keywords:["api","pagination","datasets"]},sidebar:"docsSidebar",previous:{title:"Idempotency",permalink:"/public-docs/apiFundamentals/idempotency"},next:{title:"Entities",permalink:"/public-docs/category/entities"}},d={},c=[{value:"Cursor-Based Pagination Explained",id:"cursor-based-pagination-explained",level:2},{value:"Using the Page Info Object:",id:"using-the-page-info-object",level:3},{value:"API Request Parameters",id:"api-request-parameters",level:2},{value:"Standard Response Structure",id:"standard-response-structure",level:3},{value:"Example Paginated Request",id:"example-paginated-request",level:5},{value:"Example Paginated Response",id:"example-paginated-response",level:5},{value:"Best Practices for Pagination",id:"best-practices-for-pagination",level:2}];function l(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",h5:"h5",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.M)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"pagination-in-justifi-api",children:"Pagination in JustiFi API"}),"\n",(0,i.jsx)(n.p,{children:"Effective management of large datasets is crucial in API interactions. JustiFi's API employs\ncursor-based pagination, ensuring efficient and scalable data retrieval for bulk fetches."}),"\n",(0,i.jsx)(n.h2,{id:"cursor-based-pagination-explained",children:"Cursor-Based Pagination Explained"}),"\n",(0,i.jsxs)(n.p,{children:["Cursor-based pagination involves navigating through data using cursor pointers\n(",(0,i.jsx)(n.code,{children:"before_cursor"})," and ",(0,i.jsx)(n.code,{children:"after_cursor"}),"), making it ideal for handling extensive datasets. Each\nresponse in our API includes a ",(0,i.jsx)(n.code,{children:"page_info"})," object, crucial for understanding your position in\nthe data set and managing the flow of information."]}),"\n",(0,i.jsx)(n.h3,{id:"using-the-page-info-object",children:"Using the Page Info Object:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Navigation Fields:"})," The ",(0,i.jsx)(n.code,{children:"page_info"})," object contains ",(0,i.jsx)(n.code,{children:"has_next"})," and ",(0,i.jsx)(n.code,{children:"has_previous"})," fields\nto indicate more available items."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Cursor Values:"})," ",(0,i.jsx)(n.code,{children:"start_cursor"})," and ",(0,i.jsx)(n.code,{children:"end_cursor"})," are included for precise data retrieval."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"api-request-parameters",children:"API Request Parameters"}),"\n",(0,i.jsx)(n.p,{children:"When fetching data, these parameters are key:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsxs)(n.strong,{children:[(0,i.jsx)(n.code,{children:"limit"}),":"]})," Controls the number of resources retrieved per request. It can range from 1 to\n100, with a default value of 25."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsxs)(n.strong,{children:[(0,i.jsx)(n.code,{children:"after_cursor"}),":"]})," Fetches the next page of data."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsxs)(n.strong,{children:[(0,i.jsx)(n.code,{children:"before_cursor"}),":"]})," Retrieves the previous page of data."]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"standard-response-structure",children:"Standard Response Structure"}),"\n",(0,i.jsx)(n.p,{children:"All responses follow a consistent structure:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsxs)(n.strong,{children:[(0,i.jsx)(n.code,{children:"id"}),":"]})," The ID of the object returned, null for array responses."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsxs)(n.strong,{children:[(0,i.jsx)(n.code,{children:"type"}),":"]}),' Indicates the type of object returned, typically an "array" for bulk fetches.']}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsxs)(n.strong,{children:[(0,i.jsx)(n.code,{children:"data"}),":"]})," Contains the requested resource(s) or an empty array if no resources are\navailable."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsxs)(n.strong,{children:[(0,i.jsx)(n.code,{children:"page_info"}),":"]})," Provides pagination details, including cursor positions."]}),"\n"]}),"\n",(0,i.jsx)(n.h5,{id:"example-paginated-request",children:"Example Paginated Request"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"curl -X GET https://api.justifi.ai/v1/payments?limit=25&after_cursor=token-from-page-info \\\n    -H 'Authorization: Bearer [access_token]' \\\n    -H 'Accept: application/json'\n"})}),"\n",(0,i.jsx)(n.h5,{id:"example-paginated-response",children:"Example Paginated Response"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:'{\n    "id": null,\n    "type": "array",\n    "data":[\n        { "id":"py_438xBom2Drh55kE1WfyGLg",\n          "amount": 1000,\n          ... additional response attributes based on resource schema\n        }\n    ],\n    "page_info": {\n      "has_previous": false,\n      "has_next": true,\n      "start_cursor": "WyIyMDIyLTAxLTExIDE1OjI3OjM2LjAyNzc3MDAwMCIsImNhNjQwMTk1LTEzYzMtNGJlZi1hZWQyLTU3ZjA1MzhjNjNiYSJd",\n      "end_cursor": "WyIyMDIyLTAxLTExIDEyOjU5OjQwLjAwNTkxODAwMCIsImQ0Njg5MGE2LTJhZDItNGZjNy1iNzdkLWFiNmE3MDJhNTg3YSJd"\n    }\n}\n'})}),"\n",(0,i.jsx)(n.h2,{id:"best-practices-for-pagination",children:"Best Practices for Pagination"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Determine Optimal Page Size:"})," Balance performance and usability by setting an appropriate\n",(0,i.jsx)(n.code,{children:"limit"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Consistent Cursor Usage:"})," Utilize ",(0,i.jsx)(n.code,{children:"before_cursor"})," and ",(0,i.jsx)(n.code,{children:"after_cursor"})," effectively for\npredictable navigation."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Understand Response Structure:"})," Familiarize yourself with the standard response envelope\nfor efficient data handling."]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"By leveraging JustiFi's pagination system, you can efficiently navigate through large datasets,\nensuring your application remains responsive and data retrieval remains manageable."})]})}function u(e={}){const{wrapper:n}={...(0,s.M)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},6316:(e,n,a)=>{a.d(n,{I:()=>o,M:()=>r});var i=a(6651);const s={},t=i.createContext(s);function r(e){const n=i.useContext(t);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),i.createElement(t.Provider,{value:n},e.children)}}}]);