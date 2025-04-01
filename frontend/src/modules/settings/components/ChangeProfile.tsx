import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import FeatherIcon from '@expo/vector-icons/Feather'
import { zodResolver } from '@hookform/resolvers/zod'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { icons } from '../../../core/constants'
import CustomButton from '../../../core/ui/CustomButton'
import InputField from '../../../core/ui/InputField'
import { toast } from '../../../core/ui/toast'
import { SignupFormData, signupFormSchema } from '../../auth/components/signup/signup-form-types'
import { CURRENT_USER_QUERY_KEY, useCurrentUser } from '../../auth/hooks/user-current-user.hook'
import { UpdateProfileDto } from '../dto/settings.dto'
import { profileService } from '../services/settings.service'

const ChangeProfile = () => {
	const [isSaving, setIsSaving] = useState(false)
	const navigation = useNavigation<NavigationProp<any>>()
	const { data } = useCurrentUser()
	const { t } = useTranslation()

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupFormData>({
		resolver: zodResolver(signupFormSchema),
		defaultValues: {
			firstName: data?.first_name,
			lastName: data?.last_name,
			email: data?.email,
			password: data?.password,
		},
	})

	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationFn: (dto: UpdateProfileDto) => profileService.updateProfile(dto),
		onSuccess: () => {
			toast.success(t('SETTINGS.CHANGE_PROFILE.SUCCESS'))
			queryClient.invalidateQueries({ queryKey: [CURRENT_USER_QUERY_KEY] })
			navigation.goBack()
		},
		onError: () => {
			toast.error(t('SETTINGS.CHANGE_PROFILE.ERROR'))
		},
	})

	const onSubmit = (values: SignupFormData) => {
		setIsSaving(true)
		mutate(
			{
				first_name: values.firstName,
				last_name: values.lastName,
				email: values.email,
			},
			{
				onSettled: () => setIsSaving(false),
			}
		)
	}

	return (
		<>
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={styles.backIcon}
				>
					<FeatherIcon
						name='arrow-left'
						size={26}
						color='#888'
					/>
				</TouchableOpacity>
				<Text style={styles.headerTitle}>{t('SETTINGS.CHANGE_PROFILE.TITLE')}</Text>
			</View>
			<View style={styles.divider} />

			<ScrollView
				keyboardShouldPersistTaps='handled'
				style={styles.container}
			>
				<View style={styles.innerContainer}>
					<View style={styles.formWrapper}>
						<InputField
							label={t('SETTINGS.CHANGE_PROFILE.FIRST_NAME')}
							placeholder={t('SETTINGS.CHANGE_PROFILE.FIRST_NAME_PLACEHOLDER')}
							icon={icons.person}
							name='firstName'
							control={control}
							errorMessage={errors.firstName?.message}
						/>
						<InputField
							label={t('SETTINGS.CHANGE_PROFILE.LAST_NAME')}
							placeholder={t('SETTINGS.CHANGE_PROFILE.LAST_NAME_PLACEHOLDER')}
							icon={icons.person}
							name='lastName'
							control={control}
							errorMessage={errors.lastName?.message}
						/>
						<InputField
							label={t('SETTINGS.CHANGE_PROFILE.EMAIL')}
							placeholder={t('SETTINGS.CHANGE_PROFILE.EMAIL_PLACEHOLDER')}
							icon={icons.email}
							name='email'
							control={control}
							errorMessage={errors.email?.message}
						/>

						{/* Non-editable password input with navigation */}
						<TouchableOpacity onPress={() => navigation.navigate('PasswordChange')}>
							<View pointerEvents='none'>
								<InputField
									label={t('SETTINGS.CHANGE_PROFILE.PASSWORD')}
									placeholder={t('SETTINGS.CHANGE_PROFILE.PASSWORD_PLACEHOLDER')}
									icon={icons.lock}
									secureTextEntry
									name='password'
									control={control}
									errorMessage={undefined}
								/>
							</View>
						</TouchableOpacity>

						<CustomButton
							title={
								isSaving ? t('SETTINGS.CHANGE_PROFILE.SAVING') : t('SETTINGS.CHANGE_PROFILE.SAVE')
							}
							onPress={handleSubmit(onSubmit)}
							style={styles.saveButton}
							disabled={isSaving}
						/>
					</View>
				</View>
			</ScrollView>
		</>
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
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 96,
		paddingTop: 50,
		paddingHorizontal: 16,
		backgroundColor: '#fff',
		position: 'relative',
	},
	divider: {
		height: 1,
		backgroundColor: '#E5E5E5',
		width: '100%',
		position: 'relative',
		top: 0,
	},
	backIcon: {
		position: 'absolute',
		left: 16,
		paddingTop: 50,
	},
	headerTitle: {
		fontSize: 22,
		fontWeight: '600',
		color: '#444',
		fontFamily: 'JakartaBold',
	},
	formWrapper: {
		padding: 20,
		marginTop: 20,
	},
	saveButton: {
		marginTop: 40,
	},
})

export default ChangeProfile
