import React from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Image, StyleSheet, Text, View } from 'react-native'

import { icons } from '../../../../core/constants'
import CustomButton from '../../../../core/ui/CustomButton'

const OAuth = () => {
	const { t } = useTranslation()

	const handleGoogleSignIn = () => {
		Alert.alert(t('AUTHORIZATION.OAUTH.GOOGLE_SIGN_IN_ALERT'))
	}

	return (
		<View>
			<View style={styles.dividerContainer}>
				<View style={styles.divider} />
				<Text style={styles.dividerText}>{t('AUTHORIZATION.OAUTH.OR')}</Text>
				<View style={styles.divider} />
			</View>

			<CustomButton
				title={t('AUTHORIZATION.OAUTH.LOGIN_WITH_GOOGLE')}
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
		backgroundColor: '#e0e0e0',
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
		shadowColor: 'transparent',
	},
	googleIcon: {
		marginHorizontal: 8,
		height: 20,
		width: 20,
	},
})

export default OAuth
