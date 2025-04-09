import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { icons } from '../../../core/constants'
import CustomButton from '../../../core/ui/CustomButton'

type LanguageItem = {
	code: string
	label: string
	icon: any // Тип any для require(...). Можно уточнить под себя.
}

// Пример данных: список языков с иконками флагов
const LANGUAGES: LanguageItem[] = [
	{
		code: 'en',
		label: 'English',
		icon: icons.usaselect,
	},
	{
		code: 'ru',
		label: 'Русский',
		icon: icons.russiaselect,
	},
]

export default function SelectLanguageScreen() {
	const [selectedLang, setSelectedLang] = useState<string | null>(null)
	const navigation = useNavigation<NavigationProp<any>>()
	const { t, i18n } = useTranslation()

	const handleContinue = async () => {
		if (selectedLang) {
			await AsyncStorage.setItem('hasSeenOnboarding', 'true')
			i18n.changeLanguage(selectedLang)
			await AsyncStorage.setItem('appLanguage', selectedLang)
			navigation.navigate('Login')
		}
	}

	const renderLanguageItem = ({ item }: { item: LanguageItem }) => {
		const isSelected = selectedLang === item.code

		return (
			<TouchableOpacity
				style={[styles.languageItemContainer, isSelected && styles.languageItemSelected]}
				onPress={() => setSelectedLang(item.code)}
			>
				<Image
					source={item.icon}
					style={styles.flagIcon}
				/>
				<Text style={styles.languageLabel}>{item.label}</Text>
				{isSelected && (
					<Ionicons
						name='checkmark'
						size={20}
						color='#ff7a00'
						style={styles.checkIcon}
					/>
				)}
			</TouchableOpacity>
		)
	}

	return (
		<View style={styles.container}>
			{/* Верхняя панель */}
			<View style={styles.topBar}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={styles.backButton}
				>
					<Ionicons
						name='arrow-back'
						size={24}
						color='#333'
					/>
				</TouchableOpacity>
			</View>

			{/* Сова / картинка + речь */}
			<View style={styles.headerContainer}>
				<Image
					source={icons.selectlang}
					style={styles.owlIcon}
				/>
				<View style={styles.speechBubble}>
					<Text style={styles.speechText}>На каком языке хотите изучать казахский?</Text>
				</View>
			</View>

			<Text style={styles.subtitle}>Выберите язык</Text>

			<FlatList
				data={LANGUAGES}
				renderItem={renderLanguageItem}
				keyExtractor={item => item.code}
				contentContainerStyle={styles.listContainer}
			/>

			<CustomButton
				title={t('NEXT')}
				onPress={handleContinue}
				disabled={!selectedLang}
				style={[styles.button, !selectedLang && styles.continueButtonDisabled]}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFF',
	},
	topBar: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingTop: 52,
	},
	backButton: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 8,
	},
	headerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
	},
	owlIcon: {
		width: 120,
		height: 120,
		marginRight: 12,
		resizeMode: 'contain',
	},
	speechBubble: {
		flex: 1,
		backgroundColor: '#F5F5F5',
		borderRadius: 12,
		padding: 16,
	},
	speechText: {
		fontSize: 18,
		color: '#444',
	},
	subtitle: {
		fontSize: 18,
		fontWeight: '600',
		marginHorizontal: 16,
		marginTop: 12,
		marginBottom: 8,
		color: '#666',
	},
	listContainer: {
		paddingHorizontal: 16,
	},
	languageItemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FFF',
		borderRadius: 12,
		borderColor: '#E5E5E5',
		borderWidth: 2,
		padding: 12,
		marginVertical: 6,
	},
	languageItemSelected: {
		borderColor: '#E0F2FF',
		backgroundColor: '#E0F2FF', // Лёгкий синий оттенок для выделенного языка
	},
	flagIcon: {
		width: 36,
		height: 36,
		resizeMode: 'contain',
		marginRight: 12,
	},
	languageLabel: {
		fontSize: 16,
		color: '#333',
		flex: 1,
	},
	checkIcon: {
		marginLeft: 8,
	},
	button: {
		width: '90%',
		alignSelf: 'center',
		marginBottom: 60,
	},
	continueButtonDisabled: {
		backgroundColor: '#CCC',
	},
})
