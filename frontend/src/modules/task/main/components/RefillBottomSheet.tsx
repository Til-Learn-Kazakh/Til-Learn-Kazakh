import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { icons } from '../../../../core/constants'
import { toast } from '../../../../core/ui/toast'
import { CURRENT_USER_QUERY_KEY } from '../../../auth/hooks/user-current-user.hook'
import { homeService } from '../../../home/services/home.service'

const RefillBottomSheet = ({
	bottomSheetRef,
}: {
	bottomSheetRef: React.RefObject<BottomSheetModal>
}) => {
	const navigation = useNavigation<NavigationProp<any>>()
	const queryClient = useQueryClient()

	const { mutate: refillWithCrystals, isPending } = useMutation({
		mutationFn: () => homeService.refillHeartsWithCrystals(),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: [CURRENT_USER_QUERY_KEY] })
			bottomSheetRef.current?.dismiss()
			toast.success('Сердца успешно пополнились!')
		},
		onError: error => {
			toast.error(`${error}`)
			console.error('Error refilling hearts with crystals:', error)
		},
	})

	return (
		<BottomSheetModal
			ref={bottomSheetRef}
			index={0}
			snapPoints={['58%']}
			enablePanDownToClose={false}
			backdropComponent={props => (
				<BottomSheetBackdrop
					{...props}
					disappearsOnIndex={-1}
					opacity={0.7}
				/>
			)}
		>
			<BottomSheetScrollView contentContainerStyle={styles.scrollContainer}>
				<View style={styles.container}>
					<Text style={styles.title}>You ran out of hearts!</Text>
					<Text style={styles.subtitle}>Use gems to keep learning.</Text>

					<View style={styles.card}>
						<Image
							source={icons.heart}
							style={styles.cardImage}
						/>
						<Text style={styles.cardTitle}>Refill Hearts</Text>

						<View style={styles.priceContainer}>
							<Image
								source={icons.diamond}
								style={styles.diamondIcon}
							/>
							<Text style={styles.priceText}>500</Text>
						</View>
					</View>

					<TouchableOpacity
						style={styles.refillButton}
						onPress={() => refillWithCrystals()}
					>
						<Text style={styles.refillButtonText}>Refill</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.noThanksButton}
						onPress={() => bottomSheetRef.current?.dismiss()}
					>
						<Text style={styles.noThanksText}>NO THANKS</Text>
					</TouchableOpacity>
				</View>
			</BottomSheetScrollView>
		</BottomSheetModal>
	)
}

const styles = StyleSheet.create({
	scrollContainer: {
		flexGrow: 1,
		backgroundColor: '#f7f7f7',
		paddingBottom: 30,
	},
	container: {
		alignItems: 'center',
		padding: 20,
		backgroundColor: '#fff',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		overflow: 'hidden',
	},
	title: {
		fontSize: 22,
		fontWeight: '600',
		color: '#333',
		textAlign: 'center',
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 16,
		color: '#777',
		textAlign: 'center',
		marginBottom: 25,
	},
	card: {
		backgroundColor: '#fff',
		borderRadius: 20,
		padding: 25,
		alignItems: 'center',
		width: '85%',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 6,
		elevation: 5,
		marginBottom: 20,
	},
	cardImage: {
		width: 70,
		height: 70,
		marginBottom: 15,
	},
	cardTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: '#333',
		marginBottom: 15,
	},
	priceContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 7,
	},
	diamondIcon: {
		width: 22,
		height: 22,
		marginRight: 8,
	},
	priceText: {
		fontSize: 20,
		fontWeight: '600',
		color: '#0076CE',
	},
	refillButton: {
		backgroundColor: '#0076CE',
		paddingVertical: 12,
		paddingHorizontal: 40,
		borderRadius: 10,
		shadowColor: '#0076CE',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.4,
		shadowRadius: 5,
		elevation: 3,
		marginBottom: 25,
		marginTop: 10,
		width: '50%',
		alignItems: 'center',
	},
	refillButtonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: '600',
		textAlign: 'center',
	},
	noThanksButton: {
		marginTop: 10,
		alignItems: 'center',
	},
	noThanksText: {
		color: '#0076CE',
		fontSize: 16,
		fontWeight: '600',
		textAlign: 'center',
	},
})

export default RefillBottomSheet
