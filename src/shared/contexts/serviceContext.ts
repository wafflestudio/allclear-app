import { createContext } from 'react'
import { AuthService } from '@/usecases/auth'
import { CategoryService } from '@/usecases/category'
import { ClubService } from '@/usecases/club'
import { EventLogService } from '@/usecases/eventLog'
import { RecruitmentService } from '@/usecases/recruitment'
import { ReviewService } from '@/usecases/review'
import { UserService } from '@/usecases/user'

type ServiceContext = {
	authService: AuthService
	categoryService: CategoryService
	clubService: ClubService
	eventLogService: EventLogService
	recruitmentService: RecruitmentService
	reviewService: ReviewService
	userService: UserService
}

export const serviceContext = createContext<ServiceContext>({} as ServiceContext)
