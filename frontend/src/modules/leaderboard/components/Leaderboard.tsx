import React, { useRef, useState } from 'react'
import {
	FlatList,
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import Svg, { Path } from 'react-native-svg'

// пример

import { LoadingUi } from '../../../core/ui/LoadingUi'
import { useCurrentUser } from '../../auth/hooks/user-current-user.hook'
import {
	useAllTimeLeaderboard,
	useMonthlyLeaderboard,
	useWeeklyLeaderboard,
} from '../hooks/leaderboard.hooks'

export default function LeaderboardScreen() {
	// Табы: week | month | All Time
	const [activeTab, setActiveTab] = useState<'week' | 'month' | 'All Time'>('week')

	// Получаем данные текущего юзера
	const { data: currentUser } = useCurrentUser()

	// В зависимости от tab, получаем разные данные
	const { data: weeklyData, isLoading: isLoadingWeek, error: weekError } = useWeeklyLeaderboard()

	const {
		data: monthlyData,
		isLoading: isLoadingMonth,
		error: monthError,
	} = useMonthlyLeaderboard()

	const { data: allTimeData, isLoading: isLoadingAll, error: allError } = useAllTimeLeaderboard()

	// Выбираем массив для текущего таба
	let rawData: any[] = []
	let isLoading = false
	let error: any = null

	if (activeTab === 'week') {
		rawData = weeklyData || []
		isLoading = isLoadingWeek
		error = weekError
	} else if (activeTab === 'month') {
		rawData = monthlyData || []
		isLoading = isLoadingMonth
		error = monthError
	} else {
		rawData = allTimeData || []
		isLoading = isLoadingAll
		error = allError
	}

	// Если бэкенд возвращает ( _id, first_name, weekly_xp, monthly_xp, xp, avatar? )
	// Нам нужно привести к единому виду:
	// {
	//   id: string
	//   name: string
	//   stars: number   <-- например weekly_xp / monthly_xp / xp
	//   avatar: string
	//   position: number
	// }
	// Ниже - пример маппинга:
	const mappedData = rawData.map((user, idx) => {
		const rank = idx + 1 // место в общем списке, т.к. отсортированы
		return {
			id: user._id,
			name: user.first_name || 'Unknown',
			stars:
				activeTab === 'week' ? user.weekly_xp : activeTab === 'month' ? user.monthly_xp : user.xp, // all-time
			avatar: user.avatar || 'https://picsum.photos/200', // если у вас есть поле user.avatar
			position: rank,
		}
	})

	// Делим на topThree / rest
	const topThree = mappedData.slice(0, 3)
	const rest = mappedData.slice(3)

	// Состояние: виден ли текущий пользователь?
	const [userVisible, setUserVisible] = useState(false)

	// Если в базе нет currentUser или user._id не совпадает
	// возможно, не показываем футер
	const currentUserId = currentUser?.id

	// Callback "какие items видны"
	const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
		if (!currentUserId) return
		const isUserInView = viewableItems.some(({ item }: any) => item.id === currentUserId)
		setUserVisible(isUserInView)
	}).current

	// viewabilityConfig
	const viewabilityConfig = { itemVisiblePercentThreshold: 50 }

	if (isLoading) {
		return <LoadingUi />
	}

	if (error) {
		return (
			<SafeAreaView style={styles.safeArea}>
				<Text>Error loading {activeTab} Leaderboard</Text>
			</SafeAreaView>
		)
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				{/* Заголовок */}
				<View style={styles.headerContainer}>
					<Text style={styles.headerTitle}>Leaderboard</Text>
				</View>

				{/* Табы */}
				<View style={styles.tabsContainer}>
					<TouchableOpacity
						onPress={() => setActiveTab('week')}
						style={[styles.tabButton, activeTab === 'week' && styles.tabButtonActive]}
					>
						<Text style={[styles.tabText, activeTab === 'week' && styles.tabTextActive]}>Week</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setActiveTab('month')}
						style={[styles.tabButton, activeTab === 'month' && styles.tabButtonActive]}
					>
						<Text style={[styles.tabText, activeTab === 'month' && styles.tabTextActive]}>
							Month
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setActiveTab('All Time')}
						style={[styles.tabButton, activeTab === 'All Time' && styles.tabButtonActive]}
					>
						<Text style={[styles.tabText, activeTab === 'All Time' && styles.tabTextActive]}>
							All Time
						</Text>
					</TouchableOpacity>
				</View>

				{/* Волна + Top-3 */}
				<View style={styles.waveContainer}>
					<Svg
						width='100%'
						height='100%'
						viewBox='0 0 1440 320'
						style={StyleSheet.absoluteFill}
					>
						<Path
							fill='#697CFF'
							d='M0,96L30,85.3C60,75,120,53,180,64C240,75,300,117,360,144C420,171,480,181,540,170.7C600,160,660,128,720,138.7C780,149,840,203,900,213.3C960,224,1020,192,1080,192C1140,192,1200,224,1260,208C1320,192,1380,128,1410,96L1440,64L1440,320L0,320Z'
						/>
					</Svg>
					<View style={styles.topThreeWrapper}>
						{/* #2 */}
						{topThree[1] ? (
							<View style={styles.topItem}>
								<Image
									source={{ uri: topThree[1].avatar }}
									style={styles.topAvatarSm}
								/>
								<Text style={styles.topPosition}>2</Text>
								<Text style={styles.topName}>{topThree[1].name}</Text>
								<Text style={styles.topStars}>⭐ {topThree[1].stars}</Text>
							</View>
						) : (
							<View style={styles.topItem}>
								<Text style={styles.topPosition}>--</Text>
								<Text style={styles.topName}>No user</Text>
							</View>
						)}

						{/* #1 */}
						{topThree[0] ? (
							<View style={styles.topItemCenter}>
								<Text style={styles.crownIcon}>👑</Text>
								<Image
									source={{ uri: topThree[0].avatar }}
									style={styles.topAvatarLg}
								/>
								<Text style={styles.topPosition}>1</Text>
								<Text style={styles.topName}>{topThree[0].name}</Text>
								<Text style={styles.topStars}>⭐ {topThree[0].stars}</Text>
							</View>
						) : (
							<View style={styles.topItemCenter}>
								<Text style={styles.topPosition}>--</Text>
								<Text style={styles.topName}>No user</Text>
							</View>
						)}

						{/* #3 */}
						{topThree[2] ? (
							<View style={styles.topItem}>
								<Image
									source={{ uri: topThree[2].avatar }}
									style={styles.topAvatarSm}
								/>
								<Text style={styles.topPosition}>3</Text>
								<Text style={styles.topName}>{topThree[2].name}</Text>
								<Text style={styles.topStars}>⭐ {topThree[2].stars}</Text>
							</View>
						) : (
							<View style={styles.topItem}>
								<Text style={styles.topPosition}>--</Text>
								<Text style={styles.topName}>No user</Text>
							</View>
						)}
					</View>
				</View>

				{/* Остальные */}
				<View style={styles.restContainer}>
					<FlatList
						data={rest}
						keyExtractor={item => item.id}
						renderItem={({ item }) => {
							const isMe = currentUserId ? item.id === currentUserId : false
							return (
								<View style={[styles.listItem, isMe && styles.meRow]}>
									<Text style={styles.listPosition}>{item.position}</Text>
									<Image
										source={{ uri: item.avatar }}
										style={styles.listAvatar}
									/>
									<Text style={styles.listName}>{item.name}</Text>
									<Text style={styles.listStars}>⭐ {item.stars}</Text>
								</View>
							)
						}}
						contentContainerStyle={{ paddingBottom: 80 }}
						onViewableItemsChanged={onViewableItemsChanged}
						viewabilityConfig={viewabilityConfig}
					/>
				</View>

				{/* Фиксированный футер, показываем если user в базе + он не виден */}
				{currentUser && !userVisible && !topThree.some(user => user.id === currentUserId) && (
					<View style={styles.stickyFooter}>
						<View style={[styles.listItem, styles.meRow]}>
							{/* Находим его позицию */}
							<Text style={styles.listPosition}>
								{mappedData.findIndex(u => u.id === currentUserId) + 1 || '--'}
							</Text>
							<Image
								source={{ uri: currentUser.avatar || 'https://picsum.photos/200' }}
								style={styles.listAvatar}
							/>
							<Text style={styles.listName}>{currentUser.first_name}</Text>
							<Text style={styles.listStars}>
								⭐{' '}
								{activeTab === 'week'
									? currentUser.weekly_xp
									: activeTab === 'month'
										? currentUser.monthly_xp
										: currentUser.xp}
							</Text>
						</View>
					</View>
				)}
			</View>
		</SafeAreaView>
	)
}

// ----- Стили из вашего примера (без изменений) ------
const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#697CFF',
	},
	container: {
		flex: 1,
		backgroundColor: '#697CFF',
	},
	headerContainer: {
		paddingVertical: 12,
		alignItems: 'center',
	},
	headerTitle: {
		color: '#fff',
		fontSize: 22,
		fontWeight: 'bold',
	},
	tabsContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
	tabButton: {
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#fff',
		paddingVertical: 6,
		paddingHorizontal: 16,
		marginHorizontal: 4,
	},
	tabButtonActive: {
		backgroundColor: '#fff',
	},
	tabText: {
		color: '#fff',
		fontWeight: '600',
	},
	tabTextActive: {
		color: '#697CFF',
	},
	waveContainer: {
		width: '100%',
		height: 120,
	},
	topThreeWrapper: {
		position: 'absolute',
		bottom: -40,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	topItem: {
		alignItems: 'center',
	},
	topItemCenter: {
		alignItems: 'center',
	},
	crownIcon: {
		position: 'absolute',
		top: -24,
		fontSize: 24,
	},
	topAvatarSm: {
		width: 60,
		height: 60,
		borderRadius: 30,
		borderWidth: 2,
		borderColor: '#fff',
	},
	topAvatarLg: {
		width: 80,
		height: 80,
		borderRadius: 40,
		borderWidth: 2,
		borderColor: '#fff',
	},
	topPosition: {
		marginTop: 4,
		fontSize: 20,
		fontWeight: '600',
		color: '#333',
	},
	topName: {
		fontWeight: 'bold',
		fontSize: 16,
		color: '#fff',
	},
	topStars: {
		fontSize: 14,
		color: '#fff',
	},
	restContainer: {
		flex: 1,
		marginTop: 60,
		backgroundColor: '#f9f9f9',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingTop: 8,
	},
	listItem: {
		backgroundColor: '#fff',
		marginHorizontal: 16,
		marginVertical: 6,
		borderRadius: 10,
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		elevation: 1,
		shadowColor: '#000',
		shadowOpacity: 0.08,
		shadowRadius: 2,
		shadowOffset: { width: 0, height: 1 },
	},
	listPosition: {
		width: 30,
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		textAlign: 'center',
	},
	listAvatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginHorizontal: 8,
	},
	listName: {
		flex: 1,
		fontSize: 15,
		color: '#222',
	},
	listStars: {
		fontSize: 15,
		fontWeight: '600',
		color: '#697CFF',
	},
	meRow: {
		backgroundColor: '#dceeff',
	},
	stickyFooter: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		paddingHorizontal: 6,
		paddingVertical: 10,
		marginBottom: 50,
		backgroundColor: '#f9f9f9',
	},
})
