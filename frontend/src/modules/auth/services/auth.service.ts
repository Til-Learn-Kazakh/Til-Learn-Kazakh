import { AxiosRequestConfig } from 'axios'
import * as SecureStore from 'expo-secure-store'

import { server } from '../../../core/config/environment.config'
import { axiosBase, axiosWithAuth } from '../../../middleware/axios-interceptors'
import { fetchAndSetCSRFToken } from '../../../middleware/fetchCSRF'
import { LoginDTO, SignupDTO } from '../models/auth-dto.types'
import { User } from '../models/users.types'

class AuthService {
	private readonly url = `${server}/auth`

	async login(dto: LoginDTO, config?: AxiosRequestConfig) {
		await fetchAndSetCSRFToken()
		return axiosBase
			.post<{ access_token: string; refresh_token: string }>(`${this.url}/login`, dto, config)
			.then(async resp => {
				const { access_token, refresh_token } = resp.data

				if (access_token) await SecureStore.setItemAsync('token', access_token)
				if (refresh_token) await SecureStore.setItemAsync('refresh_token', refresh_token)

				return resp.data
			})
			.catch(e => {
				console.error('Ошибка при логине:', e)
				throw e
			})
	}

	async signup(dto: SignupDTO, config?: AxiosRequestConfig) {
		await fetchAndSetCSRFToken()
		return axiosBase
			.post<{ access_token: string; refresh_token: string }>(`${this.url}/register`, dto, config)
			.then(async resp => {
				const { access_token, refresh_token } = resp.data

				if (access_token) await SecureStore.setItemAsync('token', access_token)
				if (refresh_token) await SecureStore.setItemAsync('refresh_token', refresh_token)

				return resp.data
			})
			.catch(e => {
				console.error('Ошибка при регистрации:', e)
				throw e
			})
	}

	async logout() {
		await SecureStore.deleteItemAsync('token')
		await SecureStore.deleteItemAsync('refresh_token')
	}

	async getCurrent(config?: AxiosRequestConfig) {
		return axiosWithAuth
			.get<User>(`${this.url}/current`, config)
			.then(resp => resp.data)

			.catch(e => {
				if (e?.response?.status === 401 || e?.response?.status === 404) {
					return null
				}
				throw e
			})
	}
}

export const authService = new AuthService()
