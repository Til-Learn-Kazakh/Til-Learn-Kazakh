import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { imageserver } from '../../../core/config/environment.config'
import { icons } from '../../../core/constants'
import { useBottomSheet } from '../../../core/hooks/useBottomSheet'
import { useAchievementsProgress } from '../../achievements/hooks/achievements.hooks'
import { useCurrentUser } from '../../auth/hooks/user-current-user.hook'
import { InfoBottomSheet } from '../../home/components/InfoBottomSheet'
import { useYearlyStats } from '../hooks/analytics.hooks'

import { avatars } from './AvatarPickerPage'

const ProfileScreen = () => {
	const { t, i18n } = useTranslation()
	const navigation = useNavigation<NavigationProp<any>>()

	const { data: currentUser } = useCurrentUser()
	const [selectedYearKey, setSelectedYearKey] = useState(() => new Date().getFullYear().toString())
	const selectedAvatar = avatars.find(a => a.id === currentUser?.avatar)

	// Данные по достижениям
	const {
		data: achievements,
		isLoading: isLoadingAchievements,
		isError: isAchievementsError,
	} = useAchievementsProgress()

	// Данные по статистике
	const { data: yearlyData } = useYearlyStats(selectedYearKey)

	const bottomSheet = useBottomSheet()

	const onCloseTopSheet = useCallback(() => {
		bottomSheet.collapse()
	}, [bottomSheet])

	const topSheetContent = useMemo(
		() => <InfoBottomSheet onClose={onCloseTopSheet} />,
		[onCloseTopSheet]
	)

	const onOpenTopSheet = useCallback(() => {
		bottomSheet.snapToIndex({
			renderContent: () => topSheetContent,
			index: 0,
			snapPoints: ['70%', '75%'],
		})
	}, [bottomSheet, topSheetContent])

	// Локаль для форматирования даты
	const locale = i18n.language === 'ru' ? 'ru-RU' : 'en-US'
	const joinDate = currentUser?.created_at
		? new Date(currentUser.created_at).toLocaleDateString(locale, {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})
		: t('PROFILE.JOINED_UNKNOWN')

	// Загружается или упала ошибка — можно отрисовать лоадер/заглушку
	// Но при желании можно просто не показывать карточку, если нет достижений
	if (isLoadingAchievements && !achievements) {
		// Можно возвращать <LoadingUi /> или что-то подобное
	}

	// Подготовим первые 3 достижения, чтобы отобразить их иконки
	const firstThree = achievements?.slice(0, 3) || []
	// Сколько *осталось* вне первых трёх
	const remainCount = achievements?.length || 0

	// Для удобства
	const topLeft = firstThree[0]
	const topRight = firstThree[1]
	const bottomLeft = firstThree[2]

	return (
		<View style={styles.container}>
			{/* ---------- HEADER ---------- */}
			<View style={styles.header}>
				<Text style={styles.headerTitle}>{t('PROFILE.HEADER_TITLE')}</Text>
				<TouchableOpacity
					style={styles.settingsButton}
					onPress={() => navigation.navigate('Settings')}
				>
					<Ionicons
						name='settings-outline'
						size={28}
						color='#007AFF'
					/>
				</TouchableOpacity>
			</View>

			<ScrollView contentContainerStyle={styles.scrollContainer}>
				{/* ---------- PROFILE SECTION ---------- */}
				<View style={styles.profileSection}>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('AvatarPickerPage', { selectedAvatarId: currentUser?.avatar })
						}}
					>
						<Image
							source={selectedAvatar?.img || icons.parrot}
							style={styles.avatar}
						/>
					</TouchableOpacity>
					<Text style={styles.username}>{currentUser?.first_name}</Text>
					<Text style={styles.userTag}>
						{t('PROFILE.JOINED')}
						{joinDate}
					</Text>
				</View>

				{/* ---------- OVERVIEW SECTION (Hearts / XP / Diamonds) ---------- */}
				<View style={styles.overviewSection}>
					<View style={styles.overviewItem}>
						<Image
							source={icons.heart}
							style={styles.overviewIcon}
						/>
						<Text style={styles.overviewValue}>{currentUser?.hearts}</Text>
						<Text style={styles.overviewLabel}>{t('PROFILE.HEARTS')}</Text>
					</View>

					<View style={styles.overviewItem}>
						<Image
							source={icons.light}
							style={styles.overviewIcon}
						/>
						<Text style={styles.overviewValue}>{currentUser?.xp}</Text>
						<Text style={styles.overviewLabel}>{t('PROFILE.XP')}</Text>
					</View>

					<View style={styles.overviewItem}>
						<Image
							source={icons.diamond}
							style={styles.overviewIcon}
						/>
						<Text style={styles.overviewValue}>{currentUser?.crystals}</Text>
						<Text style={styles.overviewLabel}>{t('PROFILE.DIAMONDS')}</Text>
					</View>
				</View>

				{/* ---------- STREAK & ACHIEVEMENTS CARD ---------- */}
				<View style={styles.cardsContainer}>
					{/* Streak Card */}
					<TouchableOpacity
						style={styles.squareCard}
						onPress={() => onOpenTopSheet()}
					>
						<Text style={styles.cardTitle}>{t('PROFILE.STREAK')}</Text>
						<View style={styles.streakContainer}>
							<Image
								source={
									(currentUser?.streak?.current_streak ?? 0) < 1
										? icons.profilestreak
										: icons.sunfire
								}
								style={styles.streakIcon}
							/>
							<Text style={styles.streakCount}>{currentUser?.streak?.current_streak ?? 0}</Text>
						</View>
					</TouchableOpacity>

					{/* Achievements Card */}
					<TouchableOpacity
						style={styles.squareCard}
						onPress={() => {
							// При нажатии передаем достижения в AchievementsScreen
							navigation.navigate('AchievementsScreen', { achievements })
						}}
					>
						<Text style={styles.cardTitle}>{t('PROFILE.ACHIEVEMENTS')}</Text>

						{/* 2×2 СЕТКА */}
						<View style={styles.cardGrid}>
							<View style={styles.row}>
								{topLeft ? (
									<Image
										source={{ uri: imageserver + topLeft.image_url }}
										style={styles.achievementIcon}
									/>
								) : (
									<View style={styles.placeholder} />
								)}

								{topRight ? (
									<Image
										source={{ uri: imageserver + topRight.image_url }}
										style={styles.achievementIcon}
									/>
								) : (
									<View style={styles.placeholder} />
								)}
							</View>

							<View style={styles.row}>
								{bottomLeft ? (
									<Image
										source={{ uri: imageserver + bottomLeft.image_url }}
										style={styles.achievementIcon}
									/>
								) : (
									<View style={styles.placeholder} />
								)}

								{/* Если остались ещё достижения – показываем +N */}
								{remainCount > 0 ? (
									<View style={styles.moreCircle}>
										<Text style={styles.moreText}>+{remainCount}</Text>
									</View>
								) : (
									<View style={styles.placeholder} />
								)}
							</View>
						</View>
					</TouchableOpacity>
				</View>

				{/* ---------- STATISTICS SECTION ---------- */}
				<TouchableOpacity
					onPress={() => navigation.navigate('AnalyticsScreen')}
					style={styles.statsContainer}
				>
					<View style={styles.statItem}>
						<Ionicons
							name='time-outline'
							size={24}
							color='#009688'
						/>
						<Text style={styles.statValue}>
							{yearlyData ? `${Math.floor(yearlyData.time / 60)} ${t('PROFILE.MIN')}` : '-'}
						</Text>
						<Text style={styles.statLabel}>{t('PROFILE.TIME_LEARNING')}</Text>
					</View>

					<View style={styles.statItem}>
						<Ionicons
							name='school-outline'
							size={24}
							color='#7C4DFF'
						/>
						<Text style={styles.statValue}>{yearlyData ? yearlyData.lessons : '-'}</Text>
						<Text style={styles.statLabel}>{t('PROFILE.LESSONS_COMPLETED')}</Text>
					</View>

					<View style={styles.statItem}>
						<Ionicons
							name='stats-chart-outline'
							size={24}
							color='#E91E63'
						/>
						<Text style={styles.statValue}>{yearlyData ? `${yearlyData.accuracy} %` : '-'}</Text>
						<Text style={styles.statLabel}>{t('PROFILE.ACCURACY')}</Text>
					</View>
				</TouchableOpacity>
			</ScrollView>
		</View>
	)
}

export default ProfileScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5F5F5',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingTop: 60,
		paddingBottom: 10,
		backgroundColor: '#F5F5F5',
		borderBottomColor: '#ddd',
	},
	headerTitle: {
		fontSize: 35,
		fontWeight: 'bold',
		color: '#000',
		marginLeft: 10,
	},
	settingsButton: {
		padding: 5,
	},
	scrollContainer: {
		padding: 16,
		minHeight: 800,
	},
	profileSection: {
		marginTop: 20,
		alignItems: 'center',
		marginBottom: 30,
	},
	avatar: {
		width: 110,
		height: 110,
		borderRadius: 60,
	},
	username: {
		fontSize: 24,
		fontWeight: 'bold',
		marginTop: 12,
	},
	userTag: {
		marginTop: 5,
		fontSize: 16,
		color: '#777',
		fontStyle: 'italic',
	},

	// Hearts / XP / Diamonds
	overviewSection: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#fff',
		padding: 16,
		borderRadius: 12,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 3,
		marginBottom: 25,
	},
	overviewItem: {
		alignItems: 'center',
		flex: 1,
	},
	overviewIcon: {
		width: 40,
		height: 40,
		marginBottom: 8,
	},
	overviewValue: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000',
	},
	overviewLabel: {
		fontSize: 12,
		color: '#777',
	},

	// Two cards: Streak & Achievements
	cardsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 25,
	},
	squareCard: {
		width: '46%',
		aspectRatio: 1,
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 12,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 3,
		alignItems: 'center',
	},
	cardTitle: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#000',
		marginBottom: 10,
	},
	streakContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 20,
	},
	streakIcon: {
		width: 80,
		height: 80,
		marginRight: 10,
	},
	streakCount: {
		fontSize: 50,
		fontWeight: 'bold',
		color: '#000',
	},

	// 2×2 grid для первых достижений
	cardGrid: {
		width: '100%',
		justifyContent: 'center',
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 5,
	},
	achievementIcon: {
		width: 50,
		height: 50,
		margin: 4,
		borderRadius: 25,
	},
	placeholder: {
		width: 50,
		height: 50,
		margin: 4,
		borderRadius: 25,
		backgroundColor: '#DDD',
	},
	moreCircle: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: '#E0E0E0',
		alignItems: 'center',
		justifyContent: 'center',
		margin: 4,
	},
	moreText: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#666',
	},

	// Stats
	statsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		backgroundColor: '#fff',
		padding: 16,
		borderRadius: 12,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 3,
	},
	statItem: {
		alignItems: 'center',
		flex: 1,
	},
	statValue: {
		fontSize: 18,
		fontWeight: 'bold',
		marginTop: 5,
		textAlign: 'center',
	},
	statLabel: {
		fontSize: 12,
		color: '#777',
		textAlign: 'center',
	},
})
