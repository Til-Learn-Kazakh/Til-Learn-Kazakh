import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'

const InfoAnalyticsPage: React.FC = () => {
	const navigation = useNavigation()
	const { t } = useTranslation()

	return (
		<LinearGradient
			colors={['#094979', '#00d4ff']}
			style={styles.container}
		>
			{/* Header */}
			<View style={styles.header}>
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
				<Text style={styles.title}>{t('PROFILE.INFO_ANALYTICS.TITLE')}</Text>
				<View style={styles.iconButton}>
					<Ionicons
						name='bar-chart'
						size={26}
						color='#FFF'
					/>
				</View>
			</View>

			{/* Content */}
			<View style={styles.content}>
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>{t('PROFILE.INFO_ANALYTICS.HOW_IT_WORKS_TITLE')}</Text>
					<Text style={styles.text}>{t('PROFILE.INFO_ANALYTICS.HOW_IT_WORKS_CONTENT')}</Text>
				</View>

				<View style={styles.card}>
					<Text style={styles.sectionTitle}>
						{t('PROFILE.INFO_ANALYTICS.HOW_TO_READ_DATA_TITLE')}
					</Text>
					<Text style={styles.text}>{t('PROFILE.INFO_ANALYTICS.HOW_TO_READ_DATA_CONTENT')}</Text>
				</View>

				<View style={styles.card}>
					<Text style={styles.sectionTitle}>
						{t('PROFILE.INFO_ANALYTICS.WHY_TRACK_STATS_TITLE')}
					</Text>
					<Text style={styles.text}>{t('PROFILE.INFO_ANALYTICS.WHY_TRACK_STATS_CONTENT')}</Text>
				</View>
			</View>
		</LinearGradient>
	)
}

export default InfoAnalyticsPage

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
		fontSize: 20,
		fontWeight: 'bold',
		color: '#FFF',
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
	bold: {
		fontWeight: 'bold',
	},
})
