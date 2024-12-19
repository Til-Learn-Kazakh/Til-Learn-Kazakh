import React from 'react'
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'success'

interface CustomButtonProps extends TouchableOpacityProps {
	onPress: () => void
	title: string
	bgVariant?: ButtonVariant
	textVariant?: 'default' | 'primary' | 'secondary' | 'danger' | 'success'
	IconLeft?: React.FC
	IconRight?: React.FC
	style?: ViewStyle
}

const CustomButton: React.FC<CustomButtonProps> = ({
	onPress,
	title,
	bgVariant = 'primary',
	textVariant = 'default',
	IconLeft,
	IconRight,
	style,
	...props
}) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={[styles.base, styles[bgVariant], style]}
			{...props}
		>
			{IconLeft && <IconLeft />}
			<Text style={[styles.text, styles[textVariant]]}>{title}</Text>
			{IconRight && <IconRight />}
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	base: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 50,
		padding: 12,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowRadius: 3,
	},
	primary: { backgroundColor: '#0286FF' },
	secondary: { backgroundColor: '#gray500' },
	danger: { backgroundColor: '#FF0000' },
	success: { backgroundColor: '#00FF00' },
	outline: { backgroundColor: 'transparent', borderColor: '#ccc', borderWidth: 0.5 },
	text: { fontSize: 16, fontWeight: 'bold' },
	default: { color: '#FFF' },
})

export default CustomButton
