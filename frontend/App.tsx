import React, { useMemo } from 'react'

import * as eva from '@eva-design/eva'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApplicationProvider } from '@ui-kitten/components'

import Main from './Main'

const App: React.FC = () => {
	// Инициализация Query Client
	const queryClient = useMemo(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
						retry: false,
					},
				},
			}),
		[]
	)
	return (
		<QueryClientProvider client={queryClient}>
			<ApplicationProvider
				{...eva}
				theme={eva.light}
			>
				<Main />
			</ApplicationProvider>
		</QueryClientProvider>
	)
}

export default App
