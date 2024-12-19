import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ReactNativeModal } from 'react-native-modal'

import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { icons, images } from '../../../../core/constants'
import { AuthStackParamList } from '../../../../core/navigation/AuthStack/AuthStackScreen'
import CustomButton from '../../../../core/ui/CustomButton'
import InputField from '../../../../core/ui/InputField'
import { toast } from '../../../../core/ui/toast'
import { CURRENT_USER_QUERY_KEY } from '../../hooks/user-current-user.hook'
import { SignupDTO } from '../../models/auth-dto.types'
import { authService } from '../../services/auth.service'
import OAuth from '../OAuth/OAuth'

import { SignupFormData, signupFormSchema } from './signup-form-types'

type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>

const SignUp = () => {
	const queryClient = useQueryClient()
	const [showSuccessModal, setShowSuccessModal] = useState(false)
	const navigation = useNavigation<AuthStackNavigationProp>()

	// Инициализация формы
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupFormData>({
		resolver: zodResolver(signupFormSchema),
		mode: 'onSubmit',
	})

	// Инициализация useMutation для регистрации
	const { mutate, isPending } = useMutation({
		mutationFn: (dto: SignupDTO) => authService.signup(dto),
		onSuccess: () => {
			toast.success('Успешно прошли регистрацию аккаунта')
			queryClient.invalidateQueries({ queryKey: [CURRENT_USER_QUERY_KEY] })
			setShowSuccessModal(true) // Показываем модальное окно после успешной регистрации
		},
		onError: () => {
			toast.error('Ошибка при регистрации')
		},
	})

	const onSubmit = (values: SignupFormData) => {
		const dto: SignupDTO = {
			password: values.password,
			first_name: values.firstName,
			last_name: values.lastName,
			email: values.email,
		}
		mutate(dto)
	}

	return (
		<ScrollView
			style={styles.container}
			keyboardShouldPersistTaps='handled'
		>
			<View style={styles.innerContainer}>
				<View style={styles.imageWrapper}>
					{/* <Image
						source={images.auth}
						style={styles.image}
					/> */}
					<Text style={styles.title}>Let's Get Started</Text>
					<Text style={styles.subtitle}>Create your account below</Text>
				</View>
				<View style={styles.formWrapper}>
					<InputField
						label='First Name'
						placeholder='Enter first name'
						icon={icons.person}
						name='firstName'
						control={control}
						errorMessage={errors.firstName?.message}
					/>
					<InputField
						label='Last Name'
						placeholder='Enter last name'
						icon={icons.person}
						name='lastName'
						control={control}
						errorMessage={errors.lastName?.message}
					/>
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
						title={isPending ? 'Signing Up...' : 'Sign Up'}
						onPress={handleSubmit(onSubmit)}
						style={styles.signUpButton}
						disabled={isPending}
					/>
					<OAuth />
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('Login')
						}}
						style={styles.link}
					>
						<Text style={styles.link}>
							Already have an account? <Text style={styles.linkHighlight}>Log In</Text>
						</Text>
					</TouchableOpacity>
				</View>
				<ReactNativeModal isVisible={showSuccessModal}>
					<View style={styles.modal}>
						<Image
							source={images.check}
							style={styles.successImage}
						/>
						<Text style={styles.successTitle}>Created</Text>
						<Text style={styles.successText}>You have successfully created your account.</Text>
						<CustomButton
							title='Browse Home'
							onPress={() => console.log('Browse Home pressed')}
							style={styles.browseButton}
						/>
					</View>
				</ReactNativeModal>
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
	image: {
		width: '100%',
		height: '100%',
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
	signUpButton: {
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
	modal: {
		backgroundColor: '#fff',
		padding: 20,
		borderRadius: 20,
		minHeight: 300,
	},
	modalTitle: {
		fontSize: 24,
		fontFamily: 'JakartaExtraBold',
		marginBottom: 10,
	},
	modalText: {
		fontFamily: 'Jakarta',
		marginBottom: 20,
	},
	successImage: {
		width: 110,
		height: 110,
		alignSelf: 'center',
		marginVertical: 20,
	},
	successTitle: {
		fontSize: 24,
		fontFamily: 'JakartaBold',
		textAlign: 'center',
	},
	successText: {
		fontSize: 16,
		color: '#aaa',
		textAlign: 'center',
		marginTop: 10,
	},
	browseButton: {
		marginTop: 20,
	},
})

export default SignUp
