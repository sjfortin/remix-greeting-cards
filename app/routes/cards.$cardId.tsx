import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { db } from "~/utils/db.server";

export const loader = async ({ params }: LoaderArgs) => {
  const card = await db.card.findUnique({
    where: { id: params.cardId },
  });
  if (!card) {
    throw new Error("Card not found");
  }
  return json({ card });
};

export default function CardRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>Here's your card:</p>
      <p>{data.card.frontContent}</p>
      <p>{data.card.insideContent}</p>
      <Link to=".">"{data.card.cardRecipient}" Permalink</Link>
    </div>
  );
}
