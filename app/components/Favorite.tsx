import { useFetcher } from 'react-router';
import type { Joke } from '@prisma/client';

export default function Favorite({ joke }: { joke: Pick<Joke, 'content' | 'name' | 'favorite'> }) {
  const fetcher = useFetcher();
  const favorite = fetcher.formData ? fetcher.formData.get('favorite') === 'true' : joke.favorite;

  return (
    <fetcher.Form method="post">
      <button
        className="text-yellow"
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        name="favorite"
        value={favorite ? 'false' : 'true'}
      >
        {favorite ? '★' : '☆'}
      </button>
    </fetcher.Form>
  );
}
