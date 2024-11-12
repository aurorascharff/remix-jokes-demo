import { MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import { prisma } from "db";
import NavButton from "~/components/ui/NavButton";

export const meta: MetaFunction = () => {
  return [
    { name: "description", content: "Remix Jokes app" },
    { title: "Jokes" },
  ];
};

export const loader = async () => {
  const jokeListItems = await prisma.joke.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, favorite: true },
    take: 5,
  });
  return { jokeListItems };
};

export default function JokesRoute() {
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  return (
    <div className="flex min-h-[100svh] w-full flex-col gap-5 bg-purple">
      <header className="border-b-2 border-purple-light py-4">
        <div className="mx-10 flex max-w-xl items-center justify-between lg:mx-40">
          <h1 className="text-5xl">
            <Link className="font-display text-white hover:no-underline" to="/">
              <span>J🤪KES</span>
            </Link>
          </h1>
        </div>
      </header>
      <main className="mx-10 flex grow flex-col gap-10 py-3 md:flex-row lg:mx-40">
        <div className="flex min-w-max flex-col gap-y-5">
          <Link
            className="padding-0 text-left text-yellow hover:underline"
            to="."
          >
            Get a random joke
          </Link>
          <p>Here are a few more jokes to check out:</p>
          <ul>
            {data.jokeListItems.map(({ id, name, favorite }) => (
              <li key={id}>
                <Link prefetch="intent" to={id}>
                  {name} {favorite ? "★" : ""}
                </Link>
              </li>
            ))}
          </ul>
          <NavButton to="new">Add your own</NavButton>
        </div>
        <div className={navigation.state === "loading" ? "opacity-50" : ""}>
          <Outlet />
        </div>
      </main>
      <footer className="border-t-2 border-purple-light pb-4 pt-8">
        <div className="mx-10 flex max-w-xl gap-4 md:mx-40">
          <Link reloadDocument to="/jokes.rss">
            RSS
          </Link>
        </div>
      </footer>
    </div>
  );
}
