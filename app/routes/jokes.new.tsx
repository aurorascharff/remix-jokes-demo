import { Form, useNavigation, useRouteError, redirect } from 'react-router';
import { z } from 'zod';
import type { Route } from './+types/jokes.new';
import { prisma } from '~/../db';
import JokeDisplay from '~/components/JokeDisplay';
import Button from '~/components/ui/Button';
import ErrorMessage from '~/components/ui/ErrorMessage';
import Input from '~/components/ui/Input';
import TextArea from '~/components/ui/TextArea';
import { badRequest } from '~/utils/bad-request';
import { slow } from '~/utils/slow';

const jokeSchema = z.object({
  content: z.string().min(5, {
    message: 'That joke is too short',
  }),
  createdAt: z.date().optional(),
  id: z.string().optional(),
  name: z.string().min(2, {
    message: 'That jokes name is too short',
  }),
});

export const meta = () => {
  return [{ content: 'Remix Jokes app', name: 'description' }, { title: 'New joke' }];
};

export const action = async ({ request }: Route.ActionArgs) => {
  const form = await request.formData();
  const result = jokeSchema.safeParse({
    content: form.get('content'),
    name: form.get('name'),
  });

  if (!result.success) {
    return badRequest({
      fieldErrors: result.error.formErrors.fieldErrors,
      fields: {
        content: form.get('content') as string,
        name: form.get('name') as string,
      },
    });
  }

  await slow();

  const joke = await prisma.joke.create({
    data: result.data,
  });
  throw redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== 'idle' && navigation.formAction === 'jokes/new';

  // Optimistic update
  if (navigation.formData) {
    const result = jokeSchema.safeParse({
      content: navigation.formData.get('content'),
      name: navigation.formData.get('name'),
    });
    if (result.success) {
      return (
        <JokeDisplay
          canDelete={false}
          joke={{
            content: result.data.content,
            favorite: false,
            name: result.data.name,
          }}
        />
      );
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <p>Add your own hilarious joke</p>
      <Form method="post">
        <Input
          label="Name:"
          errors={actionData?.fieldErrors?.name}
          defaultValue={actionData?.fields?.name}
          name="name"
          type="text"
        />
        <TextArea
          label="Content:"
          errors={actionData?.fieldErrors?.content}
          defaultValue={actionData?.fields?.content}
          name="content"
        />
        <div className="flex justify-end">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Adding...' : 'Add'}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  return <ErrorMessage>Something unexpected went wrong. Sorry about that.</ErrorMessage>;
}
