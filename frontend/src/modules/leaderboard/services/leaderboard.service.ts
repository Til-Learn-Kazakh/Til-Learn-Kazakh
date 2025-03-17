import { AxiosRequestConfig } from 'axios'

import { server } from '../../../core/config/environment.config'
import { axiosWithAuth } from '../../../middleware/axios-interceptors'

class LeaderboardService {
	private readonly leaderboardUrl = `${server}/leaderboard`

	async getWeeklyLeaderboard(config?: AxiosRequestConfig) {
		return axiosWithAuth
			.get(`${this.leaderboardUrl}/weekly`, config)
			.then(resp => resp.data)
			.catch(e => {
				console.error('[LeaderboardService] Error fetching weekly leaderboard:', e)
				throw e
			})
	}

	async getMonthlyLeaderboard(config?: AxiosRequestConfig) {
		return axiosWithAuth
			.get(`${this.leaderboardUrl}/monthly`, config)
			.then(resp => resp.data)
			.catch(e => {
				console.error('[LeaderboardService] Error fetching monthly leaderboard:', e)
				throw e
			})
	}

	async getAllTimeLeaderboard(config?: AxiosRequestConfig) {
		return axiosWithAuth
			.get(`${this.leaderboardUrl}/all`, config)
			.then(resp => resp.data)
			.catch(e => {
				console.error('[LeaderboardService] Error fetching all-time leaderboard:', e)
				throw e
			})
	}
}

export const leaderboardService = new LeaderboardService()
