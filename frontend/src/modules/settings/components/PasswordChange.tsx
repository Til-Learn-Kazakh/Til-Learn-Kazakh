import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import FeatherIcon from '@expo/vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import { useMutation } from '@tanstack/react-query'

import { toast } from '../../../core/ui/toast'
import { ChangePasswordDto } from '../dto/settings.dto'
import { profileService } from '../services/settings.service'

const PasswordChange = () => {
	const navigation = useNavigation()
	const [form, setForm] = useState({
		oldPassword: '',
		newPassword: '',
		confirmPassword: '',
	})
	const [isVisible, setIsVisible] = useState({
		old: false,
		new: false,
		confirm: false,
	})

	const toggleVisibility = (key: keyof typeof isVisible) => {
		setIsVisible(prev => ({ ...prev, [key]: !prev[key] }))
	}

	const handleChange = (key: keyof typeof form, value: string) => {
		setForm(prev => ({ ...prev, [key]: value }))
	}

	const { mutate, isPending } = useMutation({
		mutationFn: (dto: ChangePasswordDto) => profileService.changePassword(dto),
		onSuccess: () => {
			toast.success('Пароль успешно обновлён')
			navigation.goBack()
		},
		onError: (err: any) => {
			const message =
				err?.response?.data?.error ||
				err?.response?.data?.message ||
				err?.message ||
				'Ошибка при смене пароля'
			toast.error(message)
		},
	})

	const handleSave = () => {
		mutate({
			old_password: form.oldPassword,
			new_password: form.newPassword,
			confirm_password: form.confirmPassword,
		})
	}

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={styles.backButton}
				>
					<FeatherIcon
						name='x'
						size={28}
						color='#999'
					/>
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Password</Text>
			</View>
			<View style={styles.divider} />

			<ScrollView contentContainerStyle={styles.scrollWrapper}>
				{/* Old Password */}
				<View style={styles.inputWrapper}>
					<Text style={styles.label}>Old password</Text>
					<View style={styles.inputField}>
						<TextInput
							style={styles.input}
							secureTextEntry={!isVisible.old}
							value={form.oldPassword}
							onChangeText={text => handleChange('oldPassword', text)}
							placeholderTextColor='#999'
						/>
						<TouchableOpacity onPress={() => toggleVisibility('old')}>
							<FeatherIcon
								name={isVisible.old ? 'eye' : 'eye-off'}
								size={20}
								color='#00ADEF'
							/>
						</TouchableOpacity>
					</View>
				</View>

				{/* New Password */}
				<View style={styles.inputWrapper}>
					<Text style={styles.label}>New password</Text>
					<View style={styles.inputField}>
						<TextInput
							style={styles.input}
							secureTextEntry={!isVisible.new}
							value={form.newPassword}
							onChangeText={text => handleChange('newPassword', text)}
							placeholderTextColor='#999'
						/>
						<TouchableOpacity onPress={() => toggleVisibility('new')}>
							<FeatherIcon
								name={isVisible.new ? 'eye' : 'eye-off'}
								size={20}
								color='#00ADEF'
							/>
						</TouchableOpacity>
					</View>
				</View>

				{/* Confirm Password */}
				<View style={styles.inputWrapper}>
					<Text style={styles.label}>Confirm password</Text>
					<View style={styles.inputField}>
						<TextInput
							style={styles.input}
							secureTextEntry={!isVisible.confirm}
							value={form.confirmPassword}
							onChangeText={text => handleChange('confirmPassword', text)}
							placeholderTextColor='#999'
						/>
						<TouchableOpacity onPress={() => toggleVisibility('confirm')}>
							<FeatherIcon
								name={isVisible.confirm ? 'eye' : 'eye-off'}
								size={20}
								color='#00ADEF'
							/>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>

			{/* Save Button */}
			<TouchableOpacity
				style={[
					styles.saveButton,
					!(form.oldPassword && form.newPassword && form.confirmPassword) &&
						styles.saveButtonDisabled,
				]}
				disabled={!(form.oldPassword && form.newPassword && form.confirmPassword)}
				onPress={handleSave}
			>
				<Text style={styles.saveButtonText}>{isPending ? 'Сохраняю...' : 'Сохранить'}</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 56,
		marginTop: 50,
		position: 'relative',
	},
	backButton: {
		position: 'absolute',
		left: 20,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
		fontFamily: 'JakartaBold',
	},
	divider: {
		height: 1,
		backgroundColor: '#E5E5E5',
		width: '100%',
	},
	scrollWrapper: {
		padding: 20,
	},
	inputWrapper: {
		marginBottom: 20,
	},
	label: {
		fontSize: 15,
		fontWeight: '600',
		marginBottom: 8,
		color: '#888',
		fontFamily: 'JakartaMedium',
	},
	inputField: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F5F5F5',
		borderRadius: 10,
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	input: {
		flex: 1,
		fontSize: 16,
		color: '#000',
		fontFamily: 'JakartaRegular',
	},
	saveButton: {
		marginHorizontal: 20,
		backgroundColor: '#0286FF',
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: 'center',
		marginBottom: 44,
	},
	saveButtonDisabled: {
		backgroundColor: '#ddd',
	},
	saveButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
})

export default PasswordChange
