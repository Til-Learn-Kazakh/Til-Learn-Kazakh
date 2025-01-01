import React, { useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

const Bolatbek = require('../../../../assets/Bolatbek.png')

const ProfileScreen = () => {
	// Пример состояний
	const [xp] = useState(21500)
	const [streak] = useState(7)
	const [hearts] = useState(3)

	// Пример для прогресс-бара (из 2000 XP = 1 уровень)
	const progress = xp / 50000

	// Обработчики нажатий
	const handleSettingsPress = () => {
		alert('Open Settings Screen')
	}

	return (
		<ScrollView style={styles.container}>
			{/* Фоновый градиент в шапке (можно оставить для красоты) */}
			<LinearGradient
				colors={['#00AAFF', '#6495ed']}
				style={styles.headerContainer}
			>
				{/* Иконка настроек (сверху справа) */}
				<TouchableOpacity
					style={styles.settingsIcon}
					onPress={handleSettingsPress}
				>
					<Ionicons
						name='settings-sharp'
						size={24}
						color='#fff'
					/>
				</TouchableOpacity>

				{/* Аватар и имя */}
				<View style={styles.profileSection}>
					<View style={styles.avatarWrapper}>
						<Image
							style={styles.avatar}
							source={Bolatbek}
						/>
					</View>
					<Text style={styles.username}>Bolatbek</Text>
				</View>

				{/* Статистика: XP, Streak, Hearts */}
				<View style={styles.statsRow}>
					<View style={styles.statItem}>
						<Image
							source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png' }}
							style={styles.statIcon}
						/>
						<Text style={styles.statValue}>{xp}</Text>
						<Text style={styles.statLabel}>XP</Text>
					</View>
					<View style={styles.statItem}>
						<Image
							source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3500/3500833.png' }}
							style={styles.statIcon}
						/>
						<Text style={styles.statValue}>{streak}</Text>
						<Text style={styles.statLabel}>Streak</Text>
					</View>
					<View style={styles.statItem}>
						<Image
							source={{ uri: 'https://cdn-icons-png.flaticon.com/512/833/833472.png' }}
							style={styles.statIcon}
						/>
						<Text style={styles.statValue}>{hearts}</Text>
						<Text style={styles.statLabel}>Hearts</Text>
					</View>
				</View>

				{/* Пример прогресс-бара */}
				<View style={styles.progressContainer}>
					<Text style={styles.progressLabel}>Next Level</Text>
					<View style={styles.progressBar}>
						<View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
					</View>
					<Text style={styles.progressXP}>{xp} / 2000 XP</Text>
				</View>
			</LinearGradient>

			{/* Ежедневное задание (Daily Quest) */}
			<View style={styles.questContainer}>
				<Text style={styles.sectionTitle}>Daily Quest</Text>
				<View style={styles.questBox}>
					<Text style={styles.questDescription}>
						Пройди 3 урока сегодня, чтобы получить +50 XP!
					</Text>
					<TouchableOpacity style={styles.questButton}>
						<Text style={styles.questButtonText}>Начать</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* 1. Карточка «СЛОВА / ПРОГРЕСС» */}
			<View style={styles.bigCard}>
				<View style={styles.cardHeader}>
					<Text style={styles.cardHeaderLeft}>СЛОВА</Text>
					<Text style={styles.cardHeaderRight}>ПРОГРЕСС</Text>
				</View>

				<View style={styles.wordsProgressRow}>
					{/* Кнопка «Учить 0» */}
					<View style={styles.learnButton}>
						<Text style={styles.learnButtonText}>Учить</Text>
						<View style={styles.learnButtonBadge}>
							<Text style={styles.learnButtonBadgeText}>0</Text>
						</View>
					</View>

					{/* Кнопка «Повторить» */}
					<TouchableOpacity style={styles.repeatButton}>
						<Text style={styles.repeatButtonText}>Повторить</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* --- Ряд из 2 карточек: ЧАТЫ (слева) и ДОСТИЖЕНИЯ (справа) --- */}
			<View style={styles.rowContainer}>
				{/* 2. Карточка «ЧАТЫ» */}
				<View style={[styles.mediumCard, { marginRight: 10 }]}>
					<Text style={styles.cardTitle}>ЧАТЫ</Text>
					<View style={styles.chatsRow}>
						<Image
							source={{ uri: 'https://i.ibb.co/tzYzhTp/joker.jpg' }}
							style={styles.chatAvatar}
						/>
						<Image
							source={{ uri: 'https://i.ibb.co/3S33W2R/megan.jpg' }}
							style={styles.chatAvatar}
						/>
						<Image
							source={{ uri: 'https://i.ibb.co/vsvbtwt/sheldon.jpg' }}
							style={styles.chatAvatar}
						/>
						<View style={styles.moreCircle}>
							<Text style={styles.moreCircleText}>+16</Text>
						</View>
					</View>
				</View>

				{/* 3. Карточка «ДОСТИЖЕНИЯ» */}
				<View style={[styles.mediumCard, { marginLeft: 10 }]}>
					<Text style={styles.cardTitle}>ДОСТИЖЕНИЯ</Text>
					<View style={styles.badgesRow}>
						<Image
							source={{ uri: 'https://i.ibb.co/RyvTBzY/matrix.png' }}
							style={styles.badgeIcon}
						/>
						<Image
							source={{ uri: 'https://i.ibb.co/FHGTcjx/badge-phone.png' }}
							style={styles.badgeIcon}
						/>
						<View style={styles.moreCircle}>
							<Text style={styles.moreCircleText}>+10</Text>
						</View>
					</View>
				</View>
			</View>

			{/* 4. Итоговая карточка (Выучено слов, Пройдено уроков, Страниц прочитано) */}
			<View style={styles.statsCard}>
				<View style={styles.statColumn}>
					<Text style={styles.statColumnTitle}>Выучено слов</Text>
					<View style={styles.statColumnRow}>
						<Ionicons
							name='cash-outline'
							size={24}
							color='#00FF99'
						/>
						<Text style={styles.statColumnValue}>0</Text>
					</View>
				</View>
				<View style={styles.statColumn}>
					<Text style={styles.statColumnTitle}>Пройдено уроков</Text>
					<View style={styles.statColumnRow}>
						<Ionicons
							name='school-outline'
							size={24}
							color='#9e7aff'
						/>
						<Text style={styles.statColumnValue}>0</Text>
					</View>
				</View>
				<View style={styles.statColumn}>
					<Text style={styles.statColumnTitle}>Страниц прочитано</Text>
					<View style={styles.statColumnRow}>
						<Ionicons
							name='book-outline'
							size={24}
							color='#ffa500'
						/>
						<Text style={styles.statColumnValue}>8</Text>
					</View>
				</View>
			</View>

			{/* Небольшой отступ внизу */}
			<View style={{ height: 40 }} />
		</ScrollView>
	)
}

export default ProfileScreen

const styles = StyleSheet.create({
	// Базовый контейнер со **белым** фоном
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},

	// Шапка с градиентом (можно оставить)
	headerContainer: {
		paddingHorizontal: 20,
		paddingVertical: 40,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
		position: 'relative',
	},
	settingsIcon: {
		position: 'absolute',
		top: 40,
		right: 20,
		padding: 8,
	},
	profileSection: {
		alignItems: 'center',
	},
	avatarWrapper: {
		width: 100,
		height: 100,
		borderRadius: 50,
		borderWidth: 3,
		borderColor: '#fff',
		overflow: 'hidden',
	},
	avatar: {
		width: '100%',
		height: '100%',
	},
	username: {
		marginTop: 10,
		fontSize: 22,
		fontWeight: 'bold',
		color: '#fff',
	},

	// Статистика (XP, Streak, Hearts)
	statsRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 25,
	},
	statItem: {
		alignItems: 'center',
	},
	statIcon: {
		width: 30,
		height: 30,
		marginBottom: 5,
	},
	statValue: {
		fontSize: 20,
		color: '#fff',
		fontWeight: 'bold',
	},
	statLabel: {
		fontSize: 14,
		color: '#fff',
		marginTop: 2,
	},

	// Прогресс-бар
	progressContainer: {
		marginTop: 25,
		alignItems: 'center',
	},
	progressLabel: {
		color: '#fff',
		fontWeight: '600',
		marginBottom: 5,
	},
	progressBar: {
		width: '80%',
		height: 10,
		backgroundColor: '#fff',
		borderRadius: 5,
		overflow: 'hidden',
	},
	progressFill: {
		height: '100%',
		backgroundColor: '#FFD700',
	},
	progressXP: {
		marginTop: 5,
		color: '#fff',
	},

	// Ежедневное задание
	questContainer: {
		marginTop: 20,
		paddingHorizontal: 20,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 10,
	},
	questBox: {
		backgroundColor: '#fff',
		borderRadius: 10,
		padding: 15,
		borderColor: '#ccc',
		borderWidth: 1,
	},
	questDescription: {
		fontSize: 16,
		marginBottom: 10,
	},
	questButton: {
		backgroundColor: '#00AAFF',
		paddingVertical: 10,
		borderRadius: 8,
		alignItems: 'center',
	},
	questButtonText: {
		color: '#fff',
		fontWeight: '600',
	},

	// Карточки с белым фоном (вместо тёмного)
	bigCard: {
		backgroundColor: '#fff',
		marginHorizontal: 20,
		borderRadius: 12,
		padding: 16,
		marginTop: 20,
		borderWidth: 1,
		borderColor: '#eee',
	},
	// Ряд для чатов и достижений
	rowContainer: {
		flexDirection: 'row',
		marginHorizontal: 20,
		marginTop: 20,
	},
	mediumCard: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
		flex: 1,
		minHeight: 160, // Чтобы придать "квадратный" вид (пример)
		borderWidth: 1,
		borderColor: '#eee',
	},
	statsCard: {
		backgroundColor: '#fff',
		marginHorizontal: 20,
		borderRadius: 12,
		padding: 16,
		marginTop: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderWidth: 1,
		borderColor: '#eee',
	},

	// Заголовки в карточках
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 12,
	},
	cardHeaderLeft: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
	},
	cardHeaderRight: {
		fontSize: 16,
		fontWeight: '600',
		color: '#00AAFF',
	},

	// Кнопки «Учить 0» и «Повторить»
	wordsProgressRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	learnButton: {
		flexDirection: 'row',
		backgroundColor: '#00AAFF',
		borderRadius: 30,
		paddingHorizontal: 20,
		paddingVertical: 10,
		marginRight: 12,
		alignItems: 'center',
	},
	learnButtonText: {
		color: '#fff',
		fontWeight: '600',
		fontSize: 16,
		marginRight: 8,
	},
	learnButtonBadge: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: '#66ccff',
		justifyContent: 'center',
		alignItems: 'center',
	},
	learnButtonBadgeText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 12,
	},
	repeatButton: {
		backgroundColor: '#f0f0f0',
		borderRadius: 30,
		paddingHorizontal: 20,
		paddingVertical: 10,
	},
	repeatButtonText: {
		color: '#888',
		fontWeight: '600',
		fontSize: 15,
	},

	// ЧАТЫ
	cardTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		marginBottom: 10,
	},
	chatsRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	chatAvatar: {
		width: 50,
		height: 50,
		borderRadius: 25,
		marginRight: 8,
	},
	moreCircle: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: '#ccc',
		alignItems: 'center',
		justifyContent: 'center',
	},
	moreCircleText: {
		color: '#444',
		fontWeight: '600',
	},

	// ДОСТИЖЕНИЯ
	badgesRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	badgeIcon: {
		width: 50,
		height: 50,
		marginRight: 12,
		borderRadius: 10,
	},

	// Карточка со статистикой (Выучено слов, Уроков, Страниц)
	statColumn: {
		alignItems: 'center',
		flex: 1,
	},
	statColumnTitle: {
		color: '#777',
		fontSize: 14,
		marginBottom: 6,
	},
	statColumnRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	statColumnValue: {
		marginLeft: 6,
		color: '#333',
		fontWeight: '600',
		fontSize: 16,
	},
})
