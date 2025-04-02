import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { imageserver } from '../../../core/config/environment.config'
import { toast } from '../../../core/ui/toast'
import { CURRENT_USER_QUERY_KEY, useCurrentUser } from '../../auth/hooks/user-current-user.hook'
import { achievementMap } from '../constants/achievementMap'
import { achievementsService } from '../services/achievements.service'

export default function AchievementModalScreen() {
	const route = useRoute<RouteProp<any, any>>()
	const navigation = useNavigation()
	const { t } = useTranslation()

	// Из params берем achievementId, title, description, image
	const { achievementId, title, description, image } = route.params || {}

	// Данные текущего пользователя
	const { data: currentUser } = useCurrentUser()

	// Ищем в pending_rewards соответствующую награду
	const rewardPending = currentUser?.pending_rewards?.find(
		(rw: any) => rw.achievement_id === achievementId?.toString()
	)

	// Мутация для "получения" награды
	const queryClient = useQueryClient()
	const { mutate: claimReward, isPending: isClaiming } = useMutation({
		mutationFn: (achID: string) => achievementsService.claimAchievementReward(achID),
		onSuccess: () => {
			toast.success(t('ACHIEVEMENTS.MODAL.TITLE'))
			queryClient.invalidateQueries({ queryKey: [CURRENT_USER_QUERY_KEY] })
		},
		onError: () => {
			toast.error(t('ACHIEVEMENTS.MODAL.ERROR'))
		},
	})

	const onClose = () => {
		navigation.goBack()
	}

	const onClaim = () => {
		if (achievementId) {
			claimReward(achievementId)
		}
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			{/* Modal Title */}
			<Text style={styles.topLabel}>{t('ACHIEVEMENTS.MODAL.TITLE')}</Text>

			{/* Content Container */}
			<View style={styles.contentContainer}>
				<Image
					source={{ uri: `${imageserver}${image}` }}
					style={styles.achievementImage}
				/>
				<Text style={styles.achievementTitle}>
					{achievementMap[title]
						? t(`ACHIEVEMENTS.SCREEN.LIST.${achievementMap[title]}.TITLE`)
						: title}
				</Text>
				<Text style={styles.achievementDescription}>
					{' '}
					{achievementMap[description]
						? t(`ACHIEVEMENTS.SCREEN.LIST.${achievementMap[description]}.DESCRIPTION`)
						: description}
				</Text>
			</View>

			{/* Footer */}
			<View style={styles.footer}>
				{rewardPending ? (
					<TouchableOpacity
						style={[styles.button, styles.claimButton]}
						onPress={onClaim}
						disabled={isClaiming}
					>
						<View style={styles.iconRow}>
							<MaterialCommunityIcons
								name='diamond-stone'
								size={20}
								color='#fff'
								style={{ marginRight: 6 }}
							/>
							<Text style={styles.buttonText}>
								{isClaiming
									? t('ACHIEVEMENTS.MODAL.CLAIMING')
									: t('ACHIEVEMENTS.MODAL.CLAIM', { reward: rewardPending.reward })}
							</Text>
						</View>
					</TouchableOpacity>
				) : (
					<TouchableOpacity
						style={styles.button}
						onPress={onClose}
					>
						<Text style={styles.buttonText}>{t('ACHIEVEMENTS.MODAL.CLOSE')}</Text>
					</TouchableOpacity>
				)}
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#fff',
	},
	topLabel: {
		marginTop: 56,
		fontSize: 18,
		fontWeight: '700',
		textAlign: 'center',
	},
	contentContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	achievementImage: {
		width: 200,
		height: 200,
		resizeMode: 'contain',
		marginBottom: 24,
	},
	achievementTitle: {
		fontSize: 22,
		fontWeight: '700',
		marginBottom: 12,
		textAlign: 'center',
		color: '#000',
	},
	achievementDescription: {
		fontSize: 16,
		color: '#555',
		lineHeight: 22,
		textAlign: 'center',
		paddingHorizontal: 30,
		marginBottom: 20,
	},
	footer: {
		paddingHorizontal: 16,
		paddingBottom: 20,
	},
	button: {
		backgroundColor: '#007BFF',
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: 'center',
	},
	claimButton: {
		backgroundColor: '#FFD700',
	},
	iconRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	buttonText: {
		color: '#fff',
		fontSize: 17,
		fontWeight: '600',
	},
})
