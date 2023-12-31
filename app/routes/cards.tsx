import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Outlet,
  useLoaderData,
  useMatches,
  Form,
} from "@remix-run/react";

import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import { classNames } from "~/utils/helpers";

type CardListItemProps = {
  id: string;
  cardRecipient: string;
};

export const loader = async ({ request }: LoaderArgs) => {
  const cardListItems = await db.card.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, cardRecipient: true },
    take: 5,
  });
  const user = await getUser(request);

  return json({ cardListItems, user });
};

const CardListItem: React.FC<CardListItemProps> = ({ id, cardRecipient }) => {
  const matches = useMatches();
  const matchID = matches[matches.length - 1];
  const isCurrent = matchID.params.cardId === id;

  return (
    <li>
      <Link
        className={classNames(
          isCurrent
            ? "bg-gray-50 text-indigo-600"
            : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
          "group flex gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold"
        )}
        to={id}
        prefetch="intent"
      >
        {cardRecipient}
      </Link>
    </li>
  );
};

export default function CardsRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <header>
        <div>
          <h1>
            <Link to="/" title="Cards" aria-label="Cards">
              Cards
            </Link>
          </h1>
          {data.user ? (
            <div>
              <span>{`Hi ${data.user.username}`}</span>
              <Form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </Form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <main>
        <div className="flex">
          <div className="w-1/4 p-4 border rounded">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              List of Card Recipients:
            </h2>
            <ul className="space-y-1 my-3">
              {data.cardListItems.map(({ id, cardRecipient }) => (
                <CardListItem key={id} id={id} cardRecipient={cardRecipient} />
              ))}
            </ul>
            <Link
              to="new"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add your own
            </Link>
          </div>
          <div className="w-3/4 p-4">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export function ErrorBoundary() {
  return <div className="error-container">Oops!</div>;
}
