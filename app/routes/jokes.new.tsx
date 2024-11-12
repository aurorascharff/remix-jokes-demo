import { ActionFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  Link,
  useActionData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import { prisma } from "db";
import JokeDisplay from "~/components/JokeDisplay";
import Button from "~/components/ui/Button";
import ErrorMessage from "~/components/ui/ErrorMessage";
import { badRequest } from "~/utils/bad-request";
import { slow } from "~/utils/slow";

export const meta: MetaFunction = () => {
  return [
    { name: "description", content: "Remix Jokes app" },
    { title: "New joke" },
  ];
};

function validateJokeContent(content: string) {
  if (content.length < 10) {
    return "That joke is too short";
  }
}

function validateJokeName(name: string) {
  if (name.length < 3) {
    return "That joke's name is too short";
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await slow();

  const form = await request.formData();
  const content = form.get("content");
  const name = form.get("name");
  if (typeof content !== "string" || typeof name !== "string") {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    });
  }

  const fieldErrors = {
    content: validateJokeContent(content),
    name: validateJokeName(name),
  };
  const fields = { content, name };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  const joke = await prisma.joke.create({
    data: fields,
  });
  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  if (navigation.formData) {
    const content = navigation.formData.get("content");
    const name = navigation.formData.get("name");
    if (
      typeof content === "string" &&
      typeof name === "string" &&
      !validateJokeContent(content) &&
      !validateJokeName(name)
    ) {
      return <JokeDisplay joke={{ name, content, favorite: false }} />;
    }
  }

  return (
    <div>
      <p>Add your own hilarious joke</p>
      <Form method="post">
        <div>
          <label>
            Name:{" "}
            <input
              defaultValue={actionData?.fields?.name}
              name="name"
              type="text"
              aria-invalid={Boolean(actionData?.fieldErrors?.name)}
              aria-errormessage={
                actionData?.fieldErrors?.name ? "name-error" : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p role="alert">{actionData.fieldErrors.name}</p>
          ) : null}
        </div>
        <div>
          <label>
            Content:{" "}
            <textarea
              defaultValue={actionData?.fields?.content}
              name="content"
              aria-invalid={Boolean(actionData?.fieldErrors?.content)}
              aria-errormessage={
                actionData?.fieldErrors?.content ? "content-error" : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p role="alert">{actionData.fieldErrors.content}</p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p role="alert">{actionData.formError}</p>
          ) : null}
          <Button type="submit">Add</Button>
        </div>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error) && error.status === 401) {
    return (
      <ErrorMessage>
        <p>You must be logged in to create a joke.</p>
        <Link to="/login">Login</Link>
      </ErrorMessage>
    );
  }

  return (
    <ErrorMessage>
      Something unexpected went wrong. Sorry about that.
    </ErrorMessage>
  );
}
