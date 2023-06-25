import type { Card } from "@prisma/client";
import { Form, Link } from "@remix-run/react";

export function CardDisplay({
  canDelete = true,
  isOwner,
  card,
}: {
  canDelete?: boolean;
  isOwner: boolean;
  card: Pick<Card, "insideContent" | "frontContent" | "cardRecipient">;
}) {
  return (
    <div>
      <p>Here's your card:</p>
      <p>{card.frontContent}</p>
      <p>{card.insideContent}</p>
      <Link to=".">"{card.cardRecipient}" Permalink</Link>

      {isOwner ? (
        <Form method="post">
          <button
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            name="intent"
            type="submit"
            value="delete"
            disabled={!canDelete}
          >
            Delete
          </button>
        </Form>
      ) : null}
    </div>
  );
}
