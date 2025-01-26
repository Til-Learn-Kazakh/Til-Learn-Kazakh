import React, { useCallback, useMemo, useRef } from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ProgressBar } from 'react-native-paper'

import { icons } from '../../../core/constants'
import { useBottomSheet } from '../../../core/hooks/useBottomSheet'
import { LoadingUi } from '../../../core/ui/LoadingUi'
import { useCurrentUser } from '../../auth/hooks/user-current-user.hook'
import { useLevels } from '../hooks/home.hooks'

import { HeartsTopSheet, HeartsTopSheetRef } from './HeartsTopSheet'
import { InfoBottomSheet } from './InfoBottomSheet'

const Home = ({ route }: { route: any }) => {
	const { data: levels, isLoading: isLoadingLevels } = useLevels()
	const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser() // <-- тут подтягиваем юзера из запроса

	const snapPoints = useMemo(() => ['50%', '35%'], [])
	const bottomSheet = useBottomSheet()

	const onCloseTopSheet = useCallback(() => {
		bottomSheet.collapse()
	}, [bottomSheet])

	const topSheetContent = useMemo(
		() => <InfoBottomSheet onClose={onCloseTopSheet} />,
		[onCloseTopSheet]
	)

	const onOpenTopSheet = useCallback(() => {
		bottomSheet.snapToIndex({
			renderContent: () => topSheetContent,
			index: 0,
			snapPoints: ['70%', '75%'],
		})
	}, [bottomSheet, topSheetContent])

	const topSheetRef = useRef<HeartsTopSheetRef>(null)

	if (isLoadingLevels || isLoadingLevels) {
		return <LoadingUi />
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerRow}>
					<View style={styles.headerItem}>
						<Image
							source={icons.flag}
							style={styles.icon}
						/>
					</View>
					<TouchableOpacity
						style={styles.headerItem}
						onPress={() => onOpenTopSheet()}
					>
						<Image
							source={(currentUser?.streak ?? 0) < 1 ? icons.grayfire : icons.fire}
							style={styles.icon}
						/>
						<Text style={styles.iconText}>{currentUser?.streak ?? 0}</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.headerItem}>
						<Image
							source={icons.diamond}
							style={styles.icon}
						/>
						<Text style={styles.iconText}>{currentUser?.crystals ?? 0}</Text>
					</TouchableOpacity>

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

			{currentUser && (
				<HeartsTopSheet
					ref={topSheetRef}
					currentUser={{
						hearts: currentUser.hearts,
						last_refill_at: currentUser.last_refill_at,
					}}
				/>
			)}

			<ScrollView contentContainerStyle={styles.scrollViewContainer}>
				{levels?.map((level: any) => (
					<View key={level.id}>
						<View style={styles.sectionCard}>
							<View style={styles.sectionInfo}>
								<Text style={styles.sectionText}>{level.name}</Text>
							</View>
							<TouchableOpacity style={styles.squareButton}>
								<Image
									source={icons.book}
									style={styles.bookIconSquare}
								/>
							</TouchableOpacity>
						</View>

						{level.units.map((unit: any) => (
							<View
								key={unit.id}
								style={styles.lessonCard}
							>
								<Text style={styles.lessonTitle}>{unit.title}</Text>
								<ProgressBar
									progress={0.5}
									color='#4CAF50'
									style={styles.lessonProgress}
								/>
								<Text style={styles.lessonProgressText}>50% завершено</Text>
								<View style={styles.lessonDescription}>
									<Text style={styles.descriptionTextRu}>Description in RU</Text>
									<Text style={styles.descriptionTextKz}>Description in KZ</Text>
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
