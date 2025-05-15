import React, { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { icons } from '../../../core/constants'
import { useBottomSheet } from '../../../core/hooks/useBottomSheet'
import { LoadingUi } from '../../../core/ui/LoadingUi'
import { useCurrentUser } from '../../auth/hooks/user-current-user.hook'
import RefillBottomSheet from '../../task/main/components/RefillBottomSheet'
import { useLevels } from '../hooks/home.hooks'

import { HeartsTopSheet, HeartsTopSheetRef } from './HeartsTopSheet'
import { InfoBottomSheet } from './InfoBottomSheet'

const Home = ({ route }: { route: any }) => {
	const navigation = useNavigation<NavigationProp<any>>()

	const { data: levels, isLoading: isLoadingLevels } = useLevels()
	const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser()
	const { i18n, t } = useTranslation()

	const bottomSheet = useBottomSheet()
	const refillBottomSheetRef = useRef<BottomSheetModal>(null)
	const topSheetRef = useRef<HeartsTopSheetRef>(null)

	const hearts = currentUser?.hearts || 0

	// Открыть BottomSheet с инфо
	const onOpenTopSheet = useCallback(() => {
		bottomSheet.snapToIndex({
			renderContent: () => <InfoBottomSheet onClose={bottomSheet.collapse} />,
			index: 0,
			snapPoints: ['70%', '75%'],
		})
	}, [bottomSheet])

	// Обработчик клика по уроку
	const handleUnitPress = (unitId: string) => {
		if (hearts === 0) {
			refillBottomSheetRef.current?.present()
		} else {
			navigation.navigate('TaskScreen', { unitId })
		}
	}

	// Пока данные грузятся
	if (isLoadingLevels || isLoadingUser) {
		return <LoadingUi />
	}

	return (
		<SafeAreaView style={styles.container}>
			{/* Шапка */}
			<View style={styles.header}>
				<View style={styles.headerRow}>
					<View style={styles.headerItem}>
						<Image
							source={icons.flag}
							style={styles.icon}
						/>
					</View>

					{/* Стрик */}
					<TouchableOpacity
						style={styles.headerItem}
						onPress={onOpenTopSheet}
					>
						<Image
							source={(currentUser?.streak?.current_streak ?? 0) < 1 ? icons.grayfire : icons.fire}
							style={styles.icon}
						/>
						<Text style={styles.iconText}>{currentUser?.streak?.current_streak ?? 0}</Text>
					</TouchableOpacity>

					{/* Кристаллы */}
					<TouchableOpacity style={styles.headerItem}>
						<Image
							source={icons.diamond}
							style={styles.icon}
						/>
						<Text style={styles.iconText}>{currentUser?.crystals ?? 0}</Text>
					</TouchableOpacity>

					{/* Сердечки */}
					<TouchableOpacity
						style={styles.headerItem}
						onPress={() => topSheetRef.current?.toggle()}
					>
						<Image
							source={icons.heart}
							style={styles.icon}
						/>
						<Text style={styles.iconText}>{currentUser?.hearts ?? 0}</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* Топ‐шит для Сердечек */}
			{currentUser && (
				<HeartsTopSheet
					ref={topSheetRef}
					currentUser={{
						hearts: currentUser.hearts,
						last_refill_at: currentUser.last_refill_at,
					}}
				/>
			)}

			{/* Список уровней и уроков */}
			<ScrollView
				contentContainerStyle={styles.scrollViewContainer}
				style={{ flex: 1 }}
			>
				{levels?.map((level: any) => (
					<View key={level.id}>
						{/* Карточка секции (уровня) */}
						<View style={styles.sectionCard}>
							<View style={styles.sectionInfo}>
								<Text style={styles.sectionText}>{level.name}</Text>
							</View>
							<TouchableOpacity
								onPress={() => {
									navigation.navigate('TheoryScreen')
								}}
								style={styles.squareButton}
							>
								<Image
									source={icons.book}
									style={styles.bookIconSquare}
								/>
							</TouchableOpacity>
						</View>

						{level.units.map((unit: any) => {
							const isCompleted = currentUser?.lessons_completed?.includes(unit.id)

							const localizedDescription =
								unit.descriptions[i18n.language] ?? unit.descriptions.ru ?? ''

							return (
								<TouchableOpacity
									key={unit.id}
									style={styles.lessonCard}
									onPress={() => handleUnitPress(unit.id)}
								>
									<Text style={styles.lessonTitle}>{unit.title}</Text>

									<View style={styles.statusRow}>
										<Image
											source={isCompleted ? icons.lessonDone : icons.lessonNotDone}
											style={styles.statusIcon}
										/>
										<Text style={styles.lessonStatusText}>
											{isCompleted ? t('HOME.LESSON_COMPLETED') : t('HOME.LESSON_NOT_COMPLETED')}
										</Text>
									</View>

									<Text style={styles.descriptionText}>
										{unit.descriptions.kk} / {localizedDescription}
									</Text>
								</TouchableOpacity>
							)
						})}
					</View>
				))}
			</ScrollView>

			<RefillBottomSheet bottomSheetRef={refillBottomSheetRef} />
		</SafeAreaView>
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
		paddingTop: 30,
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
		paddingBottom: 60,
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
		fontSize: 20,
		color: '#fff',
		fontWeight: 'bold',
		marginBottom: 10,
	},
	statusRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	statusIcon: {
		width: 24,
		height: 24,
		marginRight: 8,
	},
	lessonStatusText: {
		fontSize: 14,
		color: '#fff',
		fontWeight: '600',
	},
	descriptionText: {
		color: '#DCDCDC',
		fontSize: 15,
		marginBottom: 6,
	},
})
