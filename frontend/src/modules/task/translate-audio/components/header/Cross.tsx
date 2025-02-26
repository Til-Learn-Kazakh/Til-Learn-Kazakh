import * as React from 'react'
import { TouchableOpacity } from 'react-native'
import Svg, { Path } from 'react-native-svg'

import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

export const CROSS_SIZE = 24

const Cross = () => {
	const navigation = useNavigation<NativeStackNavigationProp<any>>()

	const handlePress = () => {
		navigation.goBack() // Закрываем экран
	}

	return (
		<TouchableOpacity
			onPress={handlePress}
			activeOpacity={0.7}
		>
			<Svg
				width={CROSS_SIZE}
				height={CROSS_SIZE}
				viewBox='0 0 14 14'
				fill='none'
			>
				<Path
					d='M13 1L1 13M1 1l12 12'
					stroke='#AFAFAE'
					strokeWidth={2}
					strokeLinecap='round'
					strokeLinejoin='round'
				/>
			</Svg>
		</TouchableOpacity>
	)
}

export default Cross
