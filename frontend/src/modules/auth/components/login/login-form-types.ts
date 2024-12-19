import { z } from 'zod'

export const loginFormSchema = z.object({
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

export type LoginFormData = z.infer<typeof loginFormSchema>
