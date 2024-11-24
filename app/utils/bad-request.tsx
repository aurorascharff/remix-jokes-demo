import { data } from 'react-router';

export function badRequest<T>(input: T, init?: ResponseInit) {
  return data({ ...input, ok: false as const }, { ...init, status: 400, statusText: 'Bad Request' });
}
