import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ReactNativeModal } from 'react-native-modal'

import { zodResolver } from '@hookform/resolvers/zod'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import LottieView from 'lottie-react-native'

import { icons } from '../../../../core/constants'
import CustomButton from '../../../../core/ui/CustomButton'
import InputField from '../../../../core/ui/InputField'
import { toast } from '../../../../core/ui/toast'
import { CURRENT_USER_QUERY_KEY } from '../../hooks/user-current-user.hook'
import { SignupDTO } from '../../models/auth-dto.types'
import { authService } from '../../services/auth.service'
import OAuth from '../OAuth/OAuth'

import { SignupFormData, signupFormSchema } from './signup-form-types'

const SignUp = () => {
	const queryClient = useQueryClient()
	const [showSuccessModal, setShowSuccessModal] = useState(false)
	const navigation = useNavigation<NavigationProp<any>>()
	const { t } = useTranslation()

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupFormData>({
		resolver: zodResolver(signupFormSchema),
		mode: 'onSubmit',
	})

	const { mutate, isPending } = useMutation({
		mutationFn: (dto: SignupDTO) => authService.signup(dto),
		onSuccess: () => {
			setShowSuccessModal(true)
		},
		onError: () => {
			toast.error(t('AUTHORIZATION.SIGNUP.ERROR'))
		},
	})

	const handleBrowseHome = () => {
		setShowSuccessModal(false)
		queryClient.invalidateQueries({ queryKey: [CURRENT_USER_QUERY_KEY] })
	}
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
					<Text style={styles.title}>{t('AUTHORIZATION.SIGNUP.TITLE')}</Text>
					<Text style={styles.subtitle}>{t('AUTHORIZATION.SIGNUP.SUBTITLE')}</Text>
				</View>
				<View style={styles.formWrapper}>
					<InputField
						label={t('AUTHORIZATION.SIGNUP.FIRST_NAME_LABEL')}
						placeholder={t('AUTHORIZATION.SIGNUP.FIRST_NAME_PLACEHOLDER')}
						icon={icons.person}
						name='firstName'
						control={control}
						errorMessage={errors.firstName?.message}
					/>
					<InputField
						label={t('AUTHORIZATION.SIGNUP.LAST_NAME_LABEL')}
						placeholder={t('AUTHORIZATION.SIGNUP.LAST_NAME_PLACEHOLDER')}
						icon={icons.person}
						name='lastName'
						control={control}
						errorMessage={errors.lastName?.message}
					/>
					<InputField
						label={t('AUTHORIZATION.SIGNUP.EMAIL_LABEL')}
						placeholder={t('AUTHORIZATION.SIGNUP.EMAIL_PLACEHOLDER')}
						icon={icons.email}
						name='email'
						control={control}
						errorMessage={errors.email?.message}
					/>
					<InputField
						label={t('AUTHORIZATION.SIGNUP.PASSWORD_LABEL')}
						placeholder={t('AUTHORIZATION.SIGNUP.PASSWORD_PLACEHOLDER')}
						icon={icons.lock}
						secureTextEntry
						name='password'
						control={control}
						errorMessage={errors.password?.message}
					/>
					<CustomButton
						title={
							isPending ? t('AUTHORIZATION.SIGNUP.SIGNING_UP') : t('AUTHORIZATION.SIGNUP.SIGN_UP')
						}
						onPress={handleSubmit(onSubmit)}
						style={styles.signUpButton}
						disabled={isPending}
					/>
					<OAuth />
					<TouchableOpacity
						onPress={() => navigation.navigate('Login')}
						style={styles.link}
					>
						<Text style={styles.link}>
							{t('AUTHORIZATION.SIGNUP.ALREADY_HAVE_ACCOUNT')}{' '}
							<Text style={styles.linkHighlight}>{t('AUTHORIZATION.SIGNUP.LOG_IN')}</Text>
						</Text>
					</TouchableOpacity>
				</View>
				<ReactNativeModal isVisible={showSuccessModal}>
					<View style={styles.modal}>
						<LottieView
							style={{ height: 200, width: 300 }}
							source={require('../../../../../public/images/auth/success.json')}
							autoPlay
							loop={false}
						/>
						<Text style={styles.successTitle}>{t('AUTHORIZATION.SIGNUP.SUCCESS_TITLE')}</Text>
						<Text style={styles.successText}>{t('AUTHORIZATION.SIGNUP.SUCCESS_TEXT')}</Text>
						<CustomButton
							title={t('AUTHORIZATION.SIGNUP.BROWSE_HOME')}
							onPress={handleBrowseHome}
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
