import { AxiosRequestConfig } from 'axios'

import { server } from '../../../core/config/environment.config'
import { axiosWithAuth } from '../../../middleware/axios-interceptors'

class AchievementsService {
	private readonly url = `${server}/achievements`

	// Получение прогресса по всем достижениям
	async getAchievementsProgress(config?: AxiosRequestConfig) {
		return axiosWithAuth
			.get(`${this.url}/progress`, config)
			.then(resp => resp.data)
			.catch(e => {
				console.error('[AchievementsService] Error fetching progress:', e)
				throw e
			})
	}

	// Получение информации о конкретном достижении
	async getAchievementById(achievementID: string, config?: AxiosRequestConfig) {
		return axiosWithAuth
			.get(`${this.url}/${achievementID}`, config)
			.then(resp => resp.data)
			.catch(e => {
				console.error(`[AchievementsService] Error fetching achievement ${achievementID}:`, e)
				throw e
			})
	}

	// Получение награды за достижение (Claim reward)
	async claimAchievementReward(achievementID: string, config?: AxiosRequestConfig) {
		return axiosWithAuth
			.post(`${this.url}/claim/${achievementID}`, {}, config) // Пустое тело, так как передаем ID в URL
			.then(resp => resp.data)
			.catch(e => {
				console.error(`[AchievementsService] Error claiming reward for ${achievementID}:`, e)
				throw e
			})
	}
}

export const achievementsService = new AchievementsService()
