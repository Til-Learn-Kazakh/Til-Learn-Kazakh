import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'

const InfoLeaderboardPage: React.FC = () => {
	const navigation = useNavigation()

	return (
		<LinearGradient
			colors={['#697CFF', '#7646fc']}
			style={styles.container}
		>
			{/* Шапка */}
			<View style={styles.header}>
				{/* Кнопка «назад» слева */}
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

				{/* Заголовок */}
				<Text style={styles.title}>О Рейтинге</Text>

				{/* Пустая вьюшка справа, чтобы заголовок был по центру */}
				<View />
			</View>

			{/* Основной контент */}
			<View style={styles.content}>
				{/* Блок про недельный рейтинг */}
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Недельный рейтинг</Text>
					<Text style={styles.text}>
						Каждое воскресенье в 00:00 очки WeeklyXP у всех пользователей{' '}
						<Text style={{ fontWeight: 'bold' }}>обнуляются</Text>, и начинается новый отсчёт на
						неделю.
					</Text>
				</View>

				{/* Блок про месячный рейтинг */}
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Месячный рейтинг</Text>
					<Text style={styles.text}>
						Первого числа каждого месяца очки MonthlyXP у всех пользователей{' '}
						<Text style={{ fontWeight: 'bold' }}>обнуляются</Text>, и начинается новый отсчёт на
						месяц.
					</Text>
				</View>

				{/* Зачем обнулять */}
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Зачем это нужно?</Text>
					<Text style={styles.text}>
						Мы даём всем одинаковые условия для соревнования – это помогает поддерживать интерес и
						мотивацию. Еженедельный и ежемесячный «сброс» делает гонку за очками более честной и
						увлекательной.
					</Text>
				</View>
			</View>
		</LinearGradient>
	)
}

export default InfoLeaderboardPage

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
		marginRight: 45,
		fontSize: 20,
		fontWeight: 'bold',
		color: '#FFF',
		alignItems: 'center',
	},
	content: {
		marginTop: 10,
	},
	card: {
		backgroundColor: 'rgba(255, 255, 255, 0.9)',
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		// Тень
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
})
