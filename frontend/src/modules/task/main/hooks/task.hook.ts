import { useMutation, useQuery } from '@tanstack/react-query'

import { taskService } from '../services/task.service'

export const TASK_QUERY_KEY = 'task'

export const useTask = (unitId: string, currentOrder: number) => {
	return useQuery({
		queryKey: [TASK_QUERY_KEY, unitId, currentOrder],
		queryFn: () => taskService.getNextTask(unitId, currentOrder),
		enabled: !!unitId, // Запрос выполняется только если unitId задан
	})
}


