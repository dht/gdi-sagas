import { select, takeEvery } from 'saga-ts';
import { tasks as store } from '@gdi/selectors';
import { calculateMobileLatency } from './session';

type ClientLatencyAction = {
    type: string;
    payload: {
        startTimestamp: number;
    };
};

export function* clientLatency(action: ClientLatencyAction) {
    if (!action) {
        return;
    }

    const { startTimestamp } = action.payload ?? {};

    if (!startTimestamp) {
        return;
    }

    const tasksState = yield* select(store.selectors.raw.$rawTasksState);

    const latency = calculateMobileLatency(startTimestamp);
    // setLatency(latency);
}

export function* root() {
    yield takeEvery('PATCH_ACTIVETASK', clientLatency);
}

export default root;
