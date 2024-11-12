import type { Joke } from "@prisma/client";
import { Form, Link } from "@remix-run/react";
import Favorite from "./Favorite";
import Button from "./ui/Button";

export default function JokeDisplay({
  joke,
}: {
  joke: Pick<Joke, "content" | "name" | "favorite">;
}) {
  return (
    <div>
      <p>Here&apos;s your hilarious joke:</p>
      <p>{joke.content}</p>
      <Link to=".">&quot;{joke.name}&quot; Permalink</Link>
      <Favorite joke={joke} />
      <Form action="destroy" method="post">
        <Button name="intent" type="submit" value="delete">
          Delete
        </Button>
      </Form>
    </div>
  );
}
