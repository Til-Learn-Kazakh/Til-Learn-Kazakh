import { AxiosRequestConfig } from 'axios'
import * as SecureStore from 'expo-secure-store'

import { server } from '../../../core/config/environment.config'
import { axiosBase, axiosWithAuth } from '../../../middleware/axios-interceptors'
import { LoginDTO, SignupDTO } from '../models/auth-dto.types'
import { User } from '../models/users.types'

class AuthService {
	private readonly url = `${server}/auth`

	async login(dto: LoginDTO, config?: AxiosRequestConfig) {
		return axiosBase
			.post<{ access_token: string }>(`${this.url}/login`, dto, config)
			.then(async resp => {
				const access_token = resp.data.access_token

				if (access_token) {
					// Сохраняем токен в SecureStore
					await SecureStore.setItemAsync('token', access_token)
				}
				return resp.data
			})
			.catch(e => {
				console.error('Ошибка при регистрации:', e)
				throw e
			})
	}

	async signup(dto: SignupDTO, config?: AxiosRequestConfig) {
		return axiosBase
			.post<{ access_token: string }>(`${this.url}/register`, dto, config) // Предполагаем, что сервер возвращает объект с токеном
			.then(async resp => {
				const access_token = resp.data.access_token

				if (access_token) {
					// Сохраняем токен в SecureStore
					await SecureStore.setItemAsync('token', access_token)
				}

				return resp.data
			})
			.catch(e => {
				console.error('Ошибка при регистрации:', e)
				throw e
			})
	}

	async logout(config?: AxiosRequestConfig) {
		return axiosWithAuth
			.get<void>(`${this.url}/logout`, config)
			.then(resp => resp.data)
			.catch(e => console.error(e))
	}

	async getCurrent(config?: AxiosRequestConfig) {
		return axiosWithAuth
			.get<User>(`${this.url}/current`, config)
			.then(resp => resp.data)

			.catch(e => {
				if (e?.response?.status === 404) {
					return null
				}
				throw e
			})
	}
}

export const authService = new AuthService()
