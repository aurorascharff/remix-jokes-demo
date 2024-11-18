import { Link } from 'react-router';
import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = () => {
  return [
    { content: 'Remix Jokes app', name: 'description' },
    { title: 'Remix Jokes' },
  ];
};

export default function IndexRoute() {
  return (
    <div className="flex grow flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center pb-12 pt-12">
        <h1 className="text-center font-display text-6xl text-shadow">
          Remix{' '}
          <span className="block font-display text-6xl uppercase leading-none md:text-9xl">
            Jokes!
          </span>
        </h1>
        <nav>
          <ul className="flex list-none gap-4 p-0 font-display text-lg leading-none">
            <li>
              <Link className="decoration-wavy decoration-1" to="jokes">
                Read Jokes
              </Link>
            </li>
            <li>
              <Link className="decoration-wavy decoration-1" to="/jokes.rss">
                RSS
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
