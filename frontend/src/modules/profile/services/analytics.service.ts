import { AxiosRequestConfig } from 'axios'

import { server } from '../../../core/config/environment.config'
import { axiosWithAuth } from '../../../middleware/axios-interceptors'

class AnalyticsService {
	private readonly baseUrl = `${server}/analytics`

	async getDailyStats(date: string, config?: AxiosRequestConfig) {
		return axiosWithAuth
			.get(`${this.baseUrl}/daily`, { params: { date }, ...config })
			.then(resp => resp.data)
			.catch(e => {
				console.error('[AnalyticsService] Error fetching daily stats:', e)
				throw e
			})
	}

	async getMonthlyStats(month: string, config?: AxiosRequestConfig) {
		return axiosWithAuth
			.get(`${this.baseUrl}/monthly`, { params: { month }, ...config })
			.then(resp => resp.data)
			.catch(e => {
				if (e?.response?.status === 404) {
					console.log('No monthly data, returning zeros')

					// Возвращаем заглушку
					return {
						monthStats: {
							lessons: 0,
							accuracy: 0,
							time: 0,
							mistakes: 0,
							xp: 0,
							streak: 0,
						},
						dayStats: {},
					}
				}
				throw e
			})
	}

	async getYearlyStats(year: string, config?: AxiosRequestConfig) {
		return axiosWithAuth
			.get(`${this.baseUrl}/yearly`, { params: { year }, ...config })
			.then(resp => resp.data)
			.catch(e => {
				if (e?.response?.status === 404) {
					console.log('No yearly data, returning zeros')

					return {
						lessons: 0,
						accuracy: 0,
						time: 0,
						mistakes: 0,
						xp: 0,
						streak: 0,
						data: [],
					}
				}
				throw e
			})
	}
}

export const analyticsService = new AnalyticsService()
