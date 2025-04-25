import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	Linking,
	Modal,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Switch,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'

import FeatherIcon from '@expo/vector-icons/Feather'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { LANGUAGES } from '../../../core/constants/languages'
import { LoadingUi } from '../../../core/ui/LoadingUi'
import { toast } from '../../../core/ui/toast'
import { CURRENT_USER_QUERY_KEY } from '../../auth/hooks/user-current-user.hook'
import { authService } from '../../auth/services/auth.service'
import { usePreferences } from '../hooks/preferences.context'
import { Preferences } from '../hooks/preferences.storage'
import { profileService } from '../services/settings.service'

export default function SettingsScreen() {
	const navigation = useNavigation<NavigationProp<any>>()
	const queryClient = useQueryClient()
	const [showConfirmModal, setShowConfirmModal] = useState(false)
	const [mathInput, setMathInput] = useState('')
	const [mathProblem, setMathProblem] = useState({ question: '', answer: '' })
	const [showLogoutModal, setShowLogoutModal] = useState(false)

	const generateMathProblem = () => {
		const a = Math.floor(Math.random() * 10) + 1
		const b = Math.floor(Math.random() * 10) + 1
		setMathProblem({ question: `${a} + ${b}`, answer: (a + b).toString() })
		setMathInput('')
		setShowConfirmModal(true)
	}

	const { t, i18n } = useTranslation()
	const currentLanguageCode = i18n.language

	const currentLanguageLabel =
		LANGUAGES.find(lang => lang.code === currentLanguageCode)?.label || '—'
	const { preferences, togglePreference } = usePreferences()

	const handleToggleParam = (key: keyof Preferences) => {
		togglePreference(key)
	}

	const { mutate: deleteProfile, isPending } = useMutation({
		mutationFn: () => profileService.deleteProfile(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [CURRENT_USER_QUERY_KEY] })
			toast.success(t('SETTINGS.DELETE_ACCOUNT_SUCCESS'))
		},
		onError: err => {
			console.error('❌ Ошибка удаления аккаунта:', err)
			toast.error(t('SETTINGS.DELETE_ACCOUNT_ERROR'))
		},
	})

	const { mutate: logout, isPending: isLoggingOut } = useMutation({
		mutationFn: () => authService.logout(),
		onSuccess: () => {
			queryClient.setQueryData([CURRENT_USER_QUERY_KEY], null)
			setShowLogoutModal(false)
		},
		onError: () => {
			toast.error('Logout failed. Try again.')
			setShowLogoutModal(false)
		},
	})

	if (isPending || isLoggingOut) {
		return <LoadingUi />
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#f6f6f6' }}>
			<View style={styles.container}>
				{/* Header */}
				<View style={styles.header}>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={styles.backButton}
					>
						<FeatherIcon
							name='chevron-left'
							size={28}
							color='#000'
						/>
					</TouchableOpacity>
					<Text style={styles.headerTitle}>{t('SETTINGS.TITLE')}</Text>
				</View>

				{/* Подзаголовок */}
				<Text style={styles.headerSubtitle}>{t('SETTINGS.SUBTITLE')}</Text>

				<ScrollView contentContainerStyle={{ minHeight: '125%', paddingBottom: 40 }}>
					{/* ============ BLOCK 1: PARAMETERS ============ */}
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>{t('SETTINGS.PARAMETERS.TITLE')}</Text>
						<View style={styles.sectionBody}>
							{/* Language */}
							<View style={[styles.rowWrapper, styles.rowFirst]}>
								<TouchableOpacity
									style={styles.row}
									onPress={() => {
										navigation.navigate('LanguagePage')
									}}
								>
									<View style={[styles.rowIcon, { backgroundColor: '#F97316' }]}>
										<FeatherIcon
											name='globe'
											size={20}
											color='#fff'
										/>
									</View>
									<Text style={styles.rowLabel}>{t('SETTINGS.PARAMETERS.LANGUAGE')}</Text>
									<View style={styles.rowSpacer} />
									<Text style={styles.rowValue}>{currentLanguageLabel}</Text>
									<FeatherIcon
										name='chevron-right'
										size={20}
										color='#C6C6C6'
									/>
								</TouchableOpacity>
							</View>

							{/* Notifications */}
							<View style={styles.rowWrapper}>
								<View style={styles.row}>
									<View style={[styles.rowIcon, { backgroundColor: '#FBBF24' }]}>
										<FeatherIcon
											name='bell'
											size={20}
											color='#fff'
										/>
									</View>
									<Text style={styles.rowLabel}>{t('SETTINGS.PARAMETERS.NOTIFICATIONS')}</Text>
									<View style={styles.rowSpacer} />
									<Switch
										value={preferences.notifications}
										onValueChange={() => handleToggleParam('notifications')}
									/>
								</View>
							</View>

							{/* Sound Effects */}
							<View style={styles.rowWrapper}>
								<View style={styles.row}>
									<View style={[styles.rowIcon, { backgroundColor: '#34D399' }]}>
										<FeatherIcon
											name='volume-2'
											size={20}
											color='#fff'
										/>
									</View>
									<Text style={styles.rowLabel}>{t('SETTINGS.PARAMETERS.SOUND_EFFECTS')}</Text>
									<View style={styles.rowSpacer} />
									<Switch
										value={preferences.soundEffects}
										onValueChange={() => handleToggleParam('soundEffects')}
									/>
								</View>
							</View>

							{/* Vibration */}
							<View style={styles.rowWrapper}>
								<View style={styles.row}>
									<View style={[styles.rowIcon, { backgroundColor: '#3B82F6' }]}>
										<FeatherIcon
											name='smartphone'
											size={20}
											color='#fff'
										/>
									</View>
									<Text style={styles.rowLabel}>{t('SETTINGS.PARAMETERS.VIBRATION')}</Text>
									<View style={styles.rowSpacer} />
									<Switch
										value={preferences.vibration}
										onValueChange={() => handleToggleParam('vibration')}
									/>
								</View>
							</View>
						</View>
					</View>

					{/* ============ Блок 2. Профиль ============ */}
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>{t('SETTINGS.PROFILE')}</Text>
						<View style={styles.sectionBody}>
							<View style={[styles.rowWrapper, styles.rowFirst]}>
								<TouchableOpacity
									onPress={() => {
										navigation.navigate('ChangeProfile')
									}}
									style={styles.row}
								>
									<View style={[styles.rowIcon, { backgroundColor: '#6366F1' }]}>
										<FeatherIcon
											name='user'
											size={20}
											color='#fff'
										/>
									</View>
									<Text style={styles.rowLabel}>{t('SETTINGS.PROFILE')}</Text>
									<View style={styles.rowSpacer} />
									<FeatherIcon
										name='chevron-right'
										size={20}
										color='#C6C6C6'
									/>
								</TouchableOpacity>
							</View>
						</View>
					</View>

					{/* ============ Блок 3. Social Platforms ============ */}
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>{t('SETTINGS.SOCIAL_PLATFORMS.TITLE')}</Text>
						<View style={styles.sectionBody}>
							{/* Discord */}
							<View style={[styles.rowWrapper, styles.rowFirst]}>
								<TouchableOpacity
									style={styles.row}
									onPress={() => Linking.openURL('https://discord.gg/Pn9CpZ9W')}
								>
									<View style={[styles.rowIcon, { backgroundColor: '#5865F2' }]}>
										<FeatherIcon
											name='message-square'
											size={20}
											color='#fff'
										/>
									</View>
									<Text style={styles.rowLabel}>{t('SETTINGS.SOCIAL_PLATFORMS.DISCORD')}</Text>
									<View style={styles.rowSpacer} />
									<FeatherIcon
										name='chevron-right'
										size={20}
										color='#C6C6C6'
									/>
								</TouchableOpacity>
							</View>

							{/* Instagram */}
							<View style={styles.rowWrapper}>
								<TouchableOpacity
									style={styles.row}
									onPress={() =>
										Linking.openURL(
											'https://www.instagram.com/qazaqtil.app?igsh=MWZ2NGIxOHU3Mm9obg%3D%3D&utm_source=qr'
										)
									}
								>
									<View style={[styles.rowIcon, { backgroundColor: '#E1306C' }]}>
										<FeatherIcon
											name='instagram'
											size={20}
											color='#fff'
										/>
									</View>
									<Text style={styles.rowLabel}>{t('SETTINGS.SOCIAL_PLATFORMS.INSTAGRAM')}</Text>
									<View style={styles.rowSpacer} />
									<FeatherIcon
										name='chevron-right'
										size={20}
										color='#C6C6C6'
									/>
								</TouchableOpacity>
							</View>

							{/* Telegram */}
							<View style={styles.rowWrapper}>
								<TouchableOpacity
									style={styles.row}
									onPress={() => Linking.openURL('https://t.me/qazaqti1')}
								>
									<View style={[styles.rowIcon, { backgroundColor: '#0088CC' }]}>
										<FeatherIcon
											name='send'
											size={20}
											color='#fff'
										/>
									</View>
									<Text style={styles.rowLabel}>{t('SETTINGS.SOCIAL_PLATFORMS.TELEGRAM')}</Text>
									<View style={styles.rowSpacer} />
									<FeatherIcon
										name='chevron-right'
										size={20}
										color='#C6C6C6'
									/>
								</TouchableOpacity>
							</View>
						</View>
					</View>

					{/* ============ Блок 4. Support ============ */}
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>{t('SETTINGS.SUPPORT.SECTION')}</Text>
						<View style={styles.sectionBody}>
							<View style={[styles.rowWrapper, styles.rowFirst]}>
								<TouchableOpacity
									onPress={() => {
										navigation.navigate('SupportScreen')
									}}
									style={styles.row}
								>
									<View style={[styles.rowIcon, { backgroundColor: '#10B981' }]}>
										<FeatherIcon
											name='message-square'
											size={20}
											color='#fff'
										/>
									</View>
									<Text style={styles.rowLabel}>{t('SETTINGS.SUPPORT.CONTACT')}</Text>
									<View style={styles.rowSpacer} />
									<FeatherIcon
										name='chevron-right'
										size={20}
										color='#C6C6C6'
									/>
								</TouchableOpacity>
							</View>
						</View>
					</View>

					<View style={{ marginTop: 40, alignItems: 'center' }}>
						<TouchableOpacity
							style={styles.logoutButton}
							onPress={() => setShowLogoutModal(true)}
						>
							<Text style={styles.logoutButtonText}>{t('SETTINGS.LOGOUT')}</Text>
						</TouchableOpacity>

						<View style={styles.legalLinksContainer}>
							<TouchableOpacity
								onPress={() =>
									Linking.openURL(
										'https://www.termsfeed.com/live/1def3276-b263-4795-9f29-89898206ae03'
									)
								}
							>
								<Text style={styles.legalLink}>
									{t('SETTINGS.TERMS')} {t('SETTINGS.AND')} {t('SETTINGS.PRIVACY')}
								</Text>
							</TouchableOpacity>
						</View>

						<TouchableOpacity onPress={generateMathProblem}>
							<Text style={styles.deleteAccountText}>{t('SETTINGS.DELETE_ACCOUNT')}</Text>
						</TouchableOpacity>
						<Text style={styles.developedBy}>Developed by Bolatbek Ermekov</Text>
					</View>
					<Modal
						transparent
						visible={showConfirmModal}
						animationType='fade'
						onRequestClose={() => setShowConfirmModal(false)}
					>
						<View style={styles.modalOverlay}>
							<View style={styles.modalContent}>
								<Text style={styles.modalTitle}>😇 Just one step!</Text>
								<Text style={styles.modalText}>Please solve this to confirm:</Text>
								<Text style={styles.modalMath}>{mathProblem.question} = ?</Text>
								<TextInput
									style={styles.modalInput}
									value={mathInput}
									onChangeText={setMathInput}
									keyboardType='numeric'
									placeholder='Your answer'
								/>
								<View style={styles.modalButtons}>
									<TouchableOpacity
										style={styles.modalButtonCancel}
										onPress={() => setShowConfirmModal(false)}
									>
										<Text style={{ color: '#555' }}>Cancel</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.modalButtonConfirm}
										onPress={async () => {
											if (mathInput.trim() === mathProblem.answer) {
												await deleteProfile()
												await AsyncStorage.removeItem('hasSeenOnboarding')
												setShowConfirmModal(false)
											} else {
												toast.error('Wrong answer 😢')
											}
										}}
									>
										<Text style={{ color: '#fff' }}>Confirm</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</Modal>

					<Modal
						transparent
						visible={showLogoutModal}
						animationType='fade'
						onRequestClose={() => setShowLogoutModal(false)}
					>
						<View style={styles.logoutModalOverlay}>
							<View style={styles.logoutModalContent}>
								<Text style={styles.logoutModalTitle}>🚪 Log out</Text>
								<Text style={styles.logoutModalText}>Are you sure you want to log out?</Text>
								<View style={styles.logoutModalButtons}>
									<TouchableOpacity
										style={styles.logoutModalButtonCancel}
										onPress={() => setShowLogoutModal(false)}
									>
										<Text style={styles.logoutModalCancelText}>Cancel</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.logoutModalButtonConfirm}
										onPress={() => logout()}
									>
										<Text style={styles.logoutModalConfirmText}>Log out</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</Modal>
				</ScrollView>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 24,
		paddingHorizontal: 0,
		flexGrow: 1,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10,
		marginBottom: 2,
	},
	backButton: {
		marginRight: 5,
		padding: 8,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: '700',
		color: '#1d1d1d',
	},
	legalLinksContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		flexWrap: 'wrap',
		paddingHorizontal: 16,
		marginBottom: 20,
	},

	legalLink: {
		fontSize: 14,
		fontStyle: 'italic',
		color: '#999',
		fontWeight: '500',
		marginHorizontal: 4,
		textDecorationLine: 'underline',
	},

	legalDivider: {
		fontSize: 14,
		fontStyle: 'italic',
		color: '#999',
	},

	headerSubtitle: {
		fontSize: 15,
		marginTop: 8,
		fontWeight: '500',
		color: '#929292',
		paddingHorizontal: 16,
		marginBottom: 12,
	},

	section: {
		paddingTop: 12,
	},
	sectionTitle: {
		marginVertical: 8,
		marginHorizontal: 24,
		fontSize: 14,
		fontWeight: '600',
		color: '#a7a7a7',
		textTransform: 'uppercase',
		letterSpacing: 1.2,
	},
	sectionBody: {
		paddingLeft: 24,
		backgroundColor: '#fff',
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: '#e3e3e3',
	},

	rowWrapper: {
		borderTopWidth: 1,
		borderColor: '#e3e3e3',
	},
	rowFirst: {
		borderTopWidth: 0,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingRight: 16,
		height: 50,
	},
	rowIcon: {
		width: 30,
		height: 30,
		borderRadius: 4,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	rowLabel: {
		fontSize: 17,
		fontWeight: '500',
		color: '#000',
	},
	rowSpacer: {
		flexGrow: 1,
	},
	rowValue: {
		fontSize: 17,
		fontWeight: '500',
		color: '#8B8B8B',
		marginRight: 4,
	},

	legalText: {
		fontSize: 13,
		fontWeight: '500',
		color: '#929292',
		textAlign: 'center',
		marginBottom: 20,
		paddingHorizontal: 40,
	},

	logoutButton: {
		backgroundColor: '#eee',
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 30,
		marginBottom: 20,
		width: '90%',
		alignItems: 'center',
	},
	logoutButtonText: {
		fontSize: 16,
		color: '#FF3B30',
		fontWeight: '600',
		alignItems: 'center',
	},
	deleteAccountText: {
		fontSize: 15,
		color: '#FF3B30',
		fontWeight: '500',
		marginTop: 10,
	},
	developedBy: {
		fontSize: 13,
		color: '#A0A0A0',
		textAlign: 'center',
		marginTop: 16,
		fontStyle: 'italic',
	},

	modalOverlay: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
		backgroundColor: '#fff',
		width: '80%',
		borderRadius: 10,
		padding: 20,
		alignItems: 'center',
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: '700',
		marginBottom: 10,
	},
	modalText: {
		fontSize: 14,
		color: '#444',
	},
	modalMath: {
		fontSize: 20,
		fontWeight: '600',
		marginVertical: 10,
	},
	modalInput: {
		borderWidth: 1,
		borderColor: '#ccc',
		width: '100%',
		padding: 10,
		borderRadius: 6,
		textAlign: 'center',
		marginBottom: 15,
	},
	modalButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
	},
	modalButtonCancel: {
		padding: 10,
		borderRadius: 6,
		backgroundColor: '#eee',
		flex: 1,
		marginRight: 5,
		alignItems: 'center',
	},
	modalButtonConfirm: {
		padding: 10,
		borderRadius: 6,
		backgroundColor: '#3B82F6',
		flex: 1,
		marginLeft: 5,
		alignItems: 'center',
	},
	logoutModalOverlay: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	logoutModalContent: {
		backgroundColor: '#fff',
		width: '85%',
		borderRadius: 12,
		padding: 24,
		alignItems: 'center',
	},
	logoutModalTitle: {
		fontSize: 20,
		fontWeight: '700',
		marginBottom: 12,
	},
	logoutModalText: {
		fontSize: 15,
		color: '#444',
		textAlign: 'center',
		marginBottom: 20,
	},
	logoutModalButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
	},
	logoutModalButtonCancel: {
		flex: 1,
		backgroundColor: '#F3F4F6',
		paddingVertical: 12,
		borderRadius: 6,
		marginRight: 6,
		alignItems: 'center',
	},
	logoutModalButtonConfirm: {
		flex: 1,
		backgroundColor: '#3B82F6',
		paddingVertical: 12,
		borderRadius: 6,
		marginLeft: 6,
		alignItems: 'center',
	},
	logoutModalCancelText: {
		color: '#374151',
		fontSize: 16,
		fontWeight: '500',
	},
	logoutModalConfirmText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
})
