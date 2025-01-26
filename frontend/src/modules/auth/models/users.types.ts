export interface User {
	id: string
	email: string
	first_name: string
	last_name: string
	password: string
	crystals: number
	hearts: number
	lessons_completed: any[]
	streak: number
	last_refill_at: string
	created_at: string
	updated_at: string
}
