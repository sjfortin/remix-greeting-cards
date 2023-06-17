import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { db } from "~/utils/db.server";

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const cardRecipient = form.get("cardRecipient");
  const insideContent = form.get("insideContent");
  const frontContent = form.get("frontContent");
  
  if (
    typeof cardRecipient !== "string" ||
    typeof insideContent !== "string" ||
    typeof frontContent !== "string"
  ) {
    throw new Error("Form not submitted correctly.");
  }

  const fields = { cardRecipient, insideContent, frontContent };

  const card = await db.card.create({ data: fields });
  return redirect(`/cards/${card.id}`);
};

export default function NewCardRoute() {
  return (
    <div>
      <p>Add your own card:</p>
      <form method="post">
        <div>
          <label>
            Card Recipient: <input type="text" name="cardRecipient" />
          </label>
        </div>
        <div>
          <label>
            Front Content: <textarea name="frontContent" />
          </label>
        </div>
        <div>
          <label>
            Inside Content: <textarea name="insideContent" />
          </label>
        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
