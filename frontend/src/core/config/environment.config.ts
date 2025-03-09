// import { BASE_URL } from '@env'
// apiUrl: 'http://172.20.10.2:4000/api/v1',

const config = {
	apiUrl: 'http://192.168.0.13:4000/api/v1',
	baseUrl: 'http://192.168.0.13:4000',
}

export const server = config.apiUrl
export const imageserver = config.baseUrl
export default config
