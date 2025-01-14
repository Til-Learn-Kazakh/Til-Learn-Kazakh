import React from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ProgressBar } from 'react-native-paper'

import { icons } from '../../../core/constants'

const Home = () => {
	const sections = [
		{
			title: 'Section 1, Unit 1',
			description: 'Английский для выживания',
			lessons: [
				{
					title: 'Урок 1',
					progress: 0.8,
					descriptionRu: 'Приветствие и знакомство',
					descriptionKz: 'Сәлемдесу және танысу',
				},
				{
					title: 'Урок 2',
					progress: 0.5,
					descriptionRu: 'Введение в грамматику',
					descriptionKz: 'Грамматикаға кіріспе',
				},
			],
		},
		{
			title: 'Section 1, Unit 2',
			description: 'Разговорная грамматика',
			lessons: [
				{
					title: 'Урок 3',
					progress: 0.6,
					descriptionRu: 'Использование глаголов',
					descriptionKz: 'Етістіктерді қолдану',
				},
				{
					title: 'Урок 4',
					progress: 0.4,
					descriptionRu: 'Построение вопросов',
					descriptionKz: 'Сұрақтарды құру',
				},
			],
		},
	]

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.headerRow}>
					<View style={styles.headerItem}>
						<Image
							source={icons.flag}
							style={styles.icon}
						/>
					</View>
					<View style={styles.headerItem}>
						<Image
							source={icons.fire}
							style={styles.icon}
						/>
						<Text style={styles.iconText}>28</Text>
					</View>
					<View style={styles.headerItem}>
						<Image
							source={icons.diamond}
							style={styles.icon}
						/>
						<Text style={styles.iconText}>1057</Text>
					</View>
					<View style={styles.headerItem}>
						<Image
							source={icons.heart}
							style={styles.icon}
						/>
						<Text style={styles.iconText}>5</Text>
					</View>
				</View>
			</View>

			{/* Sections with Lessons */}
			<ScrollView contentContainerStyle={styles.scrollViewContainer}>
				{sections.map((section, sectionIndex) => (
					<View key={sectionIndex}>
						{/* Section Title and Description */}
						<View style={styles.sectionCard}>
							<View style={styles.sectionInfo}>
								<Text style={styles.sectionText}>{section.title}</Text>
								<Text style={styles.sectionDescription}>{section.description}</Text>
							</View>
							<TouchableOpacity style={styles.squareButton}>
								<Image
									source={icons.book}
									style={styles.bookIconSquare}
								/>
							</TouchableOpacity>
						</View>

						{/* Lessons in Section */}
						{section.lessons.map((lesson, lessonIndex) => (
							<View
								key={lessonIndex}
								style={styles.lessonCard}
							>
								<Text style={styles.lessonTitle}>{lesson.title}</Text>
								<ProgressBar
									progress={lesson.progress}
									color='#4CAF50'
									style={styles.lessonProgress}
								/>
								<Text style={styles.lessonProgressText}>
									{Math.round(lesson.progress * 100)}% завершено
								</Text>
								<View style={styles.lessonDescription}>
									<Text style={styles.descriptionTextRu}>{lesson.descriptionRu}</Text>
									<Text style={styles.descriptionTextKz}>{lesson.descriptionKz}</Text>
								</View>
							</View>
						))}
					</View>
				))}
			</ScrollView>
		</View>
	)
}

export default Home

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	header: {
		backgroundColor: '#fff',
		padding: 16,
		borderBottomLeftRadius: 16,
		borderBottomRightRadius: 16,
		alignItems: 'center',
		paddingTop: 60,
	},
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		marginBottom: 20,
		paddingHorizontal: 16,
	},
	headerItem: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	icon: {
		width: 32,
		height: 32,
		marginRight: 8,
	},
	iconText: {
		color: '#000',
		fontSize: 14,
		fontWeight: 'bold',
	},
	scrollViewContainer: {
		paddingVertical: 20,
		paddingHorizontal: 16,
	},
	sectionCard: {
		backgroundColor: '#f5f5f5',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
	},
	sectionInfo: {
		flex: 1,
	},
	sectionText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#000',
		marginBottom: 4,
	},
	sectionDescription: {
		fontSize: 14,
		color: '#555',
	},
	squareButton: {
		width: 40,
		height: 40,
		borderWidth: 1,
		borderColor: '#ccc',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 8,
	},
	bookIconSquare: {
		width: 24,
		height: 24,
	},
	lessonCard: {
		backgroundColor: '#0076CE',
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
	},
	lessonTitle: {
		fontSize: 18,
		color: '#fff',
		fontWeight: 'bold',
		marginBottom: 8,
	},
	lessonProgress: {
		height: 8,
		borderRadius: 4,
		marginVertical: 8,
	},
	lessonProgressText: {
		fontSize: 14,
		color: '#fff',
		marginBottom: 12,
	},
	lessonDescription: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	descriptionTextRu: {
		color: '#fff',
		flex: 1,
		marginRight: 8,
	},
	descriptionTextKz: {
		color: '#ccc',
		flex: 1,
	},
})
