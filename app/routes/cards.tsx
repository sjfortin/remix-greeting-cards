import { Outlet } from "@remix-run/react";

export default function CardsRoute() {
  return (
    <div>
      <h1>Cards</h1>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
