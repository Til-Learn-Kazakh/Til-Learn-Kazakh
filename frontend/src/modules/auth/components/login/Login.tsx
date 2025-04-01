import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { zodResolver } from '@hookform/resolvers/zod'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { icons } from '../../../../core/constants'
import CustomButton from '../../../../core/ui/CustomButton'
import InputField from '../../../../core/ui/InputField'
import { toast } from '../../../../core/ui/toast'
import { CURRENT_USER_QUERY_KEY } from '../../hooks/user-current-user.hook'
import { LoginDTO } from '../../models/auth-dto.types'
import { authService } from '../../services/auth.service'
import OAuth from '../OAuth/OAuth'

import { LoginFormData, loginFormSchema } from './login-form-types'

const Login = () => {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const navigation = useNavigation<NavigationProp<any>>()
	const queryClient = useQueryClient()
	const { t } = useTranslation()

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginFormSchema),
		mode: 'onSubmit',
	})

	const { mutate } = useMutation({
		mutationFn: (dto: LoginDTO) => authService.login(dto),
		onSuccess: () => {
			toast.success(t('AUTHORIZATION.LOGIN.WELCOME'))
			queryClient.invalidateQueries({ queryKey: [CURRENT_USER_QUERY_KEY] })
		},
		onError: () => {
			toast.error(t('AUTHORIZATION.LOGIN.INVALID_CREDENTIALS'))
		},
	})

	const onSubmit = (values: LoginFormData) => {
		const dto: LoginDTO = {
			email: values.email,
			password: values.password,
		}
		setIsSubmitting(true)
		mutate(dto, {
			onSettled: () => setIsSubmitting(false),
		})
	}

	return (
		<ScrollView
			keyboardShouldPersistTaps='handled'
			style={styles.container}
		>
			<View style={styles.innerContainer}>
				<View style={styles.imageWrapper}>
					<Text style={styles.title}>{t('AUTHORIZATION.LOGIN.TITLE')}</Text>
					<Text style={styles.subtitle}>{t('AUTHORIZATION.LOGIN.SUBTITLE')}</Text>
				</View>
				<View style={styles.formWrapper}>
					<InputField
						label={t('AUTHORIZATION.LOGIN.EMAIL_LABEL')}
						placeholder={t('AUTHORIZATION.LOGIN.EMAIL_PLACEHOLDER')}
						icon={icons.email}
						name='email'
						control={control}
						errorMessage={errors.email?.message}
					/>
					<InputField
						label={t('AUTHORIZATION.LOGIN.PASSWORD_LABEL')}
						placeholder={t('AUTHORIZATION.LOGIN.PASSWORD_PLACEHOLDER')}
						icon={icons.lock}
						secureTextEntry
						name='password'
						control={control}
						errorMessage={errors.password?.message}
					/>
					<CustomButton
						title={
							isSubmitting ? t('AUTHORIZATION.LOGIN.LOGGING_IN') : t('AUTHORIZATION.LOGIN.LOG_IN')
						}
						onPress={handleSubmit(onSubmit)}
						style={styles.loginButton}
						disabled={isSubmitting}
					/>
					<OAuth />
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('SignUp')
						}}
						style={styles.link}
					>
						<Text>
							{t('AUTHORIZATION.LOGIN.NO_ACCOUNT')}{' '}
							<Text style={styles.linkHighlight}>{t('AUTHORIZATION.LOGIN.SIGN_UP')}</Text>
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#fff' },
	innerContainer: { flex: 1, backgroundColor: '#fff' },
	imageWrapper: { position: 'relative', width: '100%', height: 150 },
	title: {
		textAlign: 'center',
		fontSize: 32,
		color: '#0286FF',
		fontFamily: 'JakartaBold',
		marginTop: 80,
		textShadowColor: 'rgba(0, 0, 0, 0.3)',
		textShadowOffset: { width: 0, height: 2 },
		textShadowRadius: 4,
	},
	subtitle: {
		textAlign: 'center',
		fontSize: 17,
		color: '#666',
		marginTop: 8,
		fontFamily: 'JakartaRegular',
	},
	formWrapper: { padding: 20 },
	loginButton: { marginTop: 20 },
	link: {
		textAlign: 'center',
		marginTop: 20,
		fontSize: 17,
		color: '#aaa',
		alignItems: 'center',
	},
	linkHighlight: { fontSize: 17, color: '#0286FF' },
})

export default Login
