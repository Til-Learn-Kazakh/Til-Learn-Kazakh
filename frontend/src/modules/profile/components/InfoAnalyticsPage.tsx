import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'

const InfoAnalyticsPage: React.FC = () => {
	const navigation = useNavigation()

	return (
		<LinearGradient
			colors={['#094979', '#00d4ff']}
			style={styles.container}
		>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={styles.iconButton}
				>
					<Ionicons
						name='arrow-back'
						size={26}
						color='#FFF'
					/>
				</TouchableOpacity>
				<Text style={styles.title}>О Аналитике</Text>
				<View style={styles.iconButton}>
					<Ionicons
						name='bar-chart'
						size={26}
						color='#FFF'
					/>
				</View>
			</View>

			{/* Content */}
			<View style={styles.content}>
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Как работает аналитика?</Text>
					<Text style={styles.text}>
						В этом разделе вы можете увидеть свою статистику за день, месяц и год. Календарь
						показывает дни, когда были выполнены уроки. Вы можете нажимать на дни, чтобы посмотреть
						детальную информацию.
					</Text>
				</View>

				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Как читать данные?</Text>
					<Text style={styles.text}>
						- <Text style={styles.bold}>Серия</Text>: количество дней подряд без пропуска. {'\n'}-{' '}
						<Text style={styles.bold}>Точность</Text>: процент правильных ответов. {'\n'}-{' '}
						<Text style={styles.bold}>Время</Text>: минуты, проведённые в изучении. {'\n'}-{' '}
						<Text style={styles.bold}>XP</Text>: заработанные очки опыта. {'\n'}-{' '}
						<Text style={styles.bold}>Ошибки</Text>: количество допущенных ошибок.
					</Text>
				</View>

				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Почему важно следить за статистикой?</Text>
					<Text style={styles.text}>
						Регулярный прогресс помогает лучше запоминать материал. Следите за своей серией и не
						пропускайте дни!
					</Text>
				</View>
			</View>
		</LinearGradient>
	)
}

export default InfoAnalyticsPage

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 50,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 20,
	},
	iconButton: {
		padding: 10,
		borderRadius: 10,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#FFF',
	},
	content: {
		marginTop: 10,
	},
	card: {
		backgroundColor: 'rgba(255, 255, 255, 0.9)',
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 5,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#007AFF',
		marginBottom: 6,
	},
	text: {
		fontSize: 14,
		color: '#333',
		lineHeight: 22,
	},
	bold: {
		fontWeight: 'bold',
	},
})
