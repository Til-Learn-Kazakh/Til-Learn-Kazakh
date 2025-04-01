import { t } from 'i18next'
import { z } from 'zod'

export const signupFormSchema = z.object({
	firstName: z
		.string()
		.min(1, { message: t('AUTHORIZATION.SIGNUP.SIGNUP_FORM.FIRST_NAME_REQUIRED') }),
	lastName: z
		.string()
		.min(1, { message: t('AUTHORIZATION.SIGNUP.SIGNUP_FORM.LAST_NAME_REQUIRED') }),
	email: z.string().min(1, { message: t('AUTHORIZATION.SIGNUP.SIGNUP_FORM.EMAIL_REQUIRED') }),
	password: z
		.string()
		.min(8, { message: t('AUTHORIZATION.SIGNUP.SIGNUP_FORM.PASSWORD_MIN_LENGTH') })
		.regex(/[A-Z]/, { message: t('AUTHORIZATION.SIGNUP.SIGNUP_FORM.PASSWORD_UPPERCASE') })
		.regex(/[a-z]/, { message: t('AUTHORIZATION.SIGNUP.SIGNUP_FORM.PASSWORD_LOWERCASE') })
		.regex(/[0-9]/, { message: t('AUTHORIZATION.SIGNUP.SIGNUP_FORM.PASSWORD_DIGIT') })
		.regex(/[@$!%*?&]/, { message: t('AUTHORIZATION.SIGNUP.SIGNUP_FORM.PASSWORD_SPECIAL') }),
})

export type SignupFormData = z.infer<typeof signupFormSchema>
