import { delay, put, select, takeEvery } from 'saga-ts';
import { onMobileModeChange } from './predicates/predicates.mixer';
import { invokeEvent } from 'shared-base';

type ActionMobileMode = {
    type: 'SWITCH_IMAGE_ACTION';
    payload: {
        mobileMode: boolean;
    };
};

function* mobileMode(action: ActionMobileMode) {
    invokeEvent(
        action.payload?.mobileMode
            ? 'force-dimensions-mobile'
            : 'force-dimensions-desktop',
        {}
    );
}

export function* root() {
    yield takeEvery(onMobileModeChange, mobileMode);
}
