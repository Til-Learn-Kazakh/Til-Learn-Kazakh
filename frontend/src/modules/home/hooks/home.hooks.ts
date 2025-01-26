import { useQuery } from '@tanstack/react-query'

import { homeService } from '../services/home.service'

export const LEVELS_QUERY_KEY = 'levels'

export const useLevels = () => {
	const result = useQuery({
		queryKey: [LEVELS_QUERY_KEY],
		queryFn: () => homeService.getLevels(),
	})

	return result
}
