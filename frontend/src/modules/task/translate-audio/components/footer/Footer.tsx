import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface FooterProps {
	isDisabled: boolean
	onPress: () => void
}

const Footer = ({ isDisabled, onPress }: FooterProps) => {
	const insets = useSafeAreaInsets()

	return (
		<View style={[styles.container, { paddingBottom: insets.bottom }]}>
			<View style={[styles.background, { backgroundColor: isDisabled ? '#B0BEC5' : '#55ACEE' }]} />
			<RectButton
				style={[styles.button, { backgroundColor: isDisabled ? '#B0BEC5' : '#0286FF' }]}
				enabled={!isDisabled}
				onPress={isDisabled ? undefined : onPress}
			>
				<Text style={styles.label}>CHECK</Text>
			</RectButton>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		margin: 16,
		marginBottom: 85,
	},
	background: {
		borderRadius: 16,
		height: 50,
		...StyleSheet.absoluteFillObject,
	},
	button: {
		width: '100%',
		height: 45,
		borderRadius: 16,
		justifyContent: 'center',
	},
	label: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 18,
		textAlign: 'center',
		fontFamily: 'Nunito-Bold',
	},
})

export default Footer
