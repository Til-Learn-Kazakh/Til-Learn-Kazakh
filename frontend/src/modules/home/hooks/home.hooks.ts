import { useQuery } from '@tanstack/react-query'

import { homeService } from '../services/home.service'

export const LEVELS_QUERY_KEY = 'levels'

export const STREAK_QUERY_KEY = 'streak'

export const useLevels = () => {
	const result = useQuery({
		queryKey: [LEVELS_QUERY_KEY],
		queryFn: () => homeService.getLevels(),
	})

	return result
}

export const useStreak = () => {
	const result = useQuery({
		queryKey: [STREAK_QUERY_KEY],
		queryFn: () => homeService.getStreak(),
	})

	return result
}
