import { z } from 'zod'

export const signupFormSchema = z.object({
	firstName: z.string().min(1, { message: 'Имя обязательное поле' }),
	lastName: z.string().min(1, { message: 'Фамилия обязательное поле' }),
	email: z.string().min(1, { message: 'Email обязательное поле' }),
	password: z
		.string()
		.min(8, { message: 'Пароль должен содержать минимум 8 символов' })
		.regex(/[A-Z]/, {
			message: 'Пароль должен содержать хотя бы одну заглавную букву',
		})
		.regex(/[a-z]/, {
			message: 'Пароль должен содержать хотя бы одну строчную букву',
		})
		.regex(/[0-9]/, { message: 'Пароль должен содержать хотя бы одну цифру' })
		.regex(/[@$!%*?&]/, {
			message: 'Пароль должен содержать хотя бы один специальный символ (@$!%*?&)',
		}),
})

export type SignupFormData = z.infer<typeof signupFormSchema>
