import React, { useState } from 'react'
import {
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Switch,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'

import FeatherIcon from '@expo/vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'

export default function Settings() {
	const navigation = useNavigation()

	const [form, setForm] = useState({
		darkMode: false,
		emailNotifications: true,
		pushNotifications: false,
	})

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#f6f6f6' }}>
			<View style={styles.container}>
				{/* Заголовок */}
				<View style={styles.header}>
					{/* Кнопка назад */}
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

					{/* Сам текст "Settings" */}
					<Text style={styles.headerTitle}>Settings</Text>
				</View>

				{/* Подзаголовок */}
				<Text style={styles.headerSubtitle}>Настройки приложения</Text>

				<ScrollView>
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Preferences</Text>
						<View style={styles.sectionBody}>
							<View style={[styles.rowWrapper, styles.rowFirst]}>
								<View style={styles.row}>
									<View style={[styles.rowIcon, { backgroundColor: '#38C959' }]}>
										<FeatherIcon
											color='#fff'
											name='at-sign'
											size={20}
										/>
									</View>

									<Text style={styles.rowLabel}>Email Notifications</Text>

									<View style={styles.rowSpacer} />

									<Switch
										onValueChange={emailNotifications => setForm({ ...form, emailNotifications })}
										value={form.emailNotifications}
									/>
								</View>
							</View>

							<View style={styles.rowWrapper}>
								<View style={styles.row}>
									<View style={[styles.rowIcon, { backgroundColor: '#38C959' }]}>
										<FeatherIcon
											color='#fff'
											name='bell'
											size={20}
										/>
									</View>

									<Text style={styles.rowLabel}>Push Notifications</Text>

									<View style={styles.rowSpacer} />

									<Switch
										onValueChange={pushNotifications => setForm({ ...form, pushNotifications })}
										value={form.pushNotifications}
									/>
								</View>
							</View>

							<View style={styles.rowWrapper}>
								<TouchableOpacity
									onPress={() => {
										// handle onPress
									}}
									style={styles.row}
								>
									<View style={[styles.rowIcon, { backgroundColor: '#FE3C30' }]}>
										<FeatherIcon
											color='#fff'
											name='music'
											size={20}
										/>
									</View>

									<Text style={styles.rowLabel}>Sound</Text>

									<View style={styles.rowSpacer} />

									<Text style={styles.rowValue}>Default</Text>

									<FeatherIcon
										color='#C6C6C6'
										name='chevron-right'
										size={20}
									/>
								</TouchableOpacity>
							</View>
						</View>
					</View>

					{/* Пример второго блока настроек */}
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Preferences</Text>
						<View style={styles.sectionBody}>
							<View style={[styles.rowWrapper, styles.rowFirst]}>
								<TouchableOpacity
									onPress={() => {
										// handle onPress
									}}
									style={styles.row}
								>
									<View style={[styles.rowIcon, { backgroundColor: '#fe9400' }]}>
										<FeatherIcon
											color='#fff'
											name='globe'
											size={20}
										/>
									</View>

									<Text style={styles.rowLabel}>Language</Text>

									<View style={styles.rowSpacer} />

									<Text style={styles.rowValue}>English</Text>

									<FeatherIcon
										color='#C6C6C6'
										name='chevron-right'
										size={20}
									/>
								</TouchableOpacity>
							</View>

							<View style={styles.rowWrapper}>
								<View style={styles.row}>
									<View style={[styles.rowIcon, { backgroundColor: '#007AFF' }]}>
										<FeatherIcon
											color='#fff'
											name='moon'
											size={20}
										/>
									</View>

									<Text style={styles.rowLabel}>Dark Mode</Text>

									<View style={styles.rowSpacer} />

									<Switch
										onValueChange={darkMode => setForm({ ...form, darkMode })}
										value={form.darkMode}
									/>
								</View>
							</View>

							<View style={styles.rowWrapper}>
								<TouchableOpacity
									onPress={() => {
										// handle onPress
									}}
									style={styles.row}
								>
									<View style={[styles.rowIcon, { backgroundColor: '#32c759' }]}>
										<FeatherIcon
											color='#fff'
											name='navigation'
											size={20}
										/>
									</View>

									<Text style={styles.rowLabel}>Location</Text>

									<View style={styles.rowSpacer} />

									<Text style={styles.rowValue}>Los Angeles, CA</Text>

									<FeatherIcon
										color='#C6C6C6'
										name='chevron-right'
										size={20}
									/>
								</TouchableOpacity>
							</View>
						</View>
					</View>

					{/* И т.д. для остальных секций/блоков */}
				</ScrollView>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 24,
		paddingHorizontal: 0,
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: 0,
	},
	/** Header */
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
	headerSubtitle: {
		fontSize: 15,
		marginTop: 8,
		fontWeight: '500',
		color: '#929292',
		paddingHorizontal: 16,
		marginBottom: 12,
	},
	/** Section */
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
	/** Row */
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
		flexShrink: 1,
		flexBasis: 0,
	},
	rowValue: {
		fontSize: 17,
		fontWeight: '500',
		color: '#8B8B8B',
		marginRight: 4,
	},
})
