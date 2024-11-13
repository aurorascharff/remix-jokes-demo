import { ActionFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import { prisma } from "db";
import ErrorMessage from "~/components/ui/ErrorMessage";
import { slow } from "~/utils/slow";
import { z } from "zod";
import TextArea from "~/components/ui/TextArea";
import Input from "~/components/ui/Input";
import JokeDisplay from "~/components/JokeDisplay";
import { badRequest } from "~/utils/bad-request";
import Button from "~/components/ui/Button";

const jokeSchema = z.object({
  content: z.string().min(5, {
    message: "That joke is too short",
  }),
  createdAt: z.date().optional(),
  id: z.string().optional(),
  name: z.string().min(2, {
    message: "That joke's name is too short",
  }),
});

export const meta: MetaFunction = () => {
  return [
    { name: "description", content: "Remix Jokes app" },
    { title: "New joke" },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await slow();

  const form = await request.formData();
  const result = jokeSchema.safeParse({
    content: form.get("content"),
    name: form.get("name"),
  });

  if (!result.success) {
    return badRequest({
      fieldErrors: result.error.formErrors.fieldErrors,
      fields: {
        content: form.get("content") as string,
        name: form.get("name") as string,
      },
    });
  }

  const joke = await prisma.joke.create({
    data: result.data,
  });
  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  if (navigation.formData) {
    const result = jokeSchema.safeParse({
      content: navigation.formData.get("content"),
      name: navigation.formData.get("name"),
    });
    if (result.success) {
      return (
        <JokeDisplay
          canDelete={false}
          joke={{
            name: result.data.name,
            content: result.data.content,
            favorite: false,
          }}
        />
      );
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <p>Add your own hilarious joke</p>
      <Form method="post">
        <div>
          <label>
            Name:{" "}
            <Input
              errors={actionData?.fieldErrors?.name}
              defaultValue={actionData?.fields?.name}
              name="name"
              type="text"
            />
          </label>
        </div>
        <div>
          <label>
            Content:{" "}
            <TextArea
              errors={actionData?.fieldErrors?.content}
              defaultValue={actionData?.fields?.content}
              name="content"
            />
          </label>
        </div>
        <div className="flex justify-end">
          <Button type="submit">Add</Button>
        </div>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  return (
    <ErrorMessage>
      Something unexpected went wrong. Sorry about that.
    </ErrorMessage>
  );
}
