import type { Joke } from "@prisma/client";
import { Form, Link, useFetcher } from "@remix-run/react";
import Button from "./ui/Button";

export default function JokeDisplay({
  joke,
}: {
  joke: Pick<Joke, "content" | "name" | "favorite">;
}) {
  return (
    <div className="flex flex-col gap-y-4">
      <p>Here&apos;s your hilarious joke:</p>
      <p>{joke.content}</p>
      <div className="flex flex-row gap-2 text-yellow w-fit text-nowrap">
        <Link to=".">&quot;{joke.name}&quot; Permalink</Link>
        <Favorite joke={joke} />
      </div>
      <Form action="destroy" method="post">
        <Button name="intent" type="submit" value="delete">
          Delete
        </Button>
      </Form>
    </div>
  );
}

function Favorite({
  joke,
}: {
  joke: Pick<Joke, "content" | "name" | "favorite">;
}) {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : joke.favorite;

  return (
    <fetcher.Form method="post">
      <button
        className="text-yellow"
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
