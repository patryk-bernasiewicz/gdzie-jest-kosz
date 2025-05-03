import { useUser } from '@clerk/clerk-expo';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import api from '@/utils/api';

import { User } from '../types';

export default function useUserProfile(options?: Partial<UseQueryOptions<User>>) {
  const { user } = useUser();

  return useQuery<User>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      try {
        const response = await api.get('/user/me');
        return response.data;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
    },
    enabled: Boolean(user),
    refetchInterval: 1000 * 60 * 15,
    ...options,
  });
}
