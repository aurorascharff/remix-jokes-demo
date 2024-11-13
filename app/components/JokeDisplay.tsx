import type { Joke } from "@prisma/client";
import { Link, useFetcher } from "@remix-run/react";
import Button from "./ui/Button";

export default function JokeDisplay({
  joke,
  canDelete = true,
}: {
  joke: Pick<Joke, "content" | "name" | "favorite">;
  canDelete?: boolean;
}) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  return (
    <div className="flex flex-col gap-y-4">
      <p>Here&apos;s your hilarious joke:</p>
      <p>{joke.content}</p>
      <div className="flex flex-row gap-2 text-yellow w-fit text-nowrap">
        <Link to=".">&quot;{joke.name}&quot; Permalink</Link>
        <Favorite joke={joke} />
      </div>
      <fetcher.Form action="destroy" method="post">
        <Button
          disabled={!canDelete || isSubmitting}
          name="intent"
          type="submit"
          value="delete"
        >
          {isSubmitting ? "Deleting..." : "Delete"}
        </Button>
      </fetcher.Form>
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
