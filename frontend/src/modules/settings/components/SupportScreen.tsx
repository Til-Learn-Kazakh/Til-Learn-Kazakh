import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	Alert,
	Image,
	KeyboardAvoidingView,
	Linking,
	Platform,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Ionicons from '@expo/vector-icons/Ionicons'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'

// ЗАМЕНИ НА СВОЙ ТОКЕН
const TELEGRAM_BOT_TOKEN = '7575382077:AAEPLd2vAHeWVXIhlgcg9kSGMCc6jcaYXb8'
const TELEGRAM_CHAT_ID = '1035030228'

export default function SupportPage() {
	const navigation = useNavigation<NavigationProp<any>>()
	const insets = useSafeAreaInsets()
	const { t } = useTranslation()

	const [email, setEmail] = useState('')
	const [message, setMessage] = useState('')
	const [isSending, setIsSending] = useState(false)
	const [photoUri, setPhotoUri] = useState<string | null>(null)

	// Выбор фото из галереи
	const handlePickPhoto = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

		if (status !== 'granted') {
			Alert.alert(
				'Нет доступа',
				'Разрешение на доступ к фотографиям отключено. Вы можете включить его в настройках.',
				[
					{
						text: 'Отмена',
						style: 'cancel',
					},
					{
						text: 'Открыть настройки',
						onPress: () => Linking.openSettings(),
					},
				]
			)
			return
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: false,
			quality: 0.8,
		})

		// Проверяем отмену
		if (result.canceled) {
			return
		}

		// Получаем первую фотографию из массива
		if (result.assets && result.assets.length > 0) {
			setPhotoUri(result.assets[0].uri)
		}
	}

	// Нажатие на "Отправить"
	const handleSend = async () => {
		if (!email || !message) {
			Alert.alert('Ошибка', 'Пожалуйста, заполните все поля')
			return
		}
		setIsSending(true)

		try {
			if (photoUri) {
				await sendPhoto({ email, message, photoUri })
			} else {
				await sendMessage({ email, message })
			}

			Alert.alert('Успех', 'Сообщение отправлено!')
			setEmail('')
			setMessage('')
			setPhotoUri(null)
			navigation.goBack()
		} catch (err) {
			console.error('[Support] Error:', err)
			Alert.alert('Ошибка', 'Не удалось отправить сообщение')
		} finally {
			setIsSending(false)
		}
	}

	return (
		<KeyboardAvoidingView
			style={{ flex: 1, backgroundColor: '#fff' }}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
		>
			<SafeAreaView style={{ flex: 1 }}>
				{/* Шапка */}
				<View style={styles.header}>
					{/* Кнопка «Назад» */}
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={styles.backButton}
					>
						<Ionicons
							name='chevron-back-outline'
							size={26}
							color='#007AFF'
						/>
						<Text style={styles.backText}>Назад</Text>
					</TouchableOpacity>

					{/* Заголовок по центру */}
					<Text style={styles.headerTitle}>{t('support.title')}</Text>

					{/* Справа пустая зона */}
					<View style={{ width: 40 }} />
				</View>

				<ScrollView contentContainerStyle={styles.contentContainer}>
					<TextInput
						style={styles.input}
						placeholder={t('support.email')}
						placeholderTextColor='#999'
						keyboardType='email-address'
						autoCapitalize='none'
						value={email}
						onChangeText={setEmail}
					/>

					<TextInput
						style={styles.textarea}
						placeholder={t('support.message')}
						placeholderTextColor='#999'
						value={message}
						onChangeText={setMessage}
						multiline
						numberOfLines={4}
					/>

					<TouchableOpacity
						style={styles.attachButton}
						onPress={handlePickPhoto}
					>
						<Text style={styles.attachButtonText}>
							{t('support.attach_photo', 'Прикрепить фото')}
						</Text>
					</TouchableOpacity>

					{photoUri && (
						<View style={styles.photoPreview}>
							<Image
								source={{ uri: photoUri }}
								style={styles.photoImage}
							/>
							<TouchableOpacity onPress={() => setPhotoUri(null)}>
								<Text style={styles.removePhotoText}>Убрать фото</Text>
							</TouchableOpacity>
						</View>
					)}

					<TouchableOpacity
						style={[styles.sendButton, (!email || !message || isSending) && styles.disabledButton]}
						disabled={!email || !message || isSending}
						onPress={handleSend}
					>
						<Text style={styles.sendButtonText}>{isSending ? 'Отправляю...' : 'Отправить'}</Text>
					</TouchableOpacity>
				</ScrollView>
			</SafeAreaView>
		</KeyboardAvoidingView>
	)
}

// отправка обычного текста
async function sendMessage({ email, message }: { email: string; message: string }) {
	const text = `🆘 *Сообщение в поддержку*\n\n📧 Email: ${email}\n📝 Сообщение: ${message}`
	const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			chat_id: TELEGRAM_CHAT_ID,
			text,
			parse_mode: 'Markdown',
		}),
	})
	if (!res.ok) {
		throw new Error(`sendMessage error: ${res.statusText}`)
	}
}

// отправка фото
async function sendPhoto({
	email,
	message,
	photoUri,
}: {
	email: string
	message: string
	photoUri: string
}) {
	const caption = `🆘 *Сообщение в поддержку*\n\n📧 Email: ${email}\n📝 Сообщение: ${message}`
	const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`

	// собираем FormData
	const formData = new FormData()
	formData.append('chat_id', TELEGRAM_CHAT_ID)
	formData.append('caption', caption)
	formData.append('parse_mode', 'Markdown')
	formData.append('photo', {
		uri: photoUri,
		name: 'image.jpg',
		type: 'image/jpeg',
	} as any)

	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		body: formData as any,
	})
	if (!res.ok) {
		throw new Error(`sendPhoto error: ${res.statusText}`)
	}
}

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderColor: '#EEE',
		marginTop: 10,
	},
	backButton: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	backText: {
		color: '#007AFF',
		fontSize: 18,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: '#000',
	},
	contentContainer: {
		padding: 16,
		marginTop: 10,
	},
	input: {
		borderWidth: 1,
		borderColor: '#DDD',
		borderRadius: 10,
		padding: 12,
		fontSize: 16,
		color: '#000',
		marginBottom: 16,
	},
	textarea: {
		borderWidth: 1,
		borderColor: '#DDD',
		borderRadius: 10,
		padding: 12,
		fontSize: 16,
		color: '#000',
		height: 120,
		textAlignVertical: 'top',
		marginBottom: 16,
	},
	attachButton: {
		backgroundColor: '#eee',
		paddingVertical: 12,
		borderRadius: 10,
		alignItems: 'center',
		marginBottom: 16,
	},
	attachButtonText: {
		color: '#666',
		fontSize: 16,
		fontWeight: '500',
	},
	photoPreview: {
		marginBottom: 16,
		alignItems: 'center',
	},
	photoImage: {
		width: 200,
		height: 200,
		borderRadius: 10,
		resizeMode: 'contain',
	},
	removePhotoText: {
		color: '#FF3B30',
		marginTop: 8,
		fontSize: 14,
	},
	sendButton: {
		backgroundColor: '#007AFF',
		paddingVertical: 14,
		borderRadius: 10,
		alignItems: 'center',
	},
	sendButtonText: {
		color: '#fff',
		fontWeight: '600',
		fontSize: 16,
	},
	disabledButton: {
		opacity: 0.5,
	},
})
