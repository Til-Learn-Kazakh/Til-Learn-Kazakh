import { server } from '../../../../core/config/environment.config'
import i18n from '../../../../core/i18n'
import { axiosWithAuth } from '../../../../middleware/axios-interceptors'

class TaskService {
	private readonly baseUrl = `${server}/tasks/unit`
	async getNextTask(unitId: string, currentOrder: number) {
		return axiosWithAuth
			.get(`${this.baseUrl}/${unitId}/next-task?currentOrder=${currentOrder}`)
			.then(resp => resp.data)
			.catch(e => {
				console.error('[TaskService] Error:', e)
				throw e
			})
	}

	async checkAnswer(taskId: string, userAnswer: string, userLang?: string) {
		const lang = userLang || i18n.language

		const payload: Record<string, string> = {
			user_answer: userAnswer,
			user_lang: lang,
		}

		return axiosWithAuth
			.post(`${server}/tasks/${taskId}/check-answer`, payload)
			.then(resp => resp.data)
			.catch(e => {
				console.error('[TaskService] Error checking answer:', e)
				throw e
			})
	}

	async calculateXP(
		unitId: string,
		correct: number,
		attempts: number,
		committedTime: number,
		mistakes: number,
		combo: number
	) {
		const payload = {
			unitId,
			correct,
			attempts,
			committedTime,
			mistakes,
			combo,
		}

		return axiosWithAuth
			.post(`${server}/user/calculate-xp`, payload)
			.then(resp => resp.data)
			.catch(e => {
				console.error('[TaskService] Error calculating XP:', e)
				throw e
			})
	}
}

export const taskService = new TaskService()
