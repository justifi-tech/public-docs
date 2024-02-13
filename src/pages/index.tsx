"use client";

import { Redirect } from "@docusaurus/router";
import BrowserOnly from "@docusaurus/BrowserOnly";

// import Link from "@docusaurus/Link";

const AiRedirect = () => {
  return (
    <BrowserOnly fallback={<div>fdgsdfg</div>}>
      {() => {
        window.location.replace("https://docs.justifi.tech");
        return null;
      }}
    </BrowserOnly>
  );
};

export default function Home(): JSX.Element {
  const hostname = window.location.hostname;

  if (hostname == "developer.justifi.ai") {
    return AiRedirect();
  }

  return <Redirect to="/gettingStarted" />;
}
