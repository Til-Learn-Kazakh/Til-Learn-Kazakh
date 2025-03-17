import { useQuery } from '@tanstack/react-query'

import { analyticsService } from '../services/analytics.service'

export const DAILY_STATS_QUERY_KEY = 'daily-stats'
export const MONTHLY_STATS_QUERY_KEY = 'monthly-stats'
export const YEARLY_STATS_QUERY_KEY = 'yearly-stats'

export const useDailyStats = (date: string) => {
	return useQuery({
		queryKey: [DAILY_STATS_QUERY_KEY, date],
		queryFn: () => analyticsService.getDailyStats(date),
		enabled: !!date,
	})
}

export const useMonthlyStats = (month: string) => {
	return useQuery({
		queryKey: [MONTHLY_STATS_QUERY_KEY, month],
		queryFn: () => analyticsService.getMonthlyStats(month),
		enabled: !!month,
	})
}

export const useYearlyStats = (year: string) => {
	return useQuery({
		queryKey: [YEARLY_STATS_QUERY_KEY, year],
		queryFn: () => analyticsService.getYearlyStats(year),
		enabled: !!year,
	})
}
