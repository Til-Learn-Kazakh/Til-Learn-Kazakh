import { useQuery } from '@tanstack/react-query'

import { authService } from '../services/auth.service'

export const CURRENT_USER_QUERY_KEY = 'auth:current-user'

export const useCurrentUser = () => {
	const result = useQuery({
		queryKey: [CURRENT_USER_QUERY_KEY],
		queryFn: () => authService.getCurrent(),
	})

	return result
}
