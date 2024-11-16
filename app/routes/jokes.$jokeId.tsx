import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  isRouteErrorResponse,
  MetaFunction,
  useLoaderData,
  useParams,
  useRouteError,
} from "react-router";
import { prisma } from "db";
import JokeDisplay from "~/components/JokeDisplay";
import ErrorMessage from "~/components/ui/ErrorMessage";
import { slow } from "~/utils/slow";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const { description, title } = data
    ? {
        description: `Enjoy the "${data.joke.name}" joke and much more`,
        title: `"${data.joke.name}" joke`,
      }
    : { description: "No joke found", title: "No joke" };

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await slow();

  const joke = await prisma.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Response("What a joke! Not found.", {
      status: 404,
    });
  }
  return {
    joke,
  };
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  await slow();

  const formData = await request.formData();
  return prisma.joke.update({
    where: { id: params.jokeId },
    data: {
      favorite: formData.get("favorite") === "true",
    },
  });
};

export default function JokeRoute() {
  const data = useLoaderData<typeof loader>();

  return <JokeDisplay joke={data.joke} />;
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
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
