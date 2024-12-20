import { redirect } from 'react-router';
import type { Route } from './+types/jokes.$jokeId.destroy';
import { prisma } from '~/../db';
import { slow } from '~/utils/slow';

export const action = async ({ params, request }: Route.ActionArgs) => {
  await slow();

  const form = await request.formData();
  if (form.get('intent') !== 'delete') {
    throw new Response(`The intent ${form.get('intent')} is not supported`, {
      status: 400,
    });
  }
  const joke = await prisma.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Response('Cant delete what does not exist', {
      status: 404,
    });
  }
  await prisma.joke.delete({ where: { id: params.jokeId } });
  throw redirect('/jokes');
};
