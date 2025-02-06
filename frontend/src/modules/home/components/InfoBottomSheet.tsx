import React, { useCallback, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'

import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { icons } from '../../../core/constants'
import { LoadingUi } from '../../../core/ui/LoadingUi'
import { useStreak } from '../hooks/home.hooks'

LocaleConfig.locales['en'] = {
	monthNames: [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	],
	dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
}
LocaleConfig.defaultLocale = 'en'

export const InfoBottomSheet = ({ onClose }: any) => {
	const navigation = useNavigation<NavigationProp<any>>()

	const [selectedDate, setSelectedDate] = useState<string | null>(null)
	const { data: streak, isPending } = useStreak()
	const onCloseClick = useCallback(() => {
		onClose()
	}, [onClose])

	const handleInfoPress = useCallback(() => {
		onClose()
		setTimeout(() => {
			navigation.navigate('AppStack', {
				screen: 'HomeStack',
				params: {
					screen: 'InfoPage',
				},
			})
		}, 300)
	}, [onClose, navigation])

	const markedDates = streak?.streak_days.reduce((acc: any, day: any) => {
		acc[day] = {
			customStyles: {
				container: { backgroundColor: '#FFD700' },
				text: { color: '#333333', fontWeight: 'bold' },
			},
		}
		return acc
	}, {})

	if (selectedDate) {
		markedDates[selectedDate] = {
			selected: true,
			selectedColor: '#0076CE',
			selectedTextColor: '#ffffff',
		}
	}
	if (isPending) {
		return <LoadingUi />
	}

	return (
		<BottomSheetScrollView
			style={styles.container}
			contentContainerStyle={styles.contentContainer}
		>
			<View style={styles.header}>
				<TouchableOpacity
					onPress={handleInfoPress}
					style={styles.infoButton}
				>
					<Image
						source={icons.information}
						style={styles.infoIcon}
					/>
				</TouchableOpacity>
			</View>

			{/* Информация о streak */}
			<View style={styles.streakHeader}>
				<View style={styles.streakCountContainer}>
					<Text style={styles.streakCount}>{streak?.current_streak}</Text>
					<Image
						source={streak?.current_streak > 0 ? icons.fire : icons.grayfire}
						style={styles.largeFireIcon}
					/>
					<Text style={styles.streakLabel}>days streak</Text>
				</View>
				<Text style={styles.recordText}>Record Streak: {streak?.max_streak} days</Text>
			</View>

			<View style={styles.calendarContainer}>
				<Calendar
					markedDates={markedDates}
					onDayPress={(day: any) => setSelectedDate(day.dateString)}
					markingType='custom'
					theme={{
						todayTextColor: '#4CAF50',
						arrowColor: '#0076CE',
						textDayFontWeight: 'bold',
						textMonthFontWeight: 'bold',
					}}
				/>
			</View>

			<TouchableOpacity
				onPress={onCloseClick}
				style={styles.cancelButton}
			>
				<Text style={styles.cancelButtonText}>Close</Text>
			</TouchableOpacity>
		</BottomSheetScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
		paddingHorizontal: 16,
	},
	contentContainer: {
		paddingBottom: 30,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 6,
	},
	infoButton: {
		padding: 3,
		borderRadius: 8,
	},
	infoIcon: {
		width: 24,
		height: 24,
	},
	streakHeader: {
		alignItems: 'center',
		marginBottom: 14,
	},
	streakCountContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	largeFireIcon: {
		width: 42,
		height: 42,
		marginHorizontal: 8,
	},
	streakCount: {
		fontSize: 42,
		fontWeight: 'bold',
		color: 'orange',
	},
	streakLabel: {
		fontSize: 28,
		color: '#333333',
	},
	recordText: {
		fontSize: 19,
		color: '#555555',
	},
	calendarContainer: {
		marginTop: 5,
	},
	cancelButton: {
		backgroundColor: '#0076CE',
		borderRadius: 8,
		padding: 12,
		marginTop: 16,
		alignItems: 'center',
	},
	cancelButtonText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#fff',
	},
})
