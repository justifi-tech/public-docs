import { darken, readableColor } from "polished";

/*
 * DEAD CODE: this file is not imported anywhere in the repo and has no
 * effect on the rendered site (verified by grepping the whole project for
 * "theme.ts" / `from "./theme"` — zero references, in this commit or any
 * prior one back to the initial commit). The `/api-spec` page's actual
 * Redoc theming lives in the `redocusaurus` plugin config in
 * docusaurus.config.ts (`primaryColor`) plus targeted CSS overrides in
 * src/css/custom.css (search "plugin-redoc") for the couple of spots
 * where Redoc's own default theme doesn't match the brand.
 *
 * Kept in sync with the same brand values as the rest of the site so it
 * isn't actively wrong if someone does wire it up later, but until then,
 * editing this file changes nothing — either delete it or actually pass
 * it to the redocusaurus plugin's `theme` option.
 */
export const theme = {
  spacing: {
    unit: 5,
    sectionHorizontal: ({ spacing }) => spacing.unit * 8,
    sectionVertical: ({ spacing }) => spacing.unit * 8,
  },
  // breakpoints: {
  //   xs: 0,
  //   small: '550px',
  //   medium: '900px',
  //   large: '1200px',
  // },
  colors: {
    tonalOffset: 0.15,
    primary: {
      // Brand amber and its real tonal ramp, from the `@justifi/ui` design
      // system (accent-500/600/700), not a guessed/computed shade.
      main: "#FFA000", // accent-600
      light: "#FFB300", // accent-500
      dark: "#E68900", // accent-700 — for hover states/borders, not body text (see links below)
      contrastText: ({ colors }) => readableColor(colors.primary.main),
    },
    // success: {
    //   main: '#00aa13',
    //   light: ({ colors }) => lighten(colors.tonalOffset * 3, colors.success.main),
    //   dark: ({ colors }) => darken(colors.tonalOffset, colors.success.main),
    //   contrastText: ({ colors }) => readableColor(colors.success.main),
    // },
    // error: {
    //   main: '#e53935',
    //   light: ({ colors }) => lighten(colors.tonalOffset * 2, colors.error.main),
    //   dark: ({ colors }) => darken(colors.tonalOffset, colors.error.main),
    //   contrastText: ({ colors }) => readableColor(colors.error.main),
    // },
    // warning: {
    //   main: '#d4ad03',
    //   light: ({ colors }) => lighten(colors.tonalOffset * 2, colors.warning.main),
    //   dark: ({ colors }) => darken(colors.tonalOffset, colors.warning.main),
    //   contrastText: ({ colors }) => readableColor(colors.warning.main),
    // },
    // info: {
    //   main: '#4782cb',
    //   light: ({ colors }) => lighten(colors.tonalOffset * 2, colors.info.main),
    //   dark: ({ colors }) => darken(colors.tonalOffset, colors.info.main),
    //   contrastText: ({ colors }) => readableColor(colors.info.main),
    // },
    text: {
      // Light-mode "Text" (primary text) from the brand doc.
      primary: "#0D1A27",
      secondary: "#4A6070",
    },
    border: {
      dark: "rgba(0,0,0, 0.15)",
      light: "#ffffff",
    },
    // responses: {
    //   success: {
    //     color: ({ colors }) => colors.success.main,
    //     backgroundColor: ({ colors }) => transparentize(0.9, colors.success.main),
    //   },
    //   error: {
    //     color: ({ colors }) => colors.error.main,
    //     backgroundColor: ({ colors }) => transparentize(0.9, colors.error.main),
    //   },
    //   redirect: {
    //     color: ({ colors }) => colors.warning.main,
    //     backgroundColor: ({ colors }) => transparentize(0.9, colors.responses.redirect.color),
    //   },
    //   info: {
    //     color: ({ colors }) => colors.info.main,
    //     backgroundColor: ({ colors }) => transparentize(0.9, colors.responses.info.color),
    //   },
    // },
    http: {
      get: "#6bbd5b",
      post: "#248fb2",
      put: "#9b708b",
      options: "#d3ca12",
      patch: "#e09d43",
      delete: "#e27a7a",
      basic: "#999",
      link: "#31bbb6",
      head: "#c167e4",
    },
    // navbar: {
    //   main: ({ colors }) => colors.primary.main,
    //   gradient: ({ colors }) => darken(colors.tonalOffset / 2, colors.navbar.main),
    //   contrastText: 'white'
    // },
    // footer: {
    // main: ({ colors }) => colors.primary.main,
    // contrastText: 'white'
    // },
  },

  sidebar: {
    // Light-mode "Surface" from the brand doc (cards/panels).
    backgroundColor: "#F0F4F7",
    width: "260px",
  },
  // tocPanel: {
  //   width: '240px',
  // },

  typography: {
    fontSize: "15px",
    lineHeight: "1.6em",
    fontWeightRegular: "400",
    fontWeightBold: "600",
    fontWeightLight: "300",
    fontFamily: "Lato, Helvetica, Arial",
    // "system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif",
    headings: {
      fontFamily: "Mulish, Helvetica, Arial",
      // "system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif",
      fontWeight: "700",
    },
    heading1: {
      //   fontSize: '1.85714em',
      //   fontWeight: '600',
      //   fontFamily: ({ typography }) => typography.headings.fontFamily,
      //   lineHeight: ({ typography }) => typography.lineHeight,
      //   color: ({ colors }) => colors.primary.main,
      capitalize: true,
    },
    // heading2: {
    //   fontSize: '1.57143em',
    //   fontWeight: '600',
    //   color: ({ colors }) => colors.text.primary,
    //   fontFamily: ({ typography }) => typography.headings.fontFamily,
    //   lineHeight: ({ typography }) => typography.lineHeight,
    //   capitalize: false,
    // },
    // heading3: {
    //   fontSize: '1.27em',
    //   fontWeight: '600',
    //   color: ({ colors }) => colors.text.primary,
    //   fontFamily: ({ typography }) => typography.headings.fontFamily,
    //   lineHeight: ({ typography }) => typography.lineHeight,
    //   capitalize: false,
    // },
    // heading4: {
    // // ...
    // },
    // heading5: {
    // // ...
    // },
    // heading6: {
    // // ...
    // },
    code: {
      fontSize: "13px",
      fontFamily: '"Source Code Pro", sans-serif',
      // fontWeight: ({ typography }) => typography.fontWeightRegular,
      // Was #e53935 — the design system's `danger` token, repurposed here
      // for plain enum/identifier text (e.g. `test`/`live`), which reads as
      // an error rather than a value. The design system's own JsonBlock
      // component never uses danger for code — using body text color on a
      // visible surface tint instead (the previous background was a
      // near-invisible 4%-opacity overlay, easy to lose against any
      // ambient theme change).
      color: "#0D1A27",
      backgroundColor: "#F0F4F7",
      wrap: false,
    },
    links: {
      // Neither flat brand amber (~2:1) nor the accent-700 hover shade
      // (~2.6:1) clears WCAG AA's 4.5:1 text-contrast minimum on white.
      // accent-900 from the design system's real ramp is the first step
      // that actually passes (~4.9:1), so it's used here specifically for
      // link text; primary.dark (accent-700) stays available for
      // Redoc-internal hover/border uses where full text-contrast doesn't
      // apply.
      color: "#996600",
      visited: "#996600",
      hover: darken(0.08, "#996600"),
    },
  },
  rightPanel: {
    // Navy, from the brand doc's dark-mode/primary-brand-surface color.
    backgroundColor: "#0D1A27",
    width: "40%",
    // textColor: '#ffffff',
  },
  schema: {
    // Light-mode "Surface" from the brand doc.
    nestedBackground: "#F0F4F7",
    // linesColor: theme => lighten( theme.colors.tonalOffset, desaturate(theme.colors.tonalOffset, theme.colors.primary.main) ),
    // defaultDetailsWidth: '75%',
    // typeNameColor: theme => theme.colors.text.secondary,
    // typeTitleColor: theme => theme.schema.typeNameColor,
    // requireLabelColor: theme => theme.colors.error.main,
    // labelsTextSize: '0.9em',
    // nestingSpacing: '1em',
    // arrow: {
    //   size: '1.1em',
    //   color: theme => theme.colors.text.secondary,
    // },
  },
  // codeBlock: {
  //   backgroundColor: ({ rightPanel }) => darken(0.1, rightPanel.backgroundColor),
  //   tokens: {},
  // },
};
