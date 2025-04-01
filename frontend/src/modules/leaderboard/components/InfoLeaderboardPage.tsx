import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'

const InfoLeaderboardPage: React.FC = () => {
	const { t } = useTranslation()
	const navigation = useNavigation()

	return (
		<LinearGradient
			colors={['#697CFF', '#7646fc']}
			style={styles.container}
		>
			{/* Header */}
			<View style={styles.header}>
				{/* Back Button */}
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={styles.iconButton}
				>
					<Ionicons
						name='arrow-back'
						size={26}
						color='#FFF'
					/>
				</TouchableOpacity>
				{/* Title */}
				<Text style={styles.title}>{t('LEADERBOARD.INFO.TITLE')}</Text>
				{/* Placeholder for alignment */}
				<View />
			</View>

			{/* Main Content */}
			<View style={styles.content}>
				{/* Weekly Ranking Card */}
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>{t('LEADERBOARD.INFO.WEEKLY_RANKING.TITLE')}</Text>
					<Text style={styles.text}>{t('LEADERBOARD.INFO.WEEKLY_RANKING.DESCRIPTION')}</Text>
				</View>

				{/* Monthly Ranking Card */}
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>{t('LEADERBOARD.INFO.MONTHLY_RANKING.TITLE')}</Text>
					<Text style={styles.text}>{t('LEADERBOARD.INFO.MONTHLY_RANKING.DESCRIPTION')}</Text>
				</View>

				{/* Why Reset Card */}
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>{t('LEADERBOARD.INFO.WHY_RESET.TITLE')}</Text>
					<Text style={styles.text}>{t('LEADERBOARD.INFO.WHY_RESET.DESCRIPTION')}</Text>
				</View>
			</View>
		</LinearGradient>
	)
}

export default InfoLeaderboardPage

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 50,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 20,
	},
	iconButton: {
		padding: 10,
		borderRadius: 10,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
	},
	title: {
		marginRight: 45,
		fontSize: 20,
		fontWeight: 'bold',
		color: '#FFF',
		textAlign: 'center',
	},
	content: {
		marginTop: 10,
	},
	card: {
		backgroundColor: 'rgba(255, 255, 255, 0.9)',
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 5,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#007AFF',
		marginBottom: 6,
	},
	text: {
		fontSize: 14,
		color: '#333',
		lineHeight: 22,
	},
})
