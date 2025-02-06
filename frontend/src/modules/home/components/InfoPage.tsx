import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { NavigationProp, useNavigation } from '@react-navigation/native'

import { icons } from '../../../core/constants'

export const InfoPage = () => {
	const navigation = useNavigation<NavigationProp<any>>()

	const handleClose = () => {
		navigation.goBack()
	}
	return (
		<View style={styles.container}>
			<Image
				source={icons.sunfire}
				style={styles.sunfireIcon}
			/>

			<Text style={styles.title}>
				Победная серия показывает, сколько дней ты занимаешься без перерывов
			</Text>

			<Text style={styles.subtitle}>Для продолжения серии ты можешь:</Text>

			<View style={styles.actionsContainer}>
				<View style={styles.action}>
					<Image
						source={icons.learning}
						style={styles.actionIcon}
					/>
					<Text style={styles.actionText}>Пройти урок</Text>
				</View>
				<View style={styles.action}>
					<Image
						source={icons.study}
						style={styles.actionIcon}
					/>
					<Text style={styles.actionText}>Выучить слова</Text>
				</View>
				<View style={styles.action}>
					<Image
						source={icons.task}
						style={styles.actionIcon}
					/>
					<Text style={styles.actionText}>Выполнить задание</Text>
				</View>
				<View style={styles.action}>
					<Image
						source={icons.book}
						style={styles.actionIcon}
					/>
					<Text style={styles.actionText}>Выйти на серию</Text>
				</View>
			</View>

			{/* Подсказка */}
			<Text style={styles.hint}>
				За любое из этих действий ты также получишь очки опыта и сможешь соревноваться за первенство
				в лиге.
			</Text>

			<TouchableOpacity
				onPress={handleClose}
				style={styles.closeButton}
			>
				<Text style={styles.closeButtonText}>Закрыть</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		alignItems: 'center',
		padding: 16,
	},
	sunfireIcon: {
		width: 200,
		height: 200,
		marginTop: 60,
		marginBottom: 10,
	},
	title: {
		fontSize: 23,
		fontWeight: 'bold',
		color: '#000000',
		textAlign: 'center',
		marginBottom: 12,
		paddingHorizontal: 16,
	},
	subtitle: {
		fontSize: 18,
		color: '#333333',
		textAlign: 'center',
		marginBottom: 20,
	},
	actionsContainer: {
		width: '100%',
		marginBottom: 20,
		paddingHorizontal: 16,
	},
	action: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
	},
	actionIcon: {
		width: 32,
		height: 32,
		marginRight: 12,
	},
	actionText: {
		fontSize: 16,
		color: '#000000',
	},
	hint: {
		fontSize: 14,
		color: '#555555',
		textAlign: 'center',
		marginBottom: 30,
		paddingHorizontal: 16,
	},
	closeButton: {
		backgroundColor: '#0076CE',
		paddingVertical: 12,
		paddingHorizontal: 40,
		borderRadius: 8,
		alignItems: 'center',
		width: '100%',
	},
	closeButtonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
})
