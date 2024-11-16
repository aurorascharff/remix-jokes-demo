import { isRouteErrorResponse, Link, useLoaderData, useRouteError } from "react-router";
import { prisma } from "db";
import ErrorMessage from "~/components/ui/ErrorMessage";

export const loader = async () => {
  const count = await prisma.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await prisma.joke.findMany({
    skip: randomRowNumber,
    take: 1,
  });
  if (!randomJoke) {
    throw new Response("No random joke found", {
      status: 404,
    });
  }
  return { randomJoke };
};

export default function JokesIndexRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-y-4">
      <p>Heres a random joke:</p>
      <p>{data.randomJoke.content}</p>
      <Link to={data.randomJoke.id}>
        &quot;{data.randomJoke.name}&quot; Permalink
      </Link>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <ErrorMessage>
        <p>There are no jokes to display.</p>
        <Link to="new">Add your own</Link>
      </ErrorMessage>
    );
  }

  return <ErrorMessage>I did a whoopsies.</ErrorMessage>;
}
