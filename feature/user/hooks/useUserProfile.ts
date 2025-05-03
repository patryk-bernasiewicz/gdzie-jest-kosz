import { useUser } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';

import api from '@/lib/api';

import { User } from '../types';

export default function useUserProfile() {
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
  });
}
