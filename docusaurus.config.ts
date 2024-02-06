import { themes as prismThemes } from "prism-react-renderer";
// import { themes as addlThemes } from "prism-themes";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "JustiFi Documentation",
  tagline: "JustiFi - Fintech Infrastructure for Platforms",
  favicon: "img/favicon.png",

  // Set the production url of your site here
  url: "https://silver-journey-22mmj12.pages.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "justifi-tech", // Usually your GitHub org/user name.
  projectName: "public-docs", // Usually your repo name.
  trailingSlash: true,

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: false,
        // blog: {
        // showReadingTime: true,
        // // Please change this to your repo.
        // // Remove this to remove the "edit this page" links.
        // editUrl:
        //   "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        // },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
    [
      "redocusaurus",
      {
        specs: [
          {
            spec: "./openapi/openapi.yaml",
            route: "/api/",
          },
        ],
        theme: {
          primaryColor: "#fccc32",
        },
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/justifi-logo-light.png",
    navbar: {
      // title: "JustiFi Documentation",
      logo: {
        alt: "My Site Logo",
        src: "img/justifi-logo-light.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          position: "left",
          label: "Documentation",
        },
        {
          to: "/api/",
          label: "API Specification",
          position: "left",
        },
        // { to: "/blog", label: "Blog", position: "left" },
        {
          href: "https://storybook.justifi.ai",
          label: "Storybook",
          position: "right",
        },
        {
          href: "https://github.com/justifi-tech",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      // links: [
      //   {
      //     title: "Docs",
      //     items: [
      //       {
      //         label: "Tutorial",
      //         to: "/overview",
      //       },
      //     ],
      //   },
      // {
      //   title: "Community",
      //   items: [
      //     {
      //       label: "Stack Overflow",
      //       href: "https://stackoverflow.com/questions/tagged/docusaurus",
      //     },
      //     {
      //       label: "Discord",
      //       href: "https://discordapp.com/invite/docusaurus",
      //     },
      //     {
      //       label: "Twitter",
      //       href: "https://twitter.com/docusaurus",
      //     },
      //   ],
      // },
      // {
      //   title: "More",
      //   items: [
      //     {
      //       label: "Blog",
      //       to: "/blog",
      //     },
      //     {
      //       label: "GitHub",
      //       href: "https://github.com/justifi-tech",
      //     },
      //   ],
      // },
      // ],
      copyright: `Copyright © ${new Date().getFullYear()} JustiFi Technologies, Inc.`,
    },
    prism: {
      // theme: prismThemes.github,
      theme: prismThemes.oceanicNext,
      darkTheme: prismThemes.oceanicNext,
      additionalLanguages: ["bash", "ruby", "jsx"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
