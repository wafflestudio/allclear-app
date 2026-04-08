import AsyncStorage from '@react-native-async-storage/async-storage'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { ENV } from '../../config/ENV'
import { LOGIN_TOKEN } from '../constants/localStorage'

export interface APIMessage<T> {
	status: number
	data?: T
	msg?: string
}

export class APIConnector {
	private _apiInstance: AxiosInstance = axios.create({
		baseURL: ENV.API_SERVER_BASE_URL,
		timeout: 3000,
		headers: this.commonHeaders,
	})

	get commonHeaders() {
		return { Accept: 'application/json' }
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async get<T>(path: string, params?: any): Promise<T> {
		const token = await AsyncStorage.getItem(LOGIN_TOKEN)

		const headers = token
			? {
					'x-authorization': `Bearer ${token}`,
					Authorization: `Bearer ${token}`,
				}
			: {}

		return this.request(path, 'GET', {
			params,
			headers: {
				...this.commonHeaders,
				...headers,
			},
		})
	}

	async post<T>(path: string, body?: object, options?: AxiosRequestConfig): Promise<T> {
		const token = await AsyncStorage.getItem(LOGIN_TOKEN)

		const headers = token
			? {
					'x-authorization': `Bearer ${token}`,
					Authorization: `Bearer ${token}`,
				}
			: {}

		return this.request(path, 'POST', {
			data: body,
			headers: {
				...this.commonHeaders,
				...headers,
			},
			...options,
		})
	}

	async put<T>(path: string, body?: object): Promise<T> {
		const token = await AsyncStorage.getItem(LOGIN_TOKEN)

		const headers = token
			? {
					'x-authorization': `Bearer ${token}`,
					Authorization: `Bearer ${token}`,
				}
			: {}

		return this.request(path, 'PUT', {
			data: body,
			headers: {
				...this.commonHeaders,
				...headers,
			},
		})
	}

	async delete<T>(path: string): Promise<T> {
		const token = await AsyncStorage.getItem(LOGIN_TOKEN)

		const headers = token
			? {
					'x-authorization': `Bearer ${token}`,
					Authorization: `Bearer ${token}`,
				}
			: {}
		return this.request(path, 'DELETE', {
			headers: {
				...this.commonHeaders,
				...headers,
			},
		})
	}

	private async request<T>(
		path: string,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE',
		options: AxiosRequestConfig = {},
	): Promise<T> {
		const response = await this._apiInstance.request<T>({
			method,
			url: path,
			...options,
		})
		return response.data
	}
}

export const apiConnector = new APIConnector()
