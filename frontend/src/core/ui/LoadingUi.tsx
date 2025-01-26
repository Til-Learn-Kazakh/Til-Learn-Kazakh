import React from 'react'
import { StyleSheet, View } from 'react-native'

import LottieView from 'lottie-react-native'

import loadingAnimation from '../../../public/images/auth/loading.json'

export const LoadingUi = () => {
	return (
		<View style={styles.container}>
			<LottieView
				source={loadingAnimation}
				autoPlay
				loop
				style={styles.lottie}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
	},
	lottie: {
		width: 250,
		height: 250,
	},
})
