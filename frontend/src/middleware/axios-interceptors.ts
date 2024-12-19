import axios, {
	AxiosHeaders,
	AxiosRequestConfig,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from 'axios'
import * as SecureStore from 'expo-secure-store'

import { server } from '../core/config/environment.config'

const options: AxiosRequestConfig = {
	baseURL: server,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
}

const axiosBase = axios.create(options)

const axiosWithAuth = axios.create(options)

axiosWithAuth.interceptors.request.use(async (config: InternalAxiosRequestConfig<any>) => {
	const accessToken = await SecureStore.getItemAsync('token')

	if (config.headers && accessToken) {
		;(config.headers as AxiosHeaders).set('Authorization', `Bearer ${accessToken}`)
	}

	return config
})

axiosWithAuth.interceptors.response.use(
	(response: AxiosResponse) => {
		return response
	},
	async error => {
		if (error.response?.status === 401) {
			console.log('Unauthorized! Redirecting to login...')
			await SecureStore.deleteItemAsync('token')
		} else if (error.response?.status === 500) {
			console.log('Server error! Please try again later.')
		}

		return Promise.reject(error)
	}
)

export { axiosBase, axiosWithAuth }
