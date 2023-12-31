import type { LoaderArgs, ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  useLoaderData,
  useParams,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

import { CardDisplay } from "~/components/card";
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

  await db.card.delete({ where: { id: params.cardId } });

  return redirect("/cards");
};

export default function CardRoute() {
  const data = useLoaderData<typeof loader>();

  return <CardDisplay isOwner={data.isOwner} card={data.card} />;
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
