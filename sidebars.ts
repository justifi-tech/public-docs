import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: "doc",
      label: "Getting Started",
      id: "gettingStarted",
    },
    {
      type: "category",
      label: "Fintech Infrastructure",
      link: {
        type: "generated-index",
        title: "Fintech Infrastructure",
        description:
          "Learn about JustiFi's revolutionary approach to Fintech Infrastructure",
        keywords: ["infrastructure"],
        // id: "infrastructure/overview",
      },
      collapsible: true,
      collapsed: false,
      items: [
        "infrastructure/overview",
        "infrastructure/architectureDiagram",
        "infrastructure/fintechProducts",
        "infrastructure/entities",
        "infrastructure/webComponents",
        "infrastructure/webComponentTokens",
      ],
    },
    {
      type: "category",
      label: "API Fundamentals",
      link: {
        type: "generated-index",
        title: "API Fundamentals",
        description:
          "Learn about the core features of JustiFi's Fintech Infrastructure Platform",
      },
      items: [
        "apiFundamentals/apiFundamentals",
        "apiFundamentals/authentication",
        "apiFundamentals/idempotency",
        "apiFundamentals/pagination",
      ],
      collapsible: true,
      collapsed: true,
    },
    {
      type: "category",
      label: "Entities",
      link: {
        type: "generated-index",
        title: "Entities",
        description:
          " Learn how leveraging Entities elevates your platform to the next level",
        keywords: ["entities"],
      },
      items: [
        "entities/overview",
        "entities/businesses",
        "entities/identities",
        // "entities/provisioning",
      ],
      collapsible: true,
      collapsed: true,
    },
    {
      type: "category",
      label: "Payments",
      link: {
        type: "generated-index",
        title: "Payments",
        description: "Learn how to get started processing payments in minutes",
      },
      items: [
        "payments/overview",
        "payments/compliance",
        "payments/paymentMethods",
        "payments/tokenization",
        "payments/paymentsApi",
        {
          type: "category",
          label: "Web Components",
          link: {
            type: "generated-index",
            title: "Web Components",
            description: "Learn how to implement payment collection forms",
          },
          items: [
            "payments/guides/achForm",
            "payments/guides/cardForm",
            "payments/guides/paymentForm",
          ],
        },
      ],
    },
  ],
};

export default sidebars;
