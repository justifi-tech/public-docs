import { Redirect } from "@docusaurus/router";
import BrowserOnly from "@docusaurus/BrowserOnly";

// import Link from "@docusaurus/Link";

// const AiRedirect = () => {
//   return (
//     <BrowserOnly>
//       {() => {
//         window.location.replace("https://docs.justifi.tech");
//         return null;
//       }}
//     </BrowserOnly>
//   );
// };

export default function Home(): JSX.Element {
  <BrowserOnly>
    {() => {
      const hostname = window.location.hostname;

      if (hostname == "developer.justifi.ai") {
        window.location.replace("https://docs.justifi.tech");
        // return AiRedirect();
      }
      return null;
    }}
  </BrowserOnly>;

  return <Redirect to="/gettingStarted" />;
}
