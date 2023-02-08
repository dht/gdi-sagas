import { call, fork, put, select, takeEvery, delay, take } from 'saga-ts';
import { mixer as store, site } from '@gdi/selectors';

type SettingsChangeAction = {
    type: 'SETTINGS_CHANGE';
    data: Json;
};

function* settingsChange(action: SettingsChangeAction) {}

export function* root() {
    yield takeEvery('SETTINGS_CHANGE', settingsChange);
}
