import React, { useEffect } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { icons } from '../../../core/constants'
import { LoadingUi } from '../../../core/ui/LoadingUi'
import { useStreak } from '../../home/hooks/home.hooks'

const StreakTracker = () => {
	const navigation = useNavigation<NavigationProp<any>>()

	// ✅ Fetch streak data from backend
	const { data: streakData, isPending } = useStreak()

	// ✅ Days of the week mapping
	const days: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

	// ✅ Ensure data is properly formatted
	const weekStreak = streakData?.week || [false, false, false, false, false, false, false]

	const currentStreak = streakData?.current_streak || 0

	const todayIndex = new Date().getDay()
	const hasStreakToday = weekStreak[todayIndex]

	//Если streak уже получен сегодня → отправляем сразу в Home
	useEffect(() => {
		if (hasStreakToday) {
			navigation.reset({
				index: 0,
				routes: [{ name: 'Home' }],
			})
		}
	}, [hasStreakToday, navigation])

	// ✅ Handle loading state
	if (isPending) {
		return <LoadingUi />
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Day {currentStreak + 1} of your streak</Text>
				<Text style={styles.subtitle}>starts tomorrow!</Text>
			</View>

			{/* Streak Animation */}
			<Image
				source={icons.completedstreak}
				style={styles.image}
			/>

			{/* Week Progress Tracker */}
			<View style={styles.weekContainer}>
				{days.map((day, index) => (
					<View
						key={day}
						style={styles.dayItem}
					>
						<Text style={[styles.dayText, weekStreak[index] && styles.highlightedText]}>{day}</Text>
						<View style={[styles.dayCircle, weekStreak[index] && styles.highlightedCircle]}>
							{weekStreak[index] && (
								<Ionicons
									name='checkmark'
									size={23}
									color='#fff'
								/>
							)}
						</View>
					</View>
				))}
			</View>

			{/* Tip Message */}
			<Text style={styles.tip}>
				Tip: Your streak will reset if you don't practice tomorrow. Watch out!
			</Text>

			{/* Continue Button */}
			<TouchableOpacity
				onPress={() => {
					navigation.reset({
						index: 0,
						routes: [{ name: 'Home' }],
					})
				}}
				style={styles.button}
			>
				<Text style={styles.buttonText}>CONTINUE</Text>
			</TouchableOpacity>
		</View>
	)
}

export default StreakTracker

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: '#fff',
		paddingTop: 120,
		paddingHorizontal: 20,
	},
	header: {
		alignItems: 'center',
		marginBottom: 10,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
		color: '#000',
	},
	subtitle: {
		fontSize: 22,
		fontWeight: '600',
		textAlign: 'center',
		color: '#666',
		marginTop: 5,
	},
	image: {
		width: 200,
		height: 200,
		marginVertical: 20,
		resizeMode: 'contain',
	},
	weekContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 15,
	},
	dayItem: {
		alignItems: 'center',
		marginHorizontal: 7,
	},
	dayText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#ccc',
	},
	highlightedText: {
		color: '#ff9900',
	},
	dayCircle: {
		width: 35,
		height: 35,
		borderRadius: 18,
		backgroundColor: '#eee',
		marginTop: 5,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 2,
		borderColor: 'transparent',
	},
	highlightedCircle: {
		backgroundColor: '#ff9900',
		borderColor: '#ff9900',
	},
	tip: {
		fontSize: 16,
		textAlign: 'center',
		color: '#555',
		marginBottom: 30,
		paddingHorizontal: 20,
	},
	button: {
		backgroundColor: '#0286FF',
		height: 50,
		padding: 15,
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		width: '100%',
		marginBottom: 10,
		position: 'absolute',
		bottom: 30,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	loaderContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
	},
})
