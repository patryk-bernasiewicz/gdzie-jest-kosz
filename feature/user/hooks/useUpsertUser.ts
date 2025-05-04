import { UseMutationResult, useMutation } from '@tanstack/react-query';

import { User } from '../types';

export default function useUpsertUser(): UseMutationResult<User, Error, string> {
  const upsertUser = useMutation<User, Error, string>({
    mutationFn: async (sessionId: string) => {
      try {
        const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/user/validate-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
          }),
        });

        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        return res.json() as Promise<User>;
      } catch (error) {
        console.error('Error upserting user:', error);
        throw error;
      }
    },
  });

  return upsertUser;
}
