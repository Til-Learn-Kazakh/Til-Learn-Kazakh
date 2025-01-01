import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Foundation from 'react-native-vector-icons/Foundation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'

export const Icons = {
	MaterialCommunityIcons,
	MaterialIcons,
	Ionicons,
	Feather,
	FontAwesome,
	FontAwesome5,
	AntDesign,
	Entypo,
	SimpleLineIcons,
	Octicons,
	Foundation,
	EvilIcons,
}

type IconComponent = typeof AntDesign // Общий тип для всех иконок

export interface IconProps {
	type: IconComponent // Тип компонента иконки
	name: string
	color?: string
	size?: number
	style?: StyleProp<ViewStyle>
}

const Icon = ({ type: IconType, name, color, size = 24, style }: IconProps) => {
	return (
		<>
			{IconType && name && (
				<IconType
					name={name}
					size={size}
					color={color}
					style={style as any}
				/>
			)}
		</>
	)
}

export default Icon
