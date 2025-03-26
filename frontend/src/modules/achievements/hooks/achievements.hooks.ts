import { useQuery } from '@tanstack/react-query'

import { achievementsService } from '../services/achievements.service'

export const ACHIEVEMENTS_PROGRESS_QUERY_KEY = 'achievements-progress'
export const ACHIEVEMENT_QUERY_KEY = 'achievement'

export const useAchievementsProgress = () => {
	return useQuery({
		queryKey: [ACHIEVEMENTS_PROGRESS_QUERY_KEY],
		queryFn: () => achievementsService.getAchievementsProgress(),
	})
}

export const useAchievementById = (achievementID: string) => {
	return useQuery({
		queryKey: [ACHIEVEMENT_QUERY_KEY, achievementID],
		queryFn: () => achievementsService.getAchievementById(achievementID),
		enabled: !!achievementID, // Запрос выполняется только если передан achievementID
	})
}
