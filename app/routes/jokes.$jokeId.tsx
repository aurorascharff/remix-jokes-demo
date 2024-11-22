import {
  isRouteErrorResponse,
  useRouteError,
} from 'react-router';
import type { Route } from './+types/jokes.$jokeId';
import { prisma } from '~/../db';
import JokeDisplay from '~/components/JokeDisplay';
import ErrorMessage from '~/components/ui/ErrorMessage';
import { slow } from '~/utils/slow';

export const meta = ({ data }: Route.MetaArgs) => {
  const { description, title } = data
    ? {
        description: `Enjoy the "${data.joke.name}" joke and much more`,
        title: `"${data.joke.name}" joke`,
      }
    : { description: 'No joke found', title: 'No joke' };

  return [
    { content: description, name: 'description' },
    { content: description, name: 'twitter:description' },
    { title },
  ];
};

export const loader = async ({ params }: Route.LoaderArgs) => {
  await slow();

  const joke = await prisma.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Response('What a joke! Not found.', {
      status: 404,
    });
  }
  return {
    joke,
  };
};

export const action = async ({ params, request }: Route.ActionArgs) => {
  await slow();

  const formData = await request.formData();
  return prisma.joke.update({
    data: {
      favorite: formData.get('favorite') === 'true',
    },
    where: { id: params.jokeId },
  });
};

export default function JokeRoute({ loaderData }: Route.ComponentProps) {
  return <JokeDisplay joke={loaderData.joke} />;
}

export function ErrorBoundary({ params }: Route.ErrorBoundaryProps) {
  const jokeId = params.jokeId;
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <ErrorMessage>Huh? What the heck is &quot;{jokeId}&quot;?</ErrorMessage>
      );
    }
  }

  return (
    <ErrorMessage>
      There was an error loading joke by the id &quot;${jokeId}&quot;. Sorry.
    </ErrorMessage>
  );
}
