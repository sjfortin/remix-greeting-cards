import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useActionData,
  useRouteError,
  Link,
} from "@remix-run/react";

import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import { getUserId, requireUserId } from "~/utils/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return json({});
};

function validateCardContent(content: string) {
  if (content.length < 10) {
    return "That card content is too short. C'mon, put some effort into it!";
  }
}

function validateCardRecipient(name: string) {
  if (name.length < 1) {
    return "Please enter valid card recipient name";
  }
}

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const cardRecipient = form.get("cardRecipient");
  const insideContent = form.get("insideContent");
  const frontContent = form.get("frontContent");

  if (
    typeof cardRecipient !== "string" ||
    typeof insideContent !== "string" ||
    typeof frontContent !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    });
  }

  const fieldErrors = {
    frontContent: validateCardContent(frontContent),
    insideContent: validateCardContent(insideContent),
    cardRecipient: validateCardRecipient(cardRecipient),
  };

  const fields = { cardRecipient, insideContent, frontContent };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  const card = await db.card.create({
    data: { ...fields, cardCreatorId: userId },
  });

  return redirect(`/cards/${card.id}`);
};

export default function NewCardRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Add your own card content:
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Enter the card recipient name and the front and inside content for your
        card!
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
                  className="block flex-1 border-0 bg-transparent p-1.5 px-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  defaultValue={actionData?.fields?.cardRecipient}
                  aria-invalid={Boolean(actionData?.fieldErrors?.cardRecipient)}
                  aria-errormessage={
                    actionData?.fieldErrors?.cardRecipient
                      ? "card-recipient-error"
                      : undefined
                  }
                />
              </div>
            </div>
            {actionData?.fieldErrors?.cardRecipient ? (
              <p
                className="text-red-600 text-sm"
                id="card-recipient-error"
                role="alert"
              >
                {actionData.fieldErrors.cardRecipient}
              </p>
            ) : null}
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
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={actionData?.fields?.frontContent}
                aria-invalid={Boolean(actionData?.fieldErrors?.frontContent)}
                aria-errormessage={
                  actionData?.fieldErrors?.frontContent
                    ? "inside-content-error"
                    : undefined
                }
              />
            </div>
            {actionData?.fieldErrors?.frontContent ? (
              <p
                className="text-red-600 text-sm"
                id="inside-content-error"
                role="alert"
              >
                {actionData.fieldErrors.frontContent}
              </p>
            ) : null}
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
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={actionData?.fields?.insideContent}
                aria-invalid={Boolean(actionData?.fieldErrors?.insideContent)}
                aria-errormessage={
                  actionData?.fieldErrors?.insideContent
                    ? "inside-content-error"
                    : undefined
                }
              />
            </div>
            {actionData?.fieldErrors?.insideContent ? (
              <p
                className="text-red-600 text-sm"
                id="inside-content-error"
                role="alert"
              >
                {actionData.fieldErrors.insideContent}
              </p>
            ) : null}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          {actionData?.formError ? (
            <p className="text-red-600 text-sm" role="alert">
              {actionData.formError}
            </p>
          ) : null}
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

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 401) {
    return (
      <div className="error-container">
        <p>You must be logged in to create a card.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}
