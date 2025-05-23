import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { NavigationProp, useNavigation } from '@react-navigation/native'
import LottieView from 'lottie-react-native'

import { icons, images } from '../../../core/constants'

const LessonCompleteScreen = ({ route }: any) => {
	const { t } = useTranslation()
	const { accuracy, committedTime, xpEarned } = route.params || {
		accuracy: 0,
		committedTime: '0:00',
	}
	const navigation = useNavigation<NavigationProp<any>>()

	return (
		<View style={styles.container}>
			{/* Animation */}
			<View style={styles.imageContainer}>
				<LottieView
					style={{ height: 300, width: 300 }}
					source={images.taskcompleted}
					autoPlay
					loop={true}
				/>
			</View>

			{/* Title */}
			<Text style={styles.title}>{t('PROGRESS.LESSON_COMPLETE.TITLE')}</Text>

			{/* Stats Section */}
			<View style={styles.statsContainer}>
				{/* XP */}
				{xpEarned > 0 && (
					<View style={styles.statBox}>
						<Text style={[styles.statLabel, { color: '#FFD700' }]}>
							{t('PROGRESS.LESSON_COMPLETE.TOTAL_XP')}
						</Text>
						<View style={[styles.innerBox, styles.goldBorder]}>
							<Image
								source={icons.light}
								style={styles.icon}
							/>
							<Text style={[styles.statValue, { color: '#FFD700' }]}>{xpEarned}</Text>
						</View>
					</View>
				)}

				{/* Accuracy */}
				<View style={styles.statBox}>
					<Text style={[styles.statLabel, { color: '#4CAF50' }]}>
						{t('PROGRESS.LESSON_COMPLETE.ACCURACY_LABEL')}
					</Text>
					<View style={[styles.innerBox, styles.greenBorder]}>
						<Image
							source={icons.accuracy}
							style={styles.icon}
						/>
						<Text style={[styles.statValue, { color: '#4CAF50' }]}>{accuracy}%</Text>
					</View>
				</View>

				{/* Time */}
				<View style={styles.statBox}>
					<Text style={[styles.statLabel, { color: '#2196F3' }]}>
						{t('PROGRESS.LESSON_COMPLETE.COMMITTED_LABEL')}
					</Text>
					<View style={[styles.innerBox, styles.blueBorder]}>
						<Image
							source={icons.clock}
							style={styles.icon}
						/>
						<Text style={[styles.statValue, { color: '#2196F3' }]}>{committedTime}</Text>
					</View>
				</View>
			</View>
			<View style={styles.bottomContainer}>
				<TouchableOpacity
					style={styles.claimButton}
					onPress={() => {
						navigation.reset({
							index: 0,
							routes: [{ name: 'StreakTracker' }],
						})
					}}
				>
					<Text style={styles.claimText}>{t('PROGRESS.LESSON_COMPLETE.CLAIM')}</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default LessonCompleteScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: '#fff',
		paddingVertical: 20,
	},
	imageContainer: {
		marginTop: 40,
		alignItems: 'center',
	},
	title: {
		fontSize: 25,
		fontWeight: 'bold',
		color: '#FFC107',
		marginVertical: 20,
		marginBottom: 35,
	},
	statsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '90%',
		marginBottom: 20,
	},
	statBox: {
		flex: 1,
		marginHorizontal: 5,
		alignItems: 'center',
	},
	statLabel: {
		fontSize: 12,
		fontWeight: 'bold',
		marginBottom: 4,
	},
	innerBox: {
		backgroundColor: 'white',
		paddingVertical: 12,
		paddingHorizontal: 17,
		borderRadius: 10,
		alignItems: 'center',
		width: '90%',
		flexDirection: 'row',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	statValue: {
		fontSize: 18,
		fontWeight: 'bold',
		marginLeft: 5,
	},
	goldBorder: {
		borderColor: '#FFD700',
		borderWidth: 4,
	},
	greenBorder: {
		borderColor: '#4CAF50',
		borderWidth: 4,
	},
	blueBorder: {
		borderColor: '#2196F3',
		borderWidth: 4,
	},
	icon: {
		width: 20,
		height: 20,
	},
	bottomContainer: {
		flex: 1,
		justifyContent: 'flex-end',
		width: '100%',
	},
	claimButton: {
		backgroundColor: '#0286FF',
		width: '93%',
		height: 50,
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 30,
		alignSelf: 'center',
	},
	claimText: {
		fontSize: 18,
		color: '#fff',
		fontWeight: 'bold',
	},
})
