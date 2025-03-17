import React, { useEffect, useState } from 'react'
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Calendar } from 'react-native-calendars'

import { Ionicons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { LoadingUi } from '../../../core/ui/LoadingUi'
import { useMonthlyStats, useYearlyStats } from '../hooks/analytics.hooks'

const availableYears = [
	{ key: '2024', label: '2024 год' },
	{ key: '2025', label: '2025 год' },
]

const AnalyticsScreen: React.FC = () => {
	const navigation = useNavigation<NavigationProp<any>>()

	const [activeTab, setActiveTab] = useState<'month' | 'year'>('month')

	const [yearMonthKey, setYearMonthKey] = useState('')
	const {
		data: monthlyData,
		isLoading: isMonthLoading,
		isError: isMonthError,
	} = useMonthlyStats(yearMonthKey)

	const [markedDays, setMarkedDays] = useState<Record<string, any>>({})
	const [selectedCalendarDay, setSelectedCalendarDay] = useState<string | null>(null)

	useEffect(() => {
		const today = new Date()
		const currentMonth = `${today.getFullYear()}-${today.getMonth() + 1}` // "2025-3"
		setYearMonthKey(currentMonth)
	}, [])

	useEffect(() => {
		if (isMonthError || !monthlyData) {
			setMarkedDays({})
			setSelectedCalendarDay(null)
			return
		}
		const { dayStats } = monthlyData
		if (!dayStats) {
			setMarkedDays({})
			setSelectedCalendarDay(null)
			return
		}
		const [yyyy, mNo] = yearMonthKey.split('-')
		const mm = mNo.padStart(2, '0')
		const newMarks: Record<string, any> = {}
		Object.keys(dayStats).forEach(dStr => {
			const dd = dStr.padStart(2, '0')
			const dateString = `${yyyy}-${mm}-${dd}`
			newMarks[dateString] = { selected: true, selectedColor: 'black' }
		})
		setMarkedDays(newMarks)
		setSelectedCalendarDay(null)
	}, [monthlyData, isMonthError, yearMonthKey])

	const handleDayPress = (dayObj: any) => {
		const dateStr = dayObj.dateString
		if (!markedDays[dateStr]) return
		setMarkedDays(prev => {
			const curColor = prev[dateStr].selectedColor
			const newColor = curColor === 'red' ? 'black' : 'red'
			return {
				...prev,
				[dateStr]: { selected: true, selectedColor: newColor },
			}
		})
		setSelectedCalendarDay(prev => (prev === dateStr ? null : dateStr))
	}

	const handleMonthChange = (date: any) => {
		const newKey = `${date.year}-${date.month}`
		setYearMonthKey(newKey)
	}

	const renderMonthTab = () => {
		if (isMonthLoading) {
			return <LoadingUi />
		}
		if (isMonthError || !monthlyData) {
			return (
				<View style={styles.card}>
					<Text>Нет данных за {yearMonthKey}</Text>
				</View>
			)
		}
		const { monthStats = {}, dayStats = {} } = monthlyData
		const { streak = 0, accuracy = 0, time = 0, xp = 0, lessons = 0, mistakes = 0 } = monthStats

		let displayStreak = streak
		let displayAccuracy = accuracy
		let displayTime = time
		let displayXp = xp
		let displayLessons = lessons
		let displayMistakes = mistakes
		let isDaySelected = false

		if (selectedCalendarDay) {
			const dayNumStr = selectedCalendarDay.slice(-2)
			const dayNum = parseInt(dayNumStr, 10)
			const d = dayStats[dayNum]
			if (d) {
				displayStreak = d.streak ?? 0
				displayAccuracy = d.accuracy ?? 0
				displayTime = d.time ?? 0
				displayXp = d.xp ?? 0
				displayLessons = d.lessons ?? 0
				displayMistakes = d.mistakes ?? 0
				isDaySelected = true
			}
		}

		return (
			<View style={styles.card}>
				<View style={styles.rowBetween}>
					<Text style={styles.sectionTitle}>Месяц (Свайп)</Text>
					<Text style={{ color: '#999', fontSize: 13 }}>{yearMonthKey}</Text>
				</View>

				<Calendar
					current={`${yearMonthKey.split('-')[0]}-${yearMonthKey.split('-')[1].padStart(2, '0')}-01`}
					onDayPress={handleDayPress}
					onMonthChange={handleMonthChange}
					markedDates={markedDays}
					theme={{
						calendarBackground: '#FFF',
						dayTextColor: 'gray',
						arrowColor: '#333',
						monthTextColor: '#333',
						textSectionTitleColor: '#333',
						selectedDayTextColor: '#FFF',
					}}
					dayComponent={({ date, state }: any) => {
						const dateString = date.dateString
						const info = markedDays[dateString]
						const bgColor = info?.selectedColor || 'transparent'
						const isActive = !!info

						if (state === 'disabled') {
							// Не отображаем дни из другого месяца
							return <View style={styles.dayContainer} />
						}

						return (
							<TouchableOpacity
								disabled={!isActive}
								onPress={() => handleDayPress(date)}
								style={[
									styles.dayContainer,
									{ backgroundColor: isActive ? bgColor : 'transparent' },
								]}
							>
								<Text style={[styles.dayText, { color: isActive ? '#FFF' : '#999' }]}>
									{date.day}
								</Text>
							</TouchableOpacity>
						)
					}}
				/>

				<Text style={styles.sectionTitle}>
					{isDaySelected ? 'Статистика за день' : 'Общая статистика за месяц'}
				</Text>
				<View style={styles.statsContainer}>
					<View style={styles.statCard}>
						<Text style={styles.statValue}>{displayStreak}</Text>
						<Text style={styles.statLabel}>Серия</Text>
					</View>
					<View style={styles.statCard}>
						<Text style={styles.statValue}>{displayAccuracy}%</Text>
						<Text style={styles.statLabel}>Точность</Text>
					</View>
					<View style={styles.statCard}>
						<Text style={styles.statValue}>{Math.floor(displayTime / 60)} мин</Text>
						<Text style={styles.statLabel}>Время</Text>
					</View>
					<View style={styles.statCard}>
						<Text style={styles.statValue}>{displayXp}</Text>
						<Text style={styles.statLabel}>XP</Text>
					</View>
					<View style={styles.statCard}>
						<Text style={styles.statValue}>{displayLessons}</Text>
						<Text style={styles.statLabel}>Уроков</Text>
					</View>
					<View style={styles.statCard}>
						<Text style={styles.statValue}>{displayMistakes}</Text>
						<Text style={styles.statLabel}>Ошибок</Text>
					</View>
				</View>
			</View>
		)
	}

	// -------------------- Вкладка "Год" --------------------
	const [selectedYearModal, setSelectedYearModal] = useState(false)
	const [selectedYearKey, setSelectedYearKey] = useState('2025')
	const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(null)
	const [selectedBarMonthKey, setSelectedBarMonthKey] = useState<string | null>(null)

	useEffect(() => {
		if (selectedMonthIndex === null) {
			setSelectedBarMonthKey(null)
		} else {
			const monthNum = selectedMonthIndex + 1
			setSelectedBarMonthKey(`${selectedYearKey}-${monthNum}`)
		}
	}, [selectedMonthIndex, selectedYearKey])

	const {
		data: barMonthData,
		isLoading: isBarMonthLoading,
		isError: isBarMonthError,
	} = useMonthlyStats(selectedBarMonthKey ?? '')

	const {
		data: yearlyData,
		isLoading: isYearLoading,
		isError: isYearError,
	} = useYearlyStats(selectedYearKey)

	const handleBarPress = (index: number) => {
		setSelectedMonthIndex(prev => (prev === index ? null : index))
	}

	const renderYearTab = () => {
		if (isYearLoading) {
			return <LoadingUi />
		}
		if (isYearError || !yearlyData) {
			return (
				<View style={styles.card}>
					<Text>Нет данных за {selectedYearKey}</Text>
				</View>
			)
		}

		const {
			lessons = 0,
			accuracy = 0,
			time = 0,
			mistakes = 0,
			xp = 0,
			streak = 0,
			activeDaysPerMonth = [],
		} = yearlyData

		let showMonthStats = false
		let barMonthStatsContent: JSX.Element | null = null

		if (selectedMonthIndex !== null) {
			if (isBarMonthLoading) {
				barMonthStatsContent = <LoadingUi />
				showMonthStats = true
			} else if (isBarMonthError || !barMonthData) {
				barMonthStatsContent = <Text>Нет данных за {selectedBarMonthKey}</Text>
				showMonthStats = true
			} else {
				const { monthStats = {} } = barMonthData
				const {
					streak: barStreak2 = 0,
					accuracy: barAcc2 = 0,
					time: barTime2 = 0,
					xp: barXp2 = 0,
					lessons: barLessons2 = 0,
					mistakes: barMistakes2 = 0,
				} = monthStats

				barMonthStatsContent = (
					<>
						<Text style={styles.sectionTitle}>
							Статистика за месяц {selectedMonthIndex + 1} ({selectedBarMonthKey})
						</Text>
						<View style={styles.statsContainer}>
							<View style={styles.statCard}>
								<Text style={styles.statValue}>{barStreak2}</Text>
								<Text style={styles.statLabel}>Серия</Text>
							</View>
							<View style={styles.statCard}>
								<Text style={styles.statValue}>{barAcc2}%</Text>
								<Text style={styles.statLabel}>Точность</Text>
							</View>
							<View style={styles.statCard}>
								<Text style={styles.statValue}>{Math.floor(barTime2 / 60)} мин</Text>
								<Text style={styles.statLabel}>Время</Text>
							</View>
							<View style={styles.statCard}>
								<Text style={styles.statValue}>{barXp2}</Text>
								<Text style={styles.statLabel}>XP</Text>
							</View>
							<View style={styles.statCard}>
								<Text style={styles.statValue}>{barLessons2}</Text>
								<Text style={styles.statLabel}>Уроков</Text>
							</View>
							<View style={styles.statCard}>
								<Text style={styles.statValue}>{barMistakes2}</Text>
								<Text style={styles.statLabel}>Ошибок</Text>
							</View>
						</View>
					</>
				)
				showMonthStats = true
			}
		}

		return (
			<View style={styles.card}>
				<View style={styles.rowBetween}>
					<Text style={styles.sectionTitle}>Год</Text>
					<TouchableOpacity
						style={styles.selectBtn}
						onPress={() => setSelectedYearModal(true)}
					>
						<Text style={{ marginRight: 4 }}>{selectedYearKey}</Text>
						<Ionicons
							name='chevron-down'
							size={14}
							color='#333'
						/>
					</TouchableOpacity>
				</View>

				<View style={styles.barChart}>
					{activeDaysPerMonth.map((val: number, i: number) => {
						const isSelected = i === selectedMonthIndex
						return (
							<TouchableOpacity
								key={i}
								style={styles.barWrapper}
								onPress={() => handleBarPress(i)}
							>
								<View
									style={[
										styles.bar,
										{
											height: val * 8,
											backgroundColor: isSelected ? '#FF6F61' : '#999',
										},
									]}
								/>
								<Text
									style={[styles.barLabel, isSelected && { color: '#FF6F61', fontWeight: 'bold' }]}
								>
									{i + 1}
								</Text>
							</TouchableOpacity>
						)
					})}
				</View>

				{!showMonthStats && (
					<>
						<Text style={styles.sectionTitle}>Общая статистика за год</Text>
						<View style={styles.statsContainer}>
							<View style={styles.statCard}>
								<Text style={styles.statValue}>{streak}</Text>
								<Text style={styles.statLabel}>Серия</Text>
							</View>
							<View style={styles.statCard}>
								<Text style={styles.statValue}>{accuracy}%</Text>
								<Text style={styles.statLabel}>Точность</Text>
							</View>
							<View style={styles.statCard}>
								<Text style={styles.statValue}>{Math.floor(time / 60)} мин</Text>
								<Text style={styles.statLabel}>Время</Text>
							</View>
							<View style={styles.statCard}>
								<Text style={styles.statValue}>{xp}</Text>
								<Text style={styles.statLabel}>XP</Text>
							</View>
							<View style={styles.statCard}>
								<Text style={styles.statValue}>{lessons}</Text>
								<Text style={styles.statLabel}>Уроков</Text>
							</View>
							<View style={styles.statCard}>
								<Text style={styles.statValue}>{mistakes}</Text>
								<Text style={styles.statLabel}>Ошибок</Text>
							</View>
						</View>
					</>
				)}

				{showMonthStats && barMonthStatsContent}
			</View>
		)
	}

	// Переключатель вкладок
	let content
	if (activeTab === 'month') {
		content = renderMonthTab()
	} else {
		content = renderYearTab()
	}

	return (
		<View style={styles.container}>
			{/* === HEADER === */}
			<View style={styles.headerContainer}>
				{/* GoBack Button (слева) */}
				<TouchableOpacity
					style={styles.headerLeft}
					onPress={() => navigation.goBack()}
				>
					<Ionicons
						name='chevron-back'
						size={30}
						color='#007AFF'
					/>
				</TouchableOpacity>
				{/* Title (по центру) */}
				<Text style={styles.headerTitle}>Аналитика</Text>

				{/* Кнопка ? (справа) */}
				<TouchableOpacity
					style={styles.headerRight}
					onPress={() => {
						// к примеру, открыть модалку help
						navigation.navigate('InfoAnalyticsPage')
					}}
				>
					<Ionicons
						name='help-circle'
						size={30}
						color='red'
					/>
				</TouchableOpacity>
			</View>

			{/* Табы */}
			<View style={styles.tabsContainer}>
				{(['month', 'year'] as const).map(t => {
					const isActive = t === activeTab
					return (
						<TouchableOpacity
							key={t}
							style={[styles.tabItem, isActive && styles.tabItemActive]}
							onPress={() => setActiveTab(t)}
						>
							<Text style={[styles.tabText, isActive && styles.tabTextActive]}>
								{t === 'month' ? 'Месяц' : 'Год'}
							</Text>
						</TouchableOpacity>
					)
				})}
			</View>

			<ScrollView style={{ padding: 16 }}>{content}</ScrollView>

			{/* Модалка года (если нужно) */}
			<Modal
				transparent
				visible={selectedYearModal}
				animationType='slide'
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContainer}>
						<Text style={styles.modalTitle}>Выберите год</Text>
						{availableYears.map(y => (
							<TouchableOpacity
								key={y.key}
								style={styles.modalItem}
								onPress={() => {
									setSelectedYearKey(y.key)
									setSelectedYearModal(false)
									setSelectedMonthIndex(null)
									setSelectedBarMonthKey(null)
								}}
							>
								<Text
									style={{
										fontSize: 16,
										color: y.key === selectedYearKey ? '#FF6F61' : '#333',
									}}
								>
									{y.label}
								</Text>
							</TouchableOpacity>
						))}
						<TouchableOpacity
							style={styles.closeBtn}
							onPress={() => setSelectedYearModal(false)}
						>
							<Text style={{ color: '#FFF' }}>Закрыть</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	)
}

export default AnalyticsScreen

// ===== Стили =====
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFF',
	},
	headerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 50,
		paddingHorizontal: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#EEE',
		marginTop: 45, // или SafeAreaView / etc
		marginBottom: 20,
	},
	headerLeft: {
		position: 'absolute',
		left: 10,
	},
	headerRight: {
		position: 'absolute',
		right: 10,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#333',
	},

	tabsContainer: {
		flexDirection: 'row',
		margin: 16,
		borderRadius: 8,
		overflow: 'hidden',
	},
	tabItem: {
		flex: 1,
		padding: 12,
		alignItems: 'center',
		backgroundColor: '#F0F0F0',
	},
	tabItemActive: {
		backgroundColor: '#FF6F61',
	},
	tabText: {
		color: '#333',
		fontWeight: '500',
	},
	tabTextActive: {
		color: '#FFF',
		fontWeight: 'bold',
	},

	card: {
		backgroundColor: '#FFF',
		height: 720,
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
	},
	rowBetween: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#007AFF',
		marginVertical: 10,
	},
	barChart: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'space-evenly',
		height: 250,
		marginBottom: 20,
		borderBottomWidth: 1,
		borderColor: '#EEE',
		paddingBottom: 10,
		marginTop: 50,
	},
	barWrapper: {
		alignItems: 'center',
	},
	bar: {
		width: 26,
		borderRadius: 4,
		marginBottom: 4,
	},
	barLabel: {
		marginTop: 10,
		fontSize: 14,
		color: '#333',
	},
	selectBtn: {
		flexDirection: 'row',
		backgroundColor: '#F0F0F0',
		borderRadius: 6,
		paddingHorizontal: 10,
		paddingVertical: 6,
		alignItems: 'center',
	},
	dayContainer: {
		width: 32,
		height: 32,
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
	dayText: {
		fontSize: 14,
		fontWeight: 'bold',
	},
	statsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	statCard: {
		width: '48%',
		backgroundColor: '#F8F8F8',
		borderRadius: 8,
		padding: 10,
		margin: '1%',
		alignItems: 'center',
	},
	statValue: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#333',
	},
	statLabel: {
		fontSize: 12,
		color: '#666',
		marginTop: 4,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.4)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContainer: {
		width: '80%',
		backgroundColor: '#FFF',
		borderRadius: 10,
		padding: 16,
	},
	modalTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 12,
		color: '#333',
	},
	modalItem: {
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderColor: '#EEE',
	},
	closeBtn: {
		marginTop: 16,
		backgroundColor: '#FF6F61',
		borderRadius: 6,
		paddingVertical: 10,
		alignItems: 'center',
	},
})
