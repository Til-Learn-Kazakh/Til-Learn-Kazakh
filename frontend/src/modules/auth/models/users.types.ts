export interface Streak {
	user_id: string
	current_streak: number
	max_streak: number
	last_active: string
	streak_days: string[]
}

export interface User {
	id: string
	email: string
	first_name: string
	last_name: string
	password: string
	crystals: number
	hearts: number
	lessons_completed: any[]
	streak: Streak | null // ✅ Теперь это объект или `null`, если streak нет
	xp: number
	last_refill_at: string
	created_at: string
	updated_at: string
}
