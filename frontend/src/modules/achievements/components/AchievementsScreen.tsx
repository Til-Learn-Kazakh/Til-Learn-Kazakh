import React from 'react'
import {
	FlatList,
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { imageserver } from '../../../core/config/environment.config'
import { useAchievementsProgress } from '../hooks/achievements.hooks'

export default function AchievementsScreen() {
	const { data: achievements, isLoading, isError } = useAchievementsProgress()
	const navigation = useNavigation<NavigationProp<any>>()

	if (isLoading) {
		return (
			<View style={styles.loaderContainer}>
				<Text>Загрузка...</Text>
			</View>
		)
	}

	if (isError) {
		return (
			<View style={styles.errorContainer}>
				<Text>Ошибка загрузки достижений</Text>
			</View>
		)
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			{/* Шапка */}
			<View style={styles.header}>
				{/* Левая часть: кнопка «Back» */}
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => navigation.goBack()}
				>
					<Ionicons
						name='chevron-back-outline'
						size={24}
						color='#007AFF'
						style={{ marginRight: 4 }}
					/>
					<Text style={styles.backText}>Back</Text>
				</TouchableOpacity>

				{/* Заголовок по центру */}
				<Text style={styles.headerTitle}>Достижения</Text>

				{/* Справа пустая вьюшка */}
				<View style={{ width: 50 }} />
			</View>

			<FlatList
				data={achievements}
				keyExtractor={item => item.achievement_id}
				contentContainerStyle={{ padding: 16 }}
				renderItem={({ item }) => {
					const isAchieved = item.is_achieved
					const progressText = `${item.current}/${item.threshold}`

					// Нажатие, если ачивка выполнена
					const onPressAchievement = () => {
						if (isAchieved) {
							navigation.navigate('AchievementModalScreen', {
								achievementId: item.achievement_id,
								title: item.title,
								description: item.description,
								image: item.image_url,
							})
						}
					}

					return (
						<TouchableOpacity
							style={styles.achievementItem}
							onPress={onPressAchievement}
							activeOpacity={isAchieved ? 0.6 : 1} // если не выполнено, делаем тап «неактивным»
						>
							{isAchieved ? (
								<Image
									source={{ uri: `${imageserver}${item.image_url}` }}
									style={styles.achievementImage}
								/>
							) : (
								<View style={styles.unachievedHex}>
									<Text style={styles.unachievedText}>{progressText}</Text>
								</View>
							)}

							<View style={styles.achievementInfo}>
								<Text style={styles.achievementTitle}>{item.title}</Text>
								<Text style={styles.achievementDescription}>{item.description}</Text>
							</View>
						</TouchableOpacity>
					)
				}}
			/>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#fff',
	},

	// Шапка
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 12,
		paddingVertical: 10,
		backgroundColor: '#fff',
	},
	backButton: {
		width: 60,
		flexDirection: 'row',
		alignItems: 'center',
	},
	backText: {
		color: '#007AFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
	},

	// Элемент списка
	achievementItem: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f8f8f8',
		borderRadius: 10,
		padding: 12,
		marginBottom: 12,
	},
	achievementImage: {
		width: 50,
		height: 50,
		borderRadius: 10,
		marginRight: 12,
	},
	unachievedHex: {
		width: 50,
		height: 50,
		borderRadius: 8,
		marginRight: 12,
		borderWidth: 2,
		borderColor: '#ccc',
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
	},
	unachievedText: {
		fontWeight: '600',
		fontSize: 14,
		color: '#FFD700',
	},

	achievementInfo: {
		flex: 1,
	},
	achievementTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#000',
	},
	achievementDescription: {
		fontSize: 14,
		color: '#6c757d',
	},

	loaderContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
})
