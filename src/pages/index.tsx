import { Redirect } from "@docusaurus/router";
import BrowserOnly from "@docusaurus/BrowserOnly";

// import Link from "@docusaurus/Link";

const AiRedirect = () => {
  return (
    <BrowserOnly fallback={<div>fdgsdfg</div>}>
      {() => {
        console.log("hereergerg");
        window.location.replace("https://docs.justifi.tech");
        return null;
      }}
    </BrowserOnly>
  );
};

export default function Home(): JSX.Element {
  const hostname = window.location.hostname;

  if (hostname == "developer.justifi.ai") {
    console.log("HERE");
    return AiRedirect();
    // window.location.replace("https://docs.justifi.tech");
  }

  return <Redirect to="/gettingStarted" />;
}
