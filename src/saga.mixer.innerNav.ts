import { call, put, select, takeEvery } from 'saga-ts';
import { customEventChannel } from './channels/channel.customEvent';
import { invokeEvent } from 'shared-base';
import { mixer as store } from '@gdi/selectors';

function* navigate(action: any) {
    const { datasetId } = action;

    if (datasetId) {
        yield call(invokeEvent, 'navigate', {
            path: `/admin/datasets#${datasetId}`,
        });
    }
}

export function* root() {
    const channel = customEventChannel('showDataset');
    yield takeEvery(channel, navigate);
}
