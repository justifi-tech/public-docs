import { Redirect } from "@docusaurus/router";
import Link from "@docusaurus/Link";

export default function Home(): JSX.Element {
  const hostname = window.location.hostname;

  if (hostname == "developer.justifi.ai") {
    window.location.replace("https://docs.justifi.tech");
    return;
  }

  return <Redirect to="/gettingStarted" />;
}
