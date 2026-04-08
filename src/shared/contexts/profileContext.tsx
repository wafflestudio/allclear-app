import { User } from 'entities/user'
import React, { createContext, useContext, useEffect } from 'react'
import { serviceContext } from './serviceContext'

const profileContext = createContext<{
	user: User | null
	setUser: (user: User | null) => void
}>({
	user: null,
	setUser: () => {},
})

export const useProfile = () => useContext(profileContext)

type Props = {
	children: React.ReactNode
}

export const ProfileProvider = ({ children }: Props) => {
	const { userService } = useContext(serviceContext)
	const [user, setUser] = React.useState<User | null>(null)

	useEffect(() => {
		const getUser = async () => {
			const u = await userService.getUser()
			setUser(u)
		}
		getUser()
	}, [userService])

	return <profileContext.Provider value={{ user, setUser }}>{children}</profileContext.Provider>
}
