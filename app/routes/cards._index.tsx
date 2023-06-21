import { isRouteErrorResponse, Link, useRouteError } from "@remix-run/react";

export default function CardsIndexRoute() {
  return (
    <div>
      <p>Cards Index</p>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="error-container">
        <p>There are no cards to display.</p>
        <Link to="new">Add your own</Link>
      </div>
    );
  }

  return <div className="error-container">I did a whoopsies.</div>;
}
