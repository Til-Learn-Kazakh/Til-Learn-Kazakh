import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { Audio } from 'expo-av'

import { icons } from '../../../core/constants'

// Example audio mapping for dialogues – adjust URIs accordingly
const dialogueAudio = [
	require('../../../../public/sound/dialogue0.mp3'),
	require('../../../../public/sound/dialogue1.mp3'),
	require('../../../../public/sound/dialogue2.mp3'),
	require('../../../../public/sound/dialogue3.mp3'),
	require('../../../../public/sound/dialogue4.mp3'),
	require('../../../../public/sound/dialogue5.mp3'),
]

const TheoryScreen = () => {
	const navigation = useNavigation<NavigationProp<any>>()
	const { t } = useTranslation()

	const playSound = async (soundSource: any) => {
		try {
			const { sound } = await Audio.Sound.createAsync(soundSource)
			await sound.playAsync()
		} catch (error) {
			console.error('Error playing sound: ', error)
		}
	}

	// Cast the output to an array of objects with SUBJECT and VERB properties
	const table1Rows = t('THEORYSCREEN.SECTIONS.TIPVERBS.TABLE1.ROWS', {
		returnObjects: true,
	}) as Array<{ SUBJECT: string; VERB: string }>

	return (
		<View style={styles.container}>
			{/* Sticky Header */}
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={styles.backButton}
				>
					<Ionicons
						name='arrow-back'
						size={24}
						color='#333'
					/>
					<Text style={styles.backText}>{t('THEORYSCREEN.BACK')}</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.helpButton}>
					<Ionicons
						name='help-circle-outline'
						size={28}
						color='#FF6F61'
					/>
				</TouchableOpacity>
			</View>

			{/* Title Section */}
			<View style={styles.titleContainer}>
				<Text style={styles.titleText}>{t('THEORYSCREEN.TITLE')}</Text>
			</View>

			{/* Scrollable Content */}
			<ScrollView contentContainerStyle={[styles.content, { paddingBottom: 85 }]}>
				{/* --- SECTION 1: Key Phrases (Kazakh Introductions) --- */}
				<Text style={styles.sectionTitle}>{t('THEORYSCREEN.SECTIONS.KEYPHRASES.TITLE')}</Text>
				<Text style={styles.sectionSubtitle}>{t('THEORYSCREEN.SECTIONS.KEYPHRASES.SUBTITLE')}</Text>

				<View style={styles.conversationContainer}>
					{/* Пример 1 */}
					<View style={styles.messageBubble}>
						<TouchableOpacity
							style={styles.audioButton}
							onPress={() => playSound(dialogueAudio[0])}
						>
							<Image
								source={icons.volume}
								style={{ width: 28, height: 28 }}
							/>
						</TouchableOpacity>

						<Text style={styles.messageText}>
							{t('THEORYSCREEN.SECTIONS.KEYPHRASES.EXAMPLE1.QUESTION')}
						</Text>
						<Text style={styles.translationText}>
							{t('THEORYSCREEN.SECTIONS.KEYPHRASES.EXAMPLE1.TRANSLATION')}
						</Text>
					</View>

					{/* Пример ответа */}
					<View style={[styles.messageBubble, styles.responseBubble]}>
						<TouchableOpacity
							style={styles.audioButton}
							onPress={() => playSound(dialogueAudio[1])}
						>
							<Image
								source={icons.volume}
								style={{ width: 28, height: 28 }}
							/>
						</TouchableOpacity>
						<Text style={styles.messageText}>
							{t('THEORYSCREEN.SECTIONS.KEYPHRASES.ANSWER1.TEXT')}
						</Text>
						<Text style={styles.translationText}>
							{t('THEORYSCREEN.SECTIONS.KEYPHRASES.ANSWER1.TRANSLATION')}
						</Text>
					</View>

					{/* Пример 2 */}
					<View style={styles.messageBubble}>
						<TouchableOpacity
							style={styles.audioButton}
							onPress={() => playSound(dialogueAudio[2])}
						>
							<Image
								source={icons.volume}
								style={{ width: 28, height: 28 }}
							/>
						</TouchableOpacity>
						<Text style={styles.messageText}>
							{t('THEORYSCREEN.SECTIONS.KEYPHRASES.EXAMPLE2.QUESTION')}
						</Text>
						<Text style={styles.translationText}>
							{t('THEORYSCREEN.SECTIONS.KEYPHRASES.EXAMPLE2.TRANSLATION')}
						</Text>
					</View>

					{/* Пример ответа */}
					<View style={[styles.messageBubble, styles.responseBubble]}>
						<TouchableOpacity
							style={styles.audioButton}
							onPress={() => playSound(dialogueAudio[3])}
						>
							<Image
								source={icons.volume}
								style={{ width: 28, height: 28 }}
							/>
						</TouchableOpacity>
						<Text style={styles.messageText}>
							{t('THEORYSCREEN.SECTIONS.KEYPHRASES.ANSWER2.TEXT')}
						</Text>
						<Text style={styles.translationText}>
							{t('THEORYSCREEN.SECTIONS.KEYPHRASES.ANSWER2.TRANSLATION')}
						</Text>
					</View>
				</View>

				<View style={styles.divider} />

				{/* --- SECTION 2: Tip (Verbs) --- */}
				<Text style={styles.sectionTitle}>{t('THEORYSCREEN.SECTIONS.TIPVERBS.TITLE')}</Text>
				<Text style={styles.sectionSubtitle}>{t('THEORYSCREEN.SECTIONS.TIPVERBS.SUBTITLE')}</Text>

				<View style={styles.tipContainer}>
					<Text style={styles.tipText}>{t('THEORYSCREEN.SECTIONS.TIPVERBS.TEXT')}</Text>

					{/* Table for verb "сөйлеу" */}
					<View style={styles.tableContainer}>
						<View style={styles.tableRow}>
							<Text style={styles.tableHeader}>
								{t('THEORYSCREEN.SECTIONS.TIPVERBS.TABLE1.HEADER1')}
							</Text>
							<Text style={styles.tableHeader}>
								{t('THEORYSCREEN.SECTIONS.TIPVERBS.TABLE1.HEADER2')}
							</Text>
						</View>
						{table1Rows.map((row, index) => (
							<View
								style={styles.tableRow}
								key={index}
							>
								<Text style={styles.tableCell}>{row.SUBJECT}</Text>
								<Text style={styles.tableCell}>{row.VERB}</Text>
							</View>
						))}
					</View>

					{/* Table for verb "бару" */}
					<View style={styles.tableContainer}>
						<View style={styles.tableRow}>
							<Text style={styles.tableHeader}>
								{t('THEORYSCREEN.SECTIONS.TIPVERBS.TABLE2.HEADER1')}
							</Text>
							<Text style={styles.tableHeader}>
								{t('THEORYSCREEN.SECTIONS.TIPVERBS.TABLE2.HEADER2')}
							</Text>
						</View>
						{(
							t('THEORYSCREEN.SECTIONS.TIPVERBS.TABLE2.ROWS', { returnObjects: true }) as any[]
						).map((row, index) => (
							<View
								style={styles.tableRow}
								key={index}
							>
								<Text style={styles.tableCell}>{row.SUBJECT}</Text>
								<Text style={styles.tableCell}>{row.VERB}</Text>
							</View>
						))}
					</View>
				</View>

				<View style={styles.divider} />

				{/* --- SECTION 3: Tip (Gender) --- */}
				<View style={styles.tipSection}>
					<Text style={styles.tipTitle}>{t('THEORYSCREEN.SECTIONS.TIPGENDER.TITLE')}</Text>
					<Text style={styles.tipHeading}>{t('THEORYSCREEN.SECTIONS.TIPGENDER.HEADING')}</Text>
					<Text style={styles.tipText}>{t('THEORYSCREEN.SECTIONS.TIPGENDER.TEXT')}</Text>

					<View style={styles.dialogue}>
						<TouchableOpacity
							style={styles.audioButton}
							onPress={() => playSound(dialogueAudio[4])}
						>
							<Ionicons
								name='volume-high-outline'
								size={20}
								color='#007AFF'
							/>
						</TouchableOpacity>
						<View style={{ flex: 1 }}>
							<Text style={styles.dialogueText}>
								{t('THEORYSCREEN.SECTIONS.TIPGENDER.DIALOGUES.0.QUESTION')}
							</Text>
							<Text style={styles.translation}>
								{t('THEORYSCREEN.SECTIONS.TIPGENDER.DIALOGUES.0.TRANSLATION')}
							</Text>
						</View>
					</View>

					<View style={styles.dialogue}>
						<TouchableOpacity
							style={styles.audioButton}
							onPress={() => playSound(dialogueAudio[5])}
						>
							<Ionicons
								name='volume-high-outline'
								size={20}
								color='#007AFF'
							/>
						</TouchableOpacity>
						<View style={{ flex: 1 }}>
							<Text style={styles.dialogueText}>
								{t('THEORYSCREEN.SECTIONS.TIPGENDER.DIALOGUES.1.QUESTION')}
							</Text>
							<Text style={styles.translation}>
								{t('THEORYSCREEN.SECTIONS.TIPGENDER.DIALOGUES.1.TRANSLATION')}
							</Text>
						</View>
					</View>
					<Text style={styles.tipText}>{t('THEORYSCREEN.SECTIONS.TIPGENDER.ADDITIONAL_TEXT')}</Text>
				</View>

				<View style={styles.divider} />

				{/* --- SECTION 4: Vocabulary (Greetings) --- */}
				<Text style={styles.sectionTitle}>{t('THEORYSCREEN.SECTIONS.VOCABULARY.TITLE')}</Text>
				<Text style={styles.sectionSubtitle}>{t('THEORYSCREEN.SECTIONS.VOCABULARY.SUBTITLE')}</Text>
				<Text style={{ marginBottom: 10 }}>{t('THEORYSCREEN.SECTIONS.VOCABULARY.INTRO')}</Text>
				<View style={styles.tableContainer}>
					<View style={styles.tableRow}>
						<Text style={styles.tableHeader}>
							{t('THEORYSCREEN.SECTIONS.VOCABULARY.ITEMS_HEADER')}
						</Text>
						<Text style={styles.tableHeader}>
							{t('THEORYSCREEN.SECTIONS.VOCABULARY.TRANSLATION_HEADER')}
						</Text>
					</View>
					{(t('THEORYSCREEN.SECTIONS.VOCABULARY.ITEMS', { returnObjects: true }) as any[]).map(
						(item, index) => (
							<View
								style={styles.tableRow}
								key={index}
							>
								<Text style={styles.tableCell}>{item.PHRASE}</Text>
								<Text style={styles.tableCell}>{item.TRANSLATION}</Text>
							</View>
						)
					)}
				</View>

				<View style={styles.divider} />

				{/* --- SECTION 5: Tip (Сен vs Сіз) --- */}
				<Text style={styles.sectionTitle}>{t('THEORYSCREEN.SECTIONS.TIPSENSIZ.TITLE')}</Text>
				<Text style={styles.sectionSubtitle}>{t('THEORYSCREEN.SECTIONS.TIPSENSIZ.SUBTITLE')}</Text>

				<View style={styles.tipContainer}>
					<Text style={styles.tipText}>
						{t('THEORYSCREEN.SECTIONS.TIPSENSIZ.TEXT')}
						<Text style={styles.tipText}>{t('THEORYSCREEN.SECTIONS.TIPSENSIZ.DETAILS')}</Text>
					</Text>
				</View>

				<View style={styles.divider} />

				{/* --- SECTION 6: Practice (Quick Check) --- */}
				<Text style={styles.sectionTitle}>{t('THEORYSCREEN.SECTIONS.PRACTICE.TITLE')}</Text>
				<Text style={styles.sectionSubtitle}>{t('THEORYSCREEN.SECTIONS.PRACTICE.SUBTITLE')}</Text>
				<Text style={{ marginBottom: 10 }}>{t('THEORYSCREEN.SECTIONS.PRACTICE.INTRO')}</Text>

				<View style={styles.tipContainer}>
					<Text style={styles.tipText}>{t('THEORYSCREEN.SECTIONS.PRACTICE.STEPS.STEP1')}</Text>
					<Text style={styles.tipText}>{t('THEORYSCREEN.SECTIONS.PRACTICE.STEPS.STEP2')}</Text>
					<Text style={styles.tipText}>{t('THEORYSCREEN.SECTIONS.PRACTICE.STEPS.STEP3')}</Text>
				</View>

				<View style={styles.divider} />

				{/* --- SECTION 7: Common Mistakes --- */}
				<Text style={styles.sectionTitle}>{t('THEORYSCREEN.SECTIONS.COMMONMISTAKES.TITLE')}</Text>

				<View style={styles.tipContainer}>
					<Text style={styles.tipText}>{t('THEORYSCREEN.SECTIONS.COMMONMISTAKES.POINTS.0')}</Text>
					<Text style={styles.tipText}>{t('THEORYSCREEN.SECTIONS.COMMONMISTAKES.POINTS.1')}</Text>
				</View>

				<View style={styles.divider} />

				{/* --- SECTION 8: Pronunciation Tips --- */}
				<Text style={styles.sectionTitle}>
					{t('THEORYSCREEN.SECTIONS.PRONUNCIATIONTIPS.TITLE')}
				</Text>

				<View style={styles.tipContainer}>
					<Text style={styles.tipText}>{t('THEORYSCREEN.SECTIONS.PRONUNCIATIONTIPS.TEXTS.0')}</Text>
					<Text style={styles.tipText}>{t('THEORYSCREEN.SECTIONS.PRONUNCIATIONTIPS.TEXTS.1')}</Text>
				</View>
			</ScrollView>
		</View>
	)
}

export default TheoryScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingTop: 50,
		paddingBottom: 10,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
	},
	backButton: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	backText: {
		fontSize: 16,
		color: '#333',
		marginLeft: 5,
	},
	helpButton: {
		padding: 5,
	},
	titleContainer: {
		backgroundColor: '#FF6F91',
		paddingVertical: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	titleText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#fff',
	},
	content: {
		padding: 16,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#007AFF',
		marginBottom: 5,
	},
	sectionSubtitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 15,
		color: '#333',
	},
	conversationContainer: {
		marginBottom: 20,
	},
	messageBubble: {
		backgroundColor: '#F8F8F8',
		padding: 10,
		borderRadius: 12,
		marginBottom: 8,
		flexDirection: 'column',
		maxWidth: '80%',
	},
	responseBubble: {
		alignSelf: 'flex-end',
		backgroundColor: '#F0F0F0',
	},
	messageText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#333',
	},
	translationText: {
		marginTop: 10,
		fontSize: 14,
		color: '#666',
	},
	tipContainer: {
		backgroundColor: '#E3F2FD',
		padding: 12,
		borderRadius: 10,
		marginBottom: 20,
	},
	tipText: {
		fontSize: 14,
		color: '#333',
		marginBottom: 10,
	},
	boldText: {
		fontWeight: 'bold',
		color: '#007AFF',
	},
	tableContainer: {
		backgroundColor: '#FFF',
		padding: 10,
		borderRadius: 8,
		marginTop: 10,
	},
	tableRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 5,
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
	},
	tableHeader: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#007AFF',
	},
	tableCell: {
		fontSize: 14,
		color: '#333',
	},
	divider: {
		height: 1,
		backgroundColor: '#ddd',
		marginVertical: 20,
	},
	dialogue: {
		backgroundColor: '#FFFFFF',
		borderRadius: 10,
		padding: 10,
		marginBottom: 10,
		flexDirection: 'row',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 2,
	},
	audioButton: {
		marginRight: 10,
	},
	dialogueText: {
		fontSize: 16,
		fontWeight: '500',
	},
	translation: {
		fontSize: 14,
		color: '#6C757D',
		marginTop: 5,
	},
	tipSection: {
		backgroundColor: '#E3F2FD',
		borderRadius: 10,
		padding: 15,
		marginBottom: 20,
	},
	tipTitle: {
		color: '#007AFF',
		fontSize: 14,
		fontWeight: 'bold',
		marginBottom: 5,
	},
	tipHeading: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
	},
})
