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
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Add your own card content:
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        This information will be displayed publicly so be careful what you
        share.
      </p>
      <form method="post">
        <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label
              htmlFor="cardRecipient"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Card Recipient
            </label>
            <div className="mt-2">
              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <input
                  type="text"
                  name="cardRecipient"
                  id="cardRecipient"
                  className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          <div className="col-span-full">
            <label
              htmlFor="frontContent"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Front Content
            </label>
            <div className="mt-2">
              <textarea
                id="frontContent"
                name="frontContent"
                rows={3}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={""}
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Add content for the front of the card.
            </p>
          </div>
          <div className="col-span-full">
            <label
              htmlFor="insideContent"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Inside Content
            </label>
            <div className="mt-2">
              <textarea
                id="insideContent"
                name="insideContent"
                rows={3}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={""}
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Add content for the inside of the card.
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
