import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Swiper from 'react-native-swiper'

import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { AuthStackParamList } from '../../../core/navigation/AuthStack/AuthStackScreen'
import CustomButton from '../../../core/ui/CustomButton'
import { data } from '../data/data'

type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>

const Welcome: React.FC = () => {
	const swiperRef = useRef<Swiper>(null)
	const navigation = useNavigation<AuthStackNavigationProp>()
	const { t } = useTranslation()

	const [activeIndex, setActiveIndex] = useState(0)

	const isLastSlide = activeIndex === data.length - 1

	return (
		<SafeAreaView style={styles.container}>
			<TouchableOpacity
				onPress={() => {
					navigation.navigate('SelectLanguageScreen')
				}}
				style={styles.skipButton}
			>
				<Text style={styles.skipText}>{t('SKIP')}</Text>
			</TouchableOpacity>

			<Swiper
				ref={swiperRef}
				loop={false}
				dot={<View style={styles.dot} />}
				activeDot={<View style={styles.activeDot} />}
				onIndexChanged={index => setActiveIndex(index)}
			>
				{data.map(item => (
					<View
						key={item.id}
						style={styles.slide}
					>
						<Image
							source={item.image}
							style={styles.image}
							resizeMode='contain'
						/>
						<Text style={styles.title}>{t(item.title)}</Text>
						<Text style={styles.description}>{t(item.description)}</Text>
					</View>
				))}
			</Swiper>

			<CustomButton
				title={isLastSlide ? t('GET_STARTED') : t('NEXT')}
				onPress={() =>
					isLastSlide ? navigation.navigate('SelectLanguageScreen') : swiperRef.current?.scrollBy(1)
				}
				style={styles.button}
			/>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	skipButton: {
		alignSelf: 'flex-end',
		padding: 20,
	},
	skipText: {
		fontSize: 16,
		color: '#000',
		fontWeight: 'bold',
	},
	dot: {
		width: 32,
		height: 4,
		backgroundColor: '#E2E8F0',
		borderRadius: 2,
		marginHorizontal: 4,
	},
	activeDot: {
		width: 32,
		height: 4,
		backgroundColor: '#0286FF',
		borderRadius: 2,
		marginHorizontal: 4,
	},
	slide: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingTop: 50,
		paddingHorizontal: 20,
	},
	image: {
		width: '100%',
		height: 320,
		marginBottom: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#000',
		textAlign: 'center',
		marginVertical: 10,
	},
	description: {
		fontSize: 16,
		color: '#858585',
		textAlign: 'center',
		marginHorizontal: 10,
		marginTop: 5,
	},
	button: {
		width: '90%',
		alignSelf: 'center',
		marginBottom: 20,
	},
})

export default Welcome
