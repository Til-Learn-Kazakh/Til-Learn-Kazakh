// src/modules/profile/services/profile.service.ts
import { AxiosRequestConfig } from 'axios'

import { server } from '../../../core/config/environment.config'
import { axiosWithAuth } from '../../../middleware/axios-interceptors'
import { ChangePasswordDto, UpdateProfileDto } from '../dto/settings.dto'

class ProfileService {
	private readonly url = `${server}/user`

	async updateProfile(data: UpdateProfileDto, config?: AxiosRequestConfig) {
		return axiosWithAuth
			.put(`${this.url}/update`, data, config)
			.then(resp => resp.data)
			.catch(e => {
				console.error('[ProfileService] Error updating profile:', e)
				throw e
			})
	}

	async changePassword(data: ChangePasswordDto, config?: AxiosRequestConfig) {
		return axiosWithAuth
			.put(`${this.url}/change-password`, data, config)
			.then(resp => resp.data)
			.catch(e => {
				console.error(e)
				throw e
			})
	}

	async updateAvatar(avatar: string, config?: AxiosRequestConfig) {
		return axiosWithAuth
			.put(`${this.url}/update-avatar`, { avatar }, config)
			.then(resp => resp.data)
			.catch(e => {
				console.error(e)
				throw e
			})
	}
}

export const profileService = new ProfileService()
