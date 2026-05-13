import { ListTermsResponse, TermRepository } from '@/repositories/term'

export type TermService = {
	listTerms: () => Promise<ListTermsResponse>
}

type Deps = {
	repositories: [TermRepository]
}

export const getTermService = ({ repositories }: Deps): TermService => ({
	listTerms: repositories[0].listTerms,
})
