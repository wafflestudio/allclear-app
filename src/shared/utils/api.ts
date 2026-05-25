import AsyncStorage from '@react-native-async-storage/async-storage'
import axios, { AxiosRequestConfig } from 'axios'
import { ENV } from '@/config/ENV'
import { LOGIN_TOKEN } from '@/shared/constants/localStorage'

let _token: string | null = null

export const setToken = (token: string | null) => {
	_token = token
}

export const initToken = async () => {
	_token = await AsyncStorage.getItem(LOGIN_TOKEN)
}

const _apiInstance = axios.create({
	baseURL: ENV.API_SERVER_BASE_URL,
	timeout: 3000,
	headers: { Accept: 'application/json' },
})

_apiInstance.interceptors.request.use(config => {
	if (_token) {
		config.headers['Authorization'] = `Bearer ${_token}`
		config.headers['x-authorization'] = `Bearer ${_token}`
	}
	return config
})

const request = async <T>(
	path: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	options: AxiosRequestConfig = {},
): Promise<T> => {
	const response = await _apiInstance.request<T>({ method, url: path, ...options })
	return response.data
}

export const apiConnector = {
	get: <T>(path: string, params?: Record<string, unknown> | URLSearchParams) =>
		request<T>(path, 'GET', { params }),
	post: <T>(path: string, body?: object, options?: AxiosRequestConfig) =>
		request<T>(path, 'POST', { data: body, ...options }),
	put: <T>(path: string, body?: object) => request<T>(path, 'PUT', { data: body }),
	delete: <T>(path: string) => request<T>(path, 'DELETE', {}),
}
