import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
// если используешь react-i18next
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import Ionicons from '@expo/vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'

import { LANGUAGES } from '../../../core/constants/languages'

// Допустим, у нас есть i18n, и язык хранится в i18n.language
// Или можно хранить выбранный язык в AsyncStorage.

export default function LanguagePage() {
	const navigation = useNavigation()
	const { i18n } = useTranslation()

	// Текущее значение языка из i18n или, если нужно, из AsyncStorage
	const currentLang = i18n.language || 'en-US'

	// Локальный стейт для «выбранного» в списке
	const [selectedLang, setSelectedLang] = useState(currentLang)

	const handleConfirm = async () => {
		i18n.changeLanguage(selectedLang)
		await AsyncStorage.setItem('appLanguage', selectedLang)
		navigation.goBack()
	}

	const renderItem = ({ item }: any) => {
		const isSelected = item.code === selectedLang

		return (
			<TouchableOpacity
				style={styles.item}
				onPress={() => setSelectedLang(item.code)}
			>
				<View style={styles.leftPart}>
					<Image
						source={item.icon}
						style={styles.flagIcon}
					/>
					<Text style={styles.label}>{item.label}</Text>
				</View>
				{isSelected && (
					<Ionicons
						name='checkmark'
						size={20}
						color='#ff7a00'
					/>
				)}
			</TouchableOpacity>
		)
	}

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => navigation.goBack()}
				>
					<Ionicons
						name='chevron-back-outline'
						size={24}
						color='#000'
					/>
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Language</Text>
				{/* Кнопка confirm справа */}
				<TouchableOpacity
					style={styles.confirmButton}
					onPress={handleConfirm}
				>
					<Ionicons
						name='checkmark'
						size={24}
						color='#ff7a00'
					/>
				</TouchableOpacity>
			</View>

			{/* Список языков */}
			<FlatList
				data={LANGUAGES}
				keyExtractor={item => item.code}
				renderItem={renderItem}
				contentContainerStyle={styles.listContainer}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f9f9f9',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 100,
		borderBottomWidth: 1,
		borderColor: '#eee',
		paddingHorizontal: 16,
		justifyContent: 'space-between',
		backgroundColor: '#fff',
		paddingTop: 40,
	},
	backButton: {
		paddingRight: 16,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#000',
	},
	confirmButton: {
		paddingLeft: 16,
	},
	listContainer: {
		paddingVertical: 8,
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		marginHorizontal: 16,
		marginVertical: 4,
		borderRadius: 8,
		paddingHorizontal: 16,
		paddingVertical: 12,

		// Тень (опционально)
		elevation: 1,
		shadowColor: '#000',
		shadowOpacity: 0.05,
		shadowRadius: 2,
		shadowOffset: { width: 0, height: 2 },
	},
	leftPart: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	flagIcon: {
		width: 28,
		height: 28,
		marginRight: 12,
		borderRadius: 12,
		resizeMode: 'cover',
	},
	label: {
		fontSize: 18,
		color: '#333',
		fontWeight: '500',
	},
})
