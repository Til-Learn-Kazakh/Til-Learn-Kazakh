import { server } from '../../../../core/config/environment.config'
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
		const payload: Record<string, string> = {
			user_answer: userAnswer,
		}

		// ✅ Добавляем user_lang только если он указан
		if (userLang) {
			payload.user_lang = userLang
		}

		return axiosWithAuth
			.post(`${server}/tasks/${taskId}/check-answer`, payload)
			.then(resp => resp.data)
			.catch(e => {
				console.error('[TaskService] Error checking answer:', e)
				throw e
			})
	}
}

export const taskService = new TaskService()
