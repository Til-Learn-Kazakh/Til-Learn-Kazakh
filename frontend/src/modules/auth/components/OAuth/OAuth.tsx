import React from 'react'
import { Alert, Image, StyleSheet, Text, View } from 'react-native'

import { icons } from '../../../../core/constants'
import CustomButton from '../../../../core/ui/CustomButton'

const OAuth = () => {
	const handleGoogleSignIn = () => {
		Alert.alert('Google Sign In')
	}

	return (
		<View>
			<View style={styles.dividerContainer}>
				<View style={styles.divider} />
				<Text style={styles.dividerText}>Or</Text>
				<View style={styles.divider} />
			</View>

			<CustomButton
				title='Log In with Google'
				style={styles.googleButton}
				IconLeft={() => (
					<Image
						source={icons.google}
						resizeMode='contain'
						style={styles.googleIcon}
					/>
				)}
				bgVariant='outline'
				textVariant='secondary'
				onPress={handleGoogleSignIn}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	dividerContainer: {
		marginTop: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	divider: {
		backgroundColor: '#e0e0e0', // Замените на ваш цвет general-100
		height: 1,
		flex: 1,
	},
	dividerText: {
		fontSize: 18,
		marginHorizontal: 12,
	},
	googleButton: {
		marginTop: 20,
		width: '100%',
		shadowColor: 'transparent', // Убираем тень
	},
	googleIcon: {
		marginHorizontal: 8,
		height: 20,
		width: 20,
	},
})

export default OAuth
