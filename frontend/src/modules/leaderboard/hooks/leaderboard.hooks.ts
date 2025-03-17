import { useQuery } from '@tanstack/react-query'

import { leaderboardService } from '../services/leaderboard.service'

export const WEEKLY_LEADERBOARD_QUERY_KEY = 'weeklyLeaderboard'
export const MONTHLY_LEADERBOARD_QUERY_KEY = 'monthlyLeaderboard'
export const ALL_TIME_LEADERBOARD_QUERY_KEY = 'allTimeLeaderboard'

export const useWeeklyLeaderboard = () => {
	return useQuery({
		queryKey: [WEEKLY_LEADERBOARD_QUERY_KEY],
		queryFn: () => leaderboardService.getWeeklyLeaderboard(),
	})
}

export const useMonthlyLeaderboard = () => {
	return useQuery({
		queryKey: [MONTHLY_LEADERBOARD_QUERY_KEY],
		queryFn: () => leaderboardService.getMonthlyLeaderboard(),
	})
}

export const useAllTimeLeaderboard = () => {
	return useQuery({
		queryKey: [ALL_TIME_LEADERBOARD_QUERY_KEY],
		queryFn: () => leaderboardService.getAllTimeLeaderboard(),
	})
}
