import { AxiosRequestConfig } from 'axios'

import { server } from '../../../core/config/environment.config'
import { axiosWithAuth } from '../../../middleware/axios-interceptors'

class HomeService {
	private readonly url = `${server}/levels`
	private readonly userUrl = `${server}/auth`
	private readonly streakUrl = `${server}/streak`

	async getLevels(config?: AxiosRequestConfig) {
		return axiosWithAuth
			.get(this.url, config)
			.then(resp => resp.data)
			.catch(e => {
				console.error('[HomeService] Error:', e)
				if (e?.response?.status === 404) {
					return []
				}
				throw e
			})
	}

	async refillHearts(config?: AxiosRequestConfig) {
		return axiosWithAuth
			.post(`${this.userUrl}/refill-hearts`, {}, config)
			.then(resp => resp.data)
			.catch(e => {
				console.error('[HomeService] Error refilling hearts:', e)
				throw e
			})
	}

	async refillHeartsWithCrystals(config?: AxiosRequestConfig) {
		return axiosWithAuth
			.post(`${this.userUrl}/refill-hearts-with-crystals`, {}, config)
			.then(resp => resp.data)
			.catch(e => {
				console.error('[HomeService] Error refilling hearts with crystals:', e)
				throw e
			})
	}

	async getStreak(config?: AxiosRequestConfig) {
		return axiosWithAuth
			.get(`${this.streakUrl}`, config)
			.then(resp => resp.data)
			.catch(e => {
				console.error('[HomeService] Error getting streak:', e)
				throw e
			})
	}
}

export const homeService = new HomeService()
