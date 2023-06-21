import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useParams,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

import { db, deleteCard } from "~/utils/db.server";

export const loader = async ({ params }: LoaderArgs) => {
  const card = await db.card.findUnique({
    where: { id: params.cardId },
  });
  if (!card) {
    throw new Response("Card not found.", {
      status: 404,
    });
  }
  return json({ card });
};

export const action: ActionFunction = async ({ request }) => {
  const body = new URLSearchParams(await request.text());
  const cardId = body.get("cardId");

  await deleteCard(cardId);

  return redirect("/cards");
};

export default function CardRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>Here's your card:</p>
      <p>{data.card.frontContent}</p>
      <p>{data.card.insideContent}</p>
      <Link to=".">"{data.card.cardRecipient}" Permalink</Link>
      <form method="post" action="/cards/delete">
        <input type="hidden" name="cardId" value={data.card.id} />
        <button
          type="submit"
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Delete Card
        </button>
      </form>
    </div>
  );
}

export function ErrorBoundary() {
  const { cardId } = useParams();
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="error-container">Huh? What the heck is "{cardId}"?</div>
    );
  }

  return (
    <div className="error-container">
      There was an error loading card by the id "${cardId}". Sorry.
    </div>
  );
}
