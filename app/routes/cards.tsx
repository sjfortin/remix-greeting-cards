import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { db } from "~/utils/db.server";

export const loader = async () => {
  return json({
    cardListItems: await db.card.findMany(),
  });
};

export default function CardsRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <main>
        <div>
          <div>
            <ul>
              {data.cardListItems.map(({ id, cardRecipient }) => (
                <li key={id}>
                  <Link to={id}>{cardRecipient}</Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
          <div>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
