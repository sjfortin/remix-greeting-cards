import type { LoaderArgs, ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useParams,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

import { db } from "~/utils/db.server";
import { requireUserId, getUserId } from "~/utils/session.server";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const { description, title } = data
    ? {
        description: `Enjoy the card for "${data.card.cardRecipient}"`,
        title: `"${data.card.cardRecipient}" card`,
      }
    : { description: "No card found", title: "No card" };

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ];
};

export const loader = async ({ params, request }: LoaderArgs) => {
  const userId = await getUserId(request);
  const card = await db.card.findUnique({
    where: { id: params.cardId },
  });
  if (!card) {
    throw new Response("Card not found.", {
      status: 404,
    });
  }
  return json({ isOwner: userId === card.cardCreatorId, card });
};

export const action = async ({ params, request }: ActionArgs) => {
  const form = await request.formData();

  if (form.get("intent") !== "delete") {
    throw new Response(`The intent ${form.get("intent")} is not supported`, {
      status: 400,
    });
  }

  const userId = await requireUserId(request);

  const card = await db.card.findUnique({
    where: { id: params.cardId },
  });

  if (!card) {
    throw new Response("Can't delete what does not exist", {
      status: 404,
    });
  }

  if (card.cardCreatorId !== userId) {
    throw new Response("Pssh, nice try. That's not your card", { status: 403 });
  }

  await db.card.delete({ where: { id: params.jokeId } });

  return redirect("/jokcardes");
};

export default function CardRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>Here's your card:</p>
      <p>{data.card.frontContent}</p>
      <p>{data.card.insideContent}</p>
      <Link to=".">"{data.card.cardRecipient}" Permalink</Link>

      {data.isOwner ? (
        <form method="post">
          <button
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            name="intent"
            type="submit"
            value="delete"
          >
            Delete
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function ErrorBoundary() {
  const { cardId } = useParams();
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 400) {
      return (
        <div className="error-container">
          What you're trying to do is not allowed.
        </div>
      );
    }

    if (error.status === 403) {
      return (
        <div className="error-container">
          Sorry, but "{cardId}" is not your card.
        </div>
      );
    }

    if (error.status === 404) {
      return (
        <div className="error-container">Huh? What the heck is "{cardId}"?</div>
      );
    }
  }

  return (
    <div className="error-container">
      There was an error loading card by the id "${cardId}". Sorry.
    </div>
  );
}
