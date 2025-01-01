import React, { useState } from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native'

// Ширина экрана (нужна для горизонтальной прокрутки "pagingEnabled")
const { width } = Dimensions.get('window')

// Примерные данные о двух уровнях
const levelsData = [
	{
		id: 1,
		levelName: 'Level 1',
		dotsCompleted: 1,
		lessons: [
			{
				id: 'lesson1',
				progress: '15/15',
				title: 'Animals',
				sub: 'View',
				color: '#89CEF9',
				imageUri: 'https://cdn-icons-png.flaticon.com/512/3929/3929816.png',
			},
			{
				id: 'lesson2',
				progress: '9/15',
				title: 'In the City',
				sub: 'Next',
				color: '#6EEB83',
				imageUri: 'https://cdn-icons-png.flaticon.com/512/4861/4861811.png',
			},
			{
				id: 'lesson3',
				progress: '6/15',
				title: 'Alphabet',
				sub: 'Next',
				color: '#FFDD75',
				imageUri: 'https://cdn-icons-png.flaticon.com/512/2199/2199947.png',
			},
			{
				id: 'lesson4',
				progress: '0/15',
				title: 'Nature',
				sub: 'Start',
				color: '#FFB4A2',
				imageUri: 'https://cdn-icons-png.flaticon.com/512/1995/1995325.png',
			},
		],
	},
	{
		id: 2,
		levelName: 'Level 2',
		dotsCompleted: 2,
		lessons: [
			{
				id: 'lesson1',
				progress: '10/15',
				title: 'Food',
				sub: 'Next',
				color: '#FFB4A2',
				imageUri: 'https://cdn-icons-png.flaticon.com/512/2909/2909765.png',
			},
			{
				id: 'lesson2',
				progress: '3/15',
				title: 'Family',
				sub: 'View',
				color: '#89CEF9',
				imageUri: 'https://cdn-icons-png.flaticon.com/512/1988/1988970.png',
			},
		],
	},
]

const Home = () => {
	// Примерные данные для верхней панели:
	const hearts = 3 // Сердечки
	const crystals = 471 // Кристаллы
	const streak = 38 // Стрик (огонёк)

	// Текущее смещение при горизонтальной прокрутке (для индикатора, если нужно)
	const [currentPage, setCurrentPage] = useState(0)

	// Функция, срабатывающая при «перелистывании» горизонтального скролла
	const handleScroll = event => {
		const offsetX = event.nativeEvent.contentOffset.x
		const pageIndex = Math.round(offsetX / width)
		setCurrentPage(pageIndex)
	}

	return (
		<View style={styles.container}>
			{/* ------------ TOP BAR с тенью ------------ */}
			<View style={styles.topBar}>
				{/* ФОТО ПРОФИЛЯ (СЛЕВА) */}
				<View style={styles.profileContainer}>
					<Image
						source={{
							uri: 'https://images.unsplash.com/photo-1647845481422-77fc779e6a41?w=60&h=60&fit=crop&crop=faces',
						}}
						style={styles.profileImage}
					/>
				</View>

				{/* СТАТЫ ПО СЕРЕДИНЕ (СЕРДЦА, КРИСТАЛЛЫ, ОГОНЁК) */}
				<View style={styles.statsContainer}>
					{/* Сердечки */}
					<View style={styles.statItem}>
						<Image
							source={{ uri: 'https://cdn-icons-png.flaticon.com/512/833/833472.png' }}
							style={styles.statIcon}
						/>
						<Text style={styles.statText}>{hearts}</Text>
					</View>

					{/* Кристаллы */}
					<View style={styles.statItem}>
						<Image
							source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828817.png' }}
							style={styles.statIcon}
						/>
						<Text style={styles.statText}>{crystals}</Text>
					</View>

					{/* Огонёк (стрик) */}
					<View style={styles.statItem}>
						<Image
							source={{ uri: 'https://cdn-icons-png.flaticon.com/512/10504/10504729.png' }}
							style={styles.statIcon}
						/>
						<Text style={styles.statText}>{streak}</Text>
					</View>
				</View>

				{/* ФЛАГ КАЗАХСТАНА (СПРАВА) */}
				<View style={styles.flagContainer}>
					<Image
						source={{
							uri: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Flag_of_Kazakhstan.svg',
						}}
						style={styles.flagIcon}
					/>
				</View>
			</View>

			{/* ------------ ГОРИЗОНТАЛЬНЫЙ SCROLL (ПО УРОВНЯМ) ------------ */}
			<ScrollView
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onScroll={handleScroll}
				scrollEventThrottle={16}
				style={{ flex: 1 }} // пусть занимает всё оставшееся пространство
			>
				{levelsData.map((level, index) => (
					<View
						key={level.id}
						style={{ width, paddingBottom: 80 }}
					>
						{/* --- Блок LEVEL --- */}
						<View style={styles.levelContainer}>
							<Text style={styles.levelText}>{level.levelName}</Text>
							{/* Индикатор прогресса из нескольких точек */}
							<View style={styles.dotsContainer}>
								{[...Array(4)].map((_, dotIndex) => {
									const isActive = dotIndex < level.dotsCompleted
									return (
										<View
											key={dotIndex}
											style={[styles.dot, { backgroundColor: isActive ? '#FFC107' : '#ccc' }]}
										/>
									)
								})}
							</View>
						</View>

						{/* --- Список УРОКОВ (Вертикальный скролл внутри) --- */}
						<ScrollView
							style={styles.lessonsContainer}
							contentContainerStyle={{ paddingBottom: 100 }}
						>
							{level.lessons.map(lesson => (
								<View
									key={lesson.id}
									style={[styles.lessonCard, { backgroundColor: lesson.color }]}
								>
									<View style={styles.lessonCardLeft}>
										<Text style={styles.lessonProgress}>{lesson.progress}</Text>
										<Text style={styles.lessonTitle}>{lesson.title}</Text>
										<Text style={styles.lessonSub}>{lesson.sub}</Text>
									</View>
									<View style={styles.lessonCardRight}>
										<Image
											source={{ uri: lesson.imageUri }}
											style={styles.lessonImage}
										/>
									</View>
								</View>
							))}
						</ScrollView>
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
	/* ---------------- TOP BAR (Синий) ---------------- */
	topBar: {
		flexDirection: 'row',
		backgroundColor: '#0A84FF',
		paddingHorizontal: 15,
		paddingVertical: 30,
		alignItems: 'center',
		justifyContent: 'space-between',

		// ===== Добавляем тень (iOS / Android) =====
		shadowColor: '#000',
		shadowOpacity: 0.15,
		shadowOffset: { width: 0, height: 3 },
		shadowRadius: 4,
		elevation: 5,
	},
	profileContainer: {
		width: 42,
		height: 42,
		borderRadius: 21,
		overflow: 'hidden',
	},
	profileImage: {
		width: '100%',
		height: '100%',
	},
	statsContainer: {
		flex: 1,
		flexDirection: 'row',
		marginHorizontal: 15,
		alignItems: 'center',
		justifyContent: 'center',
	},
	statItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: 8,
	},
	statIcon: {
		width: 20,
		height: 20,
		marginRight: 4,
		resizeMode: 'contain',
	},
	statText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#fff',
	},
	flagContainer: {
		width: 42,
		height: 42,
		borderRadius: 21,
		overflow: 'hidden',
		borderWidth: 2,
		borderColor: '#fff',
	},
	flagIcon: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
	},
	/* ---------------- LEVEL ---------------- */
	levelContainer: {
		flexDirection: 'column',
		alignItems: 'center',
		paddingVertical: 10,
		backgroundColor: '#FFE65E', // Светлый желтоватый
	},
	levelText: {
		fontSize: 20,
		fontWeight: '700',
		color: '#444',
	},
	dotsContainer: {
		flexDirection: 'row',
		marginTop: 6,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#ccc',
		marginHorizontal: 4,
	},
	/* ---------------- LESSONS ---------------- */
	lessonsContainer: {
		paddingHorizontal: 15,
		paddingTop: 10,
	},
	lessonCard: {
		flexDirection: 'row',
		padding: 15,
		borderRadius: 20,
		marginBottom: 15,
		alignItems: 'center',
	},
	lessonCardLeft: {
		flex: 1,
	},
	lessonProgress: {
		fontSize: 14,
		fontWeight: '600',
		color: '#fff',
		marginBottom: 2,
	},
	lessonTitle: {
		fontSize: 18,
		fontWeight: '700',
		color: '#fff',
		marginBottom: 5,
	},
	lessonSub: {
		fontSize: 14,
		fontWeight: '600',
		color: '#ffffff90', // чуть полупрозрачный белый
	},
	lessonCardRight: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	lessonImage: {
		width: 60,
		height: 60,
		resizeMode: 'contain',
	},
})
