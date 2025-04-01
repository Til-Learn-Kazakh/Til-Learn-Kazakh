import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { icons } from '../../../core/constants'
import { useBottomSheet } from '../../../core/hooks/useBottomSheet'
import { useCurrentUser } from '../../auth/hooks/user-current-user.hook'
import { InfoBottomSheet } from '../../home/components/InfoBottomSheet'
import { useYearlyStats } from '../hooks/analytics.hooks'

import { avatars } from './AvatarPickerPage'

const ProfileScreen = () => {
	const { t, i18n } = useTranslation()
	const navigation = useNavigation<NavigationProp<any>>()

	const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser()
	const [selectedYearKey, setSelectedYearKey] = useState(() => new Date().getFullYear().toString())
	const selectedAvatar = avatars.find(a => a.id === currentUser?.avatar)

	const {
		data: yearlyData,
		isLoading: isYearLoading,
		isError: isYearError,
	} = useYearlyStats(selectedYearKey)

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

	// Use the current language; default to 'en-US' if not Russian.
	const locale = i18n.language === 'ru' ? 'ru-RU' : 'en-US'
	const joinDate = currentUser?.created_at
		? new Date(currentUser.created_at).toLocaleDateString(locale, {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})
		: t('PROFILE.JOINED_UNKNOWN')

	return (
		<View style={styles.container}>
			{/* Fixed Header */}
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
				{/* Profile Section */}
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

				{/* Overview Section */}
				<View style={styles.overviewSection}>
					{/* Heart Item */}
					<View style={styles.overviewItem}>
						<Image
							source={icons.heart}
							style={styles.overviewIcon}
						/>
						<Text style={styles.overviewValue}>{currentUser?.hearts}</Text>
						<Text style={styles.overviewLabel}>{t('PROFILE.HEARTS')}</Text>
					</View>

					{/* XP Item */}
					<View style={styles.overviewItem}>
						<Image
							source={icons.light}
							style={styles.overviewIcon}
						/>
						<Text style={styles.overviewValue}>{currentUser?.xp}</Text>
						<Text style={styles.overviewLabel}>{t('PROFILE.XP')}</Text>
					</View>

					{/* Diamond Item */}
					<View style={styles.overviewItem}>
						<Image
							source={icons.diamond}
							style={styles.overviewIcon}
						/>
						<Text style={styles.overviewValue}>{currentUser?.crystals}</Text>
						<Text style={styles.overviewLabel}>{t('PROFILE.DIAMONDS')}</Text>
					</View>
				</View>

				{/* Streak & Achievements Section */}
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
						onPress={() => navigation.navigate('AchievementsScreen')}
						style={styles.squareCard}
					>
						<Text style={styles.cardTitle}>{t('PROFILE.ACHIEVEMENTS')}</Text>
						<View style={styles.cardGrid}>
							<View style={styles.row}>
								<Image
									source={icons.loseheart}
									style={styles.achievementIcon}
								/>
								<Image
									source={icons.fillblank}
									style={styles.achievementIcon}
								/>
							</View>
							<View style={styles.row}>
								<Image
									source={icons.fillblank}
									style={styles.achievementIcon}
								/>
								<View style={styles.moreCircle}>
									<Text style={styles.moreText}>+10</Text>
								</View>
							</View>
						</View>
					</TouchableOpacity>
				</View>

				{/* Statistics Section */}
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
		marginBottom: 25, // space below the section
	},

	overviewItem: {
		alignItems: 'center',
		flex: 1, // so each overview item evenly spaces out
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
		flex: 1, // Равномерное распределение по ширине
	},
	statValue: {
		fontSize: 18,
		fontWeight: 'bold',
		marginTop: 5,
		textAlign: 'center', // Выравнивание по центру
	},
	statLabel: {
		fontSize: 12,
		color: '#777',
		textAlign: 'center', // Выравнивание по центру
	},
})
