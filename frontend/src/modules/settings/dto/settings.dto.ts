export interface UpdateProfileDto {
	first_name: string
	last_name: string
	email: string
}

export interface ChangePasswordDto {
	old_password: string
	new_password: string
	confirm_password: string
}
