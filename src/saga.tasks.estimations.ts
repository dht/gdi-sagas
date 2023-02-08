import { api, put, select, takeEvery } from 'saga-ts';
import { tasks as store } from '@gdi/selectors';

type EstimationAction = {
    type: string;
    value: number;
    estimationTitle: string;
};

export function* setEstimation(action: EstimationAction) {
    const activeTask = yield* select(store.selectors.base.$activeTask);

    if (!activeTask.isLoaded) {
        return;
    }

    const { ticket } = activeTask;

    const response = yield* api(
        store.actions.tickets.patch(ticket.id, {
            timeEstimate: action.value,
        })
    );

    if (response.status === 200) {
        const message = `${ticket.key} time estimation is now "${action.estimationTitle}"`;

        yield put({
            type: 'SHOW_TOAST',
            flavour: 'success',
            message,
        });
    }
}

export function* root() {
    yield takeEvery('BLKR_SET_ESTIMATION', setEstimation);
}
