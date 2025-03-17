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

// Демоданные, отсортированные по position
const MOCK_DATA = [
	{ id: '1', name: 'Roy Kapoor', stars: 19800, avatar: 'https://picsum.photos/200?1', position: 1 },
	{ id: '2', name: 'Alicia', stars: 19750, avatar: 'https://picsum.photos/200?2', position: 2 },
	{ id: '3', name: 'Dua', stars: 19600, avatar: 'https://picsum.photos/200?3', position: 3 },
	{ id: '4', name: 'Deepika', stars: 18900, avatar: 'https://picsum.photos/200?4', position: 4 },
	{ id: '5', name: 'Danish', stars: 18602, avatar: 'https://picsum.photos/200?5', position: 5 },
	{ id: '6', name: 'Hania', stars: 18403, avatar: 'https://picsum.photos/200?6', position: 6 },
	{ id: '7', name: 'Luke Gil', stars: 17905, avatar: 'https://picsum.photos/200?7', position: 7 },
	{ id: '8', name: 'User8', stars: 17210, avatar: 'https://picsum.photos/200?8', position: 8 },
	{ id: '9', name: 'User9', stars: 16888, avatar: 'https://picsum.photos/200?9', position: 9 },
	{ id: '10', name: 'User10', stars: 16600, avatar: 'https://picsum.photos/200?10', position: 10 },
	{ id: '11', name: 'User11', stars: 16300, avatar: 'https://picsum.photos/200?11', position: 11 },
	{ id: '12', name: 'User12', stars: 16100, avatar: 'https://picsum.photos/200?12', position: 12 },
	{ id: '13', name: 'User13', stars: 15900, avatar: 'https://picsum.photos/200?13', position: 13 },
	{ id: '14', name: 'User14', stars: 15800, avatar: 'https://picsum.photos/200?14', position: 14 },
	// Пусть ваш userId = '26'
	{ id: '26', name: 'YOU', stars: 9999, avatar: 'https://picsum.photos/200?26', position: 26 },
	{ id: '15', name: 'User15', stars: 15555, avatar: 'https://picsum.photos/200?15', position: 15 },
	{ id: '16', name: 'User16', stars: 15333, avatar: 'https://picsum.photos/200?16', position: 16 },
	// и т.д.
]

export default function LeaderboardScreen() {
	const [activeTab, setActiveTab] = useState<'week' | 'month' | 'All Time'>('week')

	// ID текущего пользователя
	const userId = '26'

	// Находим объект пользователя (пусть будет и в общем списке)
	const currentUser = MOCK_DATA.find(item => item.id === userId)

	// ---------------------
	// 1) Разделяем Top-3
	const topThree = MOCK_DATA.slice(0, 3)
	// Остальные (#4..∞) — включая пользователя, чтобы при скролле его место действительно встретилось
	const rest = MOCK_DATA.slice(3)
	// ---------------------

	// Состояние: виден ли пользователь в списке
	const [userVisible, setUserVisible] = useState(false)

	// Конфигурация видимости:
	//   itemVisiblePercentThreshold = 50 означает,
	//   что элемент считается "visible", если 50% или более его площади
	//   оказалось в видимой зоне FlatList.
	const viewabilityConfig = {
		itemVisiblePercentThreshold: 50,
	}

	// Callback, срабатывающий при изменении списка видимых элементов
	const onViewableItemsChanged = useRef(({ viewableItems }) => {
		// Проверяем, есть ли среди видимых элементов наш userId
		const isUserInView = viewableItems.some(({ item }) => item.id === userId)
		// Обновляем стейт
		setUserVisible(isUserInView)
	}).current

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
						<View style={styles.topItem}>
							<Image
								source={{ uri: topThree[1].avatar }}
								style={styles.topAvatarSm}
							/>
							<Text style={styles.topPosition}>2</Text>
							<Text style={styles.topName}>{topThree[1].name}</Text>
							<Text style={styles.topStars}>⭐ {topThree[1].stars}</Text>
						</View>

						{/* #1 */}
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

						{/* #3 */}
						<View style={styles.topItem}>
							<Image
								source={{ uri: topThree[2].avatar }}
								style={styles.topAvatarSm}
							/>
							<Text style={styles.topPosition}>3</Text>
							<Text style={styles.topName}>{topThree[2].name}</Text>
							<Text style={styles.topStars}>⭐ {topThree[2].stars}</Text>
						</View>
					</View>
				</View>

				{/* Список остальных (#4..∞), ВКЛЮЧАЯ нашего userId (пускай будет на 26 месте) */}
				<View style={styles.restContainer}>
					<FlatList
						data={rest}
						keyExtractor={item => item.id}
						renderItem={({ item }) => {
							// Хотим подсветить нашего пользователя (не обязательно)
							const isMe = item.id === userId
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
						// Чтобы последний элемент не прятался за футером
						contentContainerStyle={{ paddingBottom: 80 }}
						// Настраиваем "видимость"
						onViewableItemsChanged={onViewableItemsChanged}
						viewabilityConfig={viewabilityConfig}
					/>
				</View>

				{/* Фиксированный футер, скрываем если пользователь виден в списке */}
				{!userVisible && currentUser && (
					<View style={styles.stickyFooter}>
						<View style={[styles.listItem, styles.meRow]}>
							<Text style={styles.listPosition}>{currentUser.position}</Text>
							<Image
								source={{ uri: currentUser.avatar }}
								style={styles.listAvatar}
							/>
							<Text style={styles.listName}>{currentUser.name}</Text>
							<Text style={styles.listStars}>⭐ {currentUser.stars}</Text>
						</View>
					</View>
				)}
			</View>
		</SafeAreaView>
	)
}

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
		// Тень
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
