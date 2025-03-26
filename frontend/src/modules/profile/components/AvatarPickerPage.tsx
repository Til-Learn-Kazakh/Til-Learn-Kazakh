import React, { useState } from 'react'
import {
	FlatList,
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'

import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { icons } from '../../../core/constants'
import { LoadingUi } from '../../../core/ui/LoadingUi'
import { toast } from '../../../core/ui/toast'
import { CURRENT_USER_QUERY_KEY } from '../../auth/hooks/user-current-user.hook'
import { profileService } from '../../settings/services/settings.service'

// Массив – иконка + фон (если хотите цветные круги) или просто картинки
export const avatars = [
	{
		id: '1',
		name: 'Kakashi',
		img: icons.agathaharkness,
		bgColor: '#8fb7e5',
	},
	{
		id: '2',
		name: 'Naruto',
		img: icons.aquaman,
		bgColor: '#FFD572',
	},
	{
		id: '3',
		name: 'Sasuke',
		img: icons.blueman,
		bgColor: '#9ba0f7',
	},
	{
		id: '4',
		name: 'Goku',
		img: icons.cat,
		bgColor: '#ffa573',
	},
	{
		id: '5',
		name: 'Vegeta',
		img: icons.deadpool,
		bgColor: '#7b77fa',
	},
	{
		id: '6',
		name: 'Piccolo',
		img: icons.logan,
		bgColor: '#5bbd5b',
	},
	{
		id: '7',
		name: 'Deku',
		img: icons.moonknight,
		bgColor: '#8ce7b0',
	},
	{
		id: '8',
		name: 'Bakugo',
		img: icons.natasha,
		bgColor: '#fcbf5b',
	},
	{
		id: '9',
		name: 'Tanjiro',
		img: icons.parrot,
		bgColor: '#7cd0ac',
	},
	{
		id: '10',
		name: 'Zenitsu',
		img: icons.sinisterstrange,
		bgColor: '#ffe96e',
	},
	{
		id: '11',
		name: 'Nezuko',
		img: icons.spiderman,
		bgColor: '#ffb5bd',
	},
	{
		id: '12',
		name: 'Todoroki',
		img: icons.starlord,
		bgColor: '#aed7f7',
	},
	{
		id: '13',
		name: 'Todoroki',
		img: icons.wanda,
		bgColor: '#aed7f7',
	},
]

export default function AvatarPickerPage() {
	const navigation = useNavigation()
	const route = useRoute()
	const { selectedAvatarId }: any = route.params || {}

	const [selected, setSelected] = useState<string | null>(selectedAvatarId || null)
	const queryClient = useQueryClient()

	// Выбор аватара => сохраняем ID
	const handleSelect = (id: string) => {
		setSelected(id)
	}

	const { mutate, isPending } = useMutation({
		mutationFn: (avatar: string) => profileService.updateAvatar(avatar),
		onSuccess: () => {
			// Можно обновить кэш пользователя
			queryClient.invalidateQueries({ queryKey: [CURRENT_USER_QUERY_KEY] })
			toast.success('Аватар успешно обновлён!')
		},
		onError: err => {
			console.error('❌ Ошибка обновления аватара:', err)
			toast.error('Не удалось обновить аватар. Попробуйте позже.')
		},
	})

	// Кнопка «Save»
	const handleSave = () => {
		if (!selected) return

		const selectedAvatarData = avatars.find(a => a.id === selected)
		if (!selectedAvatarData) return

		mutate(selectedAvatarData.id)
		navigation.goBack()
	}

	if (isPending) {
		return <LoadingUi />
	}

	// Рендер для FlatList
	const renderItem = ({ item }: any) => {
		const isSelected = item.id === selected
		return (
			<TouchableOpacity onPress={() => handleSelect(item.id)}>
				<View style={[styles.avatarItem]}>
					<Image
						source={item.img}
						style={styles.avatarImage}
					/>
					{isSelected && (
						<Ionicons
							name='checkmark'
							size={20}
							color='white'
							style={styles.checkIcon}
						/>
					)}
				</View>
			</TouchableOpacity>
		)
	}

	// Находим данные выбранного
	const selectedData = selected ? avatars.find(a => a.id === selected) : null

	return (
		<SafeAreaView style={styles.root}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={styles.backBtn}
				>
					<Ionicons
						name='chevron-back'
						size={24}
						color='#000'
					/>
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Profile</Text>
				{/* Пробел вправо (для симметрии) */}
				<View style={{ width: 24 }} />
			</View>

			{/* Большая круглая иконка (preview) */}
			<View style={styles.bigAvatarContainer}>
				{selectedData ? (
					<View style={[styles.bigAvatarWrapper]}>
						<Image
							source={selectedData.img}
							style={styles.bigAvatarImage}
						/>
					</View>
				) : (
					<View style={[styles.bigAvatarWrapper, { backgroundColor: '#ccc' }]} />
				)}
			</View>

			{/* Карточка с фоном / с закруглёнными углами */}
			<View style={styles.card}>
				{/* Сетка: 4 столбца, 3 строки */}
				<FlatList
					data={avatars}
					keyExtractor={item => item.id}
					renderItem={renderItem}
					numColumns={4}
					contentContainerStyle={styles.gridContent}
					columnWrapperStyle={{ justifyContent: 'space-between' }} // 👈 равномерно по ширине
				/>

				{/* Кнопки Cancel / Save */}
				<View style={styles.btnRow}>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={styles.cancelBtn}
					>
						<Text style={styles.cancelText}>Cancel</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={handleSave}
						style={[styles.saveBtn, !selected && { opacity: 0.5 }]}
						disabled={!selected}
					>
						<Text style={styles.saveText}>Save</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: '#f9f9f9',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		height: 56,
		justifyContent: 'space-between',
		marginTop: 10,
	},
	backBtn: {
		padding: 4,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#000',
	},

	// Превью
	bigAvatarContainer: {
		alignItems: 'center',
		marginTop: 16,
	},
	bigAvatarWrapper: {
		width: 100,
		height: 100,
		borderRadius: 50,
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
	},
	bigAvatarImage: {
		width: 100,
		height: 100,
		resizeMode: 'contain',
		borderRadius: 48,
	},

	// Карточка
	card: {
		flex: 1,
		marginTop: 24,
		marginHorizontal: 16,
		backgroundColor: '#fff',
		borderRadius: 24,
		paddingVertical: 16,
		// Тень (iOS)
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 5,
		shadowOffset: { width: 0, height: 3 },
		// Тень (Android)
		elevation: 4,
	},
	gridContent: {
		paddingHorizontal: 16,
	},
	avatarItem: {
		width: 60,
		height: 60,
		borderRadius: 30,
		margin: 8,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
	},
	avatarImage: {
		width: 60,
		height: 60,
		borderRadius: 30,
		resizeMode: 'contain',
	},
	checkIcon: {
		position: 'absolute',
		right: -2,
		top: -2,
	},

	btnRow: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		marginTop: 20,
		paddingHorizontal: 32,
	},
	cancelBtn: {
		flex: 1,
		marginRight: 10,
		backgroundColor: '#eee',
		borderRadius: 10,
		paddingVertical: 14,
		alignItems: 'center',
	},
	cancelText: {
		color: '#666',
		fontSize: 16,
		fontWeight: 'bold',
	},
	saveBtn: {
		flex: 1,
		marginLeft: 10,
		backgroundColor: '#7F5AF0',
		borderRadius: 10,
		paddingVertical: 14,
		alignItems: 'center',
	},
	saveText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
})
