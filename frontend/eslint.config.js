import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import prettierPlugin from 'eslint-plugin-prettier'
import reactPlugin from 'eslint-plugin-react'
import reactNativePlugin from 'eslint-plugin-react-native'
import globals from 'globals'

export default [
	{
		files: ['**/*.{ts,tsx,js,jsx}'], // Укажите файлы для проверки
		ignores: ['node_modules/', 'build/', 'dist/', 'android/', 'ios/'], // Игнорируемые файлы/папки
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parser: typescriptParser, // Парсер для TypeScript и JSX
			globals: {
				...globals.browser,
				...globals.node,
			},
		},

		plugins: {
			react: reactPlugin,
			'react-native': reactNativePlugin,
			'@typescript-eslint': typescriptPlugin,
			prettier: prettierPlugin,
		},
		rules: {
			'no-underscore-dangle': 'off',
			'react/function-component-definition': 'off',
			'react/prop-types': 'off',
			'no-use-before-define': 'off',
			'import/prefer-default-export': 'off',
			'react/jsx-props-no-spreading': 'off',
			quotes: ['error', 'single'], // Заменит двойные кавычки на одинарные
			'consistent-return': 'off',
			'no-param-reassign': 'off',
			'arrow-body-style': 'off',
			'@typescript-eslint/no-unused-vars': ['error'],
			// 'prettier/prettier': 'error', // Используем правила Prettier
		},
		settings: {
			react: {
				version: 'detect', // Автоматическое определение версии React
			},
		},
	},
]
