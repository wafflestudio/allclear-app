import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { useProfile } from '@/shared/contexts/profileContext'
import { serviceContext } from '@/shared/contexts/serviceContext'
import { TermService } from '@/usecases/term'

const useHomePendingTerms = () => {
	const { termService } = useContext(serviceContext)
	const { user } = useProfile()
	const queryClient = useQueryClient()
	const { data: pendingTerms = [] } = usePendingTerms(termService, !!user)
	const agreeTermsMutation = useAgreeTerms(termService, queryClient)
	const shouldShowModal = !!user && pendingTerms.length > 0

	return {
		pendingTerms,
		isSubmitting: agreeTermsMutation.isPending,
		shouldShowModal,
		handleAgreeTerms: agreeTermsMutation.mutate,
	}
}

export default useHomePendingTerms

const usePendingTerms = (termService: TermService, enabled: boolean) => {
	return useQuery({
		queryKey: ['terms'],
		queryFn: () => termService.listTerms(),
		select: data => data.data,
		enabled,
		staleTime: 60 * 1000,
		retry: false,
	})
}

const useAgreeTerms = (
	termService: TermService,
	queryClient: ReturnType<typeof useQueryClient>,
) => {
	return useMutation({
		mutationFn: ({ termUuids }: { termUuids: string[] }) => termService.agreeTerms({ termUuids }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['terms'] })
		},
	})
}
