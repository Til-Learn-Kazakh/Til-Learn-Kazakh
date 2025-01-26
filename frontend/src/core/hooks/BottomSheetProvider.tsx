import React, { useCallback, useMemo, useRef, useState } from 'react'

import BottomSheet, { BottomSheetBackdrop, BottomSheetModalProvider } from '@gorhom/bottom-sheet'

import { BottomSheetContext } from './BottomSheetContext'

const DEFAULT_OPTIONS = {
	snapPoints: ['70%', '95%'],
	index: -1,
	renderContent: () => null,
}

// Объявляем интерфейс для пропсов, чтобы не было ошибок
interface BottomSheetProviderProps {
	children: any
}

export const BottomSheetProvider = ({ children }: BottomSheetProviderProps) => {
	const bottomSheetRef = useRef<any>(null)

	const [options, setOptions] = useState<any>({ ...DEFAULT_OPTIONS })
	const snapPoints = useMemo(() => options.snapPoints || [], [options])

	const bottomSheetContext = useMemo(
		() => ({
			expand: (opts: any) => {
				bottomSheetRef.current?.expand()
				setOptions({ ...DEFAULT_OPTIONS, ...opts })
			},
			snapToIndex: (opts: any) => {
				bottomSheetRef.current?.snapToIndex(opts.index)
				setOptions({ ...DEFAULT_OPTIONS, ...opts })
			},
			collapse: () => {
				bottomSheetRef.current?.close()
				setOptions(DEFAULT_OPTIONS)
			},
		}),
		[]
	)

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				{...props}
			/>
		),
		[]
	)

	return (
		<BottomSheetModalProvider>
			<BottomSheetContext.Provider value={bottomSheetContext}>
				{children}

				<BottomSheet
					snapPoints={snapPoints}
					ref={bottomSheetRef}
					enablePanDownToClose
					backdropComponent={renderBackdrop}
				>
					{options.renderContent()}
				</BottomSheet>
			</BottomSheetContext.Provider>
		</BottomSheetModalProvider>
	)
}
