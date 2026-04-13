import { EventLogParameter, EventLogParameterType } from '@/entities/eventLog'
import analytics from '@react-native-firebase/analytics'

export type EventLogService = {
	logEvent<T extends EventLogParameterType>(params: EventLogParameter<T>): void
}

export const getEventLogService = (): EventLogService => ({
	logEvent: params => analytics().logEvent(params.name, params.parameters),
})
