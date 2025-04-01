import React, {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react'
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import moment from 'moment'

import { icons } from '../../../core/constants'
import { LoadingUi } from '../../../core/ui/LoadingUi'
import { toast } from '../../../core/ui/toast'
import { CURRENT_USER_QUERY_KEY } from '../../auth/hooks/user-current-user.hook'
import { homeService } from '../services/home.service'
import { t } from 'i18next'

export interface HeartsTopSheetRef {
	open: () => void
	close: () => void
	toggle: () => void
}

interface HeartsTopSheetProps {
	currentUser: {
		hearts: number
		last_refill_at: string
	}
}

const REFILL_INTERVAL_SECONDS = 300 // 5 минут

export const HeartsTopSheet = forwardRef<HeartsTopSheetRef, HeartsTopSheetProps>(
	({ currentUser }, ref) => {
		const [isVisible, setIsVisible] = useState(false)
		const [hearts, setHearts] = useState(currentUser?.hearts)
		const [nextHeartTime, setNextHeartTime] = useState(0)
		const [didInitialRefillCheck, setDidInitialRefillCheck] = useState(false)

		const queryClient = useQueryClient()

		const slideAnim = useRef(new Animated.Value(0)).current

		useEffect(() => {
			if (hearts < 5 && !didInitialRefillCheck) {
				const now = moment()
				const lastRefill = moment(currentUser?.last_refill_at)
				const diffSeconds = now.diff(lastRefill, 'seconds')

				const intervalsPassed = Math.floor(diffSeconds / REFILL_INTERVAL_SECONDS)
				if (intervalsPassed > 0) {
					refillHearts()
				}
				setDidInitialRefillCheck(true)
			}
		}, [hearts, currentUser?.last_refill_at, didInitialRefillCheck])

		useEffect(() => {
			if (hearts === 5) return

			const lastRefill = moment(currentUser?.last_refill_at)
			const now = moment()
			const secondsSinceLastRefill = now.diff(lastRefill, 'seconds')
			const remainingTime = Math.max(
				REFILL_INTERVAL_SECONDS - (secondsSinceLastRefill % REFILL_INTERVAL_SECONDS),
				0
			)
			setNextHeartTime(remainingTime)

			const timerId = setInterval(() => {
				setNextHeartTime(prev => {
					if (prev <= 1) {
						// Когда таймер доходит до 0 — запускаем refillHearts()
						refillHearts()
						return REFILL_INTERVAL_SECONDS
					}
					return prev - 1
				})
			}, 1000)

			return () => clearInterval(timerId)
		}, [hearts, currentUser?.last_refill_at])

		const formatTime = (seconds: number) => {
			const minutes = Math.floor(seconds / 60)
			const secs = seconds % 60
			return `${minutes}m ${secs}s`
		}

		const open = useCallback(() => {
			if (isVisible) return
			setIsVisible(true)
			Animated.timing(slideAnim, {
				toValue: 50,
				duration: 300,
				useNativeDriver: true,
			}).start()
		}, [isVisible, slideAnim])

		const close = useCallback(() => {
			if (!isVisible) return
			Animated.timing(slideAnim, {
				toValue: 15,
				duration: 300,
				useNativeDriver: true,
			}).start(() => setIsVisible(false))
		}, [isVisible, slideAnim])

		const toggle = useCallback(() => {
			if (isVisible) {
				close()
			} else {
				open()
			}
		}, [isVisible, open, close])

		useImperativeHandle(ref, () => ({
			open,
			close,
			toggle,
		}))

		const { mutate: refillHearts, isPending: isRefillLoading } = useMutation({
			mutationFn: () => homeService.refillHearts(),
			onSuccess: data => {
				queryClient.invalidateQueries({ queryKey: [CURRENT_USER_QUERY_KEY] })
				setHearts(data.hearts)
				setNextHeartTime(REFILL_INTERVAL_SECONDS)
			},
			onError: error => {
				console.error('Error refilling hearts:', error)
			},
		})

		const { mutate: refillWithCrystals, isPending: isCrystalsLoading } = useMutation({
			mutationFn: () => homeService.refillHeartsWithCrystals(),
			onSuccess: data => {
				queryClient.invalidateQueries({ queryKey: [CURRENT_USER_QUERY_KEY] })
				setHearts(data.hearts)
				toast.success('Сердца успешно пополнились!')
			},
			onError: error => {
				console.error('Error refilling hearts with crystals:', error)
			},
		})

		if (!isVisible) {
			return null
		}
		if (isCrystalsLoading || isRefillLoading) {
			return <LoadingUi />
		}

		return (
			<Animated.View style={[styles.topSheet, { transform: [{ translateY: slideAnim }] }]}>
				<View style={styles.topSheetContent}>
					{/* Display hearts */}
					<View style={styles.heartsContainer}>
						{Array.from({ length: 5 }).map((_, index) => (
							<Image
								key={index}
								source={index < hearts ? icons.heart : icons.grayheart}
								style={styles.heartIcon}
							/>
						))}
					</View>

					<Text style={styles.topSheetText}>
						{hearts === 5 ? t('HOME.HEARTS.FULL') : t('HOME.HEARTS.NEXT')}
						{hearts < 5 && <Text style={styles.redText}>{formatTime(nextHeartTime)}</Text>}
					</Text>

					<TouchableOpacity
						style={[styles.refillContainer, hearts === 5 && styles.disabledContainer]}
						onPress={() => refillWithCrystals()}
						disabled={hearts === 5}
					>
						<View style={styles.refillContent}>
							<Image
								source={hearts === 5 ? icons.grayheart : icons.heart}
								style={styles.refillIcon}
							/>
							<Text style={[styles.refillText, hearts === 5 && styles.disabledText]}>
								{hearts === 5 ? t('HOME.HEARTS.FULL_BUTTON') : t('HOME.HEARTS.REFILL_BUTTON')}
							</Text>
						</View>
						<View style={styles.priceContent}>
							<Image
								source={hearts === 5 ? icons.graydiamond : icons.diamond}
								style={styles.priceIcon}
							/>
							<Text style={[styles.priceText, hearts === 5 && styles.disabledText]}>
								{t('HOME.HEARTS.PRICE')}
							</Text>
						</View>
					</TouchableOpacity>
				</View>
			</Animated.View>
		)
	}
)

const styles = StyleSheet.create({
	topSheet: {
		height: 240,
		position: 'absolute',
		top: 90,
		left: 0,
		right: 0,
		backgroundColor: '#fff',
		padding: 16,
		elevation: 4,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowOffset: { width: 0, height: 2 },
		zIndex: 1000,
	},
	topSheetContent: {
		alignItems: 'center',
	},
	heartsContainer: {
		flexDirection: 'row',
		marginBottom: 16,
	},
	heartIcon: {
		width: 48,
		height: 48,
		marginHorizontal: 7,
	},
	topSheetText: {
		fontSize: 25,
		marginBottom: 16,
		fontWeight: 'bold',
		color: '#222D39',
	},
	redText: {
		color: 'red',
		fontWeight: 'bold',
	},
	refillContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#F0F0F0',
		height: 70,
		width: '100%',
		borderRadius: 10,
		paddingVertical: 10,
		paddingHorizontal: 15,
		marginTop: 16,
	},
	disabledContainer: {
		backgroundColor: '#E0E0E0',
	},
	refillContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	priceContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	refillIcon: {
		width: 30,
		height: 30,
		marginRight: 10,
	},
	priceIcon: {
		width: 30,
		height: 30,
		marginRight: 5,
	},
	refillText: {
		color: '#222D39',
		fontSize: 20,
		fontWeight: 'bold',
	},
	priceText: {
		color: '#00A8FF',
		fontSize: 18,
		fontWeight: 'bold',
	},
	disabledText: {
		color: '#AAAAAA',
	},
})
