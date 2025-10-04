import { User } from 'entities/user'
import {
	CreateUserVoiceRequest,
	ListCollegeMajorsResponse,
	UpdateUserRequest,
	UserRepository,
} from 'repositories/user'

export type UserService = {
	getUser: () => Promise<User>
	updateUser: (request: UpdateUserRequest) => Promise<void>
	createUserVoice: (request: CreateUserVoiceRequest) => Promise<void>
	listCollegeMajors: () => Promise<ListCollegeMajorsResponse>
}

type Deps = {
	repositories: [UserRepository]
}

export const getUserService = ({ repositories }: Deps): UserService => ({
	getUser: () => repositories[0].getUser(),
	updateUser: request => repositories[0].updateUser(request),
	createUserVoice: request => repositories[0].createUserVoice(request),
	listCollegeMajors: () => repositories[0].listCollegeMajors(),
})
