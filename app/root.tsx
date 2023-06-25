import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  Scripts,
} from "@remix-run/react";
import type { PropsWithChildren, ReactNode } from "react";
import type { LinksFunction, V2_MetaFunction } from "@remix-run/node";
import NavBar from "./components/navbar";

import styles from "./tailwind.css";
import Footer from "./components/footer";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const meta: V2_MetaFunction = () => {
  const description = "You must greet the ones you love.";

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title: "Greet the world" },
  ];
};

function Document({ children, title }: PropsWithChildren<{ title?: string }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="keywords" content="Greeting Cards" />
        <meta
          name="twitter:image"
          content="https://greet-the-world.com/social.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@greet_the_world" />
        <meta name="twitter:site" content="@greet_the_world" />
        <meta name="twitter:title" content="Greet the World" />
        <Meta />
        {title ? <title>{title}</title> : null}
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Document title={`${error.status} ${error.statusText}`}>
        <Layout>
          <div className="error-container">
            <h1>
              {error.status} {error.statusText}
            </h1>
          </div>
        </Layout>
      </Document>
    );
  }

  const errorMessage = error instanceof Error ? error.message : "Unknown error";

  return (
    <Document title="Uh-oh!">
      <div className="error-container">
        <h1>App Error</h1>
        <pre>{errorMessage}</pre>
      </div>
    </Document>
  );
}
