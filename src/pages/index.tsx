import { Redirect } from "@docusaurus/router";
import BrowserOnly from "@docusaurus/BrowserOnly";

export default function Home(): JSX.Element {
  return (
    <BrowserOnly>
      {() => {
        const hostname = window.location.hostname;

        if (hostname == "developer.justifi.ai") {
          window.location.replace("https://docs.justifi.tech");
        } else {
          return <Redirect to="/gettingStarted" />;
        }
        return null;
      }}
    </BrowserOnly>
  );
}
