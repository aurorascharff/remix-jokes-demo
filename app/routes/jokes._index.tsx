import { isRouteErrorResponse, Link, useRouteError } from 'react-router';
import type { Route } from './+types/jokes._index';
import { prisma } from '~/../db';
import ErrorMessage from '~/components/ui/ErrorMessage';

export const loader = async () => {
  const count = await prisma.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await prisma.joke.findMany({
    skip: randomRowNumber,
    take: 1,
  });
  if (!randomJoke) {
    throw new Response('No random joke found', {
      status: 404,
    });
  }
  return { randomJoke };
};

export default function JokesIndexRoute({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col gap-y-4">
      <p>Heres a random joke:</p>
      <p>{loaderData.randomJoke.content}</p>
      <Link to={loaderData.randomJoke.id}>
        &quot;{loaderData.randomJoke.name}&quot; Permalink
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
