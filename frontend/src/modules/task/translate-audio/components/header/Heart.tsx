import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

import { icons } from '../../../../../core/constants'
import { useCurrentUser } from '../../../../auth/hooks/user-current-user.hook'

// Подставь путь к иконкам

export const HEART_SIZE = 35

const Heart = () => {
	const { data: currentUser, isPending } = useCurrentUser()

	if (isPending) {
		return null // Можно заменить на лоадер, если нужно
	}

	return (
		<View style={styles.container}>
			<Image
				source={icons.heart}
				style={styles.image}
				resizeMode='contain'
			/>
			<Text style={styles.count}>{currentUser?.hearts || 0}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	image: {
		width: HEART_SIZE,
		height: HEART_SIZE,
	},
	count: {
		fontSize: 18,
		fontWeight: 'bold',
		marginLeft: 8,
		color: '#FC4747',
	},
})

export default Heart
