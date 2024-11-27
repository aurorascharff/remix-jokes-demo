import { Form, Link, useNavigation } from 'react-router';
import Favorite from './Favorite';
import Button from './ui/Button';
import type { Joke } from '@prisma/client';

export default function JokeDisplay({
  joke,
  canDelete = true,
}: {
  joke: Pick<Joke, 'content' | 'name' | 'favorite'>;
  canDelete?: boolean;
}) {
  const navigation = useNavigation();
  const isDeleting = navigation.formData?.get('intent') === 'delete';
  const canMutate = canDelete && !isDeleting;

  return (
    <div className="flex flex-col gap-y-4">
      <p>Here&apos;s your hilarious joke:</p>
      <p>{joke.content}</p>
      <div className="flex flex-row gap-2 text-yellow w-fit text-nowrap">
        <Link to=".">&quot;{joke.name}&quot; Permalink</Link>
        <Favorite disabled={!canMutate} joke={joke} />
      </div>
      <Form action="destroy" method="post">
        <Button disabled={!canMutate} name="intent" type="submit" value="delete">
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </Form>
    </div>
  );
}
