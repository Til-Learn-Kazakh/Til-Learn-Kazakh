import React from 'react'
import { StyleSheet, View } from 'react-native'

import { NavigationProp, useNavigation } from '@react-navigation/native'

const TestTasksPage = () => {
	const navigation = useNavigation<NavigationProp<any>>()

	return <View style={styles.container}></View>
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		gap: 20, // Пространство между кнопками
		backgroundColor: 'white',
	},
})

export default TestTasksPage
