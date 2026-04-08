import AsyncStorage from '@react-native-async-storage/async-storage'
import { CollegeMajor, User } from 'entities/user'
import { apiConnector } from 'shared/utils/api'
import { LOGIN_TOKEN } from 'shared/constants/localStorage'

export type GetUserResponse = {
	profile: User
}

export type UpdateUserRequest = Partial<Omit<User, 'id'>>

export type CreateUserVoiceRequest = {
	content: string
}

export type ListCollegeMajorsResponse = {
	majors: CollegeMajor[]
	totalSize: number
}

export type UserRepository = {
	getUser: () => Promise<User>
	updateUser: (request: UpdateUserRequest) => Promise<void>
	createUserVoice: (request: CreateUserVoiceRequest) => Promise<void>
	listCollegeMajors: () => Promise<ListCollegeMajorsResponse>
}

export const getUserRepository = (): UserRepository => ({
	getUser: async () => {
		const token = await AsyncStorage.getItem(LOGIN_TOKEN)

		if (!token) {
			throw new Error('No token found')
		}

		const response = await apiConnector.get<GetUserResponse>('/v1/users/me')

		return response.profile
	},
	updateUser: async request => {
		const token = await AsyncStorage.getItem(LOGIN_TOKEN)

		if (!token) {
			throw new Error('No token found')
		}

		await apiConnector.put('/v1/users/me', request)
	},
	createUserVoice: async request => {
		const token = await AsyncStorage.getItem(LOGIN_TOKEN)

		if (!token) {
			throw new Error('No token found')
		}

		await apiConnector.post('/v1/users/me/voices', request)
	},
	listCollegeMajors: async () => {
		const response = await apiConnector.get<ListCollegeMajorsResponse>('/v1/users/majors')

		return response
	},
})
