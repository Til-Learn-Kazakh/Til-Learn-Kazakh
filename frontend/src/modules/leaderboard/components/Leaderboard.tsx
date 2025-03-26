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

import { Ionicons } from '@expo/vector-icons'
// пример

import { NavigationProp, useNavigation } from '@react-navigation/native'

import { icons } from '../../../core/constants'
import { LoadingUi } from '../../../core/ui/LoadingUi'
import { useCurrentUser } from '../../auth/hooks/user-current-user.hook'
import { avatars } from '../../profile/components/AvatarPickerPage'
import {
	useAllTimeLeaderboard,
	useMonthlyLeaderboard,
	useWeeklyLeaderboard,
} from '../hooks/leaderboard.hooks'

export default function LeaderboardScreen() {
	const [activeTab, setActiveTab] = useState<'week' | 'month' | 'All Time'>('week')
	const navigation = useNavigation<NavigationProp<any>>()
	const { data: currentUser } = useCurrentUser()
	const selectedAvatar = avatars.find(a => a.id === currentUser?.avatar)
	const { data: weeklyData, isLoading: isLoadingWeek, error: weekError } = useWeeklyLeaderboard()

	const {
		data: monthlyData,
		isLoading: isLoadingMonth,
		error: monthError,
	} = useMonthlyLeaderboard()

	const { data: allTimeData, isLoading: isLoadingAll, error: allError } = useAllTimeLeaderboard()

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

	const mappedData = rawData.map((user, idx) => {
		const rank = idx + 1
		const matchedAvatar = avatars.find(a => a.id === user?.avatar) ?? null

		return {
			id: user._id,
			name: user.first_name || 'Unknown',
			stars:
				activeTab === 'week' ? user.weekly_xp : activeTab === 'month' ? user.monthly_xp : user.xp, // all-time
			avatar: matchedAvatar ? matchedAvatar.img : icons.parrot,
			position: rank,
		}
	})
	const topThree = mappedData.slice(0, 3)
	const rest = mappedData.slice(3)
	const [userVisible, setUserVisible] = useState(false)
	const currentUserId = currentUser?.id

	const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
		if (!currentUserId) return
		const isUserInView = viewableItems.some(({ item }: any) => item.id === currentUserId)
		setUserVisible(isUserInView)
	}).current

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
				<View style={styles.headerContainer}>
					<Text style={styles.headerTitle}>Leaderboard</Text>
					<TouchableOpacity
						style={styles.rightButton}
						onPress={() => {
							navigation.navigate('InfoLeaderboardPage')
						}}
					>
						<Ionicons
							name='information-circle-outline'
							size={24}
							color='#fff'
						/>
					</TouchableOpacity>
				</View>

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
									source={topThree[1].avatar}
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
									source={topThree[0].avatar}
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
									source={topThree[2].avatar}
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
										source={item.avatar}
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

				{currentUser && !userVisible && !topThree.some(user => user.id === currentUserId) && (
					<View style={styles.stickyFooter}>
						<View style={[styles.listItem, styles.meRow]}>
							{/* Находим его позицию */}
							<Text style={styles.listPosition}>
								{mappedData.findIndex(u => u.id === currentUserId) + 1 || '--'}
							</Text>
							<Image
								source={selectedAvatar?.img || icons.parrot}
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
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between', // чтобы текст по центру, иконки с краёв
		paddingHorizontal: 16,
		paddingVertical: 8,
		marginTop: 10,
	},
	rightButton: {
		width: 40,
		alignItems: 'flex-end',
	},
	headerTitle: {
		flex: 1, // позволяет занять всю оставшуюся ширину
		textAlign: 'center', // выравниваем текст по центру
		color: '#fff',
		fontSize: 22,
		fontWeight: 'bold',
		marginLeft: 40,
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
