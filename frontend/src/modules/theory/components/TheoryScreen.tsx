import React from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { icons } from '../../../core/constants'

const TheoryScreen = () => {
	const navigation = useNavigation<NavigationProp<any>>()

	return (
		<View style={styles.container}>
			{/* Sticky Header */}
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => {
						navigation.goBack()
					}}
					style={styles.backButton}
				>
					<Ionicons
						name='arrow-back'
						size={24}
						color='#333'
					/>
					<Text style={styles.backText}>НАЗАД</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.helpButton}>
					<Ionicons
						name='help-circle-outline'
						size={28}
						color='#FF6F61'
					/>
				</TouchableOpacity>
			</View>

			{/* Title Section */}
			<View style={styles.titleContainer}>
				<Text style={styles.titleText}>Уровень A1. Теория</Text>
			</View>

			{/* Scrollable Content */}
			<ScrollView contentContainerStyle={styles.content}>
				{/* --- SECTION 1: Key Phrases (Kazakh Introductions) --- */}
				<Text style={styles.sectionTitle}>KEY PHRASES</Text>
				<Text style={styles.sectionSubtitle}>Introduce yourself</Text>

				<View style={styles.conversationContainer}>
					{/* Пример 1 */}
					<View style={styles.messageBubble}>
						<Image
							source={icons.volume}
							style={{ width: 28, height: 28 }}
						/>
						<Text style={styles.messageText}>Кешіріңіз, сіз қазақша сөйлейсіз бе?</Text>
						<Text style={styles.translationText}>Простите, вы говорите по-казахски?</Text>
					</View>

					{/* Пример ответа */}
					<View style={[styles.messageBubble, styles.responseBubble]}>
						<Image
							source={icons.volume}
							style={{ width: 28, height: 28 }}
						/>
						<Text style={styles.messageText}>Иә, мен қазақпын.</Text>
						<Text style={styles.translationText}>Да, я казах(ка).</Text>
					</View>

					{/* Пример 2 */}
					<View style={styles.messageBubble}>
						<Image
							source={icons.volume}
							style={{ width: 28, height: 28 }}
						/>
						<Text style={styles.messageText}>Сенің атың кім?</Text>
						<Text style={styles.translationText}>Как тебя зовут?</Text>
					</View>

					{/* Пример ответа */}
					<View style={[styles.messageBubble, styles.responseBubble]}>
						<Image
							source={icons.volume}
							style={{ width: 28, height: 28 }}
						/>
						<Text style={styles.messageText}>Менің атым Жанна.</Text>
						<Text style={styles.translationText}>Меня зовут Жанна.</Text>
					</View>
				</View>

				<View style={styles.divider} />

				{/* --- SECTION 2: Tip (Verbs) --- */}
				<Text style={styles.sectionTitle}>TIP</Text>
				<Text style={styles.sectionSubtitle}>Verbs</Text>

				<View style={styles.tipContainer}>
					<Text style={styles.tipText}>
						В казахском языке глаголы спрягаются по лицам и временам, поэтому формы могут заметно
						меняться.
					</Text>

					{/* Пример таблицы с глаголом "сөйлеу" (говорить) */}
					<View style={styles.tableContainer}>
						<View style={styles.tableRow}>
							<Text style={styles.tableHeader}>Лицо</Text>
							<Text style={styles.tableHeader}>Глагол (сөйлеу)</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={styles.tableCell}>Мен (я)</Text>
							<Text style={styles.tableCell}>
								сөйле
								<Text style={{ fontWeight: 'bold' }}>ймін</Text>
							</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={styles.tableCell}>Сен (ты)</Text>
							<Text style={styles.tableCell}>
								сөйле
								<Text style={{ fontWeight: 'bold' }}>йсің</Text>
							</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={styles.tableCell}>Ол (он/она)</Text>
							<Text style={styles.tableCell}>
								сөйле
								<Text style={{ fontWeight: 'bold' }}>йді</Text>
							</Text>
						</View>
					</View>

					{/* Пример таблицы с глаголом "бару" (идти) */}
					<View style={styles.tableContainer}>
						<View style={styles.tableRow}>
							<Text style={styles.tableHeader}>Лицо</Text>
							<Text style={styles.tableHeader}>Глагол (бару)</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={styles.tableCell}>Мен</Text>
							<Text style={styles.tableCell}>барамын</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={styles.tableCell}>Сен</Text>
							<Text style={styles.tableCell}>барасың</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={styles.tableCell}>Ол</Text>
							<Text style={styles.tableCell}>барады</Text>
						</View>
					</View>
				</View>

				<View style={styles.divider} />

				{/* --- SECTION 3: Tip (Gender) --- */}
				<View style={styles.tipSection}>
					<Text style={styles.tipTitle}>TIP</Text>
					<Text style={styles.tipHeading}>Gender</Text>
					<Text style={styles.tipText}>
						В казахском языке грамматического рода, как в русском или французском, нет. Но помните,
						что для обращения к мужчине/женщине могут использоваться разные слова (ата/апа, аға/апке
						и т.д.).
					</Text>

					<View style={styles.dialogue}>
						<TouchableOpacity style={styles.audioButton}>
							<Ionicons
								name='volume-high-outline'
								size={20}
								color='#007AFF'
							/>
						</TouchableOpacity>
						<Text style={styles.dialogueText}>Бұл кім? — Бұл менің ағам.</Text>
						<Text style={styles.translation}>Кто это? — Это мой брат.</Text>
					</View>

					<View style={styles.dialogue}>
						<TouchableOpacity style={styles.audioButton}>
							<Ionicons
								name='volume-high-outline'
								size={20}
								color='#007AFF'
							/>
						</TouchableOpacity>
						<Text style={styles.dialogueText}>Бұл менің әпкем.</Text>
						<Text style={styles.translation}>Это моя сестра.</Text>
					</View>

					<Text style={styles.tipText}>
						Здесь нет изменения формы при обращении к разным полам, но меняется само слово.
					</Text>
				</View>

				<View style={styles.divider} />

				{/* --- SECTION 4: Vocabulary (Greetings) --- */}
				<Text style={styles.sectionTitle}>VOCABULARY</Text>
				<Text style={styles.sectionSubtitle}>Greetings</Text>
				<Text style={{ marginBottom: 10 }}>
					Ниже — самые распространённые приветствия на казахском языке:
				</Text>
				<View style={styles.tableContainer}>
					<View style={styles.tableRow}>
						<Text style={styles.tableHeader}>Фраза</Text>
						<Text style={styles.tableHeader}>Перевод</Text>
					</View>
					<View style={styles.tableRow}>
						<Text style={styles.tableCell}>Сәлем</Text>
						<Text style={styles.tableCell}>Привет</Text>
					</View>
					<View style={styles.tableRow}>
						<Text style={styles.tableCell}>Қайырлы күн</Text>
						<Text style={styles.tableCell}>Добрый день</Text>
					</View>
					<View style={styles.tableRow}>
						<Text style={styles.tableCell}>Қайырлы кеш</Text>
						<Text style={styles.tableCell}>Добрый вечер</Text>
					</View>
				</View>

				<View style={styles.divider} />

				{/* --- SECTION 5: Tip (Сен vs Сіз) --- */}
				<Text style={styles.sectionTitle}>TIP</Text>
				<Text style={styles.sectionSubtitle}>Сен vs. Сіз</Text>

				<View style={styles.tipContainer}>
					<Text style={styles.tipText}>
						В казахском языке для местоимения «ты/Вы» существуют два варианта:
						<Text style={styles.boldText}> сен </Text> (неформальное) и
						<Text style={styles.boldText}> сіз</Text> (формальное или вежливое).
					</Text>
					<Text style={styles.tipText}>
						- <Text style={styles.boldText}>сен</Text> используется между друзьями, в кругу семьи.
						{'\n'}- <Text style={styles.boldText}>сіз</Text> – более вежливое обращение, а также ко
						взрослым или незнакомым людям.
					</Text>
				</View>

				<View style={styles.divider} />

				{/* --- SECTION 6: Practice (Quick Check) --- */}
				<Text style={styles.sectionTitle}>PRACTICE</Text>
				<Text style={styles.sectionSubtitle}>Quick Check</Text>
				<Text style={{ marginBottom: 10 }}>Небольшая практика для закрепления материала:</Text>

				<View style={styles.tipContainer}>
					<Text style={styles.tipText}>
						1) Выберите правильное приветствие для вечера:
						<Text style={styles.boldText}> Сәлем / Қайырлы кеш</Text>?
					</Text>
					<Text style={styles.tipText}>2) Переведите на казахский: «Привет, как тебя зовут?»</Text>
					<Text style={styles.tipText}>
						3) В каком случае вы используете <Text style={styles.boldText}>сіз</Text>, а не{' '}
						<Text style={styles.boldText}>сен</Text>?
					</Text>
				</View>

				<View style={styles.divider} />

				{/* --- SECTION 7: Common Mistakes --- */}
				<Text style={styles.sectionTitle}>COMMON MISTAKES</Text>
				<Text style={styles.sectionSubtitle}>Частые ошибки</Text>
				<View style={styles.tipContainer}>
					<Text style={styles.tipText}>
						1) Смешивание сен/сіз. Многие начинающие изучающие ошибаются, используя «сен» при
						разговоре с незнакомцами.
					</Text>
					<Text style={styles.tipText}>
						2) Неправильное окончание глаголов для разных лиц. Например, «Мен сөйлейсің» вместо «Мен
						сөйлеймін».
					</Text>
				</View>

				<View style={styles.divider} />

				{/* --- SECTION 8: Pronunciation Tips --- */}
				<Text style={styles.sectionTitle}>PRONUNCIATION TIPS</Text>
				<Text style={styles.sectionSubtitle}>Советы по произношению</Text>
				<View style={styles.tipContainer}>
					<Text style={styles.tipText}>
						В казахском языке важно правильно произносить буквы «қ», «ө», «ү», а также носовой звук
						«ң». Например, «қ» более твёрдая, чем русское «к», а «ң» напоминает звук «н» в слове
						«банк».
					</Text>
					<Text style={styles.tipText}>
						Особое внимание обратите на различие «ы» и «і», так как неправильное произношение может
						изменить значение слова.
					</Text>
				</View>
			</ScrollView>
		</View>
	)
}

export default TheoryScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingTop: 50,
		paddingBottom: 10,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
	},
	backButton: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	backText: {
		fontSize: 16,
		color: '#333',
		marginLeft: 5,
	},
	helpButton: {
		padding: 5,
	},
	titleContainer: {
		backgroundColor: '#FF6F91',
		paddingVertical: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	titleText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#fff',
	},
	content: {
		padding: 16,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#007AFF',
		marginBottom: 5,
	},
	sectionSubtitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 15,
		color: '#333',
	},
	conversationContainer: {
		marginBottom: 20,
	},
	messageBubble: {
		backgroundColor: '#F8F8F8',
		padding: 10,
		borderRadius: 12,
		marginBottom: 8,
		flexDirection: 'column',
		maxWidth: '80%',
	},
	responseBubble: {
		alignSelf: 'flex-end',
		backgroundColor: '#F0F0F0',
	},
	messageText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#333',
	},
	translationText: {
		marginTop: 10,
		fontSize: 14,
		color: '#666',
	},
	tipContainer: {
		backgroundColor: '#E3F2FD',
		padding: 12,
		borderRadius: 10,
		marginBottom: 20,
	},
	tipText: {
		fontSize: 14,
		color: '#333',
		marginBottom: 10,
	},
	boldText: {
		fontWeight: 'bold',
		color: '#007AFF',
	},
	tableContainer: {
		backgroundColor: '#FFF',
		padding: 10,
		borderRadius: 8,
		marginTop: 10,
	},
	tableRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 5,
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
	},
	tableHeader: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#007AFF',
	},
	tableCell: {
		fontSize: 14,
		color: '#333',
	},
	divider: {
		height: 1,
		backgroundColor: '#ddd',
		marginVertical: 20,
	},
	dialogue: {
		backgroundColor: '#FFFFFF',
		borderRadius: 10,
		padding: 10,
		marginBottom: 10,
		flexDirection: 'row',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 2,
	},
	audioButton: {
		marginRight: 10,
	},
	dialogueText: {
		fontSize: 16,
		fontWeight: '500',
	},
	translation: {
		fontSize: 14,
		color: '#6C757D',
		marginTop: 5,
	},
	tipSection: {
		backgroundColor: '#E3F2FD',
		borderRadius: 10,
		padding: 15,
		marginBottom: 20,
	},
	tipTitle: {
		color: '#007AFF',
		fontSize: 14,
		fontWeight: 'bold',
		marginBottom: 5,
	},
	tipHeading: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
	},
})
