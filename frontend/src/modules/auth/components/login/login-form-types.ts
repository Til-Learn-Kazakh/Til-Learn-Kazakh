import { t } from 'i18next'
import { z } from 'zod'

export const loginFormSchema = z.object({
	
    email: z.string().min(1, { message: t('AUTHORIZATION.LOGIN.LOGIN_FORM.EMAIL_REQUIRED') }),
    password: z
        .string()
        .min(8, { message: t('AUTHORIZATION.LOGIN.LOGIN_FORM.PASSWORD_MIN_LENGTH') })
        .regex(/[A-Z]/, { message: t('AUTHORIZATION.LOGIN.LOGIN_FORM.PASSWORD_UPPERCASE') })
        .regex(/[a-z]/, { message: t('AUTHORIZATION.LOGIN.LOGIN_FORM.PASSWORD_LOWERCASE') })
        .regex(/[0-9]/, { message: t('AUTHORIZATION.LOGIN.LOGIN_FORM.PASSWORD_DIGIT') })
        .regex(/[@$!%*?&]/, { message: t('AUTHORIZATION.LOGIN.LOGIN_FORM.PASSWORD_SPECIAL') }),
})

export type LoginFormData = z.infer<typeof loginFormSchema>
