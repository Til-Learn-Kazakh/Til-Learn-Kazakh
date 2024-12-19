import { Control, FieldValues, Path } from 'react-hook-form'
import {
	ImageSourcePropType,
	TextInputProps,
	TextStyle,
	TouchableOpacityProps,
	ViewStyle,
} from 'react-native'

declare interface ButtonProps extends TouchableOpacityProps {
	title: string
	bgVariant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'success'
	textVariant?: 'primary' | 'default' | 'secondary' | 'danger' | 'success'
	IconLeft?: React.ComponentType<any>
	IconRight?: React.ComponentType<any>
	className?: string
}

export interface InputFieldProps<T extends FieldValues> extends TextInputProps {
	label: string
	icon?: ImageSourcePropType
	secureTextEntry?: boolean
	labelStyle?: TextStyle
	containerStyle?: ViewStyle
	inputStyle?: TextStyle
	iconStyle?: ImageStyle
	name: Path<T> // Связь с именем поля формы
	control: Control<T> // Управление через react-hook-form
	errorMessage?: string // Сообщение об ошибке
}
