import { themes as prismThemes } from "prism-react-renderer";
// import { themes as addlThemes } from "prism-themes";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// nightOwl with its background swapped to match --jf-surface-raised (spec section 2).
// Consumed by JS, not CSS, so this must stay a literal hex, not a var().
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
          customCss: [
            "./src/css/tokens.css",
            "./src/css/chrome.css",
            "./src/css/content.css",
            "./src/css/redoc.css",
          ],
        },
      } satisfies Preset.Options,
    ],
    [
      "redocusaurus",
      {
        specs: [
          {
            // Generated at prebuild by scripts/merge-payables-spec.mjs, from
            // openapi/multi-yaml/index.yaml + the synced openapi/payables/ spec.
            spec: "openapi/multi-yaml/index.merged.yaml",
            route: "/api-spec",
          },
        ],
        theme: {
          primaryColor: "#FFA000",
          theme: {
            colors: {
              // Solid brand hues per REST verb/status family, used directly
              // by Redoc with no darken()/transparentize() math — safe to
              // set literally here. Kept in sync by hand with the .operation-type
              // and .tab-* rgba() values in redoc.css (CSS can't read these).
              success: { main: "#4caf50" },
              warning: { main: "#ffb300" },
              error: { main: "#f44336" },
              responses: {
                success: { color: "#4caf50", backgroundColor: "rgba(76, 175, 80, .2)", tabTextColor: "#4caf50" },
                error: { color: "#f44336", backgroundColor: "rgba(244, 67, 54, .2)", tabTextColor: "#f44336" },
                redirect: { color: "#ffb300", backgroundColor: "rgba(255, 179, 0, .2)", tabTextColor: "#ffb300" },
                info: { color: "#3b82f6", backgroundColor: "rgba(59, 130, 246, .2)", tabTextColor: "#3b82f6" },
              },
              http: {
                get: "#3b82f6",
                post: "#4caf50",
                put: "#4caf50",
                patch: "#ffb300",
                delete: "#f44336",
                options: "#64748b",
                head: "#64748b",
                basic: "#64748b",
                link: "#3b82f6",
              },
            },
            typography: {
              // Redoc's own defaults are Roboto/Montserrat/Courier; the design
              // system uses one Arial stack for body+headings, Consolas for code.
              fontFamily:
                "Arial, Calibri, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
              headings: {
                fontFamily:
                  "Arial, Calibri, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
                fontWeight: "600",
              },
              code: {
                fontFamily: "'Consolas', 'Courier New', monospace",
              },
              links: {
                // No color math on these (plain CSS `color:`), so a var() is safe
                // and gives light/dark the correct accent automatically.
                color: "var(--jf-accent-text)",
                hover: "#e68900",
              },
            },
            schema: {
              nestedBackground: "var(--ifm-background-surface-color)",
            },
            // Redoc derives codeBlock/rightPanel hover shades via darken()
            // on these values, which crashes on a CSS var() string — so
            // both must stay literal. Right panel matches the dark-mode
            // sidebar in both themes rather than reactively going white
            // in light mode (which would break with white text) — this is
            // also the common "code panel stays dark" pattern other API docs use.
            rightPanel: {
              backgroundColor: "#253545",
              textColor: "#ffffff",
              servers: {
                overlay: { backgroundColor: "#2d3e4e", textColor: "#ffffff" },
                url: { backgroundColor: "#2d3e4e" },
              },
            },
            // surface-raised (JsonBlock body), not surface-default/canvas — previous
            // value (#1a2a3a) was the wrong token for this spot.
            codeBlock: {
              backgroundColor: "#2d3e4e",
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
    colorMode: {
      defaultMode: "dark",
      respectPrefersColorScheme: false,
    },
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
