import { themes as prismThemes } from "prism-react-renderer";
// import { themes as addlThemes } from "prism-themes";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// nightOwl with its background swapped to match --color-surface-raised.
const darkCodeTheme = {
  ...prismThemes.nightOwl,
  plain: {
    ...prismThemes.nightOwl.plain,
    backgroundColor: "#2D3E4E",
  },
};

const config: Config = {
  title: "JustiFi Documentation",
  tagline: "JustiFi - Fintech Infrastructure for Platforms",
  favicon: "img/favicon.png",

  stylesheets: [
    {
      href: "https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Mulish:wght@400;600;700;900&display=swap",
      rel: "stylesheet",
    },
  ],

  // Set the production url of your site here.
  // Defaults target the primary (Vercel) deploy at docs.justifi.tech.
  // The GitHub Pages workflow overrides SITE_URL/SITE_BASE_URL so the site
  // builds correctly under https://justifi-tech.github.io/public-docs/.
  url: process.env.SITE_URL ?? "https://docs.justifi.tech",
  // Set the /<baseUrl>/ pathname under which your site is served.
  // For GitHub project pages this is '/<projectName>/' (e.g. '/public-docs/').
  baseUrl: process.env.SITE_BASE_URL ?? "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "justifi-tech", // Usually your GitHub org/user name.
  projectName: "public-docs", // Usually your repo name.
  trailingSlash: false,

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
          //   editUrl:
          //     "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
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
            spec: "openapi/multi-yaml/index.yaml",
            route: "/api-spec",
          },
        ],
        theme: {
          primaryColor: "#FFA000",
          theme: {
            schema: {
              nestedBackground: "var(--ifm-background-surface-color)",
            },
            // Redoc derives codeBlock/rightPanel hover shades via darken()
            // on these values, which crashes on a CSS var() string — so
            // both must stay literal. Right panel matches the dark-mode
            // sidebar in both themes rather than reactively going white
            // in light mode (which would break with white text).
            rightPanel: {
              backgroundColor: "#253545",
              textColor: "#ffffff",
            },
            codeBlock: {
              backgroundColor: "#1a2a3a",
            },
          },
        },
      },
    ],
  ],
  plugins: [
    function() {
      return {
        name: 'node-builtins-fallback',
        configureWebpack() {
          return {
            resolve: { fallback: { fs: false, path: false, url: false } },
          };
        },
      };
    },
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'web-components',
        path: '.wc-current',
        routeBasePath: 'web-components',
        sidebarPath: require.resolve('./sidebars.web-components.js'),
        includeCurrentVersion: true,
        lastVersion: 'current',
        versions: { current: { label: '6.14', banner: 'none' } },
        // Exclude templates and internal helper files from being parsed as docs
        exclude: [
          '**/templates/**',
          '**/scripts/**',
          '**/*.ts',
          '**/*.tsx',
          '**/node_modules/**',
          '**/CHANGELOG.md',
        ],
      },
    ],
  ],
  themeConfig: {
    // Replace with your project's social card
    image: "img/justifi-logo-navy.png",
    navbar: {
      // title: "JustiFi Documentation",
      logo: {
        alt: "JustiFi",
        src: "img/justifi-logo-navy.svg",
        srcDark: "img/justifi-logo-white.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          position: "left",
          label: "Documentation",
        },
        {
          to: "/api-spec",
          label: "API Specification",
          position: "left",
        },
        {
          type: 'doc',
          docsPluginId: 'web-components',
          docId: 'introduction',
          label: 'Web Components',
          position: 'left',
        },
        {
          href: 'https://github.com/justifi-tech/web-component-library/blob/main/packages/webcomponents/CHANGELOG.md',
          label: 'Changelog',
          position: 'right',
        },
        // { to: "/blog", label: "Blog", position: "left" },
        {
          type: 'docsVersionDropdown',
          docsPluginId: 'web-components',
          position: 'right',
          dropdownActiveClassDisabled: true,
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
      theme: prismThemes.github,
      darkTheme: darkCodeTheme,
      additionalLanguages: ["bash", "ruby", "jsx"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
