import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
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

	// Инициализация формы
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginFormSchema),
		mode: 'onSubmit',
	})

	// Инициализация useMutation для логина
	const { mutate } = useMutation({
		mutationFn: (dto: LoginDTO) => authService.login(dto),
		onSuccess: () => {
			toast.success('Добро пожаловать!')
			queryClient.invalidateQueries({ queryKey: [CURRENT_USER_QUERY_KEY] })

			// navigation.navigate('Home') // Переход к экрану HomeStack, который зарегистрирован в AppStack
		},

		onError: () => {
			toast.error('Неверный email или пароль.')
		},
	})

	const onSubmit = (values: LoginFormData) => {
		const dto: LoginDTO = {
			email: values.email,
			password: values.password,
		}
		setIsSubmitting(true)
		mutate(dto, {
			onSettled: () => setIsSubmitting(false), // Сбрасываем состояние отправки
		})
	}

	return (
		<ScrollView
			keyboardShouldPersistTaps='handled'
			style={styles.container}
		>
			<View style={styles.innerContainer}>
				<View style={styles.imageWrapper}>
					<Text style={styles.title}>Welcome Back</Text>
					<Text style={styles.subtitle}>Log in to your account</Text>
				</View>
				<View style={styles.formWrapper}>
					<InputField
						label='Email'
						placeholder='Enter email'
						icon={icons.email}
						name='email'
						control={control}
						errorMessage={errors.email?.message}
					/>
					<InputField
						label='Password'
						placeholder='Enter password'
						icon={icons.lock}
						secureTextEntry
						name='password'
						control={control}
						errorMessage={errors.password?.message}
					/>
					<CustomButton
						title={isSubmitting ? 'Logging In...' : 'Log In'}
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
							Don't have an account? <Text style={styles.linkHighlight}>Sign Up</Text>
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	innerContainer: {
		flex: 1,
		backgroundColor: '#fff',
	},
	imageWrapper: {
		position: 'relative',
		width: '100%',
		height: 150,
	},
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
	formWrapper: {
		padding: 20,
	},
	loginButton: {
		marginTop: 20,
	},
	link: {
		textAlign: 'center',
		marginTop: 20,
		fontSize: 17,
		color: '#aaa',
		alignItems: 'center',
	},
	linkHighlight: {
		fontSize: 17,
		color: '#0286FF',
	},
})

export default Login
