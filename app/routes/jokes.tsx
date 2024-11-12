import { MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
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

  return (
    <div>
      <header>
        <div>
          <h1>
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span>🤪</span>
              <span>J🤪KES</span>
            </Link>
          </h1>
        </div>
      </header>
      <main>
        <div>
          <div>
            <Link to=".">Get a random joke</Link>
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
          <div>
            <Outlet />
          </div>
        </div>
      </main>
      <footer>
        <div>
          <Link reloadDocument to="/jokes.rss">
            RSS
          </Link>
        </div>
      </footer>
    </div>
  );
}
