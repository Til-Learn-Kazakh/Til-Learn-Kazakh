import React, { useState } from 'react'
import { Controller } from 'react-hook-form'
import {
	Image,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native'

import { icons } from '../constants'
import { InputFieldProps } from '../types/type'

const InputField = <T extends Record<string, any>>({
	label,
	icon,
	secureTextEntry = false,
	labelStyle,
	containerStyle,
	inputStyle,
	iconStyle,
	name,
	control,
	errorMessage,
	...props
}: InputFieldProps<T>) => {
	const [isHidden, setIsHidden] = useState(secureTextEntry)

	const togglePasswordVisibility = () => {
		setIsHidden(!isHidden)
	}

	return (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.wrapper}>
					<Text style={[styles.label, labelStyle]}>{label}</Text>
					<Controller
						control={control}
						name={name}
						render={({ field: { onChange, onBlur, value } }) => (
							<View style={[styles.container, containerStyle]}>
								{icon && (
									<Image
										source={icon}
										style={[styles.icon, iconStyle]}
									/>
								)}
								<TextInput
									style={[styles.input, inputStyle]}
									secureTextEntry={isHidden}
									onBlur={onBlur}
									onChangeText={onChange}
									value={value}
									{...props}
								/>
								{secureTextEntry && (
									<TouchableOpacity
										onPress={togglePasswordVisibility}
										activeOpacity={1}
										onPressIn={event => event.preventDefault()}
									>
										<Image
											source={isHidden ? icons.eyeoff : icons.eye}
											style={styles.toggleIcon}
										/>
									</TouchableOpacity>
								)}
							</View>
						)}
					/>
					{errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	wrapper: {
		marginVertical: 8,
		width: '100%',
	},
	label: {
		fontSize: 16,
		fontFamily: 'JakartaSemiBold',
		marginBottom: 8,
	},
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F5F5F5',
		borderRadius: 9999,
		borderWidth: 1,
		borderColor: '#F5F5F5',
		paddingHorizontal: 12,
	},
	icon: {
		width: 24,
		height: 24,
		marginLeft: 8,
	},
	toggleIcon: {
		width: 24,
		height: 24,
	},
	input: {
		flex: 1,
		fontFamily: 'JakartaSemiBold',
		fontSize: 15,
		padding: 12,
		textAlign: 'left',
	},
	errorText: {
		color: 'red',
		fontSize: 12,
		marginTop: 4,
	},
})

export default InputField
