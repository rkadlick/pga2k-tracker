import { User } from '@/types';

// The site is a read-only archive, so nobody can sign in. Keeping this hook means the
// admin-only controls stay in the code and stay hidden behind `isAuthenticated`.
export function useAuth() {
  return {
    user: null as User | null,
    loading: false,
    isAuthenticated: false
  };
}
